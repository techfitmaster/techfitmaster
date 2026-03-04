# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## 当前配置

### Git 自动备份

- **仓库**：git@github.com:techfitmaster/myopenclaw.git
- **频率**：每天 2 次（00:00 和 12:00）
- **脚本**：`/Users/dresing/.openclaw/auto-backup.sh`
- **Cron ID**：`a83dc9ed-1400-4a61-8940-5e86135a6571`
- **备份内容**：workspace/, agents/, cron/, canvas/
- **排除内容**：openclaw.json, credentials/, identity/

### SSH

- **818ys 服务器**：待配置

### 项目路径

- **818ys 主项目**：`/Users/dresing/projects/818ys`
- **818ys Android**：`/Users/dresing/projects/818ys-sup/android-project`
- **Skills 仓库**：`/Users/dresing/projects/skills` (共享 skills 发布仓库)

### 命名规范

- **项目命名前缀**：`818`（所有项目名以 818 开头，例如 818ys、818-xxx）

### 自定义 Skills

#### GitHub Issues 管理 (github-issues)
- **位置**：`~/projects/skills/skills/github-issues.md`
- **用途**：创建符合 BDD 格式的高质量 GitHub Issues
- **功能**：
  - 自动调查代码（数据库、API、枚举）
  - 根因分析（优先级排序 ⭐⭐⭐⭐⭐）
  - 双层解决方案（紧急 P0 + 长期 P1）
  - 质量评分（目标 ≥9/10）
- **使用**：直接说"创建一个 bug/feature issue"
- **辅助脚本**：`workspace/skills/github-issues/` 下有 3 个调查脚本
  - `find-entity.sh` - 查找数据库实体
  - `find-apis.sh` - 查找 API 接口
  - `find-status.sh` - 查找状态枚举

### 苹果生态 Skills

#### 已安装工具
- ✅ **Apple Reminders (remindctl 0.1.1)** - 提醒事项管理
- ✅ **Apple Notes (memo 0.3.3)** - 备忘录管理
- ✅ **iMessage (imsg 0.4.0)** - 消息收发

#### 快速检查
```bash
/Users/dresing/.openclaw/check-apple-skills.sh
```

#### 配置指南
详细配置步骤：`workspace/skills/apple-skills-setup.md`

#### 常用命令
- **Reminders**: `remindctl today`, `remindctl add "..."`
- **Notes**: `memo notes`, `memo notes -a "..."`
- **iMessage**: `imsg chats --limit 5`, `imsg send --to "..." --text "..."`

---

### 多角色系统

#### 可用角色
| 角色 | 文件 | 模型 | 描述 |
|------|------|------|------|
| CEO | `roles/ceo.md` | `openai-codex/gpt-5.3-codex` | 战略决策、业务全景 |
| 技术部 | `roles/tech.md` | `openai-codex/gpt-5.3-codex` | 代码审查、故障排查 |
| 市场部 | `roles/marketing.md` | `anthropic/claude-sonnet-4-6` | 竞品分析、活动策划 |
| 运营部 | `roles/operations.md` | `anthropic/claude-sonnet-4-6` | 用户增长、内容运营 |
| 财务部 | `roles/finance.md` | `google-antigravity/gemini-3-flash` | 账目核对、预算管理 |
| 法务部 | `roles/legal.md` | `google-antigravity/gemini-3-flash` | 合同审查、合规检查 |

#### 切换角色
说 "切换到 [角色名]" 即可，当前角色会加载对应的配置和记忆。

#### 模型自动切换
切换角色时自动读取角色文件中的 `**模型**` 字段，执行 `openclaw models set <model-id>` 切换模型。退出角色时恢复默认模型 `anthropic/claude-sonnet-4-6`。

---

Add whatever helps you do your job. This is your cheat sheet.
