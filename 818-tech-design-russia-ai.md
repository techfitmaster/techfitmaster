# 818 俄罗斯 AI 产品 — 技术详细设计
> CTO 技术设计 v1.0 | 2026-03-04

---

## 一、整体技术决策

### 技术选型总表

| 模块 | 技术 | 版本 | 理由 |
|------|------|------|------|
| API 网关 | Go + Gin | 1.21+ | 高并发代理场景首选，内存占用低 |
| Telegram Bot | Go + telebot.v3 | 3.x | 与网关同语言，维护成本低 |
| 数据库 | MySQL 8.0 | - | 复用818现有基础设施 |
| 缓存/限流 | Redis 7.x | - | 复用818现有基础设施 |
| 日志分析 | ClickHouse | 23.x | 亿级Token调用日志，查询快 |
| 获客Agent | Python 3.11 | - | LLM生态最成熟 |
| 消息队列 | Redis Stream | - | 轻量，够用，不引入Kafka |
| 部署 | Docker + 阿里云 | - | 复用818现有部署体系 |
| 节点 | 欧洲VPS（荷兰） | - | 俄罗斯访问延迟<100ms |

---

## 二、AI 中转站详细设计（818-ru-ai-svc-proxy）

### 2.1 模块划分

```
818-ru-ai-svc-proxy/
├── cmd/
│   └── main.go              # 启动入口
├── internal/
│   ├── gateway/             # 核心代理层
│   │   ├── handler.go       # HTTP请求处理
│   │   ├── router.go        # 路由配置
│   │   └── middleware.go    # 鉴权/限流/日志
│   ├── billing/             # 计费引擎
│   │   ├── counter.go       # Token计数
│   │   ├── deduct.go        # 余额扣减
│   │   └── alert.go         # 低余额预警
│   ├── routing/             # 模型路由
│   │   ├── selector.go      # 模型选择策略
│   │   ├── health.go        # 健康检测
│   │   └── fallback.go      # 熔断降级
│   ├── user/                # 用户管理
│   │   ├── service.go
│   │   └── apikey.go        # API Key 生成/验证
│   └── payment/             # 支付
│       ├── usdt.go          # USDT收款
│       └── telegram.go      # Telegram Stars
├── pkg/
│   ├── models/              # LLM供应商适配器
│   │   ├── openai.go
│   │   ├── claude.go
│   │   └── deepseek.go
│   └── redis/               # Redis工具
└── configs/
    └── model_config.yaml    # 模型价格配置（热更新）
```

### 2.2 核心 API 设计（兼容 OpenAI 格式）

```
# 完全兼容 OpenAI SDK，用户只需替换 BASE_URL

POST /v1/chat/completions      # 对话（流式/非流式）
POST /v1/embeddings            # 向量嵌入
POST /v1/images/generations    # 图像生成
GET  /v1/models                # 可用模型列表

# 用户管理（内部）
POST /api/user/register        # 注册
POST /api/user/login
GET  /api/user/balance         # 余额查询
GET  /api/user/usage           # 用量统计
POST /api/payment/usdt/create  # 创建USDT收款单
POST /api/payment/callback     # 支付回调
```

### 2.3 计费引擎设计

```go
// Token 扣费核心逻辑
type BillingEvent struct {
    UserID      int64
    Model       string
    InputTokens  int
    OutputTokens int
    RequestID   string
    Timestamp   time.Time
}

// 定价配置（model_config.yaml，支持热更新）
models:
  gpt-4o:
    input_price:  0.00001500   # 美元/Token
    output_price: 0.00006000
    enabled: true
    weight: 3                  # 路由权重
  claude-3-5-sonnet:
    input_price:  0.00001800
    output_price: 0.00007200
    enabled: true
    weight: 2
  deepseek-chat:
    input_price:  0.00000030   # 引流款，极低价
    output_price: 0.00000120
    enabled: true
    weight: 5

// 扣费流程（原子操作）
1. 请求到达 → 预扣 500 积分（防超支）
2. 请求完成 → 计算实际Token → 退还差额
3. 余额不足 → 返回 402 错误
4. Redis Lua 脚本保证原子性
```

### 2.4 模型路由策略

