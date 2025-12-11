-- 社区功能数据库表 v2

-- 如果需要添加 tags 字段到现有表，运行：
-- ALTER TABLE public.community_topics ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 完整建表语句（新项目使用）
CREATE TABLE IF NOT EXISTS public.community_topics (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL,
  author_id TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_replies (
  id BIGSERIAL PRIMARY KEY,
  topic_id BIGINT REFERENCES public.community_topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_id TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_topics_created_at ON public.community_topics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_topics_category ON public.community_topics(category);
CREATE INDEX IF NOT EXISTS idx_topics_tags ON public.community_topics USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_replies_topic_id ON public.community_replies(topic_id);

-- RLS
ALTER TABLE public.community_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

-- 策略（如果不存在）
DO $$ BEGIN
  CREATE POLICY "Topics select" ON public.community_topics FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Topics insert" ON public.community_topics FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Topics update" ON public.community_topics FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Replies select" ON public.community_replies FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Replies insert" ON public.community_replies FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ============================================
-- 后台管理系统数据库表 v1
-- ============================================

-- 音乐曲目表
CREATE TABLE IF NOT EXISTS public.music_tracks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  audio_url TEXT,
  display_order INTEGER DEFAULT 0,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 管理员用户表
CREATE TABLE IF NOT EXISTS public.admin_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_music_tracks_order ON public.music_tracks(display_order);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON public.admin_users(username);

-- RLS
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 音乐曲目策略（公开读取，仅管理员写入）
DO $ BEGIN
  CREATE POLICY "Music tracks select" ON public.music_tracks FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $;

DO $ BEGIN
  CREATE POLICY "Music tracks insert" ON public.music_tracks FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $;

DO $ BEGIN
  CREATE POLICY "Music tracks update" ON public.music_tracks FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $;

DO $ BEGIN
  CREATE POLICY "Music tracks delete" ON public.music_tracks FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $;

-- 管理员用户策略（允许所有人读取，由应用层控制权限）
DO $ BEGIN
  CREATE POLICY "Admin users select" ON public.admin_users FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $;

DO $ BEGIN
  CREATE POLICY "Admin users insert" ON public.admin_users FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $;

DO $ BEGIN
  CREATE POLICY "Admin users update" ON public.admin_users FOR UPDATE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $;

DO $ BEGIN
  CREATE POLICY "Admin users delete" ON public.admin_users FOR DELETE USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $;

-- 创建默认管理员账户（密码: admin123，请在生产环境中修改）
-- 密码哈希使用 bcrypt 生成
-- INSERT INTO public.admin_users (username, password_hash) 
-- VALUES ('admin', '$2a$10$your_bcrypt_hash_here')
-- ON CONFLICT (username) DO NOTHING;


-- ============================================
-- Supabase Storage Buckets 配置
-- 需要在 Supabase Dashboard 中手动创建
-- ============================================

-- 1. 创建 music-covers bucket（存储音乐封面图片）
-- INSERT INTO storage.buckets (id, name, public) VALUES ('music-covers', 'music-covers', true);

-- 2. 创建 music-audio bucket（存储音频文件）
-- INSERT INTO storage.buckets (id, name, public) VALUES ('music-audio', 'music-audio', true);

-- Storage 策略（允许公开读取，仅认证用户上传）
-- 在 Supabase Dashboard -> Storage -> Policies 中配置：

-- music-covers bucket 策略:
-- SELECT: 允许所有人 (true)
-- INSERT: 允许所有人 (true) - 由 API 层控制权限
-- UPDATE: 允许所有人 (true) - 由 API 层控制权限
-- DELETE: 允许所有人 (true) - 由 API 层控制权限

-- music-audio bucket 策略:
-- SELECT: 允许所有人 (true)
-- INSERT: 允许所有人 (true) - 由 API 层控制权限
-- UPDATE: 允许所有人 (true) - 由 API 层控制权限
-- DELETE: 允许所有人 (true) - 由 API 层控制权限
