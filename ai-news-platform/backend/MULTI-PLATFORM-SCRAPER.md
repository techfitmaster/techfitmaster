# 🕷️ 多平台攻略爬虫系统

自动抓取 DNF 手游攻略并整合到 RAG 知识库

---

## 🎯 **支持平台**

| 平台 | 内容类型 | 数据质量 | 难度 | 状态 |
|------|---------|---------|------|------|
| **百度贴吧** | 帖子、回复 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ✅ 已实现 |
| **抖音** | 视频标题、热度 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ✅ 已实现 |
| **微信公众号** | 文章、摘要 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ 已实现 |
| **知乎** | 问答、文章 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 🔄 计划中 |
| **B站** | 视频、评论 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 🔄 计划中 |

---

## 🚀 **快速使用**

### **安装依赖**
```bash
cd backend
npm install
npx playwright install chromium
```

### **单平台爬取**
```bash
# 百度贴吧（推荐）
npm run scrape:tieba "鬼泣攻略"
npm run scrape:tieba "安图恩副本"

# 抖音
npm run scrape:douyin

# 公众号
npm run scrape:wechat "DNF手游"
```

### **自动整合到 RAG**
```bash
# 爬取 + AI提取 + 向量化 + 入库
node scrape-all.js tieba "鬼泣攻略"
node scrape-all.js wechat "装备强化"
node scrape-all.js douyin
```

---

## 📊 **百度贴吧爬虫（重点）**

### **为什么推荐贴吧？**
✅ **内容质量高** - 玩家深度攻略  
✅ **反爬较弱** - 容易获取  
✅ **数据全面** - 帖子+回复  
✅ **更新及时** - 活跃社区  

### **使用示例**
```bash
$ node scrape-tieba.js "鬼泣攻略" 5

🚀 爬取百度贴吧: 鬼泣攻略

🔍 搜索贴吧帖子...
✅ 搜索结果: 23 条帖子

📱 访问 DNF 手游吧...
📖 爬取第 1/5 页...
   ✅ 本页 15 条帖子
📖 爬取第 2/5 页...
   ✅ 本页 15 条帖子
...

✅ 共爬取 73 条帖子

📋 热门帖子预览:

📌 【攻略】鬼泣职业全面解析 - 从萌新到高手
   👤 作者: 攻略帝
   💬 回复: 1523
   🔗 https://tieba.baidu.com/p/xxxxx
```

### **详情爬取**
```javascript
// 爬取帖子完整内容（包括高赞回复）
const detail = await scrapePostDetail('https://tieba.baidu.com/p/xxxxx');
console.log(detail.mainContent);     // 楼主内容
console.log(detail.topReplies);      // 前5条高赞回复
```

---

## 🤖 **智能处理流程**

```
1. 爬取原始内容
   ↓
2. AI 提取关键信息
   - 主题分类（职业/副本/装备）
   - 核心要点（3-5条）
   - 质量评分（1-10）
   ↓
3. 内容清洗 + 分块
   ↓
4. 向量化（OpenAI Embeddings）
   ↓
5. 存入 Supabase
   ↓
6. 用户问答时检索
```

### **AI 质量过滤**
```javascript
// 只入库质量 ≥ 6分 的内容
if (metadata.qualityScore >= 6) {
  await storeGuide(post, metadata);
}
```

---

## 📁 **文件清单**

```
backend/
├── scrape-tieba.js          # 百度贴吧爬虫 ⭐
├── scrape-douyin.js         # 抖音爬虫
├── scrape-wechat.js         # 公众号爬虫
├── scrape-all.js            # 统一调度器（爬取+入库）
├── dnf-import-guides.js     # 手动导入攻略
├── dnf-rag-query.js         # RAG 问答引擎
├── dnf-rag-schema.sql       # 数据库表结构
└── package.json             # 依赖配置
```

---

## ⚙️ **自动化运行**

### **OpenClaw 定时任务**
```bash
# 每天爬取一次贴吧最新攻略
openclaw cron add \
  --name "DNF攻略更新-贴吧" \
  --schedule "0 2 * * *" \
  --task "cd backend && node scrape-all.js tieba"

# 每周爬取一次公众号
openclaw cron add \
  --name "DNF攻略更新-公众号" \
  --schedule "0 3 * * 0" \
  --task "cd backend && node scrape-all.js wechat"
```

---

## 💰 **成本估算**

| 项目 | 用量 | 费用 |
|------|------|------|
| 爬虫运行 | 本地 | $0 |
| AI 内容提取 | 100次/天 | ~$1/天 |
| 向量化 | 500块/天 | ~$0.5/天 |
| Supabase 存储 | 1GB | $0 |
| **月总计** | | **~$45** |

优化方案：
- 降低爬取频率 → $20/月
- 使用本地模型提取 → $15/月

---

## ⚠️ **反爬应对**

### **基础防护**
```javascript
// 随机延迟
await page.waitForTimeout(Math.random() * 2000 + 1000);

// 模拟人类行为
await page.mouse.move(x, y);
await page.evaluate(() => window.scrollBy(0, 300));

// User-Agent 轮换
const ua = randomUserAgent();
```

### **高级策略**
- 使用代理池（防IP封禁）
- Cookie池（模拟多账号）
- 降低频率（每页间隔3-5秒）

---

## 🎯 **推荐策略**

### **阶段 1: 快速验证（当前）**
- ✅ 手动整理 10-20 篇优质攻略
- ✅ 使用模拟数据测试 RAG
- ✅ 验证用户需求

### **阶段 2: 半自动化（1周内）**
- 🔄 每天手动运行贴吧爬虫
- 🔄 AI 过滤后人工审核
- 🔄 逐步积累知识库

### **阶段 3: 全自动化（1月内）**
- 🚀 OpenClaw 定时任务
- 🚀 多平台并行爬取
- 🚀 自动去重 + 质量评分

---

## 🔥 **下一步行动**

需要我：
1. **测试贴吧爬虫**（运行并查看效果）？
2. **配置自动化任务**（OpenClaw 定时爬取）？
3. **优化质量过滤**（调整 AI 评分标准）？
4. **扩展其他平台**（知乎、B站）？

选一个我立刻实现！🚀
