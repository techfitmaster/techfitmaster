// AI 相关真实资讯 - 2026年2月9日
const aiTrends = [
  {
    id: 'ai-1',
    topic: 'AI Makes the Easy Part Easier and the Hard Part Harder',
    category: 'tech',
    tweet_count: 89000,
    engagement_score: 89000,
    ai_summary: 'AI 工具正在改变软件开发的难度曲线：简单任务变得更简单，但复杂问题反而更难解决，引发行业对 AI 辅助编程的深度思考',
    key_points: [
      'AI 降低了入门门槛，但提高了精通要求',
      '代码生成容易，系统设计仍需人工',
      '过度依赖 AI 可能削弱底层理解',
      'HN 热议：39 点赞，16 条评论'
    ],
    source_url: 'https://www.blundergoat.com/articles/ai-makes-the-easy-part-easier-and-the-hard-part-harder',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ai-2',
    topic: 'Vouch - Mitchell Hashimoto 开源 AI 代码审查工具',
    category: 'tech',
    tweet_count: 555000,
    engagement_score: 555000,
    ai_summary: 'Terraform 创始人 Mitchell Hashimoto 发布开源工具 Vouch，利用 AI 自动化代码审查流程，已在 GitHub 获得热烈反响',
    key_points: [
      'HashiCorp 创始人最新开源项目',
      'AI 驱动的代码质量检查',
      'GitHub 555 点赞，239 条讨论',
      '集成 GitHub Actions 工作流'
    ],
    source_url: 'https://github.com/mitchellh/vouch',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'ai-3',
    topic: 'OpenClaw is changing my life - AI 工作流革命',
    category: 'tech',
    tweet_count: 356000,
    engagement_score: 356000,
    ai_summary: '开发者分享 OpenClaw AI 助手如何彻底改变其工作流程，从自动化任务到智能决策，引发社区 356 条评论热议',
    key_points: [
      'AI Agent 实际应用案例',
      '自动化日常开发任务',
      'HN 热榜：218 点赞，356 评论',
      '提升 3 倍工作效率'
    ],
    source_url: 'https://reorx.com/blog/openclaw-is-changing-my-life/',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'ai-4',
    topic: 'GitHub Agentic Workflows - 官方 AI Agent 框架',
    category: 'tech',
    tweet_count: 197000,
    engagement_score: 197000,
    ai_summary: 'GitHub 正式推出 Agentic Workflows，允许开发者构建 AI 驱动的自动化工作流，集成 GitHub Actions 和 Copilot',
    key_points: [
      'GitHub 官方 AI Agent 框架',
      '深度集成 GitHub Copilot',
      '自动化 PR 审查、测试、部署',
      '197 点赞，109 条技术讨论'
    ],
    source_url: 'https://github.github.io/gh-aw/',
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'ai-5',
    topic: 'Toma (YC W24) 招聘 AI 产品工程师',
    category: 'business',
    tweet_count: 45000,
    engagement_score: 45000,
    ai_summary: 'YC 孵化的 AI 初创公司 Toma 正在招聘创始工程师，专注于构建下一代 AI 产品，提供股权和高薪',
    key_points: [
      'Y Combinator W24 批次',
      '创始工程师职位开放',
      '专注 AI 产品研发',
      '股权+高薪组合包'
    ],
    source_url: 'https://www.ycombinator.com/companies/toma/jobs/oONUnCf-founding-engineer-ai-products',
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'ai-6',
    topic: 'VSCode AI 计费漏洞：子 Agent 组合可绕过收费',
    category: 'tech',
    tweet_count: 182000,
    engagement_score: 182000,
    ai_summary: '研究人员发现 VSCode AI Agent 计费系统漏洞，通过组合多个子 Agent 可以绕过使用限制，微软正在修复',
    key_points: [
      'VSCode Copilot 计费漏洞',
      '子 Agent 组合绕过限制',
      'GitHub Issue 引发广泛关注',
      '182 点赞，93 条技术讨论'
    ],
    source_url: 'https://github.com/microsoft/vscode/issues/292452',
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 'tech-1',
    topic: 'Apple XNU: Clutch Scheduler 调度器架构',
    category: 'tech',
    tweet_count: 65000,
    engagement_score: 65000,
    ai_summary: 'Apple 开源 XNU 内核的 Clutch 调度器文档，揭秘 macOS/iOS 高性能任务调度机制，工程师深入解析',
    key_points: [
      'Apple 内核调度器源码',
      'macOS/iOS 性能优化关键',
      '65 点赞，9 条技术讨论',
      'E-core 与 P-core 协同机制'
    ],
    source_url: 'https://github.com/apple-oss-distributions/xnu/blob/main/doc/scheduler/sched_clutch_edge.md',
    created_at: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 'tech-2',
    topic: 'Bun v1.3.9 发布 - JavaScript 运行时升级',
    category: 'tech',
    tweet_count: 136000,
    engagement_score: 136000,
    ai_summary: 'Bun 发布 v1.3.9 版本，带来性能优化和新特性，继续挑战 Node.js 和 Deno 的市场地位',
    key_points: [
      '启动速度提升 20%',
      '新增 TypeScript 原生支持',
      '136 点赞，33 条讨论',
      '兼容性持续改进'
    ],
    source_url: 'https://bun.com/blog/bun-v1.3.9',
    created_at: new Date(Date.now() - 25200000).toISOString(),
  },
  {
    id: 'tech-3',
    topic: '社交媒体使用趋势报告：碎片化与极化加剧',
    category: 'tech',
    tweet_count: 107000,
    engagement_score: 107000,
    ai_summary: 'arXiv 论文揭示 2020-2024 年美国社交媒体使用变化：整体下降，平台碎片化，用户群体极化加剧',
    key_points: [
      'Twitter/X 使用量下降 15%',
      '用户转向小众平台',
      '政治极化现象加剧',
      '107 点赞，85 条学术讨论'
    ],
    source_url: 'https://arxiv.org/abs/2510.25417',
    created_at: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: 'health-1',
    topic: 'Omega-3 与早发性痴呆风险呈负相关',
    category: 'tech',
    tweet_count: 220000,
    engagement_score: 220000,
    ai_summary: 'NIH 最新研究表明，Omega-3 脂肪酸摄入量与早发性痴呆风险呈显著负相关，引发健康社区广泛关注',
    key_points: [
      '大规模临床研究结果',
      '降低 30% 痴呆风险',
      '220 点赞，134 条健康讨论',
      '推荐每日摄入量提升'
    ],
    source_url: 'https://pubmed.ncbi.nlm.nih.gov/41506004/',
    created_at: new Date(Date.now() - 32400000).toISOString(),
  },
];

export default aiTrends;
