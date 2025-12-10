-- 社区功能数据库表

-- 社区话题表
CREATE TABLE IF NOT EXISTS public.community_topics (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_id TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 社区回复表
CREATE TABLE IF NOT EXISTS public.community_replies (
  id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT REFERENCES public.community_topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON public.community_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_category ON public.community_topics(category);
CREATE INDEX IF NOT EXISTS idx_replies_topic_id ON public.community_replies(topic_id);

-- 启用 RLS
ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

-- RLS 策略：所有人可读
CREATE POLICY "Topics are viewable by everyone" 
  ON public.community_topics FOR SELECT 
  USING (true);

CREATE POLICY "Replies are viewable by everyone" 
  ON public.community_replies FOR SELECT 
  USING (true);

-- RLS 策略：所有人可写（匿名社区）
CREATE POLICY "Anyone can create topics" 
  ON public.community_topics FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can create replies" 
  ON public.community_replies FOR INSERT 
  WITH CHECK (true);

-- 创建函数：获取话题回复数
CREATE OR REPLACE FUNCTION get_topic_reply_count(topic_id BIGINT)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM public.community_replies WHERE community_replies.topic_id = $1;
$$ LANGUAGE SQL STABLE;

-- 创建视图：话题列表（包含回复数）
CREATE OR REPLACE VIEW public.community_topics_with_counts AS
SELECT 
  t.*,
  COALESCE((SELECT COUNT(*) FROM public.community_replies r WHERE r.topic_id = t.id), 0) AS replies_count
FROM public.community_topics t
ORDER BY t.pinned DESC, t.created_at DESC;
