# 🍎 苹果生态 Skills 配置指南

## ✅ 已安装的工具

1. **Apple Reminders** - remindctl (0.1.1)
2. **Apple Notes** - memo (0.3.3)
3. **iMessage** - imsg (0.4.0)

---

## 📋 配置步骤

### **第一步：验证安装**

```bash
# 检查工具是否正确安装
which remindctl
which memo
which imsg

# 查看版本
remindctl --version
memo --version
imsg --version
```

**预期输出：**
```
/opt/homebrew/bin/remindctl
/opt/homebrew/bin/memo
/opt/homebrew/bin/imsg
```

---

### **第二步：配置权限**

#### **A. Apple Reminders (remindctl)**

1. **请求权限：**
   ```bash
   remindctl authorize
   ```

2. **配置系统权限：**
   - 打开「系统设置」→「隐私与安全」→「提醒事项」
   - 找到「Terminal」或「remindctl」
   - 勾选启用

3. **验证权限：**
   ```bash
   remindctl status
   ```

   **预期输出：**
   ```
   ✓ Reminders access granted
   ```

---

#### **B. Apple Notes (memo)**

1. **首次运行（会自动请求权限）：**
   ```bash
   memo notes
   ```

2. **配置系统权限：**
   - 打开「系统设置」→「隐私与安全」→「自动化」
   - 找到「Terminal」
   - 勾选「Notes.app」

3. **验证：**
   ```bash
   memo notes
   ```

   **预期输出：**
   ```
   列出所有笔记（可能为空）
   ```

---

#### **C. iMessage (imsg)**

1. **配置完全磁盘访问：**
   - 打开「系统设置」→「隐私与安全」→「完全磁盘访问」
   - 点击「+」添加「Terminal.app」
   - 勾选启用

2. **配置自动化权限（用于发送消息）：**
   - 打开「系统设置」→「隐私与安全」→「自动化」
   - 找到「Terminal」
   - 勾选「Messages.app」

3. **验证：**
   ```bash
   imsg chats --limit 5
   ```

   **预期输出：**
   ```
   显示最近 5 个对话
   ```

---

### **第三步：测试功能**

#### **测试 Apple Reminders**

```bash
# 查看今天的提醒
remindctl today

# 添加一个测试提醒
remindctl add "OpenClaw 配置测试" --due tomorrow

# 查看所有提醒列表
remindctl list

# 查看明天的提醒
remindctl tomorrow
```

---

#### **测试 Apple Notes**

```bash
# 列出所有笔记
memo notes

# 创建测试笔记
memo notes -a "OpenClaw 测试笔记"

# 搜索笔记
memo notes -s "OpenClaw"

# 列出文件夹
memo notes | grep -i folder
```

---

#### **测试 iMessage**

```bash
# 查看最近 5 个对话
imsg chats --limit 5 --json

# 查看某个对话的历史（需要先获取 chat-id）
# 先运行上面的命令，找到一个 chat-id，例如 "1"
imsg history --chat-id 1 --limit 10

# 发送测试消息（谨慎使用！会真的发送）
# imsg send --to "+86138xxxxxxxx" --text "测试消息"
```

**⚠️ 注意：** 发送消息前请确认收件人！

---

### **第四步：集成到 OpenClaw**

#### **在 TOOLS.md 中记录配置**

```bash
cd /Users/dresing/.openclaw/workspace
nano TOOLS.md
```

添加以下内容：

```markdown
### Skills 配置

#### Apple Reminders (remindctl)
- 默认列表：Reminders
- 常用命令：`remindctl today`, `remindctl add "..."`

#### Apple Notes (memo)
- 默认文件夹：Notes
- 常用命令：`memo notes`, `memo notes -a "..."`

#### iMessage (imsg)
- 常用联系人：
  - 自己：+86138xxxxxxxx
  - 同事：+86139xxxxxxxx
- 常用命令：`imsg chats --limit 5`
```

---

## 🎯 **实用示例**

### **场景 1：快速添加待办**
对 OpenClaw 说："提醒我明天 9 点检查服务器日志"

OpenClaw 会执行：
```bash
remindctl add "检查服务器日志" --due tomorrow --list Work
```

---

### **场景 2：记录会议笔记**
对 OpenClaw 说："创建笔记：今天的会议要点"

OpenClaw 会执行：
```bash
memo notes -a "会议要点 - $(date +%Y-%m-%d)"
```

---

### **场景 3：发送 iMessage**
对 OpenClaw 说："发 iMessage 给张三：服务器已重启"

OpenClaw 会执行：
```bash
imsg send --to "+86138xxxxxxxx" --text "服务器已重启"
```

---

## 🔍 **故障排查**

### **问题 1：remindctl 无权限**

**错误信息：**
```
Error: Reminders access denied
```

**解决方案：**
1. 系统设置 → 隐私与安全 → 提醒事项
2. 启用 Terminal 的访问权限
3. 重启 Terminal

---

### **问题 2：memo 无法访问笔记**

**错误信息：**
```
Error: Unable to access Notes.app
```

**解决方案：**
1. 系统设置 → 隐私与安全 → 自动化
2. Terminal → 勾选 Notes.app
3. 如果没有此选项，先运行 `memo notes` 触发权限请求

---

### **问题 3：imsg 无法读取消息**

**错误信息：**
```
Error: Unable to read Messages database
```

**解决方案：**
1. 系统设置 → 隐私与安全 → 完全磁盘访问
2. 添加并启用 Terminal.app
3. **重启 Terminal**（重要！）

---

## 📚 **高级用法**

### **批量添加提醒**

```bash
# 从文件批量导入
cat << EOF | while read line; do remindctl add "$line"; done
检查邮件
更新文档
提交代码
EOF
```

### **导出所有笔记**

```bash
# 导出为 Markdown
memo notes -ex > ~/Desktop/all_notes_$(date +%Y%m%d).md
```

### **监控 iMessage**

```bash
# 实时监控某个对话
imsg watch --chat-id 1
```

---

## ✅ **配置完成检查清单**

运行以下命令，确保所有功能正常：

```bash
echo "🔍 检查 Reminders..."
remindctl status && echo "✅ Reminders OK" || echo "❌ Reminders 需要配置权限"

echo ""
echo "🔍 检查 Notes..."
memo notes > /dev/null 2>&1 && echo "✅ Notes OK" || echo "❌ Notes 需要配置权限"

echo ""
echo "🔍 检查 iMessage..."
imsg chats --limit 1 > /dev/null 2>&1 && echo "✅ iMessage OK" || echo "❌ iMessage 需要配置权限"

echo ""
echo "🎉 配置检查完成！"
```

---

## 📞 **需要帮助？**

如果遇到问题：
1. 检查系统设置中的权限配置
2. 重启 Terminal
3. 查看工具的官方文档：
   - remindctl: https://github.com/steipete/remindctl
   - memo: https://github.com/antoniorodr/memo
   - imsg: https://imsg.to

---

**配置日期：** 2026-02-08  
**OpenClaw 版本：** Latest  
**macOS 版本：** Sequoia (15.2)
