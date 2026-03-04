# 🚀 一键部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/ai-news-platform)

## 快速部署步骤

### 方法 1: Vercel 一键部署 (推荐)

1. **Fork 此项目** (或上传到你的 GitHub)

2. **访问 Vercel**
   - 登录 https://vercel.com
   - 点击 "New Project"
   - 导入你的 GitHub 仓库

3. **配置**
   - Root Directory: `frontend`
   - Framework Preset: Next.js
   - 无需环境变量 (使用模拟数据)

4. **点击 Deploy**
   - 等待 1-2 分钟
   - 获得地址: `https://your-project.vercel.app`

### 方法 2: 本地运行

```bash
# 克隆项目
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

## 演示说明

当前版本使用 **模拟数据**，无需任何 API 密钥即可运行。

### 要接入真实数据：

1. 创建 Supabase 项目
2. 配置 `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```
3. 修改 `app/page.tsx`:
   ```typescript
   // 从这行：
   const trends = mockTrends;
   
   // 改为：
   const trends = await getTrending();
   ```

## 功能特性

✅ 响应式设计 (移动端友好)
✅ 实时热点展示
✅ AI 智能摘要
✅ 分类筛选
✅ 美观的卡片布局
✅ 无需后端即可演示

## 技术栈

- **前端**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **部署**: Vercel
- **数据**: 模拟数据 / Supabase (可选)

---

**需要帮助？** 在 Discord 找我：albert_15619
