#!/bin/bash
# 完整的 Git 提交脚本

set -e  # 遇到错误立即退出

cd /Users/dresing/projects/818ys-sup/android-project

echo "📂 当前目录: $(pwd)"
echo ""

# 1. 配置远程仓库
echo "🔗 配置远程仓库..."
git remote remove origin 2>/dev/null || true
git remote add origin git@github.com:techfitmaster/818ys-sup.git
git remote -v
echo ""

# 2. 暂存所有修改
echo "📦 暂存所有修改..."
git add -A
echo ""

# 3. 显示状态
echo "📊 Git 状态:"
git status --short | head -20
echo "... (总计 $(git status --short | wc -l) 个文件)"
echo ""

# 4. 提交
echo "💾 提交修改..."
git commit -m "refactor: 清理项目依赖库

- 移除 2215 个已删除的库文件
- 更新资源文件  
- 添加自定义属性文件"
echo ""

# 5. 查看提交记录
echo "📝 提交记录:"
git log --oneline -2
echo ""

# 6. 推送到远程
echo "🚀 推送到 GitHub..."
git push -u origin main 2>&1 || {
    echo "⚠️ main 分支推送失败，尝试 master 分支..."
    git push -u origin master
}
echo ""

echo "✅ 完成！"
echo ""
echo "🔍 最终状态:"
git status
