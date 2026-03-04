// 模拟数据版本 - 无需任何 API
const mockTrends = [
  {
    id: '1',
    topic: 'OpenAI 发布 GPT-5',
    category: 'tech',
    tweet_count: 125000,
    engagement_score: 125000,
    ai_summary: '全新一代大语言模型 GPT-5 正式发布，多模态能力大幅提升，推理速度提高 3 倍，API 价格下调 40%',
    key_points: [
      '支持图像、视频、音频多模态输入',
      '推理速度比 GPT-4 提升 300%',
      'API 调用成本降低 40%',
      '上下文窗口扩展至 1M tokens'
    ],
    source_url: 'https://twitter.com/search?q=GPT-5',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    topic: 'Tesla FSD 完全自动驾驶更新',
    category: 'tech',
    tweet_count: 89000,
    engagement_score: 89000,
    ai_summary: 'Tesla 推送 FSD v13 重大更新，城市道路自动驾驶能力显著提升，多个城市开启完全无人驾驶测试',
    key_points: [
      '城市道路导航准确率提升至 95%',
      '新增雨雪天气自适应算法',
      '支持复杂路口自主决策',
      '北美 10 个城市开启测试'
    ],
    source_url: 'https://twitter.com/search?q=Tesla+FSD',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    topic: 'AI 监管新规正式生效',
    category: 'politics',
    tweet_count: 67000,
    engagement_score: 67000,
    ai_summary: '欧盟 AI 法案正式生效，对高风险 AI 系统实施严格监管，违规企业面临巨额罚款',
    key_points: [
      '高风险 AI 必须通过合规认证',
      '违规企业最高罚款 3000 万欧元',
      '生物识别技术受严格限制',
      '2026 年 6 月全面执行'
    ],
    source_url: 'https://twitter.com/search?q=AI+Regulation',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    topic: 'NBA 总决赛抢七大战',
    category: 'sports',
    tweet_count: 156000,
    engagement_score: 156000,
    ai_summary: 'NBA 总决赛第七场比赛进入白热化阶段，湖人队主场迎战凯尔特人队，詹姆斯关键时刻砍下 45 分',
    key_points: [
      '詹姆斯全场 45 分 12 篮板 8 助攻',
      '湖人队加时赛险胜 2 分',
      '时隔 4 年再夺总冠军',
      '创造 NBA 历史第 18 冠'
    ],
    source_url: 'https://twitter.com/search?q=NBA+Finals',
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: '5',
    topic: '全球气候峰会达成历史性协议',
    category: 'politics',
    tweet_count: 45000,
    engagement_score: 45000,
    ai_summary: 'COP30 气候峰会达成突破性协议，全球 195 个国家承诺 2035 年前实现碳排放减半',
    key_points: [
      '2035 年全球碳排放减半目标',
      '发达国家承诺 5000 亿美元援助基金',
      '可再生能源占比提升至 60%',
      '建立全球碳交易市场'
    ],
    source_url: 'https://twitter.com/search?q=Climate+Summit',
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: '6',
    topic: 'iPhone 17 谍照曝光',
    category: 'tech',
    tweet_count: 98000,
    engagement_score: 98000,
    ai_summary: '苹果 iPhone 17 设计图曝光，采用无刘海全面屏设计，搭载 A19 芯片，相机模组全新升级',
    key_points: [
      '屏下摄像头技术首次应用',
      'A19 芯片性能提升 40%',
      '潜望式长焦镜头支持 10 倍光学变焦',
      '预计 2026 年 9 月发布'
    ],
    source_url: 'https://twitter.com/search?q=iPhone+17',
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: '7',
    topic: '美股创历史新高',
    category: 'business',
    tweet_count: 72000,
    engagement_score: 72000,
    ai_summary: '美股三大指数集体大涨，标普 500 突破 6000 点大关，科技股领涨市场',
    key_points: [
      '标普 500 指数首次突破 6000 点',
      '纳斯达克涨幅超 2.5%',
      '英伟达、微软领涨科技股',
      'AI 概念股全线飘红'
    ],
    source_url: 'https://twitter.com/search?q=Stock+Market',
    created_at: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: '8',
    topic: '奥斯卡提名名单公布',
    category: 'entertainment',
    tweet_count: 134000,
    engagement_score: 134000,
    ai_summary: '第98届奥斯卡金像奖提名名单揭晓，《奥本海默2》获 13 项提名领跑，华人导演首次入围最佳导演',
    key_points: [
      '《奥本海默2》获 13 项提名',
      '华人导演贾樟柯入围最佳导演',
      '最佳影片竞争异常激烈',
      '颁奖典礼 3 月 10 日举行'
    ],
    source_url: 'https://twitter.com/search?q=Oscars',
    created_at: new Date(Date.now() - 25200000).toISOString(),
  },
];

export default mockTrends;
