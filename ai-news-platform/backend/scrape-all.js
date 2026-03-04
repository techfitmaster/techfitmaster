#!/usr/bin/env node
/**
 * 全平台攻略爬虫整合
 * 支持: 抖音、公众号、贴吧、知乎、B站等
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ========== 平台爬虫映射 ==========
const scrapers = {
  tieba: () => import('./scrape-tieba.js'),
  douyin: () => import('./scrape-douyin.js'),
  wechat: () => import('./scrape-wechat.js'),
  // 未来扩展
  zhihu: () => import('./scrape-zhihu.js'),
  bilibili: () => import('./scrape-bilibili.js'),
};

// ========== 内容清洗 ==========
function cleanContent(raw) {
  return raw
    .replace(/\s+/g, ' ')           // 多个空格 → 单个
    .replace(/\n{3,}/g, '\n\n')     // 多个换行 → 双换行
    .replace(/[^\S\n]+/g, ' ')      // 清理特殊空白字符
    .trim();
}

// ========== AI 内容提取 ==========
async function extractKeyInfo(content) {
  const prompt = `请从以下 DNF 手游攻略内容中提取关键信息:

**原文:**
${content.substring(0, 2000)}

**请提取:**
1. 主要话题（职业/副本/装备/PVP等）
2. 核心观点（3-5条要点）
3. 适用对象（萌新/进阶/高手）
4. 内容质量评分（1-10分）

**输出JSON格式:**
{
  "topic": "主要话题",
  "keyPoints": ["要点1", "要点2", "要点3"],
  "targetAudience": "适用对象",
  "qualityScore": 8
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: '你是专业的游戏攻略内容分析师。' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI 提取失败:', error.message);
    return null;
  }
}

// ========== 生成向量嵌入 ==========
async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}

// ========== 文本分块 ==========
function chunkText(text, maxSize = 500) {
  const paragraphs = text.split('\n').filter(p => p.trim());
  const chunks = [];
  let current = '';

  for (const para of paragraphs) {
    if ((current + para).length > maxSize && current) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += '\n' + para;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

// ========== 存储到数据库 ==========
async function storeGuide(guide, metadata) {
  console.log(`💾 存储攻略: ${guide.title}`);

  // 1. 插入攻略文档
  const { data: guideData, error: guideError } = await supabase
    .from('dnf_guides')
    .insert({
      title: guide.title,
      category: metadata.topic || 'general',
      content: cleanContent(guide.content || guide.title),
      source_url: guide.link,
      author: guide.author,
      publish_date: guide.publishTime || new Date().toISOString(),
      view_count: guide.views || 0,
    })
    .select()
    .single();

  if (guideError) {
    console.error(`❌ 存储失败: ${guideError.message}`);
    return false;
  }

  // 2. 文本分块并向量化
  const chunks = chunkText(guide.content || guide.title);
  console.log(`   📦 分块: ${chunks.length} 个`);

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);

    await supabase.from('dnf_embeddings').insert({
      guide_id: guideData.id,
      chunk_index: i,
      chunk_text: chunks[i],
      embedding: embedding,
    });

    await new Promise(resolve => setTimeout(resolve, 500)); // 限流
  }

  console.log(`   ✅ 已入库\n`);
  return true;
}

// ========== 主爬虫流程 ==========
async function scrapeAndStore(platform, keyword = 'dnf手游') {
  console.log(`\n🚀 启动 ${platform} 爬虫...\n`);

  // 动态加载对应爬虫
  const scraperModule = await scrapers[platform]();
  const posts = await scraperModule.default(keyword);

  console.log(`\n📊 爬取到 ${posts.length} 条内容\n`);

  // 处理每条内容
  let successCount = 0;
  for (const post of posts) {
    console.log(`🔄 处理: ${post.title}`);

    // AI 提取关键信息
    const metadata = await extractKeyInfo(post.content || post.title);

    if (metadata && metadata.qualityScore >= 6) {
      const success = await storeGuide(post, metadata);
      if (success) successCount++;
    } else {
      console.log('   ⚠️ 质量过低，跳过\n');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n🎉 完成！成功入库 ${successCount}/${posts.length} 条\n`);
}

// ========== 命令行入口 ==========
const platform = process.argv[2];
const keyword = process.argv[3] || 'dnf手游';

if (!platform || !scrapers[platform]) {
  console.log('用法: node scrape-all.js <平台> [关键词]');
  console.log('\n支持平台:');
  console.log('  tieba    - 百度贴吧');
  console.log('  douyin   - 抖音');
  console.log('  wechat   - 微信公众号');
  console.log('\n示例:');
  console.log('  node scrape-all.js tieba "鬼泣攻略"');
  console.log('  node scrape-all.js douyin');
  console.log('  node scrape-all.js wechat "安图恩副本"');
  process.exit(1);
}

scrapeAndStore(platform, keyword).catch(console.error);
