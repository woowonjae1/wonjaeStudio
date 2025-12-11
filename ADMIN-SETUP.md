# 后台管理系统部署指南

## 1. 环境变量配置

在 `.env.local` 文件中添加以下变量：

```env
# 已有的 Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 新增：JWT 密钥（用于管理员认证）
JWT_SECRET=your-super-secret-key-at-least-32-characters
```

> ⚠️ `JWT_SECRET` 必须是一个强密钥，建议至少 32 个字符

---

## 2. 数据库配置

### 2.1 运行数据库迁移

在 Supabase Dashboard 的 SQL Editor 中运行 `database-migrations.sql` 文件中的 SQL 语句。

这将创建以下表：

- `music_tracks` - 音乐曲目表
- `admin_users` - 管理员用户表

### 2.2 创建管理员账户

在 Supabase SQL Editor 中运行以下命令创建管理员账户：

```sql
-- 密码: admin123 (请在生产环境中修改)
INSERT INTO public.admin_users (username, password_hash)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT (username) DO NOTHING;
```

> 上面的密码哈希对应密码 `admin123`

### 2.3 自定义密码

如果你想使用自定义密码，可以使用以下 Node.js 代码生成哈希：

```javascript
const bcrypt = require("bcryptjs");
const password = "你的密码";
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

然后用生成的哈希替换上面 SQL 中的 `password_hash` 值。

---

## 3. Supabase Storage 配置

### 3.1 创建存储桶

在 Supabase Dashboard → Storage 中创建两个存储桶：

1. **music-covers** - 用于存储音乐封面图片
2. **music-audio** - 用于存储音频文件

### 3.2 配置存储策略

对于每个存储桶，添加以下策略：

**music-covers 策略：**

```sql
-- 允许公开读取
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'music-covers');

-- 允许上传（由 API 层控制权限）
CREATE POLICY "Allow Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'music-covers');

-- 允许删除
CREATE POLICY "Allow Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'music-covers');
```

**music-audio 策略：**

```sql
-- 允许公开读取
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'music-audio');

-- 允许上传
CREATE POLICY "Allow Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'music-audio');

-- 允许删除
CREATE POLICY "Allow Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'music-audio');
```

或者在 Supabase Dashboard → Storage → 选择桶 → Policies 中手动添加：

- SELECT: 允许所有人 (`true`)
- INSERT: 允许所有人 (`true`)
- DELETE: 允许所有人 (`true`)

---

## 4. 访问后台

部署完成后，访问以下地址：

- **本地开发**: `http://localhost:3000/admin/login`
- **生产环境**: `https://your-domain.com/admin/login`

默认登录凭据：

- 用户名: `admin`
- 密码: `admin123`

> ⚠️ 请在首次登录后立即修改密码！

---

## 5. 后台功能说明

| 页面     | 路径             | 功能                        |
| -------- | ---------------- | --------------------------- |
| 仪表盘   | `/admin`         | 查看统计数据和最近话题      |
| 音乐管理 | `/admin/music`   | 添加/编辑/删除/排序音乐曲目 |
| 话题管理 | `/admin/topics`  | 查看/删除/置顶社区话题      |
| 回复管理 | `/admin/replies` | 查看/删除社区回复           |

---

## 6. 故障排除

### 登录失败

- 检查 `JWT_SECRET` 环境变量是否设置
- 检查 Supabase 连接是否正常
- 检查 `admin_users` 表中是否有管理员记录

### 文件上传失败

- 检查 Storage 桶是否创建
- 检查 Storage 策略是否配置正确
- 检查文件大小是否超过限制

### 数据不显示

- 检查数据库表是否创建成功
- 检查 RLS 策略是否配置正确
- 查看浏览器控制台是否有错误

---

## 7. 安全建议

1. **修改默认密码** - 首次登录后立即修改 admin 密码
2. **使用强 JWT 密钥** - 生产环境使用随机生成的长密钥
3. **限制 Storage 大小** - 在 Supabase 中设置文件大小限制
4. **定期备份** - 定期备份数据库数据
