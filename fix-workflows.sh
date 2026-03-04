#!/bin/bash
# 修复所有 workflow 文件的 submodule checkout 问题

cd /Users/dresing/projects/818ys/.github/workflows

for file in main-regression.yml nightly-regression.yml pr-gate.yml; do
  if [ -f "$file" ]; then
    echo "修复 $file..."
    # 在 checkout@v4 后添加 submodules: recursive
    sed -i '' '/- uses: actions\/checkout@v4$/a\
        with:\
          submodules: recursive
' "$file"
  fi
done

echo "✅ 所有 workflow 文件已修复"
