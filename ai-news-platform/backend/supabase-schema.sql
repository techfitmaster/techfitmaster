-- AI 资讯平台数据库表结构
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 热点资讯表
CREATE TABLE IF NOT EXISTS trending_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  category TEXT NOT NULL, -- tech, business, entertainment, sports, politics
  tweet_count INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0,
  ai_summary TEXT,
  key_points JSONB, -- 存储要点数组
  source_url TEXT,
  trend_data JSONB, -- 历史热度数据
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_trending_category ON trending_news(category);
CREATE INDEX IF NOT EXISTS idx_trending_created ON trending_news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_trending_engagement ON trending_news(engagement_score DESC);

-- 3. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trending_news_updated_at
  BEFORE UPDATE ON trending_news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 4. 启用 Row Level Security (可选，用于付费功能)
ALTER TABLE trending_news ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取 (免费版)
CREATE POLICY "Allow public read access"
  ON trending_news
  FOR SELECT
  USING (true);

-- 5. 创建视图 - 最新热点 Top 20
CREATE OR REPLACE VIEW latest_trending AS
SELECT 
  id,
  topic,
  category,
  tweet_count,
  engagement_score,
  ai_summary,
  key_points,
  created_at
FROM trending_news
ORDER BY engagement_score DESC, created_at DESC
LIMIT 20;

COMMENT ON TABLE trending_news IS 'X平台热点资讯数据表';
COMMENT ON VIEW latest_trending IS '最新热点 Top 20 视图';