```go
type RoutingStrategy int

const (
    StrategyRoundRobin  RoutingStrategy = iota // 轮询
    StrategyLowestCost                         // 最低成本
    StrategyLowestLatency                      // 最低延迟
    StrategyUserSpecified                      // 用户指定
)

// 健康检测（每30秒）
// 失败3次 → 熔断，停止路由
// 恢复检测（每5分钟探测一次）
// 成功 → 重新加入路由池
```

### 2.5 数据库设计

```sql
-- 用户表
CREATE TABLE t_ru_user (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    telegram_id BIGINT UNIQUE,           -- Telegram用户ID
    username    VARCHAR(64),
    api_key     VARCHAR(64) UNIQUE NOT NULL,
    balance     DECIMAL(18,8) DEFAULT 0, -- 美元余额
    total_spent DECIMAL(18,8) DEFAULT 0,
    status      TINYINT DEFAULT 1,       -- 1:正常 0:封禁
    created_at  DATETIME,
    updated_at  DATETIME,
    INDEX idx_api_key (api_key),
    INDEX idx_telegram_id (telegram_id)
);

-- 充值记录
CREATE TABLE t_ru_recharge (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id     BIGINT NOT NULL,
    order_no    VARCHAR(64) UNIQUE,
    amount_usd  DECIMAL(18,8),
    amount_usdt DECIMAL(18,8),
    pay_method  VARCHAR(20),  -- usdt / telegram_stars
    status      TINYINT,      -- 0:待支付 1:已支付 2:已过期
    tx_hash     VARCHAR(128), -- USDT链上哈希
    created_at  DATETIME,
    paid_at     DATETIME
);

-- 用量记录（按日分区）
CREATE TABLE t_ru_usage (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id       BIGINT NOT NULL,
    request_id    VARCHAR(64),
    model         VARCHAR(64),
    input_tokens  INT,
    output_tokens INT,
    cost_usd      DECIMAL(18,8),
    latency_ms    INT,
    created_at    DATETIME,
    INDEX idx_user_date (user_id, created_at)
) PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at));

-- 模型配置（支持动态更新）
CREATE TABLE t_ru_model_config (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    model_id     VARCHAR(64) UNIQUE,
    display_name VARCHAR(128),
    input_price  DECIMAL(18,10),
    output_price DECIMAL(18,10),
    enabled      TINYINT DEFAULT 1,
    weight       INT DEFAULT 1,
    updated_at   DATETIME
);
```

### 2.6 Telegram Bot 交互设计

```
用户输入 /start
Bot 回复（俄语）：
┌─────────────────────────────────────┐
│ 🤖 818 AI API — Добро пожаловать!  │
│                                     │
│ Ваш API ключ: sk-818-xxxxxxxxxxxx  │
│ Баланс: $0.00                       │
│                                     │
│ [💳 Пополнить]  [📊 Статистика]    │
│ [📖 Документация] [❓ Помощь]      │
└─────────────────────────────────────┘

点击 [💳 Пополнить]：
┌─────────────────────────────────────┐
│ Выберите сумму пополнения:          │
│                                     │
│ [$5]  [$20]  [$50]  [$100]         │
│                                     │
│ Способ оплаты:                      │
│ [USDT TRC20] [Telegram Stars]      │
└─────────────────────────────────────┘

选择 USDT $20：
┌─────────────────────────────────────┐
│ 💳 Пополнение $20.00               │
│                                     │
│ Отправьте 20.00 USDT на адрес:     │
│ TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │
│                                     │
│ ⏰ Истекает через: 30:00           │
│                                     │
│ После оплаты нажмите [✅ Проверить]│
└─────────────────────────────────────┘
```

---

## 三、自动获客系统详细设计（818-ru-growth-agent）

### 3.1 系统架构

```
818-ru-growth-agent/
├── collectors/              # 数据采集
│   ├── telegram_monitor.py  # Telegram频道监控
│   ├── vk_crawler.py        # VK群组爬取
│   └── habr_crawler.py      # Habr论坛爬取
├── analyzers/               # 意图分析
│   ├── intent_classifier.py # LLM意图识别
│   ├── scorer.py            # 转化概率评分
│   └── deduplicator.py      # 去重
├── outreach/                # 自动触达
│   ├── tg_sender.py         # Telegram消息发送
│   ├── template_gen.py      # LLM生成个性化话术
│   └── rate_limiter.py      # 频率控制
├── crm/                     # 线索管理
│   ├── models.py
│   └── tracker.py           # 转化追踪
├── scheduler.py             # 定时任务调度
└── config/
    └── keywords_ru.yaml     # 俄语关键词库
```

