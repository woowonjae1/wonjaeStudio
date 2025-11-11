# Supabase 登录问题诊断和修复指南

## 🔴 问题：Failed to fetch 错误

当你看到 "Failed to fetch" 错误时，通常是以下原因之一：

## 📋 检查清单

### 1. ✅ 检查 Supabase 项目配置

#### 步骤 1: 获取 Supabase 凭证

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧 **Settings** (齿轮图标)
4. 点击 **API**
5. 复制以下信息：
   - **Project URL** (例如: `https://xxxxx.supabase.co`)
   - **anon public** key

#### 步骤 2: 创建 .env.local 文件

在项目根目录创建 `.env.local` 文件：

```bash
# 在项目根目录运行
cd C:\Loading\wonjaeStudio\wonjaeStudio
New-Item -ItemType File -Path .env.local
```

或直接创建文件，内容如下：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的anon-key

# 可选：服务端密钥（从 Settings > API > service_role key 获取）
SUPABASE_SERVICE_ROLE_KEY=你的service-role-key
```

**⚠️ 重要**: 
- 不要提交 `.env.local` 到 Git
- `.env.local` 已在 `.gitignore` 中
- 使用真实的项目凭证替换上面的值

### 2. ✅ 检查 Supabase 项目状态

1. **项目是否暂停？**
   - 免费计划的项目闲置一周会自动暂停
   - 访问 Dashboard 检查项目状态
   - 如果暂停，点击 "Resume" 恢复

2. **项目是否存在？**
   - 确认项目没有被删除
   - 检查 URL 是否正确

### 3. ✅ 检查网络和CORS配置

#### 在 Supabase Dashboard 中:

1. 进入 **Settings** > **API**
2. 向下滚动到 **CORS Configuration**
3. 确保包含你的开发域名：
   ```
   http://localhost:3000
   http://localhost:3001
   ```

#### 本地开发配置:

确保开发服务器运行在正确的端口：

```bash
npm run dev
```

检查是否有端口冲突。

### 4. ✅ 检查防火墙和代理

1. **防火墙设置**
   - 检查 Windows 防火墙是否阻止连接
   - 临时禁用防火墙测试

2. **VPN/代理**
   - 如果使用 VPN，尝试关闭
   - 检查代理设置

3. **公司网络**
   - 可能阻止外部 API 调用
   - 尝试使用其他网络（如手机热点）

### 5. ✅ 验证配置

运行以下命令检查配置：

```powershell
# 检查 .env.local 是否存在
Get-Content .env.local

# 检查环境变量是否加载
npm run dev
# 然后在浏览器控制台检查是否有警告信息
```

### 6. ✅ 测试 Supabase 连接

创建测试页面验证连接：

在浏览器控制台运行：

```javascript
// 打开 http://localhost:3000
// 按 F12 打开控制台
// 粘贴以下代码

fetch('https://你的项目ID.supabase.co/auth/v1/health', {
  method: 'GET',
  headers: {
    'apikey': '你的anon-key'
  }
})
.then(res => res.json())
.then(data => console.log('Supabase连接成功:', data))
.catch(err => console.error('连接失败:', err));
```

## 🔧 常见问题解决方案

### 问题 1: "Invalid API key"

**原因**: anon key 不正确

**解决**:
1. 重新从 Dashboard 复制 anon key
2. 确保没有多余的空格
3. 确保复制的是 "anon public" 而不是 "service_role"

### 问题 2: "CORS error"

**原因**: CORS 配置不正确

**解决**:
```bash
# Supabase Dashboard > Settings > API > CORS Configuration
# 添加:
http://localhost:3000
http://127.0.0.1:3000
```

### 问题 3: "Project paused"

**原因**: 免费项目自动暂停

**解决**:
1. 访问 Supabase Dashboard
2. 点击项目
3. 点击 "Resume project"
4. 等待几秒钟

### 问题 4: 网络超时

**原因**: 网络连接问题

**解决**:
1. 检查网络连接
2. 尝试访问 https://supabase.com
3. 更换网络（如使用手机热点）
4. 检查 DNS 设置

## 🚀 快速修复步骤

如果你之前能正常登录，现在不行了，按以下步骤：

### 步骤 1: 重启开发服务器

```powershell
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 步骤 2: 清除浏览器缓存

1. 按 `Ctrl + Shift + Delete`
2. 选择 "缓存的图片和文件"
3. 清除数据
4. 刷新页面

### 步骤 3: 检查 Supabase 项目状态

```powershell
# 使用 curl 测试连接 (需要安装 curl)
curl https://你的项目ID.supabase.co/rest/v1/

# 或使用 PowerShell
Invoke-WebRequest -Uri "https://你的项目ID.supabase.co/rest/v1/" -Method GET
```

### 步骤 4: 验证环境变量

在 `src/lib/supabase.ts` 顶部临时添加：

```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

检查浏览器控制台输出。

## 📝 更新后的代码改进

我已经对代码做了以下改进：

1. **增强错误处理** (`src/hooks/useAuth.ts`)
   - 更友好的错误消息
   - 区分不同的错误类型
   - 提供解决建议

2. **改进 Supabase 配置** (`src/lib/supabase.ts`)
   - 添加请求超时（10秒）
   - 更好的 fetch 配置
   - PKCE 认证流程

3. **修复 settings.json**
   - 修正 JSON 格式错误
   - 正确配置 MCP 服务

## 🔍 调试命令

```powershell
# 1. 检查 Node.js 版本
node --version

# 2. 检查 npm 包
npm list @supabase/supabase-js

# 3. 重新安装依赖
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# 4. 检查环境变量
Get-ChildItem Env:NEXT_PUBLIC_*

# 5. 测试网络连接
Test-NetConnection supabase.com -Port 443
```

## ⚡ 紧急恢复方案

如果以上都不行，使用本地模拟模式：

1. **不创建 .env.local**
2. 代码会自动使用 demo 模式
3. 功能有限但可以开发

## 📞 获取帮助

如果问题仍然存在：

1. **检查 Supabase 状态**
   - https://status.supabase.com

2. **查看浏览器控制台**
   - F12 > Console
   - F12 > Network (查看失败的请求)

3. **Supabase 社区**
   - https://github.com/supabase/supabase/discussions

## ✅ 成功标志

配置成功后，你应该看到：

1. **浏览器控制台** (F12)
   - 没有红色错误
   - 可能有黄色警告（正常）

2. **登录页面**
   - 可以输入邮箱密码
   - 点击登录后有反应
   - 错误消息清晰（如果有）

3. **网络请求** (F12 > Network)
   - 看到对 Supabase 的请求
   - 状态码 200 或其他非网络错误

---

**最后更新**: 2025年10月21日
**版本**: 1.0.0
