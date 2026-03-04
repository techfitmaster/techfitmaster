import { NextRequest, NextResponse } from 'next/server';

// 直接在 API 路由中定义数据（避免 TS 导入问题）
const wechatArticles = [
  {
    id: 'wechat-2026-1',
    topic: 'DNF手游2026大动作! 女法双职领衔,女格斗全员集结,等级扩张+新副本',
    category: 'tech',
    tweet_count: 25000,
    engagement_score: 25000,
    ai_summary: '2026年DNF手游重大更新：周年庆新职业女法双职上线，女格斗全职业集结，等级上限扩张，高难度新副本暗藏玄机',
    key_points: [
      '女法师双职业首次登场',
      '女格斗全员集结更新',
      '等级上限扩张至新高度',
      '公众号: 八百万勇士之一白马'
    ],
    source_url: 'https://weixin.sogou.com/weixin?type=2&query=DNF手游2026',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'wechat-2026-2',
    topic: 'DNF手游:2026新春10+活动齐开,太初武器+3件首饰免费领',
    category: 'tech',
    tweet_count: 32000,
    engagement_score: 32000,
    ai_summary: '史上最强新春版本！2026年DNF手游策划发福利，太初武器和3件首饰可免费获取，0氪党毕业良机',
    key_points: [
      '10个以上新春活动同时开启',
      '太初武器免费获取途径',
      '3件首饰白嫖攻略',
      '公众号: 足迹街'
    ],
    source_url: 'https://weixin.sogou.com/weixin?type=2&query=DNF手游2026新春',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'wechat-2026-3',
    topic: 'DNF手游:2026新春福利全汇总! 白嫖120矛盾+天空套',
    category: 'tech',
    tweet_count: 28000,
    engagement_score: 28000,
    ai_summary: '2026新春版本福利爆炸性汇总，白嫖120个矛盾材料+天空套装，微氪玩家性价比最高方案',
    key_points: [
      '新春福利全面解析',
      '120个矛盾材料获取路径',
      '天空套白嫖具体方法',
      '公众号: 足迹街'
    ],
    source_url: 'https://weixin.sogou.com/weixin?type=2&query=DNF手游2026福利',
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'wechat-2026-4',
    topic: '【DNF手游】2026年2月热点汇总:新春版本福利拉满,3月更新前瞻',
    category: 'tech',
    tweet_count: 18000,
    engagement_score: 18000,
    ai_summary: '2026年2月至3月DNF手游呈现"新春福利拉满,版本更新可期"态势，3月重大更新前瞻引爆玩家期待',
    key_points: [
      '2月新春版本活动总结',
      '3月重大更新前瞻爆料',
      '社区凝聚力数据分析',
      '公众号: 卦填梨下'
    ],
    source_url: 'https://weixin.sogou.com/weixin?type=2&query=DNF手游2026热点',
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'wechat-2026-5',
    topic: 'dnf手游:2026年春节档「魔界人奇遇记」活动全攻略',
    category: 'tech',
    tweet_count: 22000,
    engagement_score: 22000,
    ai_summary: '2026年春节特别活动"魔界人奇遇记"详细攻略，全新回合制玩法，丰富奖励等你来拿',
    key_points: [
      '魔界人奇遇记玩法解析',
      '回合制战斗系统介绍',
      '活动奖励获取技巧',
      '公众号: 鲁班七号'
    ],
    source_url: 'https://weixin.sogou.com/weixin?type=2&query=DNF手游魔界人',
    created_at: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 'wechat-2026-6',
    topic: '「DNF手游」2026春节第一波福利曝光,魔界人回合游戏实装',
    category: 'tech',
    tweet_count: 20000,
    engagement_score: 20000,
    ai_summary: '2026春节首波福利曝光，包含2026万金币、属强自选、26个矛盾等丰富奖励，魔界人回合游戏正式实装',
    key_points: [
      '2026万金币领取方式',
      '1级属强自选兑换',
      '26个大矛盾获取攻略',
      '公众号: 七夕公会'
    ],
    source_url: 'https://weixin.sogou.com/weixin?type=2&query=DNF手游春节福利',
    created_at: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 'wechat-2026-7',
    topic: 'DNF手游春节福利炸裂,武器装扮白送还有朱雀光环',
    category: 'tech',
    tweet_count: 24000,
    engagement_score: 24000,
    ai_summary: '2026春节福利全解析：免费领取武器装扮、朱雀光环、深渊减负攻略，覆盖双端操作和防骗预警',
    key_points: [
      '武器装扮免费获取',
      '朱雀光环领取方式',
      '深渊副本减负技巧',
      '公众号: 房产一哈'
    ],
    source_url: 'https://weixin.sogou.com/weixin?type=2&query=DNF手游朱雀',
    created_at: new Date(Date.now() - 25200000).toISOString(),
  },
  {
    id: 'wechat-2026-8',
    topic: 'DNF手游:顶流主播苏离正式宣布退圈,转型幕后当发行人',
    category: 'entertainment',
    tweet_count: 15000,
    engagement_score: 15000,
    ai_summary: '2026年DNF手游圈大新闻：年入300万的人气主播苏离宣布退圈，转型做游戏发行人，标志着直播红利时代结束',
    key_points: [
      '顶流主播苏离退圈决定',
      '转型游戏发行人路线',
      '年入300万直播生涯回顾',
      '公众号: 全游汇'
    ],
    source_url: 'https://weixin.sogou.com/weixin?type=2&query=DNF手游主播',
    created_at: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: 'wechat-2026-9',
    topic: 'DNF手游:2026新春理查德赛马回归,竞猜赢绝版年兽头框',
    category: 'tech',
    tweet_count: 19000,
    engagement_score: 19000,
    ai_summary: '爷青回！2026新春经典活动理查德赛马回归，参与竞猜可白嫖绝版年兽头像框',
    key_points: [
      '理查德赛马经典活动回归',
      '绝版年兽头框获取方式',
      '竞猜玩法详细教程',
      '公众号: 足迹街'
    ],
    source_url: 'https://weixin.sogou.com/weixin?type=2&query=DNF手游赛马',
    created_at: new Date(Date.now() - 32400000).toISOString(),
  },
  {
    id: 'wechat-2026-10',
    topic: 'DNF手游:八百万勇士速看! 2026春节版本福利炸裂',
    category: 'tech',
    tweet_count: 30000,
    engagement_score: 30000,
    ai_summary: '2026春节版本是DNF手游福利密度最高的一次，5000碳、天空套、+12券等顶级奖励应有尽有',
    key_points: [
      '5000碳材料获取攻略',
      '天空套装领取方式',
      '+12强化券使用建议',
      '公众号: 足迹街'
    ],
    source_url: 'https://weixin.sogou.com/weixin?type=2&query=DNF手游春节',
    created_at: new Date(Date.now() - 36000000).toISOString(),
  },
];

