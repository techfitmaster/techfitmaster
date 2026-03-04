#!/usr/bin/env node
/**
 * DNF 手游 RAG 问答系统
 * 用法: node dnf-rag-query.js "鬼泣怎么加点？"
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ========== 生成查询向量 ==========
async function generateQueryEmbedding(question) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: question,
  });
  return response.data[0].embedding;
}

// ========== 语义搜索 ==========
async function searchRelevantGuides(question, limit = 3) {
  console.log('🔍 搜索相关攻略...\n');

  const queryEmbedding = await generateQueryEmbedding(question);

  const { data, error } = await supabase.rpc('search_similar_guides', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: limit,
  });

  if (error) {
    console.error('❌ 搜索失败:', error.message);
    return [];
  }

  return data;
}

// ========== 生成答案 ==========
async function generateAnswer(question, context) {
  const prompt = `你是DNF手游的专业攻略助手。请基于以下攻略内容回答用户问题。

**攻略内容:**
${context.map((c, i) => `[攻略${i + 1}] ${c.title}\n${c.chunk_text}`).join('\n\n---\n\n')}

**用户问题:** ${question}

**回答要求:**
1. 基于提供的攻略内容回答
2. 如果内容不足，明确说明
3. 提供具体建议，不要笼统
4. 可以引用攻略标题

**回答:**`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: '你是DNF手游攻略专家，提供专业、详细的游戏建议。' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  return completion.choices[0].message.content;
}

// ========== 保存问答历史 ==========
async function saveQAHistory(question, answer, guides) {
  await supabase.from('dnf_qa_history').insert({
    question,
    answer,
    retrieved_guides: guides.map(g => ({
      title: g.title,
      similarity: g.similarity,
    })),
    model_used: 'gpt-4o-mini',
  });
}

// ========== 主函数 ==========
async function askDNF(question) {
  console.log('🎮 DNF 手游攻略助手\n');
  console.log(`❓ 问题: ${question}\n`);

  // 1. 语义搜索相关攻略
  const relevantGuides = await searchRelevantGuides(question);

  if (relevantGuides.length === 0) {
    console.log('❌ 抱歉，未找到相关攻略。请尝试其他问题。');
    return;
  }

  console.log('📚 找到相关攻略:');
  relevantGuides.forEach((g, i) => {
    console.log(`${i + 1}. ${g.title} (相似度: ${(g.similarity * 100).toFixed(1)}%)`);
  });
  console.log('');

  // 2. 生成答案
  console.log('🤖 正在生成答案...\n');
  const answer = await generateAnswer(question, relevantGuides);

  // 3. 输出答案
  console.log('💡 回答:');
  console.log('━'.repeat(60));
  console.log(answer);
  console.log('━'.repeat(60));

  // 4. 保存历史
  await saveQAHistory(question, answer, relevantGuides);

  console.log('\n✅ 答案已生成并保存！');
}

// ========== 命令行入口 ==========
const question = process.argv[2];

if (!question) {
  console.log('用法: node dnf-rag-query.js "你的问题"');
  console.log('示例:');
  console.log('  node dnf-rag-query.js "鬼泣怎么加点？"');
  console.log('  node dnf-rag-query.js "安图恩副本怎么打？"');
  console.log('  node dnf-rag-query.js "装备强化有什么技巧？"');
  process.exit(1);
}

askDNF(question).catch(console.error);
