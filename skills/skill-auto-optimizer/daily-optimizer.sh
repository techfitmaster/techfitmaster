#!/bin/bash
# 818 Skills 每日自动优化脚本
set -e

SKILLS_DIR="/Users/dresing/projects/skills"
GAMING_DIR="/Users/dresing/projects/818-gaming"
AGI_DIR="/Users/dresing/projects/818-agi"
REPORT=""

echo "=== 818 Skills 每日优化 $(date '+%Y-%m-%d') ==="

# 1. 获取过去24小时 PR 情况
GAMING_PRS=$(gh pr list --repo techfitmaster/818-gaming --state all --limit 20 \
  --json number,title,mergedAt,createdAt,body 2>/dev/null | \
  jq -c '[.[] | select(.createdAt > (now - 86400 | todate))]' 2>/dev/null || echo "[]")

AGI_PRS=$(gh pr list --repo techfitmaster/818-agi --state all --limit 20 \
  --json number,title,mergedAt,createdAt,body 2>/dev/null | \
  jq -c '[.[] | select(.createdAt > (now - 86400 | todate))]' 2>/dev/null || echo "[]")

GAMING_COUNT=$(echo "$GAMING_PRS" | jq 'length')
AGI_COUNT=$(echo "$AGI_PRS" | jq 'length')

echo "今日 PR: 818-gaming=$GAMING_COUNT, 818-agi=$AGI_COUNT"

# 2. 用 Claude Code 分析并优化 skill
cd "$GAMING_DIR"
claude --permission-mode bypassPermissions --print "
## 任务：每日 Skill 自动优化

分析过去24小时的 PR 执行情况，优化 818-dev-flow.md。

### 今日 PR 数据
818-gaming PRs: $GAMING_PRS
818-agi PRs: $AGI_PRS

### 执行步骤

1. 读取当前 .claude/commands/818-dev-flow.md
2. 分析 PR 数据中的问题迹象：
   - commit message 不规范
   - PR 描述缺失信息
   - 步骤跳过或失败的迹象
3. 如有明确优化点（置信度>80%）：
   - 直接修改 .claude/commands/818-dev-flow.md
   - 同时修改 $SKILLS_DIR/skills/818-gaming/818-dev-flow.md
4. 输出优化报告（JSON格式）：
{
  \"optimized\": true/false,
  \"changes\": [\"变更1\", \"变更2\"],
  \"issues_found\": [\"问题1\"],
  \"suggestion\": \"明日建议\"
}

如果今日 PR 数据不足或无明显问题，输出 {\"optimized\": false, \"reason\": \"...\"}
" 2>/dev/null

echo "优化完成"
