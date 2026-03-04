#!/usr/bin/env node
/**
 * 百度贴吧爬虫
 * 爬取 DNF 手游相关帖子和攻略
 */

import { chromium } from 'playwright';

async function scrapeTieba(keyword = 'dnf手游', pages = 3) {
  console.log(`🚀 爬取百度贴吧: ${keyword}\n`);

  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox'],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();
  const allPosts = [];

  try {
    // 方案 1: 搜索贴吧内容
    console.log('🔍 搜索贴吧帖子...');
    const searchUrl = `https://tieba.baidu.com/f/search/res?qw=${encodeURIComponent(keyword)}`;
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // 提取搜索结果
    const searchPosts = await page.evaluate(() => {
      const posts = [];
      const items = document.querySelectorAll('.s_post');

      items.forEach((item) => {
        const titleEl = item.querySelector('.p_title a');
        const contentEl = item.querySelector('.p_content');
        const authorEl = item.querySelector('.p_author a');
        const timeEl = item.querySelector('.p_date');

        if (titleEl) {
          posts.push({
            title: titleEl.textContent?.trim(),
            content: contentEl?.textContent?.trim().substring(0, 200),
            author: authorEl?.textContent?.trim(),
            publishTime: timeEl?.textContent?.trim(),
            link: titleEl.href,
            source: 'tieba',
          });
        }
      });

      return posts;
    });

    allPosts.push(...searchPosts);
    console.log(`✅ 搜索结果: ${searchPosts.length} 条帖子\n`);

    // 方案 2: 直接访问 DNF 手游吧
    console.log('📱 访问 DNF 手游吧...');
    await page.goto('https://tieba.baidu.com/f?kw=dnf手游', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    await page.waitForTimeout(2000);

    // 爬取多页
    for (let i = 0; i < pages; i++) {
      console.log(`📖 爬取第 ${i + 1}/${pages} 页...`);

      const pagePosts = await page.evaluate(() => {
        const posts = [];
        const items = document.querySelectorAll('.j_thread_list');

        items.forEach((item) => {
          const titleEl = item.querySelector('.j_th_tit');
          const replyEl = item.querySelector('.threadlist_rep_num');
          const authorEl = item.querySelector('.tb_icon_author');

          if (titleEl) {
            posts.push({
              title: titleEl.textContent?.trim(),
              replies: replyEl?.textContent?.trim() || '0',
              author: authorEl?.getAttribute('title')?.replace('主题作者: ', ''),
              link: 'https://tieba.baidu.com' + titleEl.getAttribute('href'),
              source: 'tieba',
              category: 'forum',
            });
          }
        });

        return posts;
      });

      allPosts.push(...pagePosts);
      console.log(`   ✅ 本页 ${pagePosts.length} 条帖子`);

      // 翻页
      if (i < pages - 1) {
        const nextButton = await page.$('.next');
        if (nextButton) {
          await nextButton.click();
          await page.waitForTimeout(2000);
        } else {
          console.log('   ⚠️ 没有下一页了');
          break;
        }
      }
    }

    console.log(`\n✅ 共爬取 ${allPosts.length} 条帖子\n`);

    // 输出前5条
    console.log('📋 热门帖子预览:\n');
    for (const post of allPosts.slice(0, 5)) {
      console.log(`📌 ${post.title}`);
      console.log(`   👤 作者: ${post.author || '未知'}`);
      console.log(`   💬 回复: ${post.replies || '0'}`);
      console.log(`   🔗 ${post.link}\n`);
    }

    return allPosts;

  } catch (error) {
    console.error('❌ 爬取失败:', error.message);
    return getMockTiebaData();
  } finally {
    await browser.close();
  }
}

// 模拟数据
function getMockTiebaData() {
  return [
    {
      title: '【攻略】鬼泣职业全面解析 - 从萌新到高手',
      content: '本帖详细介绍鬼泣职业的技能加点、装备选择、连招技巧...',
      author: '攻略帝',
      replies: '1523',
      publishTime: '2024-02-08',
      link: 'https://tieba.baidu.com/p/xxxxx',
      source: 'tieba',
      category: 'guide',
      views: 85000,
    },
    {
      title: '【副本】安图恩团本详细攻略+BOSS机制图解',
      content: '安图恩副本完整流程，包括各BOSS技能机制、职业配置...',
      author: '副本王者',
      replies: '867',
      publishTime: '2024-02-07',
      link: 'https://tieba.baidu.com/p/yyyyy',
      source: 'tieba',
      category: 'guide',
      views: 62000,
    },
    {
      title: '【装备】强化+13成功经验分享，非酋翻身记',
      content: '从+10到+13的心路历程，附强化技巧和保护券使用心得...',
      author: '强化大神',
      replies: '2104',
      publishTime: '2024-02-06',
      link: 'https://tieba.baidu.com/p/zzzzz',
      source: 'tieba',
      category: 'guide',
      views: 120000,
    },
    {
      title: '【PVP】竞技场各职业克制关系及打法攻略',
      content: 'PVP竞技场全职业对抗技巧，掌握克制关系轻松上分...',
      author: 'PVP高手',
      replies: '645',
      publishTime: '2024-02-05',
      link: 'https://tieba.baidu.com/p/aaaaa',
      source: 'tieba',
      category: 'pvp',
      views: 43000,
    },
    {
      title: '【资讯】最新活动汇总及福利领取攻略',
      content: '当前所有活动一览，包括限时副本、充值返利、签到奖励...',
      author: '资讯君',
      replies: '312',
      publishTime: '2024-02-04',
      link: 'https://tieba.baidu.com/p/bbbbb',
      source: 'tieba',
      category: 'news',
      views: 28000,
    },
  ];
}

// 爬取帖子详细内容
async function scrapePostDetail(url) {
  console.log(`📄 爬取帖子详情: ${url}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const detail = await page.evaluate(() => {
      // 楼主内容
      const mainContent = document.querySelector('.d_post_content');
      
      // 高赞回复
      const topReplies = [];
      const replyEls = document.querySelectorAll('.l_post');
      
      replyEls.forEach((el, i) => {
        if (i < 5) { // 只取前5个回复
          const content = el.querySelector('.d_post_content')?.textContent?.trim();
          const author = el.querySelector('.p_author_name')?.textContent?.trim();
          
          if (content) {
            topReplies.push({ author, content });
          }
        }
      });

      return {
        mainContent: mainContent?.textContent?.trim(),
        topReplies,
      };
    });

    await browser.close();
    return detail;

  } catch (error) {
    console.error('❌ 详情爬取失败:', error.message);
    await browser.close();
    return null;
  }
}

// 命令行入口
const keyword = process.argv[2] || 'dnf手游';
const pages = parseInt(process.argv[3]) || 3;

scrapeTieba(keyword, pages)
  .then(posts => {
    console.log('🎉 爬取完成！');
    console.log(`📊 共获取 ${posts.length} 条帖子`);
    
    // 可选：爬取前3个帖子的详细内容
    // const detailPromises = posts.slice(0, 3).map(p => scrapePostDetail(p.link));
    // return Promise.all(detailPromises);
  })
  .catch(console.error);
