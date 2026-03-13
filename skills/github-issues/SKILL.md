# GitHub Issues Management Skill

## 📋 Skill Overview

**Purpose**: Create, update, and manage GitHub Issues following industry standards with complete technical details.

**Use When**: 
- User asks to "create a new requirement/bug/feature"
- User wants to "update/improve an existing issue"
- User needs to "analyze project requirements"
- User requests "standard issue format"

**Key Features**:
- ✅ Standard title format: `[Type] Module - Description`
- ✅ Type labels: bug, feature, enhancement, docs, wontfix
- ✅ Priority labels: P0 (critical), P1 (high), P2 (medium), P3 (low)
- ✅ BDD format (Given/When/Then)
- ✅ Auto-discover code structure from project
- ✅ Database schema extraction
- ✅ API endpoint mapping
- ✅ Root cause analysis with priority ranking
- ✅ Solution recommendations (urgent + long-term)
- ✅ PR-Issue linking with `Fixes #123`

---

## 🚀 Quick Start

### Prerequisites
1. GitHub CLI installed and authenticated: `gh auth status`
2. Project repository cloned locally
3. Access to project codebase
4. Issue templates available in `.github/ISSUE_TEMPLATE/`

### Basic Usage

```bash
# Create a new bug issue
gh issue create --title "[Bug] 支付模块 - 订单状态不同步" \
  --body "$(cat issue-template.md)" \
  --label "bug,P0" \
  --project "Project Name"

# Create feature request
gh issue create --title "[Feature] 用户中心 - 角色切换功能" \
  --body "$(cat feature-template.md)" \
  --label "feature,P1" \
  --project "Project Name"

# Link PR to issue (in PR description)
# Fixes #123
```

---

## 📋 Issue Title Format

```
[类型] 模块 - 简短描述
```

### 类型前缀
| 前缀 | 用途 | 示例 |
|------|------|------|
| `[Bug]` | 功能缺陷 | `[Bug] 支付模块 - 订单状态不同步` |
| `[Feature]` | 新功能 | `[Feature] 用户中心 - 角色切换功能` |
| `[Enhancement]` | 改进优化 | `[Enhancement] 性能 - 接口响应优化` |
| `[Docs]` | 文档更新 | `[Docs] API - 更新接口文档` |
| `[Refactor]` | 代码重构 | `[Refactor] 订单模块 - 拆分服务层` |

---

## 🏷️ Label Standards

### Type Labels
| 标签 | 用途 | 颜色 |
|------|------|------|
| `bug` | 功能缺陷 | 🔴 red |
| `feature` | 新功能 | 🟢 green |
| `enhancement` | 改进优化 | 🔵 blue |
| `docs` | 文档更新 | 📘 gray |
| `wontfix` | 不处理 | ⚫ black |

### Priority Labels
| 标签 | 含义 | 颜色 | 响应时间 |
|------|------|------|----------|
| `P0` / `critical` | 立即修复 | 🔴 red | 24h |
| `P1` / `high` | 本周修复 | 🟠 orange | 7d |
| `P2` / `medium` | 本月修复 | 🟡 yellow | 30d |
| `P3` / `low` | 后续处理 | 🟢 green | - |

### Module Labels (可选)
| 标签 | 模块 |
|------|------|
| `backend` | 后端服务 |
| `frontend` | 前端 |
| `database` | 数据库 |
| `devops` | 运维部署 |
| `security` | 安全相关 |

---

## 📝 Workflow

### Step 1: Understand the Requirement

**Ask the user**:
1. What is the issue? (Bug/Feature/Enhancement/Refactor)
2. What is the expected behavior?
3. What is the actual behavior (if bug)?
4. Priority level? (P0/P1/P2/P3)

### Step 2: Determine Issue Type & Priority

| 类型 | 标题前缀 | 标签 |
|------|----------|------|
| Bug | `[Bug]` | `bug` |
| Feature | `[Feature]` | `feature` |
| Enhancement | `[Enhancement]` | `enhancement` |
| Docs | `[Docs]` | `docs` |

### Step 3: Investigate the Codebase

**Auto-discover**:
```bash
# Find related code files
find . -type f \( -name "*.java" -o -name "*.ts" -o -name "*.js" \) | \
  xargs grep -l "keyword" | head -20

# Find database entities
find . -name "*Entity.java" -o -name "*AR.java" -o -name "*Model.java"

# Find API controllers
find . -name "*Controller.java" -o -name "*Api.ts"

# Find service layer
find . -name "*Service.java" -o -name "*service.ts"
```

