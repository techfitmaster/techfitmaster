# 角色目录

当前可用角色：

| 角色 | emoji | 模型 | 描述 |
|------|-------|------|------|
| [CEO](ceo.md) | 🏢 | `openai-codex/gpt-5.3-codex` | 战略决策、业务全景、风险预警 |
| [技术部](tech.md) | 💻 | `openai-codex/gpt-5.3-codex` | 代码审查、故障排查、技术支持 |
| [市场部](marketing.md) | 📈 | `anthropic/claude-sonnet-4-6` | 竞品分析、活动策划、用户反馈 |
| [运营部](operations.md) | 🎯 | `anthropic/claude-sonnet-4-6` | 用户增长、内容运营、数据分析 |
| [财务部](finance.md) | 💰 | `google-antigravity/gemini-3-flash` | 账目核对、支出分析、预算管理 |
| [法务部](legal.md) | ⚖️ | `google-antigravity/gemini-3-flash` | 合同审查、合规检查、风险提示 |

## 切换角色

告诉我 "切换到 [角色名]" 即可切换。

例如：
- "切换到 CEO"
- "切换到技术部"
- "切到市场部"

### 模型自动切换

切换角色时，agent 会自动读取角色文件中的 `**模型**` 字段，并执行模型切换：

```bash
# 切换角色时自动执行
openclaw models set <角色对应的 model-id>

# 切换回默认状态时恢复
openclaw models set anthropic/claude-sonnet-4-6
```

**默认模型**：`anthropic/claude-sonnet-4-6`（市场部和运营部使用默认模型，无需额外切换）

## 跨角色协作

多角色任务会自动组合信息，比如：
- 技术部排查问题 → CEO 需要汇总汇报
- 法务部审合同 → 财务部看条款

---

创建时间：2026-03-02
