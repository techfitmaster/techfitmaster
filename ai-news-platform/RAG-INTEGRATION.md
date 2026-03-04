# 🎯 真实 RAG 数据接入方案

## ✅ 已完成：简单 RAG（基于公众号数据）

### **当前实现**
- ✅ 基于 10 篇 2026 年公众号文章
- ✅ 文本相似度匹配算法
- ✅ 自动检索最相关的 3 篇文章
- ✅ 生成结构化回答
- ✅ 显示数据来源和相关度

### **工作原理**
```
用户提问 → 计算相似度 → 检索 Top 3 文章 → 生成回答
```

### **测试方法**
刷新 http://localhost:3000，试试这些问题：
- "2026新春有什么福利？"
- "太初武器怎么获取？"
- "女法师新职业"

---

## 🚀 升级方案：完整 RAG 系统（Supabase + OpenAI）

### **架构图**
```
用户提问
    ↓
生成问题向量 (OpenAI Embeddings)
    ↓
向量相似度搜索 (Supabase pgvector)
    ↓
检索 Top-K 相关文章
    ↓
GPT-4 生成回答 (基于检索内容)
    ↓
返回答案 + 来源
```

### **Step 1: 配置 Supabase**

#### 1.1 创建项目
```bash
# 访问 https://supabase.com
# 创建新项目，获取：
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-anon-key
```

#### 1.2 执行数据库脚本
```bash
# 在 Supabase SQL Editor 执行
backend/dnf-rag-schema.sql
```

### **Step 2: 导入数据到数据库**

```bash
cd /Users/dresing/.openclaw/workspace/ai-news-platform/backend

# 设置环境变量
export SUPABASE_URL="your-url"
export SUPABASE_KEY="your-key"
export OPENAI_API_KEY="sk-your-key"

# 导入公众号数据
node import-wechat-to-db.js
```

创建导入脚本：

```javascript
// backend/import-wechat-to-db.js
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import wechatArticles from '../frontend/app/wechatData.ts';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function importArticle(article) {
  // 1. 插入文档
  const { data: guide, error } = await supabase
    .from('dnf_guides')
    .insert({
      title: article.topic,
      category: article.category,
      content: article.ai_summary + '\n\n' + article.key_points.join('\n'),
      source_url: article.source_url,
      view_count: article.tweet_count,
    })
    .select()
    .single();

  if (error) {
    console.error('插入失败:', error);
    return;
  }

  // 2. 生成向量
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: article.topic + ' ' + article.ai_summary,
  });

  // 3. 存储向量
  await supabase.from('dnf_embeddings').insert({
    guide_id: guide.id,
    chunk_index: 0,
    chunk_text: article.ai_summary,
    embedding: embedding.data[0].embedding,
  });

  console.log(`✅ 导入: ${article.topic}`);
}

// 执行导入
for (const article of wechatArticles) {
  await importArticle(article);
  await new Promise(r => setTimeout(r, 1000)); // 限流
}
```

### **Step 3: 更新 API 使用真实 RAG**

```typescript
// app/api/ask/route.ts
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: NextRequest) {
  const { question } = await request.json();

  // 1. 生成问题向量
  const queryEmbedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: question,
  });

  // 2. 向量搜索
  const { data } = await supabase.rpc('search_similar_guides', {
    query_embedding: queryEmbedding.data[0].embedding,
    match_threshold: 0.7,
    match_count: 3,
  });

  // 3. 用 GPT-4 生成回答
  const context = data.map(d => d.chunk_text).join('\n\n');
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: '你是DNF手游攻略专家，基于提供的文章内容回答用户问题。'
      },
      {
        role: 'user',
        content: `文章内容:\n${context}\n\n问题: ${question}`
      }
    ],
  });

  return NextResponse.json({
    answer: completion.choices[0].message.content,
    sources: data.map(d => ({ title: d.title, url: d.source_url })),
  });
}
```

---

## 📊 方案对比

| 特性 | 当前方案 | 完整 RAG |
|------|---------|---------|
| 数据源 | 10篇公众号 | Supabase 数据库 |
| 搜索方式 | 关键词匹配 | 向量相似度 |
| 回答质量 | 模板拼接 | GPT-4 生成 |
| 可扩展性 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 成本 | $0 | ~$30/月 |
| 实时性 | 静态数据 | 可实时更新 |

---

## 💰 成本估算（完整 RAG）

| 项目 | 用量 | 费用 |
|------|------|------|
| Supabase | 1GB 数据 | $0 |
| OpenAI Embeddings | 100篇文章 | ~$0.5 |
| OpenAI GPT-4-mini | 1000次问答 | ~$10 |
| **总计** | | **~$10.5/月** |

---

## 🎯 推荐步骤

### **阶段 1: 当前（已完成）✅**
- 使用简单 RAG，基于 10 篇公众号
- 验证功能可用性
- 收集用户反馈

### **阶段 2: 扩展数据（本周）**
- 爬取更多公众号文章（50-100篇）
- 更新前端数据文件
- 优化匹配算法

### **阶段 3: 完整 RAG（下周）**
- 配置 Supabase 数据库
- 导入向量数据
- 接入 OpenAI GPT-4

---

## 🔥 立即测试当前功能

刷新 http://localhost:3000，试试：

1. **提问**: "2026新春活动有哪些福利？"
   - 应该返回 3 篇相关文章
   - 显示福利详情和来源

2. **提问**: "太初武器怎么获取？"
   - 检索太初武器相关文章
   - 展示获取方法

3. **提问**: "魔界人奇遇记"
   - 找到活动相关内容
   - 显示玩法攻略

---

## 📝 环境变量配置

创建 `.env.local`：

```bash
# Supabase（完整 RAG 需要）
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-anon-key

# OpenAI（完整 RAG 需要）
OPENAI_API_KEY=sk-your-key
```

---

需要我帮你执行哪个阶段？
1. **测试当前简单 RAG**（已就绪）
2. **爬取更多公众号数据**
3. **配置完整 RAG 系统**
