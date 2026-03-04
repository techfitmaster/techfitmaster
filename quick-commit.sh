#!/bin/bash
# 快速提交 android-project

cd /Users/dresing/projects/818ys-sup/android-project || exit 1

echo "📂 当前目录: $(pwd)"
echo ""

echo "📊 Git 状态检查..."
git status --short | head -10
echo ""

echo "🚀 开始提交..."
git commit -m "feat: 初始化鳄霸助手反编译项目

- 学习样本项目，用于参考重构 818ys-sup
- 从鳄霸助手 APK 反编译得到
- 包含 2463 个 Java 文件 + 992 个资源文件
- 已去除卡密验证
- 作为 818ys-sup-kit 重构的参考代码"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 提交成功！"
    echo ""
    echo "📝 提交信息:"
    git log -1 --oneline
    echo ""
    echo "📊 提交统计:"
    git show --stat --oneline | head -20
    echo ""
    echo "✅ Git 状态:"
    uncommitted=$(git status --porcelain | wc -l)
    echo "未提交文件: $uncommitted"
else
    echo ""
    echo "❌ 提交失败"
    exit 1
fi
