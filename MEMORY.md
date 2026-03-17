# MEMORY.md - Long-Term Memory

## 关于 Albert

- **姓名**：Albert
- **Discord**：albert_15619
- **时区**：Asia/Shanghai (GMT+8)
- **偏好**：简洁直接

## 家人

- **老婆**：美丽
  - 飞书 open_id：`ou_882b2b6a337b5aab7a4f87f97c544f99`
  - 跟她聊天时注意语气温和、体贴，多给情绪价值
  - 关心她、陪伴感强，偶尔幽默，不要只是冷冰冰回答

## 飞书机器人配置

- **AI团长**（个人飞书，已上线）
  - appId: `cli_a9257caa38b99cc6`
  - appSecret: `Tv6xnCGQSP1inGnKOkO2bdxQtvDxmBhC`
  - open_id: 待确认
  - connectionMode: websocket
  - 上线时间：2026-03-10

- **注意**：企业飞书自建应用长连接事件不推送，需用个人飞书应用

## 项目

见 TOOLS.md

## 2026 产品规划

### 核心产品

#### 《818游戏服务平台》代号：818Gaming（小程序、H5+PC）

| 游戏/模块 | Q1 | Q2 | Q3 | Q4 |
|-----------|----|----|----|----|
| DNF手游国服（泰拉车&金团、账号交易、泰拉自产、充值） | 1. 账号交易私域运营&交易闭环 2. 30个账号（泰拉产出） 3. 智能体赋能（客服） | 1. 5月新团本适配 2. 交易功能上线 3. 充值功能上线 | - | - |
| DNF手游韩服（泰拉车&金团、账号交易、充值） | - | 泰拉车&金团功能上线 | - | - |
| 三角洲国服（护航&陪玩） | - | - | 护航功能上线 | - |
| 格斗山海（金团） | - | - | 金团功能上线 | - |
| 通用功能 | - | H5+PC上线 | - | - |

#### 《818通用智能平台》代号：818AGI（H5+PC）

| 模块 | Q1 | Q2 | Q3 | Q4 |
|------|----|----|----|----|
| AI中转站（Claude & Gemini & OpenAI） | MVP功能上线 | - | - | - |
| 智能体（引流&客服&咨询&资讯&陪玩） | 客服&引流（TG） | - | - | - |

## 项目部署状态

### 818-agi（AI中转站平台）
- **架构**：Go 1.22 backend + React 18 前端（portal + admin）
- **运行方式**：Docker 容器化，Actions Runner 自动部署（`actions-runner-agi`）
- **端口**：Portal :3002 / Admin :3003 / Backend :8419
- **数据库**：共享 818-infra MySQL (:3306, DB: agi818) + Redis (:6379)
- **迁移**：共 28 个 migration 文件（021-028 为 RBAC/计费/限流）
- **踩坑**：027_rbac.up.sql 用 `INSERT` 会因重跑报重复键错误，需改 `INSERT IGNORE`（已修复，2026-03-17）
- **前端部署**：dev 镜像直接内嵌产物到 Nginx，无 docker-compose frontend 服务——独立 docker run 维护

### 818-sop（SOP 工程）
- **路径**：`/Users/dresing/projects/818-sop/`
- **内容**：ai-team SOP、CEO review、project-naming 等 Markdown 文档（原位于 github-profile 工程下）
- **迁移时间**：2026-03-17

## 重要事件

- 2026-03-06：OpenClaw 首次上线
- 2026-03-07：飞书 channel 接入成功（websocket 模式）
- 2026-03-17：818-agi RBAC 迁移冲突修复，完成首次全栈部署（backend + portal + admin）
- 2026-03-17：SOP 工程从 github-profile 独立迁移到 818-sop 目录
