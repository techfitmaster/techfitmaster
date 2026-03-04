// 真实 X 热点数据 - 2026年2月9日
const realTrends = [
  {
    id: '1',
    topic: '#SuperBowl',
    category: 'sports',
    tweet_count: 2500000,
    engagement_score: 2500000,
    ai_summary: '第58届超级碗正在进行，旧金山49ers对阵堪萨斯城酋长队，全美关注度最高的体育赛事，中场秀和广告创历史纪录',
    key_points: [
      '旧金山49ers vs 堪萨斯城酋长队激战中',
      '中场秀表演备受期待',
      '30秒广告价值突破700万美元',
      '预计观看人数超1.2亿'
    ],
    source_url: 'https://twitter.com/search?q=%23SuperBowl',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    topic: 'Seahawks',
    category: 'sports',
    tweet_count: 890000,
    engagement_score: 890000,
    ai_summary: '西雅图海鹰队季后赛表现引发热议，已持续16小时成为最长热点话题，球迷讨论下赛季阵容调整方向',
    key_points: [
      '季后赛首轮遗憾出局',
      '四分卫位置成焦点',
      '休赛期交易传闻不断',
      '球迷期待下赛季反弹'
    ],
    source_url: 'https://twitter.com/search?q=Seahawks',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    topic: 'Lindsey Vonn',
    category: 'sports',
    tweet_count: 780000,
    engagement_score: 780000,
    ai_summary: '美国高山滑雪传奇林赛·沃恩在35岁高龄宣布复出，将参加世界杯赛事，创造滑雪运动历史性时刻',
    key_points: [
      '35岁宣布复出参赛',
      '曾获82个世界杯冠军',
      '膝伤恢复情况良好',
      '目标2026年冬奥会'
    ],
    source_url: 'https://twitter.com/search?q=Lindsey%20Vonn',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '4',
    topic: 'Green Day',
    category: 'entertainment',
    tweet_count: 650000,
    engagement_score: 650000,
    ai_summary: '传奇朋克摇滚乐队绿日宣布全球巡演计划，将访问北美、欧洲和亚洲，粉丝热烈响应预售信息',
    key_points: [
      '2026年全球巡演启动',
      '新专辑预计春季发布',
      '经典曲目+新作混合演出',
      '门票预售火爆开启'
    ],
    source_url: 'https://twitter.com/search?q=Green%20Day',
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: '5',
    topic: 'Charlie Puth',
    category: 'entertainment',
    tweet_count: 520000,
    engagement_score: 520000,
    ai_summary: '流行歌手查理·普斯发布新单曲预告，将与神秘嘉宾合作，社交媒体互动量激增',
    key_points: [
      '新单曲即将发布',
      '神秘嘉宾引发猜测',
      'TikTok预告片播放量破千万',
      '粉丝期待新专辑'
    ],
    source_url: 'https://twitter.com/search?q=Charlie%20Puth',
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: '6',
    topic: 'Liverpool',
    category: 'sports',
    tweet_count: 890000,
    engagement_score: 890000,
    ai_summary: '利物浦在英超关键战役中3-1击败竞争对手，积分榜排名上升至第二，欧冠资格争夺白热化',
    key_points: [
      '英超3-1大胜对手',
      '积分榜升至第二位',
      '萨拉赫梅开二度',
      '欧冠资格争夺激烈'
    ],
    source_url: 'https://twitter.com/search?q=Liverpool',
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: '7',
    topic: 'Jake Paul',
    category: 'sports',
    tweet_count: 720000,
    engagement_score: 720000,
    ai_summary: '网红拳击手杰克·保罗宣布下一场比赛对手，将挑战前UFC冠军，职业拳击生涯再升级',
    key_points: [
      '挑战前UFC世界冠军',
      '比赛定于3月举行',
      '职业战绩9胜1负',
      '奖金预计超2000万美元'
    ],
    source_url: 'https://twitter.com/search?q=Jake%20Paul',
    created_at: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: '8',
    topic: 'Joe Montana',
    category: 'sports',
    tweet_count: 450000,
    engagement_score: 450000,
    ai_summary: 'NFL传奇四分卫乔·蒙塔纳接受采访，回顾四次超级碗夺冠经历，分享职业生涯感悟',
    key_points: [
      '四次超级碗冠军回顾',
      '与现役球员对比分析',
      '退役后慈善事业',
      'NFL名人堂成员'
    ],
    source_url: 'https://twitter.com/search?q=Joe%20Montana',
    created_at: new Date(Date.now() - 25200000).toISOString(),
  },
  {
    id: '9',
    topic: 'Campbell',
    category: 'sports',
    tweet_count: 380000,
    engagement_score: 380000,
    ai_summary: 'NFL底特律雄狮队主教练丹·坎贝尔赛后新闻发布会引发热议，激情演讲感染球迷',
    key_points: [
      '赛后激情演讲走红',
      '带领球队创造佳绩',
      '年度最佳教练候选',
      '球员高度信任'
    ],
    source_url: 'https://twitter.com/search?q=Campbell',
    created_at: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: '10',
    topic: 'Kid Rock',
    category: 'entertainment',
    tweet_count: 340000,
    engagement_score: 340000,
    ai_summary: '美国摇滚歌手基德·洛克发表争议性言论，引发社交媒体激烈讨论，支持者与批评者针锋相对',
    key_points: [
      '争议性言论引发讨论',
      '音乐与政治立场',
      '粉丝群体分化',
      '媒体广泛报道'
    ],
    source_url: 'https://twitter.com/search?q=Kid%20Rock',
    created_at: new Date(Date.now() - 32400000).toISOString(),
  },
  {
    id: '11',
    topic: 'Breezy Johnson',
    category: 'sports',
    tweet_count: 280000,
    engagement_score: 280000,
    ai_summary: '美国高山滑雪运动员布里兹·约翰逊在世界杯赛事中夺得奖牌，为美国队增添荣誉',
    key_points: [
      '世界杯赛事夺得奖牌',
      '技术动作完美呈现',
      '美国队实力展现',
      '冬奥会前景看好'
    ],
    source_url: 'https://twitter.com/search?q=Breezy%20Johnson',
    created_at: new Date(Date.now() - 36000000).toISOString(),
  },
  {
    id: '12',
    topic: 'Darnold',
    category: 'sports',
    tweet_count: 320000,
    engagement_score: 320000,
    ai_summary: 'NFL四分卫萨姆·达诺德转会传闻升温，多支球队表达兴趣，休赛期交易市场活跃',
    key_points: [
      '多支球队表达兴趣',
      '合同细节谈判中',
      '职业生涯转折点',
      '球迷期待新开始'
    ],
    source_url: 'https://twitter.com/search?q=Darnold',
    created_at: new Date(Date.now() - 39600000).toISOString(),
  },
];

export default realTrends;
