#!/bin/bash
cd /Users/dresing/projects/818ys

# 提交 main-regression.yml 修复
git add .github/workflows/main-regression.yml
git commit -m "fix(ci): 修复 main regression workflow 缺少 submodules checkout

问题: platform-core 子模块未被 checkout 导致构建失败
修复: 在 actions/checkout@v4 步骤添加 submodules: recursive

Closes GitHub Actions run #21822231138"

# 推送到远程
git push origin main

echo "✅ 修复已推送，GitHub Actions 将重新运行"
