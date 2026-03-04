#!/bin/bash
# 快速部署脚本

echo "🚀 准备部署 AI 资讯速报平台到 GitHub + Vercel"
echo "=================================================="
echo ""

# 检查 git
if ! command -v git &> /dev/null; then
    echo "❌ 请先安装 Git"
    exit 1
fi

# 初始化 Git (如果未初始化)
if [ ! -d .git ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "Initial commit: AI News Platform"
fi

echo ""
echo "✅ 项目准备完成！"
echo ""
echo "📌 下一步操作："
echo ""
echo "1. 在 GitHub 创建新仓库："
echo "   https://github.com/new"
echo "   仓库名: ai-news-platform"
echo ""
echo "2. 推送代码："
echo "   git remote add origin https://github.com/YOUR_USERNAME/ai-news-platform.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. 部署到 Vercel:"
echo "   访问: https://vercel.com/new"
echo "   导入你的 GitHub 仓库"
echo "   Root Directory: frontend"
echo "   点击 Deploy"
echo ""
echo "4. 2 分钟后获得访问地址！"
echo "   https://your-project.vercel.app"
echo ""
echo "=================================================="
echo "需要帮助？Discord: albert_15619"
