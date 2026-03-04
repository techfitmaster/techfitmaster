#!/bin/bash
# 快速启动脚本

echo "🚀 AI 资讯速报平台 - 快速启动"
echo "================================"
echo ""

# 检查环境变量
if [ ! -f backend/.env ]; then
  echo "⚠️  请先配置 backend/.env"
  echo "   复制 backend/.env.example 并填入你的密钥"
  exit 1
fi

if [ ! -f frontend/.env.local ]; then
  echo "⚠️  请先配置 frontend/.env.local"
  echo "   复制 frontend/.env.example 并填入你的密钥"
  exit 1
fi

# 安装依赖
echo "📦 安装后端依赖..."
cd backend && npm install --silent
cd ..

echo "📦 安装前端依赖..."
cd frontend && npm install --silent
cd ..

echo ""
echo "✅ 安装完成！"
echo ""
echo "接下来的步骤:"
echo "1. 后端测试: cd backend && npm run fetch"
echo "2. 前端启动: cd frontend && npm run dev"
echo "3. 访问: http://localhost:3000"
echo ""
echo "完整文档: 查看 README.md"
