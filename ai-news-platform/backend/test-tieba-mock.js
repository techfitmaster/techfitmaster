#!/usr/bin/env node
/**
 * 贴吧爬虫测试 - 使用模拟数据
 */

const mockData = [
  {
    title: '【攻略】鬼泣职业全面解析 - 从萌新到高手',
    content: `
# 鬼泣职业攻略

鬼泣是DNF手游中的高爆发近战职业，拥有强大的连招能力。

## 技能加点推荐
- 主加满月斩、裂波斩、极鬼剑术
- 副加冰刃、银光落刃

## PVE连招
满月斩 → 裂波斩 → 银光落刃 → 极鬼剑术

## 装备推荐
- 武器：荒古太刀
- 防具：恍惚套装
    `,
    author: '攻略帝',
    replies: '1523',
    publishTime: '2024-02-08',
    link: 'https://tieba.baidu.com/p/8234567890',
    source: 'tieba',
    views: 85000,
  },
  {
    title: '【副本】安图恩团本详细攻略+BOSS机制图解',
    content: `
# 安图恩副本攻略

## 副本概述
安图恩是80级团队副本，需要4人组队。

## BOSS机制
1. 第一阶段 - 召唤小怪，优先清理
2. 第二阶段 - 全屏AOE，躲避红圈
3. 狂暴机制 - 5分钟内未击败会团灭

## 职业配置
- 1个坦克
- 2个输出
- 1个辅助
    `,
    author: '副本王者',
    replies: '867',
    publishTime: '2024-02-07',
    link: 'https://tieba.baidu.com/p/8234567891',
    source: 'tieba',
    views: 62000,
  },
  {
    title: '【装备】强化+13成功经验分享，非酋翻身记',
    content: `
# 装备强化技巧

## 强化成功率
- +10: 60%
- +11: 40%
- +12: 20%
- +13: 10%

## 技巧分享
1. 垫子理论 - 先用低级装备失败几次
2. 黑钻加成 - 提升5%成功率
3. 活动期间强化

## 保护券使用
使用强化保护券可防止失败降级。
    `,
    author: '强化大神',
    replies: '2104',
    publishTime: '2024-02-06',
    link: 'https://tieba.baidu.com/p/8234567892',
    source: 'tieba',
    views: 120000,
  },
];

console.log('🎮 百度贴吧爬虫 - 模拟数据演示\n');
console.log(`✅ 共爬取 ${mockData.length} 条帖子\n`);
console.log('📋 热门帖子:\n');

mockData.forEach((post, i) => {
  console.log(`📌 ${i+1}. ${post.title}`);
  console.log(`   👤 作者: ${post.author}`);
  console.log(`   💬 回复: ${post.replies}`);
  console.log(`   👁️ 浏览: ${post.views.toLocaleString()}`);
  console.log(`   🔗 ${post.link}\n`);
});

console.log('💡 这些数据可以直接导入 RAG 系统用于问答！');
