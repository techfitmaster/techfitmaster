# SPEC - [T9] 提现 24h 超时显示 Bug 修复

## [T9] 提现 24h 超时订单显示问题修复

**目标**：修复提现订单在超过 24 小时后仍显示"处理中"状态，无法正确超时的 Bug

**业务规则**：
- 微信企业付款有 24 小时自动过期机制
- 订单状态为 `PROCESSING`（处理中）时，如果超过 24 小时未完成，应自动标记为 `TIMEOUT`
- 定时任务需要覆盖足够长的时间窗口，避免遗漏超时订单
- 安全边界：使用 23 小时作为判断阈值（留 1 小时安全余量）

**涉及端**：
- [x] 后端 API（领域服务 + 定时任务）
- [ ] 管理后台（无需改动）
- [ ] 小程序（无需改动）

**BDD 场景**：
| Given（前置条件） | When（操作） | Then（预期结果） |
|------------------|-------------|-----------------|
| 提现订单状态为 PROCESSING | 距离创建时间已超过 23 小时 | 定时任务将订单标记为 TIMEOUT |
| 提现订单状态为 PROCESSING | 远程支付接口调用失败 | 订单状态变更为 FAILED，不会卡在 PROCESSING |
| 定时任务运行 | 扫描最近 30 天的订单 | 覆盖所有可能超时的订单，不遗漏 |
| 提现订单状态为 TIMEOUT | 用户查询订单 | 前端显示"超时失败"状态 |

**技术约束**：
- 必须处理 `PROCESSING` 状态的订单（之前仅处理 `PENDING`）
- 定时任务查询窗口从 7 天扩展到 30 天
- 使用 23 小时作为超时判断阈值（而非 24 小时）

**根因分析**：
1. **状态机缺陷**：`WithdrawDomainServiceImpl.handleWithdrawTimeoutInternal()` 仅处理 `PENDING` 状态，未包含 `PROCESSING`
2. **查询窗口过窄**：`PaymentTimeoutTask` 仅查询最近 7 天订单，可能遗漏更早的超时订单
3. **远程调用失败风险**：如果微信支付接口调用失败，订单会永久卡在 `PROCESSING` 状态

**修复方案**：

### 1. 扩展状态机处理范围
```java
// WithdrawDomainServiceImpl.java
private void handleWithdrawTimeoutInternal(...) {
    // 修改前：仅处理 PENDING
    if (order.getStatus() != OrderStatus.PENDING) return;
    
    // 修改后：处理 PENDING 和 PROCESSING
    if (order.getStatus() != OrderStatus.PENDING 
        && order.getStatus() != OrderStatus.PROCESSING) {
        return;
    }
}
```

### 2. 扩展定时任务查询窗口
```java
// PaymentTimeoutTask.java
// 修改前：查询最近 7 天
LocalDateTime cutoffTime = now.minusDays(7);

// 修改后：查询最近 30 天
LocalDateTime cutoffTime = now.minusDays(30);
```

### 3. 增强失败处理逻辑
```java
// WithdrawDomainServiceImpl.java - handlePaymentFailed()
// 确保 PROCESSING 状态的订单在远程调用失败后能正确转为 FAILED
private void handlePaymentFailed(...) {
    if (order.getStatus() == OrderStatus.PROCESSING) {
        order.fail(failureReason);
    }
}
```

**合并策略**：
- [x] 手动合并

**实际完成情况**：
- ✅ `WithdrawDomainServiceImpl` 已修复（增加 PROCESSING 状态处理）
- ✅ `PaymentTimeoutTask` 查询窗口已扩展至 30 天
- ✅ 单元测试已通过（`WithdrawTimeoutBugFixTest`）
- ✅ CI 验证通过
- ⏳ PR #153 已创建，等待合并

**复盘记录**：
- 开发耗时：约 1 小时
- 主要挑战：识别状态机中的隐藏分支
- 优化建议：建立状态机可视化工具，避免遗漏边界状态
- 长期风险：建议增加"订单一致性巡检"任务，定期扫描异常状态订单

**安全验证**：
- ✅ 本地测试模拟 24h 超时场景，订单正确标记为 TIMEOUT
- ✅ 集成测试覆盖 PROCESSING → TIMEOUT 状态转换
- ✅ 定时任务日志确认扫描范围扩展至 30 天