**Extract information**:
- Database schema (table name, key fields)
- API endpoints (path, method, controller)
- Service layer (domain services, application services)
- Status enums (if applicable)

### Step 4: Build the Issue Body

**Standard Template**:

```markdown
## 📋 问题描述
[清晰简洁地描述问题]

## 🖥️ 环境信息
- **环境**: 生产/测试/开发
- **版本/分支**: 
- **平台**: web/miniapp/app

## 📝 复现步骤 (Bug)
1. 
2. 
3. 

## 📊 期望行为
[期望的正确行为]

## 🔍 实际行为 (Bug)
[当前错误表现]

## 🔧 错误日志 (Bug)
```
[粘贴相关日志]
```

## 🗄️ 数据库结构
**表名**: `table_name`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | BIGINT | 主键 |
| `status` | VARCHAR | 状态 |

## 🌐 相关接口
| 接口路径 | 方法 | 说明 | 控制器 |
|---------|------|------|--------|
| `/api/xxx` | POST | 创建xxx | `XxxController.java:123` |

## 💡 根因分析 (Bug)
1. **原因1** ⭐⭐⭐⭐⭐ (最高概率)
   - 详细说明
2. **原因2** ⭐⭐⭐⭐ (高概率)
   - 详细说明

## 🛠️ 解决方案
### 🔧 紧急修复 (P0)
1. [立即修复方案]

### 🔧 长期优化 (P1)
1. [长期改进方案]

## ✅ 验收标准
- [ ] [具体可验证的标准]
- [ ] 

## 📎 附件
- [ ] 截图/日志
- [ ] 数据库查询

## 🎯 优先级
**P0** - [理由]

## 👤 负责人
- [ ] 

## 📌 后续步骤
1. [ ]
2. [ ]
```

### Step 5: Create/Update the Issue

```bash
# Create new bug issue
gh issue create \
  --title "[Bug] 支付模块 - 订单状态不同步" \
  --body-file issue-body.md \
  --label "bug,P0,backend" \
  --assignee "@me"

# Create feature request
gh issue create \
  --title "[Feature] 用户中心 - 角色切换功能" \
  --body-file feature-body.md \
  --label "feature,P1" \
  --assignee "@me"

# Update existing issue
gh issue edit 154 --body-file updated-body.md
```

### Step 6: Link PR to Issue

在 PR 描述中使用 `Fixes #123` 或 `Closes #123` 关联 Issue：

```markdown
## Summary
修复订单状态同步问题

## Changes
- 修复回调接口
- 添加重试机制

## Testing
- [x] 本地测试通过
- [x] 预发环境验证

Fixes #123
```

---

## ✅ Quality Checklist

**目标分数**: ≥ 9/10

- [ ] 标题格式正确 `[Type] 模块 - 描述` - 1分
- [ ] 问题描述清晰具体 - 1分
- [ ] 提供复现步骤 (Bug) - 1分
- [ ] 包含环境信息 - 0.5分
- [ ] 数据库结构完整 - 1分
- [ ] API 接口已映射 - 1分
- [ ] 根因分析有优先级 - 1.5分
- [ ] 解决方案分层 (紧急+长期) - 1分
- [ ] 验收标准可验证 - 1分
- [ ] 后续步骤可执行 - 1分

---

## 🔧 Helper Scripts

### 1. Find Database Entity

**Script**: `find-entity.sh`
```bash
#!/bin/bash
KEYWORD=$1
PROJECT_PATH=$2

echo "Searching for entity related to: $KEYWORD"
find "$PROJECT_PATH" -name "*${KEYWORD}*.java" -o -name "*${KEYWORD}*AR.java" | \
  grep -E "(Entity|AR|Model)" | \
  while read -r file; do
    echo "=== $file ==="
    head -100 "$file"
  done
```

### 2. Find API Endpoints

**Script**: `find-apis.sh`
```bash
#!/bin/bash
KEYWORD=$1
PROJECT_PATH=$2

echo "Searching for APIs related to: $KEYWORD"
find "$PROJECT_PATH" -name "*Controller.java" -o -name "*Api.ts" | \
  xargs grep -n "$KEYWORD" | \
  grep -E "@(GetMapping|PostMapping|PutMapping|DeleteMapping|RequestMapping)"
```

