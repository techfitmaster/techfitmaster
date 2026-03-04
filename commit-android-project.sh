#!/bin/bash
# Git 提交脚本 - android-project

cd /Users/dresing/projects/818ys-sup/android-project || exit 1

# 执行提交
git commit -m "feat: 初始化鳄霸助手反编译项目

- 学习样本项目，用于参考重构 818ys-sup
- 从鳄霸助手 APK 反编译得到
- 包含 2463 个 Java 文件 + 992 个资源文件
- 已去除卡密验证
- 作为 818ys-sup-kit 重构的参考代码"

echo "✅ Git 提交完成"
git log -1 --oneline
echo ""
echo "📊 提交统计:"
git show --stat
