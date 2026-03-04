#!/usr/bin/env node
/**
 * X 热点资讯抓取脚本
 * 功能: 抓取 X Trending + AI 摘要 + 存入 Supabase
 * 运行: node fetch-trends.js
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// ========== 配置 ==========
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_ANON_KEY';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'YOUR_OPENAI_KEY';
const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN || 'YOUR_X_BEARER_TOKEN';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ========== X API 抓取 ==========
async function fetchXTrending() {
  console.log('🔍 正在抓取 X 热点...');
  
  try {
    // X API v2 - Trending Topics
    const response = await fetch('https://api.twitter.com/2/trends/place.json?id=1', {
      headers: {
        'Authorization': `Bearer ${X_BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`X API Error: ${response.status}`);
    }

    const data = await response.json();
    const trends = data[0]?.trends || [];

    console.log(`✅ 抓取到 ${trends.length} 个热点`);
    return trends.slice(0, 20); // 只取前 20
  } catch (error) {
    console.error('❌ X API 抓取失败:', error.message);
    
    // 降级方案: 使用模拟数据
    console.log('⚠️  使用模拟数据...');
    return getMockTrends();
  }
}

// ========== 模拟数据 (用于测试) ==========
function getMockTrends() {
  return [
    { name: 'OpenAI GPT-5', tweet_volume: 125000, category: 'tech' },
    { name: 'Tesla FSD Update', tweet_volume: 89000, category: 'tech' },
    { name: 'AI Regulations', tweet_volume: 67000, category: 'politics' },
    { name: 'NBA Playoffs', tweet_volume: 156000, category: 'sports' },
    { name: 'Climate Summit', tweet_volume: 45000, category: 'politics' },
    { name: 'New iPhone Leak', tweet_volume: 98000, category: 'tech' },
    { name: 'Stock Market Rally', tweet_volume: 72000, category: 'business' },
    { name: 'Oscar Nominations', tweet_volume: 134000, category: 'entertainment' },
  ];
}

// ========== AI 摘要生成 ==========
async function generateAISummary(topic, category) {
  const prompt = `作为资讯分析师，请为以下热点话题生成简洁摘要和3-5个关键点：

话题: ${topic}
分类: ${category}

请以 JSON 格式返回:
{
  "summary": "一句话摘要 (30字内)",
  "key_points": ["要点1", "要点2", "要点3"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // 使用便宜的模型
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result;
  } catch (error) {
    console.error(`❌ AI 生成失败 (${topic}):`, error.message);
    return {
      summary: `${topic} 相关讨论热度上升`,
      key_points: ['正在分析中...'],
    };
  }
}

// ========== 分类推断 ==========
function inferCategory(topicName) {
  const keywords = {
    tech: ['AI', 'OpenAI', 'Tesla', 'Apple', 'iPhone', 'Google', 'Meta', 'Tech', 'Crypto'],
    business: ['Stock', 'Market', 'IPO', 'Economy', 'Earnings', 'Wall Street'],
    sports: ['NBA', 'NFL', 'FIFA', 'Olympics', 'Champions'],
    entertainment: ['Oscar', 'Grammy', 'Netflix', 'Movie', 'Music'],
    politics: ['President', 'Election', 'Congress', 'Climate', 'Policy'],
  };

  for (const [category, terms] of Object.entries(keywords)) {
    if (terms.some(term => topicName.includes(term))) {
      return category;
    }
  }
  return 'general';
}

// ========== 保存到 Supabase ==========
async function saveTrends(trends) {
  console.log('💾 正在处理并保存数据...');

  const records = [];

  for (const trend of trends) {
    const category = trend.category || inferCategory(trend.name);
    const aiResult = await generateAISummary(trend.name, category);

    records.push({
      topic: trend.name,
      category,
      tweet_count: trend.tweet_volume || 0,
      engagement_score: trend.tweet_volume || Math.floor(Math.random() * 100000),
      ai_summary: aiResult.summary,
      key_points: aiResult.key_points,
      source_url: trend.url || `https://twitter.com/search?q=${encodeURIComponent(trend.name)}`,
    });

    // 避免 API 频率限制
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const { data, error } = await supabase
    .from('trending_news')
    .insert(records);

  if (error) {
    console.error('❌ Supabase 保存失败:', error.message);
    throw error;
  }

  console.log(`✅ 成功保存 ${records.length} 条热点资讯`);
  return data;
}

// ========== 主函数 ==========
async function main() {
  console.log('🚀 开始抓取 X 热点资讯...\n');

  try {
    const trends = await fetchXTrending();
    await saveTrends(trends);
    console.log('\n🎉 抓取完成！');
  } catch (error) {
    console.error('\n💥 执行失败:', error.message);
    process.exit(1);
  }
}

main();
