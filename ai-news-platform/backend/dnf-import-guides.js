#!/usr/bin/env node
/**
 * DNF 手游攻略爬虫
 * 功能: 抓取攻略 → 分块 → 向量化 → 存入 Supabase
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// 配置
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// ========== 模拟攻略数据 (实际应从网站爬取) ==========
const mockGuides = [
  {
    title: '鬼泣职业全面攻略 - 技能加点与连招教学',
    category: '职业攻略',
    content: `
# 鬼泣职业攻略

## 职业定位
鬼泣是DNF手游中的高爆发近战职业，拥有强大的连招能力和AOE伤害。

## 核心技能
1. **满月斩** - 主要输出技能，CD短，伤害高
2. **裂波斩** - 破防技能，可降低敌人防御
3. **极鬼剑术** - 大招，范围AOE爆发

## 加点推荐
- 主加满月斩、裂波斩、极鬼剑术
- 副加冰刃、银光落刃
- 控制技能点1级即可

## 装备推荐
- 武器：荒古太刀
- 防具：恍惚套装
- 首饰：超大陆套装

## PVE连招
满月斩 → 裂波斩 → 银光落刃 → 极鬼剑术

## PVP技巧
利用冰刃控制 → 满月斩快速消耗 → 抓机会爆发
    `,
    source_url: 'https://dnf.example.com/guide/guiqi',
    author: '攻略大神',
  },
  {
    title: '安图恩副本攻略 - 通关技巧与奖励',
    category: '副本攻略',
    content: `
# 安图恩副本攻略

## 副本概述
安图恩是DNF手游80级团队副本，需要4人组队，难度较高。

## BOSS机制
1. **第一阶段** - BOSS会召唤小怪，优先清理
2. **第二阶段** - 出现全屏AOE，需要躲避红圈
3. **狂暴机制** - 5分钟内未击败会团灭

## 职业配置
- 1个坦克职业（鬼泣、剑魂）
- 2个输出职业（漫游、元素）
- 1个辅助职业（奶妈、奶爸）

## 通关技巧
1. 优先击杀召唤的小怪
2. BOSS读条时远离
3. 保持血量在50%以上
4. 利用觉醒技能打爆发

## 奖励
- 史诗装备（恍惚、超大陆）
- 强化材料
- 金币和经验
    `,
    source_url: 'https://dnf.example.com/guide/anton',
    author: '副本王者',
  },
  {
    title: '装备强化系统详解 - 从+10到+13',
    category: '装备系统',
    content: `
# 装备强化系统

## 强化等级
- +10: 成功率60%，需要普通强化券
- +11: 成功率40%，需要中级强化券
- +12: 成功率20%，需要高级强化券
- +13: 成功率10%，需要特级强化券

## 强化技巧
1. **垫子理论** - 用低级装备先失败几次再上主装备
2. **黑钻加成** - 购买黑钻提升5%成功率
3. **活动期间** - 等强化活动时再冲

## 失败惩罚
- +10以下：无惩罚
- +11-+12：失败降1级
- +13：失败降2级

## 保护券
使用强化保护券可防止失败降级，但成本较高。

## 建议
- 武器优先强化到+12
- 防具保持+10即可
- 首饰不建议强化
    `,
    source_url: 'https://dnf.example.com/guide/enhance',
    author: '强化大师',
  },
];

// ========== 文本分块 ==========
function chunkText(text, maxChunkSize = 500) {
  const paragraphs = text.split('\n').filter(p => p.trim());
  const chunks = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk + para).length > maxChunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += '\n' + para;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// ========== 生成向量嵌入 ==========
async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}

// ========== 存储攻略 ==========
async function storeGuide(guide) {
  console.log(`📝 处理攻略: ${guide.title}`);

  // 1. 插入文档
  const { data: guideData, error: guideError } = await supabase
    .from('dnf_guides')
    .insert({
      title: guide.title,
      category: guide.category,
      content: guide.content,
      source_url: guide.source_url,
      author: guide.author,
      publish_date: new Date().toISOString(),
    })
    .select()
    .single();

  if (guideError) {
    console.error('❌ 存储攻略失败:', guideError.message);
    return;
  }

  console.log(`✅ 攻略已存储，ID: ${guideData.id}`);

  // 2. 文本分块
  const chunks = chunkText(guide.content);
  console.log(`📦 分块数量: ${chunks.length}`);

  // 3. 生成并存储向量
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`🔄 处理分块 ${i + 1}/${chunks.length}...`);

    const embedding = await generateEmbedding(chunk);

    const { error: embeddingError } = await supabase
      .from('dnf_embeddings')
      .insert({
        guide_id: guideData.id,
        chunk_index: i,
        chunk_text: chunk,
        embedding: embedding,
      });

    if (embeddingError) {
      console.error(`❌ 存储向量失败 (分块 ${i}):`, embeddingError.message);
    }

    // 避免 API 频率限制
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`✅ 攻略 "${guide.title}" 处理完成\n`);
}

// ========== 主函数 ==========
async function main() {
  console.log('🚀 开始导入 DNF 手游攻略...\n');

  for (const guide of mockGuides) {
    await storeGuide(guide);
  }

  console.log('🎉 所有攻略导入完成！');
}

main().catch(console.error);
