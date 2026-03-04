#!/bin/bash
set -e

cd /Users/dresing/projects/818ys

echo "📝 当前未提交文件："
git status --short

echo ""
echo "🔧 修复并提交 CI workflow..."

# 添加修改的文件
git add .github/workflows/

# 提交修复
git commit -m "fix(ci): 修复 main/nightly regression workflows 缺少 submodules checkout

问题: platform-core 子模块未被 checkout 导致构建失败
- main-regression.yml: 添加 submodules: recursive
- nightly-regression.yml: 从远程同步
- pr-gate.yml: 从远程同步

修复: 在 actions/checkout@v4 步骤添加 submodules: recursive

Closes GitHub Actions run #21822231138"

echo ""
echo "🚀 推送到远程..."
git push origin main

echo ""
echo "✅ 修复完成！GitHub Actions 将自动重新运行测试"
echo ""
echo "查看运行状态："
echo "https://github.com/techfitmaster/818ys/actions"
