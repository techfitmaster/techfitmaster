# 🕷️ 抖音 & 公众号爬虫方案

## ✅ **可行性分析**

### **抖音**
- ✅ **可爬取内容**: 热榜、视频标题、热度、作者
- ⚠️ **反爬措施**: 需要模拟真实浏览器、登录状态
- 💡 **推荐方案**: Playwright 浏览器自动化

### **公众号**
- ✅ **可爬取内容**: 文章标题、摘要、发布时间
- ⚠️ **限制**: 需要通过搜狗微信搜索或第三方API
- 💡 **推荐方案**: 搜狗微信搜索 + Playwright

---

## 🚀 **快速使用**

### **安装依赖**
```bash
cd backend
npm install playwright
npx playwright install chromium
```

### **爬取抖音热点**
```bash
npm run scrape:douyin
```

### **爬取公众号文章**
```bash
npm run scrape:wechat "DNF手游"
npm run scrape:wechat "鬼泣攻略"
```

---

## 📊 **爬取示例输出**

### **抖音热点**
```
🚀 启动抖音爬虫...

📱 访问抖音热榜...
✅ 抓取到 10 条热点视频

📹 1. DNF手游鬼泣全技能展示
   🔥 热度: 1200万
   🔗 链接: https://www.douyin.com/video/xxxxx

📹 2. DNF手游安图恩副本速通教学
   🔥 热度: 980万
   🔗 链接: https://www.douyin.com/video/yyyyy
```

### **公众号文章**
```
🔍 搜索公众号文章: DNF手游

✅ 找到 15 篇相关文章

📄 DNF手游：鬼泣职业深度解析
   👤 公众号: 地下城玩家社区
   📅 发布: 2天前
   🔗 链接: https://mp.weixin.qq.com/s/xxxxx
```

---

## ⚠️ **重要注意事项**

### **1. 反爬虫应对**
```javascript
// 随机延迟
await page.waitForTimeout(Math.random() * 2000 + 1000);

// 模拟鼠标移动
await page.mouse.move(Math.random() * 1000, Math.random() * 800);

// 滚动页面
await page.evaluate(() => window.scrollBy(0, 300));
```

### **2. 登录状态保持**
```javascript
// 保存 cookies
await context.storageState({ path: 'auth.json' });

// 加载 cookies
const context = await browser.newContext({
  storageState: 'auth.json'
});
```

### **3. IP 限制处理**
- 使用代理池
- 降低爬取频率
- 分布式爬取

---

## 🔐 **合规建议**

### **✅ 合法使用**
- 仅爬取公开数据
- 遵守 robots.txt
- 不频繁请求（避免DDOS）
- 标注数据来源

### **❌ 避免**
- 爬取付费/会员内容
- 绕过登录验证
- 商业化未授权数据
- 侵犯版权内容

---

## 🎯 **整合到 RAG 系统**

### **完整流程**
```
抖音/公众号爬取
    ↓
内容提取 + 清洗
    ↓
文本分块 (Chunking)
    ↓
向量化 (Embeddings)
    ↓
存入 Supabase
    ↓
用户问答时检索
```

### **自动化更新**
```bash
# OpenClaw 定时任务
openclaw cron add \
  --name "DNF攻略更新" \
  --schedule "0 */6 * * *" \  # 每6小时
  --task "cd backend && npm run scrape:all"
```

---

## 📦 **已创建文件**

```
backend/
├── scrape-douyin.js      # 抖音爬虫
├── scrape-wechat.js      # 公众号爬虫
├── package.json          # 依赖配置
└── SCRAPER-README.md     # 本文档
```

---

## 💡 **替代方案**

### **方案 A: 第三方 API（推荐）**
- **新榜**: 公众号数据 API
- **巨量引擎**: 抖音官方数据
- **优点**: 稳定、合规、数据全
- **缺点**: 需付费

### **方案 B: RSS 聚合**
- 部分公众号支持 RSS
- 使用 RSSHub 等工具
- **优点**: 合法、稳定
- **缺点**: 覆盖面有限

### **方案 C: 用户手动提交**
- 提供表单让用户提交攻略链接
- 系统自动抓取和处理
- **优点**: 完全合规
- **缺点**: 内容增长慢

---

## 🚦 **下一步行动**

需要我：
1. **完善爬虫代码**（处理分页、详情页）？
2. **整合到 RAG 系统**（自动入库）？
3. **设置自动化任务**（OpenClaw 定时爬取）？
4. **对接第三方 API**（新榜/巨量引擎）？

选一个我立刻实现！🚀
