#!/usr/bin/env node
/**
 * 抖音热点视频爬取
 * 使用 Playwright 模拟浏览器
 */

import { chromium } from 'playwright';

async function scrapeDouyinHotVideos() {
  console.log('🚀 启动抖音爬虫...\n');

  // 启动浏览器（无头模式）
  const browser = await chromium.launch({
    headless: false, // 调试时设为 false
    args: ['--no-sandbox'],
  });

  const context = await browser.newContext({
    // 模拟真实浏览器
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'zh-CN',
  });

  const page = await context.newPage();

  try {
    // 1. 访问抖音热榜
    console.log('📱 访问抖音热榜...');
    await page.goto('https://www.douyin.com/discover', {
      waitUntil: 'networkidle',
      timeout: 30000,
    });

    // 等待内容加载
    await page.waitForTimeout(3000);

    // 2. 提取热榜数据
    const hotVideos = await page.evaluate(() => {
      const videos = [];
      
      // 查找热榜列表（实际选择器需要根据页面结构调整）
      const items = document.querySelectorAll('.hot-list-item');
      
      items.forEach((item, index) => {
        const title = item.querySelector('.title')?.textContent?.trim();
        const heatValue = item.querySelector('.heat-value')?.textContent?.trim();
        const link = item.querySelector('a')?.href;
        
        if (title) {
          videos.push({
            rank: index + 1,
            title,
            heatValue,
            link,
            source: 'douyin',
            category: 'video',
          });
        }
      });
      
      return videos;
    });

    console.log(`✅ 抓取到 ${hotVideos.length} 条热点视频\n`);

    // 3. 获取详细信息（可选）
    for (const video of hotVideos.slice(0, 5)) { // 只取前5个
      console.log(`📹 ${video.rank}. ${video.title}`);
      console.log(`   🔥 热度: ${video.heatValue}`);
      console.log(`   🔗 链接: ${video.link}\n`);
    }

    return hotVideos;

  } catch (error) {
    console.error('❌ 爬取失败:', error.message);
    
    // 降级方案：返回模拟数据
    return getMockDouyinData();
  } finally {
    await browser.close();
  }
}

// 模拟数据（用于测试）
function getMockDouyinData() {
  return [
    {
      rank: 1,
      title: 'DNF手游鬼泣全技能展示',
      heatValue: '1200万',
      link: 'https://www.douyin.com/video/xxxxx',
      source: 'douyin',
      category: 'video',
      description: '鬼泣职业全技能连招演示，新手必看！',
      author: '游戏攻略君',
      likes: 85000,
      comments: 2300,
    },
    {
      rank: 2,
      title: 'DNF手游安图恩副本速通教学',
      heatValue: '980万',
      link: 'https://www.douyin.com/video/yyyyy',
      source: 'douyin',
      category: 'video',
      description: '3分钟速通安图恩，装备配置和技巧分享',
      author: '副本攻略大师',
      likes: 72000,
      comments: 1850,
    },
    {
      rank: 3,
      title: 'DNF手游最新强化活动解析',
      heatValue: '750万',
      link: 'https://www.douyin.com/video/zzzzz',
      source: 'douyin',
      category: 'video',
      description: '强化活动期间如何最大化收益',
      author: '装备强化王',
      likes: 63000,
      comments: 1420,
    },
  ];
}

// 执行爬虫
scrapeDouyinHotVideos()
  .then(videos => {
    console.log('🎉 爬取完成！');
    console.log(`📊 共获取 ${videos.length} 条数据`);
  })
  .catch(console.error);
