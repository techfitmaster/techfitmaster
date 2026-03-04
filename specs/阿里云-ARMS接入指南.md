# ARMS Java Agent 接入指南

## 1. 下载 ARMS Agent

```bash
# 在 ECS 上执行
mkdir -p /opt/arms-agent
cd /opt/arms-agent
wget "https://arms-apm-cn-hangzhou.oss-cn-hangzhou-internal.aliyuncs.com/ArmsAgent/2.9.4/ArmsAgent.zip"
unzip ArmsAgent.zip
```

## 2. 修改 Docker 启动命令

### 方式 A：Dockerfile 集成

```dockerfile
FROM openjdk:17-jdk-slim

# 复制 ARMS Agent
COPY arms-agent /opt/arms-agent

# 复制应用
COPY target/818ys-backend.jar /app.jar

# 设置 ARMS 环境变量
ENV JAVA_TOOL_OPTIONS="-javaagent:/opt/arms-agent/arms-bootstrap.jar \
  -Darms.licenseKey=YOUR_LICENSE_KEY \
  -Darms.appName=818ys-backend"

ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 方式 B：docker-compose.yml

```yaml
version: '3.8'
services:
  app:
    image: 818ys/backend:latest
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - JAVA_TOOL_OPTIONS=-javaagent:/opt/arms/arms-bootstrap.jar -Darms.licenseKey=${ARMS_LICENSE_KEY} -Darms.appName=818ys-backend
    volumes:
      - /opt/arms-agent:/opt/arms:ro
```

### 方式 C：启动脚本

```bash
#!/bin/bash
# startup.sh
java -javaagent:/opt/arms-agent/arms-bootstrap.jar \
     -Darms.licenseKey=YOUR_LICENSE_KEY \
     -Darms.appName=818ys-backend \
     -jar /app/818ys-backend.jar
```

## 3. 获取 LicenseKey

登录 ARMS 控制台：
https://arms.console.aliyun.com/

1. 点击「应用监控」→「应用列表」
2. 点击「新建应用」
3. 选择「Java」→「EDAS/ECS」
4. 复制显示的 LicenseKey

## 4. 验证接入

重启应用后，访问 ARMS 控制台：
https://arms.console.aliyun.com/apm

等待 2-3 分钟，应该能看到：
- JVM 监控数据（堆内存、GC）
- 接口调用数据（QPS、响应时间）
- SQL 执行统计

## 5. 常见问题

### Q: 日志中看到 "arms agent start failed"
A: 检查 LicenseKey 是否正确，区域是否匹配

### Q: 控制台看不到数据
A: 
1. 检查应用是否有流量
2. 确认 ECS 能访问 arms-apm-cn-hangzhou.oss-cn-hangzhou-internal.aliyuncs.com
3. 查看 /opt/arms-agent/logs/ 下的日志

### Q: 对性能有影响吗？
A: 
- CPU 开销：<5%
- 内存开销：~50MB
- 网络开销：~1KB/s
