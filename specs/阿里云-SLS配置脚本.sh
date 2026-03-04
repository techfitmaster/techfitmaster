#!/bin/bash
# 阿里云 SLS 日志服务一键配置脚本
# 用途：自动化创建 Project、Logstore 和日志采集配置

set -e

# ==================== 配置区域 ====================
REGION="cn-hangzhou"                    # 阿里云区域
PROJECT_NAME="818ys-prod"                # 项目名称
LOGSTORE_NAME="app-logs"                 # 日志存储名称
ECS_INSTANCE_ID="i-xxx"                  # ECS 实例 ID（需替换）

# ==================== 创建 SLS Project ====================
echo "📦 创建 SLS Project: ${PROJECT_NAME}..."
aliyun log CreateProject \
  --region ${REGION} \
  --projectName ${PROJECT_NAME} \
  --description "818ys 生产环境日志" || echo "Project 已存在，跳过创建"

# ==================== 创建 Logstore ====================
echo "📊 创建 Logstore: ${LOGSTORE_NAME}..."
aliyun log CreateLogstore \
  --region ${REGION} \
  --project ${PROJECT_NAME} \
  --logstoreName ${LOGSTORE_NAME} \
  --ttl 30 \
  --shardCount 2 || echo "Logstore 已存在，跳过创建"

# ==================== 安装 Logtail ====================
echo "🔧 在 ECS 上安装 Logtail..."
wget http://logtail-release-${REGION}.oss-${REGION}.aliyuncs.com/linux64/logtail.sh -O logtail.sh
chmod 755 logtail.sh
sudo ./logtail.sh install ${REGION}

# ==================== 配置 Docker stdout 采集 ====================
echo "🐳 配置 Docker 日志采集..."

cat > /tmp/logtail_docker_config.json <<EOF
{
  "inputs": [
    {
      "type": "service_docker_stdout",
      "detail": {
        "IncludeLabel": {
          "app": "818ys-backend"
        },
        "IncludeEnv": {
          "SPRING_PROFILES_ACTIVE": "prod"
        },
        "Stdout": true,
        "Stderr": true
      }
    }
  ],
  "processors": [
    {
      "type": "processor_json",
      "detail": {
        "KeepSource": true,
        "ExpandDepth": 1
      }
    }
  ]
}
EOF

# 上传配置到 SLS
aliyun log CreateConfig \
  --region ${REGION} \
  --project ${PROJECT_NAME} \
  --configName "docker-stdout-config" \
  --inputType "plugin" \
  --inputDetail "$(cat /tmp/logtail_docker_config.json)" \
  --outputType "LogService" \
  --outputDetail "{\"projectName\":\"${PROJECT_NAME}\",\"logstoreName\":\"${LOGSTORE_NAME}\"}"

echo "✅ SLS 日志服务配置完成！"
echo "访问控制台查看日志："
echo "https://sls.console.aliyun.com/lognext/project/${PROJECT_NAME}/logsearch/${LOGSTORE_NAME}"
