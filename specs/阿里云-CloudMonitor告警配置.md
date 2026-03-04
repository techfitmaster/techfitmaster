# CloudMonitor 统一告警配置

## 1. 告警联系人配置

### 1.1 添加钉钉机器人
1. CloudMonitor 控制台：https://cloudmonitor.console.aliyun.com/
2. 「告警服务」→「告警联系人」→「新建联系人」
3. 填写信息：
   - 姓名：运维组
   - 手机号：138xxxx（接收短信/电话）
   - 邮箱：ops@818ys.com

### 1.2 创建告警组
1. 「告警联系人」→「新建联系组」
2. 组名：818ys-运维组
3. 添加成员：刚才创建的联系人

### 1.3 配置钉钉机器人
1. 「告警服务」→「报警联系人」→「钉钉机器人」
2. 添加 Webhook URL
3. 关键词：【告警】

## 2. RDS 告警规则

### 2.1 CPU 使用率告警
```yaml
告警名称: RDS-CPU使用率过高
监控项: rds_cpu_usage
阈值条件: 
  - CPU使用率 >= 80%，持续5分钟
通知方式: 钉钉 + 短信
告警级别: P1（紧急）
```

**CLI 创建命令：**
```bash
aliyun cms PutResourceMetricRule \
  --RuleName "RDS-CPU使用率过高" \
  --Namespace "acs_rds_dashboard" \
  --MetricName "CpuUsage" \
  --Resources '[{"instanceId":"rm-xxxx"}]' \
  --Escalations.Critical.Statistics "Average" \
  --Escalations.Critical.ComparisonOperator "GreaterThanOrEqualToThreshold" \
  --Escalations.Critical.Threshold "80" \
  --Escalations.Critical.Times "3" \
  --Period "60" \
  --EffectiveInterval "00:00-23:59" \
  --ContactGroups '["818ys-运维组"]'
```

### 2.2 连接数告警
```yaml
告警名称: RDS-连接数过高
监控项: rds_connection_usage
阈值: >= 90%，持续3分钟
通知: 钉钉 + 短信
级别: P1
```

### 2.3 磁盘使用率告警
```yaml
告警名称: RDS-磁盘空间不足
监控项: rds_disk_usage
阈值: >= 85%
通知: 钉钉
级别: P2
```

### 2.4 IOPS 使用率告警
```yaml
告警名称: RDS-IOPS使用率过高
监控项: rds_iops_usage
阈值: >= 80%，持续5分钟
通知: 钉钉
级别: P2
```

### 2.5 慢查询告警
```yaml
告警名称: RDS-慢查询突增
监控项: rds_slow_queries
阈值: >= 10条/分钟，持续3分钟
通知: 钉钉
级别: P2
```

## 3. ECS 告警规则

### 3.1 CPU 使用率
```yaml
告警名称: ECS-CPU使用率过高
监控项: cpu_total
阈值: >= 85%，持续5分钟
通知: 钉钉
级别: P2
```

### 3.2 内存使用率
```yaml
告警名称: ECS-内存使用率过高
监控项: memory_usedutilization
阈值: >= 90%，持续5分钟
通知: 钉钉 + 短信
级别: P1
```

### 3.3 磁盘使用率
```yaml
告警名称: ECS-磁盘空间不足
监控项: disk_usedutilization
阈值: >= 80%
通知: 钉钉
级别: P2
```

### 3.4 网络出流量
```yaml
告警名称: ECS-网络流量异常
监控项: net_tcpconnection
阈值: >= 10000 连接数
通知: 钉钉
级别: P3
```

## 4. 应用层告警（自定义指标）

### 4.1 安装 CloudMonitor Agent
```bash
# 在 ECS 上执行
wget http://cms-agent-cn-hangzhou.oss-cn-hangzhou-internal.aliyuncs.com/cms-go-agent/2.1.55/cms-go-agent-linux-amd64.tar.gz
tar -xf cms-go-agent-linux-amd64.tar.gz
cd cms-go-agent
sudo ./install.sh
```

### 4.2 Spring Boot 自定义指标（通过 Micrometer）

**application.yml 配置：**
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
```

**通过脚本上报自定义指标：**
```bash
#!/bin/bash
# report_metrics.sh - 每分钟执行一次（cron）

# 获取应用 QPS
QPS=$(curl -s http://localhost:8080/actuator/metrics/http.server.requests | jq '.measurements[0].value')

# 上报到 CloudMonitor
aliyun cms PutCustomMetric \
  --MetricList "[
    {
      \"groupId\": \"xxx\",
      \"metricName\": \"app_qps\",
      \"time\": \"$(date +%s)000\",
      \"type\": 0,
      \"values\": {\"value\": $QPS}
    }
  ]"
