# GitHub Issues Skill - Usage Examples

## Example 1: Create a Bug Issue from Scratch

### User Request
> "用户提现超过24小时后，还是待领取状态，但实际已经提现成功"

### Step-by-Step Process

#### 1. Initial Understanding
```bash
# Ask clarifying questions
- What's the expected behavior? → "提现成功后5分钟内状态应更新"
- Priority? → "P0 - 涉及资金"
- Environment? → "生产环境，微信小程序"
```

#### 2. Investigate Codebase
```bash
# Find related entities
cd /Users/dresing/projects/818ys
./find-entity.sh Payment .

# Find API endpoints
./find-apis.sh withdraw .

# Find status enums
./find-status.sh Withdraw .
```

#### 3. Extract Information
```
Database: payment_order table
  - Fields: id, order_no, status, wechat_transfer_id, version
  - Problem field: status (PROCESSING → SUCCESS not updated)

APIs:
  - POST /payment/withdraw - Create withdraw order
  - POST /payment/transfer/notify - Callback (DEPRECATED ⚠️)
  
Status:
  - PENDING, PROCESSING, SUCCESS, FAILED
```

#### 4. Root Cause Analysis
```
Priority ranking:
1. ⭐⭐⭐⭐⭐ Callback endpoint deprecated
   - Evidence: PaymentController.java:186 marked as "暂时废弃"
   - Impact: Status never updates to SUCCESS
   
2. ⭐⭐⭐⭐ No periodic sync task
   - No cron job found to query WeChat status
   
3. ⭐⭐⭐ Callback signature verification failed
   - Possible but less likely
```

#### 5. Build Issue Body
```bash
# Use template from REQUIREMENT_SPEC.md
# Fill in all sections with discovered information
# Add database schema, API table, root cause analysis
```

#### 6. Create Issue
```bash
gh issue create \
  --title "bug: 用户提现超过24小时后，还是待领取状态，真实是已经提现成功" \
  --body-file issue-154.md \
  --label "bug,P0,payment,backend" \
  --project "818ys"
```

#### 7. Verify Completeness
```
Scoring:
✅ BDD format: 9/10
✅ Database schema: 10/10
✅ API endpoints: 10/10
✅ Root cause: 10/10
✅ Solutions: 10/10
✅ Acceptance: 10/10
✅ Next steps: 10/10

Total: 10/10 ✅
```

---

## Example 2: Enhance Existing Issue

### Before (7.5/10)
```markdown
## Bug
提现状态显示不准确

## Scenario
用户提现后，状态仍显示待领取，但实际已到账

## Acceptance Criteria
- [ ] 提现成功后更新状态
- [ ] 批量更新历史数据
```

### Investigation Commands
```bash
# Find the payment controller
find . -name "*Controller.java" | xargs grep -l "withdraw"

# Find the entity
find . -name "*PaymentOrder*.java"

# Read the controller
cat ./src/main/java/.../PaymentController.java | grep -A 50 "transfer/notify"
```

### After Enhancement (10/10)
```markdown
## Bug
提现状态显示不准确

## Database Schema
**表名**: payment_order
**关键字段**: id, status, wechat_transfer_id, version

## API Endpoints
| 路径 | 方法 | 说明 | 文件 |
|------|------|------|------|
| /payment/transfer/notify | POST | 转账回调（已废弃）| PaymentController.java:186 |

## Root Cause Analysis
1. ⭐⭐⭐⭐⭐ 转账回调接口废弃
   - 位置: PaymentController.java:186
   - 影响: 状态永远停留在 PROCESSING
   
## Solution
### 紧急修复 (P0)
1. 恢复 /payment/transfer/notify 接口
2. 实现 handleTransferNotify() 方法

### Acceptance Criteria
- [ ] 转账回调接口能正确处理微信回调
- [ ] 提现成功后，状态在 5分钟内 更新为 SUCCESS
- [ ] 历史数据批量修复完成

## Next Steps
1. 查看生产日志确认回调调用情况
2. 代码审查 PaymentCommandService.handleTransferNotify()
3. 统计当前 PROCESSING 状态订单数量
```

---

## Example 3: Feature Request

### User Request
> "想要在房间内直接切换角色，不用退出重进"

