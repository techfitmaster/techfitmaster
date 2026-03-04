# GitHub Issues Management Skill

## 📋 Skill Overview

**Purpose**: Create, update, and manage GitHub Issues following BDD (Behavior-Driven Development) format with complete technical details.

**Use When**: 
- User asks to "create a new requirement/bug/feature"
- User wants to "update/improve an existing issue"
- User needs to "analyze project requirements"
- User requests "BDD format documentation"

**Key Features**:
- ✅ BDD format (Given/When/Then)
- ✅ Auto-discover code structure from project
- ✅ Database schema extraction
- ✅ API endpoint mapping
- ✅ Root cause analysis with priority ranking
- ✅ Solution recommendations (urgent + long-term)
- ✅ Acceptance criteria checklist

---

## 🚀 Quick Start

### Prerequisites
1. GitHub CLI installed and authenticated: `gh auth status`
2. Project repository cloned locally
3. Access to project codebase
4. `REQUIREMENT_SPEC.md` template available

### Basic Usage

```bash
# Create a new bug issue
gh issue create --title "bug: User login fails" \
  --body "$(cat issue-template.md)" \
  --label "bug,P0" \
  --project "Project Name"

# Update existing issue
gh issue edit 154 --body "$(cat updated-body.md)"

# View issue
gh issue view 154
```

---

## 📝 Workflow

### Step 1: Understand the Requirement

**Ask the user**:
1. What is the issue? (Bug/Feature/Enhancement/Refactor)
2. What is the expected behavior?
3. What is the actual behavior (if bug)?
4. Priority level? (P0/P1/P2/P3)

### Step 2: Investigate the Codebase

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

### Step 3: Build the Issue Body

**Template Structure** (based on `REQUIREMENT_SPEC.md`):

```markdown
## Feature/Bug
[Short description]

## Background (背景)
作为 [用户角色]
我想要 [完成什么目标]
以便 [达成什么价值]

## Scenario (场景)
**Given** [前置条件]
**And** [额外条件]
**When** [触发操作]
**Then** [期望结果]
**But** [实际结果 (if bug)]

## Steps to Reproduce (复现步骤)
1. [Step 1]
2. [Step 2]
3. [Observe behavior]

## Expected Behavior (期望行为)
**Given** [前置条件]
**When** [触发操作]
**Then** [正确结果]

## Actual Behavior (实际行为)
[当前错误表现]

## Affected Users (受影响用户)
- 预估影响: [统计数据]
- 用户反馈: [具体案例]

## Environment (环境信息)
- 环境: 生产/测试/开发
- 版本: [version]
- 平台: [web/miniapp/app]
- 受影响模块: [module paths]

## Database Schema (数据库结构)
**表名**: `table_name`
**关键字段**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| `id` | BIGINT | 主键 |
| `status` | VARCHAR | 状态字段 |

## API Endpoints (相关接口)
| 接口路径 | 方法 | 说明 | 控制器 |
|---------|------|------|--------|
| `/api/xxx` | POST | 创建xxx | `XxxController.java:123` |

## Technical Notes (技术说明)
### 涉及模块
- **前端**: [files]
- **后端**: [files]

### 可能原因分析
1. **原因1** ⭐⭐⭐⭐⭐ (最高概率)
   - 详细说明
2. **原因2** ⭐⭐⭐⭐ (高概率)
   - 详细说明

### 建议解决方案
#### 🔧 紧急修复 (P0)
1. [立即修复方案]

#### 🔧 长期优化 (P1)
1. [长期改进方案]

## Acceptance Criteria (验收标准)
- [ ] [具体可验证的标准]
- [ ] [包含时间/性能要求]

## Impact (影响范围)
- **用户体验**: [影响]
- **业务风险**: [影响]

## Related Issues
- [ ] 检查历史相关问题

## Attachments (附件)
- [ ] 截图/日志
- [ ] 数据库查询示例

## Priority (优先级)
**P0/P1/P2/P3** - [理由]

## Next Steps (后续步骤)
1. [立即行动]
2. [后续验证]
```

### Step 4: Create/Update the Issue

```bash
# Create new issue
gh issue create \
  --title "bug: [description]" \
  --body-file issue-body.md \
  --label "bug,P0,backend" \
  --assignee "@me" \
  --project "Project Name"

# Update existing issue
gh issue edit 154 --body-file updated-body.md
```

### Step 5: Verify Completeness

**Scoring checklist** (target: 10/10):
- [ ] BDD format complete (Given/When/Then) - 2分
- [ ] Database schema documented - 1.5分
- [ ] API endpoints mapped - 1.5分
- [ ] Root cause analysis with priority - 2分
- [ ] Solution recommendations (urgent + long-term) - 1.5分
- [ ] Acceptance criteria specific - 1分
- [ ] Next steps actionable - 0.5分

**Total ≥ 9/10**: Ready for development
**Total < 9/10**: Need more investigation

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

### Example 1: Bug Issue (Issue #154)

**Initial Score**: 6/10
**After Enhancement**: 10/10

**Key Improvements**:
1. Added database schema (`payment_order` table)
2. Mapped 8 API endpoints
3. Found root cause (callback endpoint deprecated)
4. Provided 2-tier solution (urgent + long-term)
5. Added actionable next steps

**Result**: Developer can fix the bug in 2-4 hours following the issue

### Example 2: Feature Request

```markdown
## Feature: User can switch roles within a room

## Background
作为房间参与者
我想要在房间内直接切换角色
以便快速适应不同位置需求，无需退出重进

## Scenario
**Given** 用户已加入房间
**And** 房间内有其他空闲角色位置
**When** 用户点击「切换角色」按钮
**Then** 显示可选角色列表
**And** 用户选择新角色后立即切换

## Database Schema
**表名**: `room_participant`
**新增字段**: `previous_role` (记录切换历史)

## API Endpoints
- POST `/api/room/{roomId}/switch-role` - 切换角色
- GET `/api/room/{roomId}/available-roles` - 获取可选角色

## Priority
P1 - 高优先级（提升用户体验）
```

---

## 🚨 Common Pitfalls

### ❌ DON'T

1. **Vague descriptions**
   - ❌ "优化提现功能"
   - ✅ "提现成功后状态在5分钟内更新为「提现成功」"

2. **Missing technical context**
   - ❌ "后端有问题"
   - ✅ "PaymentController.java:186 回调接口被废弃"

3. **No priority reasoning**
   - ❌ "P0"
   - ✅ "P0 - 涉及资金操作，影响用户信任"

4. **Generic acceptance criteria**
   - ❌ "功能正常"
   - ✅ "提现成功后，状态在5分钟内自动更新"

### ✅ DO

1. **Specific and measurable**
   - "状态更新时间 ≤ 5分钟"
   - "查询响应时间 < 200ms"

2. **Include code references**
   - "PaymentController.java:186"
   - "WithdrawDomainService.java"

3. **Prioritize root causes**
   - ⭐⭐⭐⭐⭐ Most likely
   - ⭐⭐⭐ Possible
   - ⭐ Low probability

4. **Actionable next steps**
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
1. BDD template in `REQUIREMENT_SPEC.md` changes
2. New project structure patterns emerge
3. Quality metrics need adjustment
4. New helper scripts are added

### Version History
- **v1.0.0** (2026-02-10): Initial skill based on Issue #154 enhancement experience

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
