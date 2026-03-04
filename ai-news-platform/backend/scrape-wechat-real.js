#!/usr/bin/env node
/**
 * 微信公众号真实爬虫 - 搜狗微信版本
 * 可以抓取真实数据
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeWeChatReal(keyword = 'DNF手游', pages = 2) {
  console.log(`🚀 爬取公众号文章: ${keyword}\n`);

  const allArticles = [];

  for (let page = 1; page <= pages; page++) {
    console.log(`📖 第 ${page}/${pages} 页...`);

    try {
      const url = `https://weixin.sogou.com/weixin?type=2&query=${encodeURIComponent(keyword)}&page=${page}`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);
      
      // 提取文章列表
      $('.news-list li').each((i, el) => {
        const $item = $(el);
        const title = $item.find('.txt-box h3 a').text().trim();
        const summary = $item.find('.txt-info').text().trim();
        const author = $item.find('.account').text().trim();
        const date = $item.find('.s2').text().trim();
        const link = $item.find('.txt-box h3 a').attr('href');

        if (title && link) {
          allArticles.push({
            title,
            summary,
            author,
            publishTime: date,
            link: 'https://weixin.sogou.com' + link,
            source: 'wechat',
            category: 'guide',
          });
        }
      });

      console.log(`   ✅ 抓取 ${$('.news-list li').length} 篇文章`);

      // 避免请求过快
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`   ❌ 第 ${page} 页爬取失败:`, error.message);
    }
  }

  console.log(`\n✅ 共爬取 ${allArticles.length} 篇文章\n`);

  // 输出前5篇
  console.log('📋 热门文章:\n');
  allArticles.slice(0, 5).forEach((article, i) => {
    console.log(`📄 ${i + 1}. ${article.title}`);
    console.log(`   👤 公众号: ${article.author}`);
    console.log(`   📅 发布: ${article.publishTime}`);
    console.log(`   📝 摘要: ${article.summary.substring(0, 80)}...`);
    console.log(`   🔗 ${article.link}\n`);
  });

  return allArticles;
}

// 命令行入口
const keyword = process.argv[2] || 'DNF手游攻略';
const pages = parseInt(process.argv[3]) || 2;

scrapeWeChatReal(keyword, pages)
  .then(articles => {
    console.log('🎉 爬取完成！');
    console.log(`📊 共获取 ${articles.length} 篇公众号文章`);
  })
  .catch(console.error);
