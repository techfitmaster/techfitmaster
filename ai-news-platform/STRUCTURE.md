# 项目结构说明

```
ai-news-platform/
├── backend/                    # 后端数据抓取
│   ├── fetch-trends.js        # X API 抓取 + AI 摘要生成
│   ├── package.json           # 依赖配置
│   ├── supabase-schema.sql    # 数据库表结构
│   ├── .env.example           # 环境变量模板
│   └── .env                   # 实际配置 (需自行创建)
│
├── frontend/                   # Next.js 前端
│   ├── app/
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页 (热点列表)
│   │   ├── globals.css        # 全局样式
│   │   └── components/
│   │       └── TrendingCard.tsx  # 热点卡片组件
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── .env.example
│   └── .env.local             # 实际配置 (需自行创建)
│
├── README.md                   # 完整部署指南
└── setup.sh                    # 快速启动脚本
```

## 核心文件说明

### 后端
- **fetch-trends.js**: 核心抓取逻辑
  - 从 X API 获取热点
  - 调用 OpenAI 生成摘要
  - 存入 Supabase

- **supabase-schema.sql**: 数据库设计
  - `trending_news` 表
  - 索引优化
  - 自动更新触发器

### 前端
- **page.tsx**: 服务端组件，直接查询 Supabase
- **TrendingCard.tsx**: 热点卡片 UI
- **layout.tsx**: 全局布局 + SEO

## 数据流

```
X API → fetch-trends.js → OpenAI API
                ↓
           Supabase DB
                ↓
         Next.js (SSR) → 用户浏览器
```

## 下一步

1. **配置环境变量** (必须)
2. **运行 setup.sh** (可选，自动安装)
3. **部署到 Vercel** (推荐)
4. **设置 OpenClaw 定时任务** (自动化)
