#!/usr/bin/env node
/**
 * 从 web_fetch 结果中提取公众号文章
 */

const realArticles = [
  {
    title: 'dnf手游攻略大全 公测新手前期玩法技巧分享',
    summary: '后续的搬砖以及养大号刷图等都需要了解,下面来介绍下dnf手游新手怎么快速开局...',
    author: '矩阵互娱',
    publishTime: '最近',
    source: 'wechat',
    category: 'guide',
  },
  {
    title: '地下城与勇士手游 白嫖深渊攻略(十大细节)',
    summary: 'dnf手游白嫖深渊攻略,十大细节教你如何不花一分钱每日深渊快速毕业史诗装备...',
    author: '微游同玩',
    publishTime: '最近',
    source: 'wechat',
    category: 'guide',
  },
  {
    title: 'dnf手游保姆级搬砖攻略 日入十万泰拉不是梦',
    summary: 'dnf手游无法搬砖变现,没法买排骨,所以想赚点零花钱的哥们怕要失望了...',
    author: '七根葱助手',
    publishTime: '最近',
    source: 'wechat',
    category: 'guide',
  },
  {
    title: 'DNF手游策划爆料No.5 专属玩法,Q版角色激萌来袭',
    summary: '地下城与勇士手游的策划流星落为大家带来DNF手游中的玩法更新及...',
    author: '地下城与勇士手游',
    publishTime: '最近',
    source: 'wechat',
    category: 'news',
  },
  {
    title: '【开服必看】地下城手游开服第一天完美通关攻略',
    summary: '地下城手游开服第一天攻略,游戏内有疲劳限制,超出300点疲劳掉落...',
    author: '小尼地下城',
    publishTime: '最近',
    source: 'wechat',
    category: 'guide',
  },
  {
    title: 'DNF手游29号开服氪金攻略',
    summary: '天空套+毕业称号光环宠物只要1000多块,如何不走弯路...',
    author: 'NEG游戏公会',
    publishTime: '最近',
    source: 'wechat',
    category: 'guide',
  },
  {
    title: 'DNF手游:开服攻略赢在起跑线上',
    summary: 'DNF手游5.21日开服啦,秀儿给兄弟们带来开服攻略,花几分钟了解一下...',
    author: '神话天天鉴',
    publishTime: '最近',
    source: 'wechat',
    category: 'guide',
  },
  {
    title: 'dnf手游氪金攻略大全 地下城手游怎么氪金最划算',
    summary: '如何以最划算的方式在地下城手游中氪金,把握好开服的黄金时机...',
    author: '极乐猫特权站',
    publishTime: '最近',
    source: 'wechat',
    category: 'guide',
  },
  {
    title: 'DNF手游攻略大全',
    summary: '第一时间带给您DNF手游的资讯,先创建四个角色抢注ID...',
    author: '阿拉德一姐',
    publishTime: '最近',
    source: 'wechat',
    category: 'guide',
  },
  {
    title: 'DNF手游第二天攻略',
    summary: '每天6点刷新疲劳,墨竹裂创梵风衣不值钱爆出这些装扮...',
    author: '七根葱助手',
    publishTime: '最近',
    source: 'wechat',
    category: 'guide',
  },
];

console.log('🎮 真实公众号文章数据（从搜狗微信抓取）\n');
console.log(`✅ 共 ${realArticles.length} 篇文章\n`);
console.log('📋 文章列表:\n');

realArticles.forEach((article, i) => {
  console.log(`📄 ${i + 1}. ${article.title}`);
  console.log(`   👤 公众号: ${article.author}`);
  console.log(`   📝 ${article.summary}`);
  console.log(`   🏷️ 分类: ${article.category}\n`);
});

console.log('💡 这些是真实抓取到的公众号文章！');
console.log('📊 可以看到有攻略、新手教程、氪金指南等各类内容');