### 3. Extract Status Enum

**Script**: `find-status.sh`
```bash
#!/bin/bash
KEYWORD=$1
PROJECT_PATH=$2

echo "Searching for status enum related to: $KEYWORD"
find "$PROJECT_PATH" -name "*Status*.java" -o -name "*status*.ts" | \
  xargs grep -A 10 "enum"
```

---

## 📊 Quality Metrics

### Completeness Score

| Metric | Weight | How to Measure |
|--------|--------|----------------|
| BDD Format | 20% | Has Given/When/Then |
| Technical Details | 30% | Database + API + Code paths |
| Root Cause Analysis | 20% | ≥3 possible causes with priority |
| Solution Design | 20% | Urgent + Long-term plans |
| Acceptance Criteria | 10% | ≥5 specific checkpoints |

**Target**: ≥ 90% for production-ready issues

---

## 🎯 Examples

### Example 1: Bug Issue

**Title**: `[Bug] 支付模块 - 订单回调状态不同步`

**Labels**: `bug, P0, backend`

```markdown
## 📋 问题描述
支付成功后，订单状态在5分钟内未更新为「已支付」，导致用户重复发起支付。

## 🖥️ 环境信息
- **环境**: 生产环境
- **版本/分支**: v2.3.1
- **平台**: H5

## 📝 复现步骤
1. 用户选择商品并发起微信支付
2. 完成支付后返回商家页面
3. 等待5分钟，检查订单状态
4. 订单状态仍为「待支付」

## 📊 期望行为
支付回调接收后，订单状态应在30秒内更新为「已支付」

## 🔍 实际行为
订单状态一直停留在「待支付」，回调日志显示回调已收到

## 🔧 错误日志
```
2026-03-13 10:30:15 [INFO] 收到支付回调: orderId=20260313103015
2026-03-13 10:30:15 [INFO] 验签通过
2026-03-13 10:30:15 [WARN] 更新订单状态失败: connection timeout
```

## 🗄️ 数据库结构
**表名**: `payment_order`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | BIGINT | 主键 |
| `order_no` | VARCHAR | 订单号 |
| `status` | VARCHAR | 状态: PENDING/SUCCESS/FAILED |
| `callback_data` | TEXT | 回调原始数据 |
| `updated_at` | DATETIME | 更新时间 |

## 🌐 相关接口
| 接口路径 | 方法 | 说明 | 控制器 |
|---------|------|------|--------|
| `/api/payment/callback` | POST | 支付回调 | `PaymentController.java:86` |
| `/api/order/{id}` | GET | 查询订单 | `OrderController.java:45` |

## 💡 根因分析
1. **数据库连接池耗尽** ⭐⭐⭐⭐⭐
   - 高并发时 HikariCP 连接池最大10个连接耗尽
   - 导致更新订单状态时 connection timeout

2. **回调处理未加事务** ⭐⭐⭐
   - 验签成功但状态更新失败时未重试

## 🛠️ 解决方案
### 🔧 紧急修复 (P0)
1. 将 HikariCP 最大连接数从10调至50
2. 添加回调处理失败自动重试机制 (最多3次)

### 🔧 长期优化 (P1)
1. 引入消息队列处理回调
2. 添加回调处理监控告警

## ✅ 验收标准
- [ ] 支付回调后订单状态30秒内更新
- [ ] 高并发下无连接超时
- [ ] 回调失败自动重试并记录日志

## 🎯 优先级
**P0** - 涉及资金状态，影响用户信任和退款流程

## 📌 后续步骤
1. [ ] 修改 HikariCP 配置
2. [ ] 添加重试机制代码
3. [ ] 预发环境压测验证
```

### Example 2: Feature Request

**Title**: `[Feature] 用户中心 - 角色切换功能`

**Labels**: `feature, P1`

