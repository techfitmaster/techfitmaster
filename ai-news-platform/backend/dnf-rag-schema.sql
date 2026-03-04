-- DNF 手游攻略 RAG 数据库设计

-- 1. 启用 pgvector 扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. 攻略文档表
CREATE TABLE IF NOT EXISTS dnf_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 职业、副本、装备、技能、PVP等
  content TEXT NOT NULL,
  source_url TEXT,
  author TEXT,
  publish_date TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 向量嵌入表 (用于语义搜索)
CREATE TABLE IF NOT EXISTS dnf_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES dnf_guides(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL, -- 文档分块索引
  chunk_text TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 维度
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 用户问答历史
CREATE TABLE IF NOT EXISTS dnf_qa_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  retrieved_guides JSONB, -- 检索到的相关攻略
  model_used TEXT DEFAULT 'gpt-4',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 创建索引
CREATE INDEX IF NOT EXISTS idx_guides_category ON dnf_guides(category);
CREATE INDEX IF NOT EXISTS idx_guides_created ON dnf_guides(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_embeddings_guide ON dnf_embeddings(guide_id);

-- 6. 向量相似度搜索索引 (HNSW 算法)
CREATE INDEX IF NOT EXISTS idx_embeddings_vector 
  ON dnf_embeddings 
  USING hnsw (embedding vector_cosine_ops);

-- 7. 全文搜索索引
CREATE INDEX IF NOT EXISTS idx_guides_content_fts 
  ON dnf_guides 
  USING gin(to_tsvector('chinese', content));

-- 8. 相似度搜索函数
CREATE OR REPLACE FUNCTION search_similar_guides(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  guide_id uuid,
  title text,
  chunk_text text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.guide_id,
    g.title,
    e.chunk_text,
    1 - (e.embedding <=> query_embedding) as similarity
  FROM dnf_embeddings e
  JOIN dnf_guides g ON g.id = e.guide_id
  WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

COMMENT ON TABLE dnf_guides IS 'DNF手游攻略文档';
COMMENT ON TABLE dnf_embeddings IS '攻略向量嵌入（用于语义搜索）';
COMMENT ON TABLE dnf_qa_history IS '用户问答历史记录';
