#!/bin/bash
# 818ys-sup-kit Git 初始化和提交脚本

set -e

cd /Users/dresing/projects/818ys-sup-kit

echo "📂 当前目录: $(pwd)"
echo ""

# 1. 初始化 Git 仓库
echo "🔧 初始化 Git 仓库..."
git init
echo ""

# 2. 创建 .gitignore
echo "📝 创建 .gitignore..."
cat > .gitignore <<'EOF'
# Android 编译产物
*.iml
.gradle
/local.properties
/.idea/
.DS_Store
/build
/captures
.externalNativeBuild
.cxx
*.apk
*.ap_
*.aab

# Gradle
.gradle/
build/
gradle-app.setting
!gradle-wrapper.jar
!gradle-wrapper.properties

# IDE
*.iml
.idea/
*.iws
*.ipr
out/
.project
.settings/
.classpath

# OS
.DS_Store
Thumbs.db

# Kotlin
*.class
*.log
*.jar
*.war
*.ear
*.zip
*.tar.gz
*.rar

# Android Studio
local.properties
captures/
.navigation/
output.json

# Keystore
*.jks
*.keystore

# 其他
/app/release/
EOF

echo ""

# 3. 暂存所有文件
echo "📦 暂存所有文件..."
git add .
echo ""

# 4. 显示状态
echo "📊 Git 状态:"
git status --short | head -20
echo "... (总计 $(git status --short | wc -l | xargs) 个文件)"
echo ""

# 5. 提交
echo "💾 提交代码..."
git commit -m "feat: 初始化 818ys-sup-kit 项目

- Jetpack Compose + Material 3 UI
- MVVM 架构 (80+ Kotlin 文件)
- 核心功能模块:
  - OCR 文字识别 (ML Kit)
  - 相机功能 (CameraX)
  - 脚本引擎 (Rhino JS)
  - 本地数据库 (Room)
  - 后台任务 (WorkManager)
- 现代化技术栈:
  - Kotlin 1.9.24
  - Android SDK 34
  - Gradle 8.1.0
  - Compose BOM 2024.02.00

Status: 基础框架完成 (~30%)"
echo ""

# 6. 查看提交记录
echo "📝 提交记录:"
git log --oneline -1
echo ""

echo "✅ Git 初始化完成！"
echo ""
echo "🔍 当前状态:"
git status
echo ""
echo "📋 下一步："
echo "  - 配置远程仓库: git remote add origin <repo-url>"
echo "  - 推送代码: git push -u origin main"
