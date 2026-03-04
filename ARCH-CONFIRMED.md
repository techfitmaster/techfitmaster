# ARCH-CONFIRMED.md — 818-Platform 架构决策

**确认时间：** 2026-03-04  
**状态：** ✅ 已定稿，可开工

---

## 1. 项目结构 — 独立 Git 仓库（全栈 Go）

仓库：`/projects/818-platform/`（独立 repo，不依赖外部 Python 服务）

```
/projects/818-platform/
├── relay/          # RELAY 模块（HTTP 代理 + 转化追踪）
├── scout/          # SCOUT 模块（Telegram 意图评分 + 分发）
├── shared/         # 公共包
│   ├── models/     # 数据模型（User, ScoutLead, etc.）
│   ├── config/     # 配置加载
│   └── db/         # DB 连接池
├── go.work         # Go workspace（统一版本管理）
├── docker-compose.yml
└── README.md
```

**语言约定：全栈 Go，禁止引入 Python/Node 外部依赖。**

## 2. 数据库 — 共享 PostgreSQL

- RELAY 和 SCOUT 共用同一个 PostgreSQL 实例
- ScoutLead 表直接关联 User 表，转化追踪天然打通
- 迁移工具：golang-migrate

关键表：
- `users` — 用户信息（来源渠道、注册时间）
- `scout_leads` — Telegram 意图记录（评分、状态）
- `relay_links` — 代理链接（溯源参数）
- `conversions` — 转化事件（lead_id → user_id）

## 3. RELAY 技术栈 — Go + Gin

- HTTP 反向代理 + 参数注入
- 转化事件写库
- 端口：8080

## 4. SCOUT Telegram 库 — gotd/td（纯 Go MTProto）

- 纯 Go，无 CGO，Docker 构建简单
- 多账号 Session 管理
- 消息接收 → 意图评分 → 分配逻辑

## 5. 意图评分 — OpenAI gpt-4o-mini

- SCOUT 直接调用 OpenAI API
- Prompt：用户消息 → 返回 score(0-100) + intent_label
- 按需调用，月成本可控

## 6. 部署目标（MVP） — 本地 Docker Compose

- 先本地跑通全流程
- 依赖：OPENAI_API_KEY + Telegram Bot Token + Telegram Account Session
- docker-compose up 一键启动（PostgreSQL + RELAY + SCOUT）

---

## MVP 交付范围

### RELAY MVP
- [x] GET /r/:code → 302 跳转目标 URL（注入 utm 参数）
- [x] 记录访问日志（IP、UA、referrer、时间）
- [x] POST /webhook/convert 接收转化回调
- [x] GET /admin/stats 查看基础数据

### SCOUT MVP
- [x] 监听指定 Telegram 群组消息
- [x] 调用 gpt-4o-mini 评分（score + intent_label）
- [x] score ≥ 70 → 自动私信用户（发送 RELAY 追踪链接）
- [x] 写库 scout_leads

---

## 开工顺序

1. **初始化 Monorepo** — 目录结构 + go.work
2. **shared/db** — PostgreSQL 连接 + 迁移脚本
3. **RELAY MVP** — 代理核心 + 统计接口
4. **SCOUT MVP** — Telegram 接入 + 评分 + 分发
5. **docker-compose** — 一键启动验证

---

*此文件由 Dressing 在 Albert 确认后生成，作为开工基准。*