### 3.2 意图识别 Prompt 设计

```python
INTENT_CLASSIFICATION_PROMPT = """
你是一个专业的销售意图分析师。
分析以下俄语/英语文本，判断发帖者是否有购买AI API访问服务的需求。

文本内容：{text}
平台：{platform}

返回JSON格式：
{
  "has_intent": true/false,
  "intent_type": "寻找API服务/抱怨访问限制/询问价格/其他",
  "pain_point": "具体痛点描述",
  "urgency": "high/medium/low",
  "conversion_score": 0.0-1.0,
  "recommended_response": "建议的回复话术（俄语）",
  "reason": "判断理由"
}

高意向信号：
- 明确提到无法访问ChatGPT/Claude/OpenAI
- 询问API Key获取方式
- 询问付款方式（尤其USDT）
- 抱怨官方封锁
- 在寻找替代方案
"""
```

### 3.3 自动触达规则引擎

```python
class OutreachRule:
    # 触达条件
    min_conversion_score = 0.70    # 最低转化概率
    max_daily_per_account = 50     # 每账号每日上限
    cooldown_per_user_hours = 48   # 同一用户冷却时间
    
    # 话术生成规则
    max_message_length = 120       # 最多120字（俄语）
    must_include_link = True       # 必须含产品链接
    tone = "friendly_helpful"      # 友好+有帮助
    
    # 安全规则
    no_spam_keywords = [           # 不使用这些词（平台会检测）
        "реклама", "купи", "скидка"
    ]
    
OUTREACH_PROMPT = """
根据用户的痛点，生成一条自然的俄语回复：

用户痛点：{pain_point}
用户平台：{platform}
产品链接：{product_url}

要求：
1. 不超过120字
2. 语气自然，像朋友推荐
3. 提到他的具体问题
4. 强调USDT付款和稳定访问
5. 末尾附链接
6. 不要过于推销

示例风格：
"Привет! Видел твой вопрос про ChatGPT API. 
У нас есть сервис — стабильный доступ, оплата USDT, 
никаких блокировок. Первые 1000 токенов бесплатно: [链接]"
"""
```

### 3.4 线索数据库设计

```sql
-- 线索表
CREATE TABLE t_ru_lead (
    id                BIGINT PRIMARY KEY AUTO_INCREMENT,
    platform          VARCHAR(20),     -- telegram/vk/habr
    platform_user_id  VARCHAR(64),     -- 平台用户ID
    platform_username VARCHAR(128),
    source_url        TEXT,            -- 原始帖子URL
    original_text     TEXT,            -- 原始内容
    intent_type       VARCHAR(50),
    pain_point        TEXT,
    conversion_score  DECIMAL(4,2),
    urgency           VARCHAR(10),
    status            VARCHAR(20) DEFAULT 'new',
    -- new/outreached/replied/registered/paid/archived
    outreach_count    INT DEFAULT 0,
    last_outreach_at  DATETIME,
    created_at        DATETIME,
    INDEX idx_status_score (status, conversion_score),
    INDEX idx_platform_user (platform, platform_user_id)
);

-- 触达记录
CREATE TABLE t_ru_outreach (
    id           BIGINT PRIMARY KEY AUTO_INCREMENT,
    lead_id      BIGINT,
    message_text TEXT,
    sent_via     VARCHAR(20),  -- telegram_dm/comment/reply
    account_used VARCHAR(64),  -- 使用哪个账号发送
    status       VARCHAR(20),  -- sent/delivered/replied/failed
    sent_at      DATETIME,
    replied_at   DATETIME
);

-- 转化归因
CREATE TABLE t_ru_conversion (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    lead_id         BIGINT,
    ru_user_id      BIGINT,      -- 注册后的用户ID
    registered_at   DATETIME,
    first_paid_at   DATETIME,
    first_paid_usd  DECIMAL(10,2),
    attribution     VARCHAR(20), -- 归因渠道
    created_at      DATETIME
);
```

### 3.5 Telegram 账号池管理

