# AI 资讯速报平台

> 实时追踪 X 平台热点，AI 智能摘要，每 30 分钟自动更新

![Demo](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=AI+News+Platform+Demo)

## ✨ 功能特性

- 🔥 实时热点追踪
- 🤖 AI 智能摘要 (GPT-4)
- 📊 数据可视化
- 📱 响应式设计
- ⚡ 自动更新 (30分钟)
- 🎨 现代化 UI

## 🚀 快速开始

### 在线演示

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ai-news-platform&project-name=ai-news&repository-name=ai-news-platform)

点击按钮，2 分钟后即可访问！

### 本地运行

```bash
cd frontend
npm install
npm run dev
```

访问 `http://localhost:3000`

## 📁 项目结构

```
ai-news-platform/
├── backend/           # 数据抓取 (Node.js)
│   ├── fetch-trends.js
│   └── supabase-schema.sql
├── frontend/          # Web 界面 (Next.js)
│   ├── app/
│   │   ├── page.tsx
│   │   └── components/
│   └── package.json
└── README.md
```

## 🛠️ 技术栈

- **前端**: Next.js 14, React 18, Tailwind CSS
- **后端**: Node.js, Supabase
- **AI**: OpenAI GPT-4
- **部署**: Vercel + OpenClaw

## 📸 截图

### 主页
实时热点展示，AI 智能摘要

### 分类筛选
科技、商业、娱乐、体育、政治

### 响应式设计
完美适配移动端和桌面端

## 🔧 配置

### 1. Supabase
```bash
# 在 Supabase SQL Editor 中执行
backend/supabase-schema.sql
```

### 2. 环境变量
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

### 3. 自动更新 (OpenClaw)
```bash
openclaw cron add \
  --schedule "*/30 * * * *" \
  --task "cd backend && npm run fetch"
```

## 💰 成本

| 服务 | 计划 | 费用 |
|------|------|------|
| Vercel | Hobby | $0/月 |
| Supabase | Free | $0/月 |
| OpenAI | Pay-as-go | ~$1.5/月 |
| **总计** | | **~$1.5/月** |

## 📝 待办

- [ ] 搜索功能
- [ ] 用户收藏
- [ ] RSS 订阅
- [ ] 移动端 PWA
- [ ] 多语言支持

## 📄 许可

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📧 联系

Discord: albert_15619

---

**Made with ❤️ using OpenClaw, Vercel & Supabase**