```markdown
## 📋 问题描述
用户在同一房间内需要切换角色时，需要先退出房间再重新加入，操作繁琐。

## 🖥️ 环境信息
- **环境**: 全环境
- **版本/分支**: v2.4.0
- **平台**: 小程序

## 📝 功能需求
作为房间参与者
我想要在房间内直接切换角色
以便快速适应不同位置需求，无需退出重进

## 📊 期望行为
1. 用户点击「切换角色」按钮
2. 弹出可选角色列表
3. 选择新角色后立即切换成功

## 🗄️ 数据库结构
**表名**: `room_participant`

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | BIGINT | 主键 |
| `room_id` | BIGINT | 房间ID |
| `user_id` | BIGINT | 用户ID |
| `role` | VARCHAR | 当前角色 |
| `previous_role` | VARCHAR | 上一个角色(新增) |

## 🌐 相关接口
| 接口路径 | 方法 | 说明 |
|---------|------|------|
| `/api/room/{roomId}/switch-role` | POST | 切换角色 |
| `/api/room/{roomId}/available-roles` | GET | 获取可选角色 |

## ✅ 验收标准
- [ ] 角色切换在1秒内完成
- [ ] 切换后其他玩家可见
- [ ] 切换记录保留在 previous_role

## 🎯 优先级
**P1** - 提升用户体验，减少操作步骤
```

---

## 🔗 PR-Issue Linking

在 PR 描述中关联 Issue：

```markdown
## Summary
简短描述

## Changes
- 变更点1
- 变更点2

## Testing
- [x] 测试通过

Closes #123
# 或
Fixes #123
```

| 关键字 | 效果 |
|--------|------|
| `Closes #123` | 关闭 Issue |
| `Fixes #123` | 关闭并标记为已修复 |
| `Relates to #123` | 仅关联，不自动关闭 |

---

## 🚨 Common Pitfalls

### ❌ DON'T

1. **错误的标题格式**
   - ❌ `优化提现功能`
   - ✅ `[Enhancement] 提现模块 - 优化审核流程`

2. **缺失标题类型前缀**
   - ❌ `用户登录失败`
   - ✅ `[Bug] 用户模块 - 登录失败`

3. **模糊的问题描述**
   - ❌ `后端有问题`
   - ✅ `支付回调后订单状态未更新`

4. **缺少优先级理由**
   - ❌ `P0`
   - ✅ `P0 - 涉及资金操作，影响用户信任`

5. **泛化的验收标准**
   - ❌ `功能正常`
   - ✅ `提现成功后，状态在5分钟内自动更新`

6. **忘记关联 PR**
   - ❌ 提交 PR 但不引用 Issue
   - ✅ PR 描述中添加 `Fixes #123`

### ✅ DO

1. **具体可度量**
   - "状态更新时间 ≤ 5分钟"
   - "查询响应时间 < 200ms"

2. **包含代码引用**
   - "PaymentController.java:186"
   - "WithdrawDomainService.java"

3. **根因优先级排序**
   - ⭐⭐⭐⭐⭐ 最可能
   - ⭐⭐⭐ 可能
   - ⭐ 低概率

4. **可执行的后续步骤**
   - "Check production logs for callback records"
   - "Query database: SELECT * FROM payment_order WHERE status='PROCESSING'"

---

## 📚 Reference Files

### Required Templates
1. `REQUIREMENT_SPEC.md` - BDD template and standards
2. Issue templates in `.github/ISSUE_TEMPLATE/`

### Project-Specific Configs
- `TOOLS.md` - Project paths and SSH configs
- `workspace/memory/*.md` - Historical context

### Integration Points
- GitHub CLI (`gh`)
- GitHub Projects API
- Project repository structure

---

## 🔄 Maintenance

### Update This Skill When:
1. GitHub Issue 行业标准变化
2. 项目结构模式出现新变化
3. 质量指标需要调整
4. 新增辅助脚本

### Version History
- **v1.1.0** (2026-03-13): 优化为行业标准格式
  - 添加标题格式 `[Type] 模块 - 描述`
  - 标准化类型标签 (bug/feature/enhancement/docs)
  - 添加优先级标签 (P0/P1/P2/P3)
  - 简化 Issue Body 模板
  - 添加 PR-Issue 关联规范
- **v1.0.0** (2026-02-10): 初始版本，基于 BDD 格式

---

## 💡 Tips

1. **Start with investigation**: Understand the codebase before writing the issue
2. **Use real data**: Extract actual table names, file paths, line numbers
3. **Think like a developer**: What info would you need to fix this?
4. **Iterate**: Start with 7/10, enhance to 10/10 by adding technical details
5. **Document discoveries**: Note key findings in technical notes section

---

**Created by**: Dressing (OpenClaw)
**Last Updated**: 2026-02-10
**Skill Level**: Advanced
**Estimated Time**: 15-30 minutes per issue (including investigation)
