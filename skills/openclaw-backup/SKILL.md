# OpenClaw Auto Backup Skill

自动备份 OpenClaw 配置到 GitHub 的技能。

## 功能

- 检测 workspace/、agents/、cron/ 目录的更改
- 自动提交到本地 Git
- 推送到远程 GitHub 仓库
- 生成带时间戳的提交信息

## 使用方式

### 手动触发
```bash
/Users/dresing/.openclaw/auto-backup.sh
```

### 自动触发
已通过 OpenClaw cron 配置为每天 00:00 和 12:00 自动执行。

## 配置

**仓库地址：** git@github.com:techfitmaster/myopenclaw.git  
**备份内容：**
- workspace/ - 配置文件
- agents/ - 会话数据
- cron/ - 定时任务
- canvas/ - Canvas 数据

**排除内容：**
- openclaw.json - 敏感 API 密钥
- credentials/ - 认证信息
- identity/ - 设备身份

## 脚本位置

`/Users/dresing/.openclaw/auto-backup.sh`

## Cron 任务 ID

`a83dc9ed-1400-4a61-8940-5e86135a6571`

## 日志

执行日志会输出到标准输出，包含：
- 时间戳
- 更改检测结果
- 提交状态
- 推送结果

## 故障排查

### 推送失败
1. 检查 SSH 密钥是否正确：`ssh -T git@github.com`
2. 检查网络连接
3. 确认仓库权限

### 没有更改
如果脚本输出"没有新的更改"，说明自上次备份以来没有文件修改。

### 提交冲突
如果有其他设备也在提交，可能需要先拉取：
```bash
cd /Users/dresing/.openclaw
git pull --rebase origin main
```