### Investigation
```bash
# Find room-related entities
./find-entity.sh Room /Users/dresing/projects/818ys

# Find room APIs
./find-apis.sh room /Users/dresing/projects/818ys

# Look for role/participant logic
grep -r "role\|participant" ./src --include="*.java" | head -20
```

### Discovered Information
```
Entity: RoomParticipantAR
  - Fields: id, room_id, user_id, role, status
  
APIs:
  - POST /api/room/{id}/join - Join room
  - POST /api/room/{id}/leave - Leave room
  - (Missing) POST /api/room/{id}/switch-role ← Need to add

Roles: OWNER, MEMBER, OBSERVER
```

### Create Issue
```bash
gh issue create \
  --title "feature: 支持房间内切换角色" \
  --body-file feature-switch-role.md \
  --label "feature,P1,room,backend,frontend" \
  --project "818ys"
```

### Issue Body Preview
```markdown
## Feature: 用户可以在房间内直接切换角色

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
**表名**: room_participant
**涉及字段**:
- `role` VARCHAR - 当前角色
- `previous_role` VARCHAR - 前一个角色（新增字段）
- `switch_count` INT - 切换次数（新增字段）
- `last_switch_time` DATETIME - 最后切换时间（新增字段）

## API Endpoints
**需新增**:
- POST `/api/room/{roomId}/switch-role` - 切换角色
  - Request: `{ "newRole": "MEMBER" }`
  - Response: `{ "success": true, "role": "MEMBER" }`

**需修改**:
- GET `/api/room/{roomId}/available-roles` - 获取可选角色（新接口）

## Technical Notes
### 涉及模块
- **前端**: `miniapp/pages/room-detail/`
- **后端**: `RoomParticipantService.java`, `RoomController.java`

### 业务规则
1. 只能切换到空闲位置（无人占用）
2. 切换后押金自动调整（如有差额）
3. 房主可以限制是否允许切换
4. 切换操作需记录日志

## Acceptance Criteria
- [ ] 用户可以查看当前可选角色列表
- [ ] 切换成功后前端实时更新角色显示
- [ ] 押金差额自动计算并扣除/退还
- [ ] 房主可以在房间设置中开启/关闭切换功能
- [ ] 切换操作有审计日志记录

## Priority
P1 - 高优先级（提升用户体验，减少退出重进流程）
```

---

## Example 4: Quick Bug Fix

### User Report
> "退款失败，但钱没退回来"

### Quick Investigation (5 mins)
```bash
cd /Users/dresing/projects/818ys

# Find refund code
grep -r "refund" --include="*.java" ./src | grep -i "fail\|error" | head -10

# Check refund callback
cat ./src/.../PaymentController.java | grep -A 30 "refund/notify"

# Check refund service
find . -name "*RefundService*.java" -exec head -50 {} \;
```

### Quick Issue
```bash
gh issue create \
  --title "bug: 退款失败但资金未退回" \
  --body "
## Bug
退款失败但用户余额未恢复

## Expected
退款失败时，扣除的金额应自动退回用户余额

## Actual  
退款失败，但余额未恢复

## Root Cause (Preliminary)
- RefundService.handleRefundFailure() 可能缺少余额回退逻辑
- 需检查事务是否回滚

## Priority
P0 - 涉及资金

## Next Steps
1. 查看生产日志
2. 检查 RefundService 代码
3. 统计受影响用户数量
" \
  --label "bug,P0,payment" \
  --assignee "@me"
```

---

## Tips for Efficient Usage

### 1. Start with Investigation
Don't write the issue immediately. Spend 10-15 minutes investigating:
- Code structure
- Database schema
- Existing similar issues

### 2. Use Helper Scripts
The three scripts save significant time:
```bash
./find-entity.sh Payment .    # Database layer
./find-apis.sh withdraw .     # API layer
./find-status.sh Withdraw .   # Enum definitions
```

### 3. Template Reuse
Keep a `template.md` with your project-specific structure:
- Common sections
- Standard tables
- Project paths

### 4. Incremental Enhancement
Start with 7/10 issue, then enhance:
1. Basic BDD (7/10)
2. Add database schema (8/10)
3. Add API endpoints (9/10)
4. Add root cause + solutions (10/10)

### 5. Link Issues
Reference related issues:
```markdown
## Related Issues
- Fixes #142 (partial)
- Related to #98 (payment callback)
- Blocks #156 (refund optimization)
```

---

**Last Updated**: 2026-02-10