```

### 4.3 应用 QPS 告警
```yaml
告警名称: 应用QPS异常低
监控项: app_qps
阈值: <= 10（正常应该 >100）
通知: 钉钉 + 短信
级别: P0（严重）
```

## 5. 告警分级与通知策略

### 5.1 告警级别定义

| 级别 | 描述 | 响应时间 | 通知方式 | 示例 |
|------|------|---------|---------|------|
| **P0 严重** | 服务不可用 | 立即 | 电话 + 钉钉 + 短信 | RDS 宕机、应用无响应 |
| **P1 紧急** | 严重性能问题 | 5分钟 | 钉钉 + 短信 | CPU >80%、内存 >90% |
| **P2 重要** | 需要关注 | 15分钟 | 钉钉 | 慢查询、磁盘 >80% |
| **P3 一般** | 监控信息 | 1小时 | 钉钉/邮件 | 磁盘趋势预警 |

### 5.2 值班轮换
1. CloudMonitor 控制台 → 「告警服务」→ 「值班表」
2. 配置轮换规则：
   - 周一~周五：工程师 A
   - 周末：工程师 B
3. 电话告警会自动路由到当前值班人

### 5.3 告警升级策略
1. P0 告警 15分钟未确认 → 自动升级到主管
2. P1 告警 30分钟未确认 → 自动升级

## 6. 钉钉告警模板

### 6.1 自定义告警消息格式
CloudMonitor → 「告警服务」→ 「告警模板」→ 「新建」

**Markdown 模板：**
```markdown
## 【${level}】${alertName}

**时间**：${timestamp}  
**资源**：${instanceName} (${instanceId})  
**指标**：${metricName}  
**当前值**：${curValue} ${unit}  
**阈值**：${threshold} ${unit}  
**持续时间**：${duration}

**详情**：[点击查看](${consoleUrl})

---
> 818ys 运维监控系统
```

**效果预览：**
```
## 【P1】RDS-CPU使用率过高

时间：2026-02-08 11:30:00
资源：818ys-prod (rm-bp1xxxx)
指标：CPU使用率
当前值：85.3%
阈值：80%
持续时间：5分钟

详情：[点击查看](https://...)
```

## 7. 一键创建所有告警规则（脚本）

```bash
#!/bin/bash
# create_all_alarms.sh - 一键创建所有告警规则

CONTACT_GROUP="818ys-运维组"
RDS_INSTANCE="rm-xxxx"  # 替换为你的 RDS 实例 ID
ECS_INSTANCE="i-xxxx"   # 替换为你的 ECS 实例 ID

# RDS 告警
create_rds_alarm() {
  local name=$1
  local metric=$2
  local threshold=$3
  
  aliyun cms PutResourceMetricRule \
    --RuleName "RDS-${name}" \
    --Namespace "acs_rds_dashboard" \
    --MetricName "${metric}" \
    --Resources "[{\"instanceId\":\"${RDS_INSTANCE}\"}]" \
    --Escalations.Critical.Statistics "Average" \
    --Escalations.Critical.ComparisonOperator "GreaterThanOrEqualToThreshold" \
    --Escalations.Critical.Threshold "${threshold}" \
    --Escalations.Critical.Times "3" \
    --Period "60" \
    --ContactGroups "[\"${CONTACT_GROUP}\"]"
}

create_rds_alarm "CPU使用率过高" "CpuUsage" "80"
create_rds_alarm "连接数过高" "ConnectionUsage" "90"
create_rds_alarm "磁盘使用率过高" "DiskUsage" "85"
create_rds_alarm "IOPS使用率过高" "IOPSUsage" "80"

# ECS 告警
create_ecs_alarm() {
  local name=$1
  local metric=$2
  local threshold=$3
  
  aliyun cms PutResourceMetricRule \
    --RuleName "ECS-${name}" \
    --Namespace "acs_ecs_dashboard" \
    --MetricName "${metric}" \
    --Resources "[{\"instanceId\":\"${ECS_INSTANCE}\"}]" \
    --Escalations.Critical.Statistics "Average" \
    --Escalations.Critical.ComparisonOperator "GreaterThanOrEqualToThreshold" \
    --Escalations.Critical.Threshold "${threshold}" \
    --Escalations.Critical.Times "3" \
    --Period "60" \
    --ContactGroups "[\"${CONTACT_GROUP}\"]"
}

create_ecs_alarm "CPU使用率过高" "cpu_total" "85"
create_ecs_alarm "内存使用率过高" "memory_usedutilization" "90"
create_ecs_alarm "磁盘使用率过高" "disk_usedutilization" "80"

echo "✅ 所有告警规则创建完成！"
```

**使用方法：**
```bash
chmod +x create_all_alarms.sh
# 编辑脚本，替换 RDS_INSTANCE 和 ECS_INSTANCE
./create_all_alarms.sh
```

## 8. 验证告警

### 8.1 测试告警（模拟 CPU 高负载）
```bash
# 在 ECS 上执行
stress --cpu 4 --timeout 600s
```

等待 5-10 分钟，你应该会收到钉钉/短信告警。

### 8.2 告警收敛
如果同一个告警在 1 小时内触发超过 5 次，CloudMonitor 会自动收敛，避免告警风暴。

配置路径：CloudMonitor → 「告警服务」→ 「告警收敛」

## 9. 成本优化建议

**免费额度：**
- CloudMonitor 基础版：免费
- RDS/ECS 基础监控：免费
- 短信告警：前 500 条/月免费
- 电话告警：¥0.15/次

**预估月费用：**
- 短信：~¥20（假设 100 条/月）
- 电话：~¥5（假设 30 次/月）
- **合计：~¥25/月**

CloudMonitor 几乎是免费的！主要成本在 SLS、ARMS、DAS。
