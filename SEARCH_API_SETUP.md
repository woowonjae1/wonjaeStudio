# 实时搜索功能设置指南

## 概述

该应用提供**多层级搜索**功能，支持以下搜索提供商：

| 提供商         | 优先级   | 需要 API 密钥 | 成本             | 特点                 |
| -------------- | -------- | ------------- | ---------------- | -------------------- |
| **Tavily**     | 1 (最高) | ✅ 可选       | 免费 1000 次/月  | 专为 AI 设计，最精准 |
| **Serper**     | 2        | ✅ 可选       | 免费 100 次/月   | Google 搜索结果      |
| **DuckDuckGo** | 3        | ❌ **否**     | **完全免费无限** | 隐私友好、无需认证   |
| **Bing**       | 4        | ✅ 可选       | 免费 1000 次/月  | 微软搜索             |
| **Google**     | 5        | ✅ 可选       | 付费             | 最全面               |
| **Jina**       | 6 (最低) | ❌ 否         | 免费             | 网页内容提取         |

---

## 快速开始（零配置 - 推荐）

**不需要配置任何东西！** 系统会自动使用 **DuckDuckGo**，完全免费且无需任何 API 密钥。

```bash
npm run dev
```

在聊天界面启用 **"🔍 网络搜索"** 复选框即可搜索。

✅ **优点**：

- 无需注册
- 无需 API 密钥
- 无限搜索次数
- 隐私保护
- 即插即用

---

## ⭐ DuckDuckGo - 零配置搜索（推荐新手）

**DuckDuckGo 是最简单的选择 - 无需任何配置！**

### 为什么选择 DuckDuckGo？

- ✅ **完全免费** - 无限搜索次数
- ✅ **无需注册** - 无需 API 密钥
- ✅ **隐私保护** - 不追踪用户
- ✅ **即插即用** - 开箱即用
- ✅ **稳定可靠** - 专业搜索引擎

### 使用方法

1. **无需任何配置** - 开箱即用
2. 启动应用：`npm run dev`
3. 打开聊天页面
4. 勾选 **"🔍 网络搜索"** 复选框
5. 输入问题并发送

**就这么简单！** 搜索功能立即可用。

---

## 📋 可选 API 密钥配置

如果想要更好的搜索体验，可以配置以下可选的 API 密钥。

### 1. Tavily API（推荐 - 专为 AI 设计）

**最精准、最快的 AI 搜索**

#### 获取步骤：