// 改进的相似度算法
function calculateSimilarity(text1: string, text2: string): number {
  const normalize = (text: string) => {
    return text.toLowerCase()
      .replace(/[！？。，、；：""''（）【】《》]/g, ' ') // 去除标点
      .split(/\s+/)
      .filter(word => word.length > 0);
  };

  const words1 = normalize(text1);
  const words2 = normalize(text2);
  
  // 计算重叠词数
  const commonWords = words1.filter(word => 
    words2.some(w => w.includes(word) || word.includes(w))
  );
  
  if (commonWords.length === 0) return 0;
  
  return commonWords.length / Math.min(words1.length, words2.length);
}

// 从公众号文章中检索相关内容
function searchRelevantArticles(question: string, topK = 3) {
  console.log(`\n🔍 开始检索: "${question}"`);
  console.log(`📚 知识库文章数: ${wechatArticles.length}`);
  
  const scored = wechatArticles.map(article => {
    const titleScore = calculateSimilarity(question, article.topic) * 3;
    const summaryScore = calculateSimilarity(question, article.ai_summary) * 2;
    const pointsScore = article.key_points.reduce((sum, point) => 
      sum + calculateSimilarity(question, point), 0) / article.key_points.length;
    
    const totalScore = titleScore + summaryScore + pointsScore;
    
    console.log(`  ${article.topic.substring(0, 40)}... = ${totalScore.toFixed(3)}`);
    
    return {
      article,
      score: totalScore,
    };
  });

  const results = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(item => item.score > 0.15); // 降低阈值

  console.log(`\n✅ 匹配结果: ${results.length} 篇`);
  return results;
}

// 生成回答
function generateAnswer(question: string, articles: any[]) {
  if (articles.length === 0) {
    return {
      answer: `😅 抱歉，我暂时没有找到关于"${question}"的相关攻略。

**💡 可能的原因：**
• 这个问题比较新，公众号还没有相关文章
• 问题表述可能不够准确
• 我的知识库还需要扩充

**🎯 您可以尝试：**

**1. 换个问法：**
• ❌ "怎么玩" → ✅ "2026新春活动攻略"
• ❌ "技能" → ✅ "女法师技能加点"

**2. 问这些热门话题：**
• 2026新春活动有哪些福利？
• 太初武器怎么获取？
• 女法师新职业详细介绍
• 魔界人奇遇记活动玩法
• 理查德赛马竞猜攻略
• 朱雀光环怎么领取？

**3. 或者直接告诉我：**
您想了解哪方面的内容？
• 新春活动福利
• 新职业介绍
• 装备获取
• 副本攻略
• 氪金建议`,
      needsHelp: true,
      suggestions: [
        '2026新春活动有哪些福利？',
        '太初武器怎么获取？',
        '女法师新职业详细介绍',
        '魔界人奇遇记活动玩法',
      ],
    };
  }

  let answer = `根据最新的公众号攻略，我为您找到以下信息：\n\n`;

  articles.forEach((item, index) => {
    const { article } = item;
    answer += `### ${index + 1}. ${article.topic}\n\n`;
    answer += `📝 ${article.ai_summary}\n\n`;
    answer += `**要点：**\n`;
    article.key_points.forEach((point: string) => {
      answer += `• ${point}\n`;
    });
    answer += `\n📱 来源：${article.key_points[article.key_points.length - 1]}\n`;
    answer += `🔗 [查看详情](${article.source_url})\n\n`;
    answer += `---\n\n`;
  });

  return {
    answer,
    needsHelp: false,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: '请输入问题' },
        { status: 400 }
      );
    }

    console.log('\n📝 用户提问:', question);

    // 1. 检索相关文章
    const relevantArticles = searchRelevantArticles(question, 3);
    
    if (relevantArticles.length > 0) {
      console.log('\n📌 Top 3 匹配:');
      relevantArticles.forEach((item, i) => {
        console.log(`  ${i+1}. ${item.article.topic} (${(item.score * 100).toFixed(1)}%)`);
      });
    } else {
      console.log('\n⚠️ 未找到相关内容');
    }

    // 2. 生成回答
    const result = generateAnswer(question, relevantArticles);

    return NextResponse.json({
      question,
      answer: result.answer.trim(),
      sources: relevantArticles.map(item => ({
        title: item.article.topic,
        url: item.article.source_url,
        relevance: item.score,
      })),
      needsHelp: result.needsHelp,
      suggestions: result.suggestions || [],
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ AI 问答错误:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