```python
# 账号池策略
ACCOUNT_POOL = {
    "主账号": {
        "daily_limit": 30,       # 每日发送上限
        "used_today": 0,
        "last_used": None,
        "status": "active"
    },
    "备用账号1": { ... },
    "备用账号2": { ... },
}

# 轮换策略：
# 1. 优先使用今日使用最少的账号
# 2. 某账号被限制 → 自动切换到下一个
# 3. 所有账号都受限 → 暂停24小时
```

---

## 四、部署架构设计

```
┌─────────────────────────────────────────────────────────┐
│                  Cloudflare（CDN + WAF）                 │
└─────────────────────────────┬───────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
┌─────────────▼──┐  ┌─────────▼──┐  ┌────────▼───────────┐
│  荷兰 VPS      │  │  香港 ECS  │  │  大陆管理服务器    │
│  （主节点）    │  │  （亚洲）  │  │  （监控/数据库）   │
│                │  │            │  │                    │
│  Go 网关       │  │  Go 网关   │  │  MySQL主库         │
│  Telegram Bot  │  │            │  │  Redis             │
│  获客Agent     │  │            │  │  ClickHouse        │
└────────────────┘  └────────────┘  └────────────────────┘
```

**节点选择理由：**
```
荷兰 → 俄罗斯延迟约50-80ms，欧洲数据中心首选
香港 → 亚洲用户备用，OpenAI等服务访问快
大陆 → 818现有服务器，复用，存放数据库
```

### Docker Compose 结构
```yaml
services:
  gateway:
    image: 818-ru-gateway:latest
    ports: ["8080:8080"]
    env:
      - REDIS_URL
      - MYSQL_URL
      - MODEL_CONFIGS_PATH
    
  telegram-bot:
    image: 818-ru-bot:latest
    env:
      - BOT_TOKEN
      - GATEWAY_URL
      - PAYMENT_USDT_ADDRESS
    
  growth-agent:
    image: 818-ru-growth:latest
    env:
      - OPENAI_API_KEY   # 用于意图识别
      - TG_ACCOUNTS      # 账号池配置
      - DB_URL

  redis:
    image: redis:7-alpine
    
  clickhouse:
    image: clickhouse/clickhouse-server:23
```

---

## 五、安全设计

```
API Key 设计：
格式：sk-818ru-{32位随机hex}
存储：数据库存SHA256哈希，不存明文
验证：Redis缓存5分钟，减少DB查询

限流规则：
每个API Key：
  - 100 RPM（每分钟请求数）
  - 10,000 TPM（每分钟Token数）
  - 可按套餐升级

防滥用：
  - 请求内容不做日志（隐私）
  - 违规内容检测（OpenAI Moderation API）
  - 异常流量自动封号

USDT 收款安全：
  - 每单独立地址（HD钱包派生）
  - 链上确认≥3次才到账
  - 金额误差<0.01 USDT自动通过
```

---

## 六、监控告警

```yaml
告警规则：
  - 网关错误率 > 5%          → 立即通知
  - 某模型响应时间 > 10s     → 自动切换
  - 余额池 < $100            → 通知充值
  - 获客Agent停止运行         → 立即通知
  - 单用户异常高消耗          → 自动限速

监控面板（Grafana）：
  - 实时QPS
  - Token消耗/分钟
  - 各模型健康状态
  - 收入/小时曲线
  - 获客漏斗转化
```

---

## 七、开发里程碑

### Week 1（MVP核心）
- [ ] Go网关基础框架（鉴权+代理+计费）
- [ ] MySQL建表
- [ ] Telegram Bot基础命令（/start /balance）
- [ ] USDT收款集成（TronWeb）

### Week 2（完整流程）
- [ ] 模型路由+健康检测
- [ ] Token计费引擎
- [ ] 充值→余额到账全流程
- [ ] 获客Agent：Telegram频道监控 + 意图识别

### Week 3（自动化）
- [ ] 低余额预警Bot通知
- [ ] 获客Agent：自动触达 + 频率控制
- [ ] CRM线索管理
- [ ] 基础监控告警

### Week 4（测试+上线）
- [ ] 压力测试（1000并发）
- [ ] 荷兰节点部署
- [ ] 10个种子用户内测
- [ ] 获客Agent小批量启动（3个Telegram群）

---

*文档版本：v1.0*
*创建：2026-03-04*
*评审人：Albert (CEO)*