1. 访问 [https://tavily.com/](https://tavily.com/)
2. 注册免费账户
3. 获取 API 密钥（每月 1000 次免费搜索）

#### 配置：

在项目根目录创建或编辑 `.env.local` 文件：

```env
TAVILY_API_KEY=your_tavily_api_key_here
```

### 2. Serper API

**Google 搜索结果，每月 100 次免费**

#### 获取步骤：

1. 访问 [https://serper.dev/](https://serper.dev/)
2. 注册免费账户
3. 复制 API 密钥

#### 配置：

```env
SERPER_API_KEY=your_serper_api_key_here
```

### 3. Bing 搜索 API

**Microsoft 提供，每月 1000 次免费搜索**

#### 获取步骤：

1. 访问 [https://www.bing.com/webmaster/](https://www.bing.com/webmaster/)
2. 进入 "Webmaster Tools"
3. 创建搜索应用，获取 API 密钥

#### 配置：

```env
BING_SEARCH_KEY=your_bing_search_key
```

### 4. Google/SerpStack

**Google 搜索结果，但需要付费**

#### 获取步骤：

1. 访问 [https://serpstack.com/](https://serpstack.com/)
2. 注册免费账户（100 次/月）
3. 获取 API 密钥

#### 配置：

```env
SERPSTACK_API_KEY=your_serpstack_api_key
```

---

## 完整配置示例

创建 `.env.local` 文件：

```env
# 可选：高质量搜索
SERPER_API_KEY=abc123def456

# 可选：备选搜索
BING_SEARCH_KEY=xyz789uvw456

# 可选：Google 搜索
SERPSTACK_API_KEY=abc123xyz789
```

## 搜索优先级

系统会按以下顺序尝试，确保总能找到搜索结果：

1. **Tavily** ← 如果配置且有结果（最精准）
2. **Serper** ← 如果配置且有结果（Google 搜索）
3. **DuckDuckGo** ← 总是可用（无需配置，免费无限）
4. **Bing** ← 如果配置且有结果
5. **Google** ← 如果配置且有结果
6. **Jina** ← 最后备选（网页内容提取）

**关键点**：即使不配置任何 API 密钥，**DuckDuckGo 也会自动接管**，提供免费的搜索体验。

---

## 使用搜索功能

### 在聊天界面启用搜索：

1. 打开聊天页面
2. 在输入框左侧勾选 **"🔍 网络搜索"**
3. 输入问题并发送
4. 系统会先搜索实时信息，然后结合模型知识生成回答

### 搜索状态指示：

- ✅ **绿色**：搜索成功找到结果
- ⚠️ **黄色**：搜索失败，使用本地知识
- 💡 **蓝色**：当前模型不支持搜索（仅 KAT-Coder-Pro 和 Qwen 支持）

---

## 测试搜索功能

运行测试脚本验证搜索是否工作：

```bash
node test-search-realtime.js
```

预期输出（使用 DuckDuckGo）：

```
✓ 搜索成功！
状态码: 200
查询词: AI news
结果数: 5
```

---

## 常见问题

### Q: 没有 API 密钥可以用吗？

**A:** 完全可以！**DuckDuckGo 完全免费无需任何密钥**。无限搜索次数，隐私保护，立即可用。这是推荐的快速开始方式。

### Q: DuckDuckGo 需要注册吗？

**A:** 不需要！完全无需任何注册或认证。只需启动应用即可搜索。

### Q: 搜索结果为何较少？

**A:**

- DuckDuckGo JSON API 返回的搜索结果有限
- 解决方案：配置 Tavily 或 Serper 获得更多结果
- 或者 DuckDuckGo 可能对某些查询没有结果

### Q: 为什么搜索失败？

**A:** 检查以下几点：

- 网络连接是否正常（`ping 8.8.8.8`）
- 如果配置了 API 密钥，检查密钥是否正确
- 尝试不同的搜索词
- 查看浏览器控制台日志

### Q: 哪个 API 最划算？

**A:**

- **完全免费无限**：DuckDuckGo（最佳选择）
- **最佳付费 AI**：Tavily（1000 次/月 免费）
- **最便宜付费**：Serper（100 次/月 免费，$2.50/月 起）
- **企业级**：Google（按需付费）

### Q: 可以同时使用多个 API 吗？

**A:** 可以！系统会按优先级自动尝试。如果 Tavily 失败，会自动切换到 Serper，再到 DuckDuckGo。

### Q: 搜索会影响应用性能吗？

**A:** 不会。搜索在后台异步进行，有超时保护（8-10 秒）。如果超时，系统会自动回退到本地知识。

---

## 故障排除

### 搜索总是返回 0 结果

1. **检查网络**：

   ```bash
   ping 8.8.8.8
   ```

2. **手动测试 API**：

   ```bash
   # DuckDuckGo（无需密钥）
   curl -X POST http://localhost:3000/api/chat/search \
     -H "Content-Type: application/json" \
     -d '{"query":"AI"}'
   ```

3. **检查服务器日志**：查看 `npm run dev` 的终端输出

### 特定搜索提供商无法工作

检查 `.env.local` 中的 API 密钥是否正确，然后查看服务器日志中的错误消息。

---

## 推荐配置

### 对于个人用户（最佳免费体验）✅ **推荐**

```env
# 无需配置任何东西！
# DuckDuckGo 已默认启用
# 完全免费、无限搜索、隐私保护
```

只需 `npm run dev`，立即可用。

### 对于追求性能的用户（最佳搜索质量）

```env
TAVILY_API_KEY=your_key  # 最优先：AI 专用搜索
SERPER_API_KEY=your_key  # 备选：Google 搜索
```

### 对于生产环境（企业级配置）

```env
TAVILY_API_KEY=your_key          # 主要搜索源（最精准）
SERPER_API_KEY=your_key          # 备选源（Google）
BING_SEARCH_KEY=your_key         # 三级备选（Microsoft）
SERPSTACK_API_KEY=your_key       # 四级备选（Google 付费）
```

---

## 更新日志

- **v1.0** (2025-11-11)
  - ✅ 添加 Serper 支持（最优先）
  - ✅ 改进 DuckDuckGo HTML 解析
  - ✅ 多层级回退机制
  - ✅ 自动超时处理（8-10 秒）
  - ✅ 完全零配置支持

---

**需要帮助？** 查看 `/api/chat/search` 的完整 API 文档或检查浏览器控制台日志。
