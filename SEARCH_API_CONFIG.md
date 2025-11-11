# 搜索 API 配置指南

## 概述

项目集成了多源网络搜索功能，支持以下搜索提供商：

### 搜索提供商优先级

1. **DuckDuckGo JSON API** ✅ (推荐)
   - 状态：始终可用
   - 认证：无需 API 密钥
   - 超时：8 秒
   - 费用：免费
   - 优点：稳定，无需配置

2. **Bing Search API** (可选)
   - 认证：需要 `BING_SEARCH_KEY`
   - 超时：8 秒
   - 费用：付费服务
   - 优点：结果准确性高

3. **Google Search (SerpStack)** (可选)
   - 认证：需要 `SERPSTACK_API_KEY`
   - 超时：8 秒
   - 费用：付费服务
   - 优点：Google 搜索结果

4. **Jina AI Search** (备选)
   - 状态：始终可用
   - 认证：无需 API 密钥
   - 超时：8 秒
   - 费用：免费
   - 优点：当其他方案失败时使用

## 安装和配置

### 前置要求

- Node.js 18+
- npm 或 yarn

### 基础配置（无需任何 API 密钥）

```bash
# 克隆项目
git clone <repository>
cd wonjaeStudio

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

**此时搜索功能已可用，使用 DuckDuckGo 和 Jina 作为备选方案。**

### 可选配置

#### 配置 Bing Search API

1. 访问 [Bing Search API](https://www.microsoft.com/en-us/bing/apis/bing-web-search-api)
2. 申请免费试用或订阅付费计划
3. 获取 API 密钥
4. 在 `.env.local` 中添加：

```env
BING_SEARCH_KEY=your_bing_api_key_here
```

#### 配置 Google Search (SerpStack)

1. 访问 [SerpStack](https://serpstack.com/)
2. 注册账户
3. 获取 API 密钥
4. 在 `.env.local` 中添加：

```env
SERPSTACK_API_KEY=your_serpstack_api_key_here
```

## 使用方法

### API 端点

#### 获取搜索 API 状态

```bash
curl http://localhost:3000/api/chat/search
```

响应示例：

```json
{
  "message": "搜索 API 已启用",
  "status": "正常",
  "providers": {
    "duckduckgo": {
      "name": "DuckDuckGo JSON API",
      "status": "✅ 始终可用",
      "priority": 1
    },
    ...
  }
}
```

#### 执行搜索

```bash
curl -X POST http://localhost:3000/api/chat/search \
  -H "Content-Type: application/json" \
  -d '{"query": "你的搜索词"}'
```

响应示例：

```json
{
  "query": "你的搜索词",
  "results": [
    {
      "title": "结果标题",
      "url": "https://example.com",
      "description": "结果描述",
      "source": "DuckDuckGo"
    }
  ],
  "count": 3,
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

### 在聊天中启用搜索

1. 打开聊天界面（`/chat`）
2. 勾选 "🔍 启用网络搜索" 复选框
3. 发送消息
4. 系统将自动搜索网络信息并融合到回答中

## 常见问题

### Q: 搜索返回空结果怎么办？

**A:** 可能的原因和解决方案：

1. **网络连接问题**
   - 检查网络连接
   - 检查防火墙设置

2. **所有提供商都失败**
   - 查看服务器日志
   - 重启开发服务器
   - 尝试搜索不同的查询词

3. **特定提供商失败**
   - 检查 API 密钥是否正确
   - 检查 API 配额是否已用完
   - 查看提供商的服务状态页面

### Q: 如何调试搜索问题？

**A:** 在 `src/app/api/chat/search/route.ts` 中查看日志：

```
[搜索] 开始搜索: "搜索词"
[搜索] 使用 DuckDuckGo 找到 3 个结果
```

### Q: 搜索超时了怎么办？

**A:**

- 各个搜索提供商的超时时间设置为 8 秒
- 如果经常超时，考虑配置付费搜索 API（Bing 或 SerpStack）
- 检查网络连接质量

### Q: 如何改进搜索结果质量？

**A:** 优先级排列：

1. 配置 Bing Search API（最可靠）
2. 配置 Google Search (SerpStack)
3. 使用默认的 DuckDuckGo（免费）

### Q: 搜索结果被缓存了吗？

**A:** 是的，搜索结果被缓存 1 小时。在 `src/app/api/chat/search/route.ts` 中修改：

```typescript
headers: {
  'Cache-Control': 'public, max-age=3600', // 改为你想要的秒数
}
```

## 环境变量

| 变量名              | 必需 | 描述                   |
| ------------------- | ---- | ---------------------- |
| `BING_SEARCH_KEY`   | ❌   | Bing Search API 密钥   |
| `SERPSTACK_API_KEY` | ❌   | SerpStack API 密钥     |
| `NODE_ENV`          | ❌   | 开发环境 (development) |

## 性能优化

### 缓存策略

- 搜索结果缓存 1 小时
- 相同查询不会重复调用 API

### 超时设置

- 所有网络请求都有 8 秒超时
- 防止长时间挂起

### 并行搜索

- 支持多个搜索提供商同时尝试
- 第一个成功的结果会被使用

## 故障排查

### 日志位置

- 服务器日志：终端输出
- 浏览器控制台：`F12` -> Console

### 常见错误

| 错误                      | 原因                 | 解决方案           |
| ------------------------- | -------------------- | ------------------ |
| `ConnectTimeoutError`     | 网络连接超时         | 检查网络，重试     |
| `UND_ERR_CONNECT_TIMEOUT` | 无法连接到搜索提供商 | 检查 API 状态      |
| 搜索返回空结果            | 所有提供商都失败     | 查看日志，检查配置 |

## 支持的搜索提供商 API

### DuckDuckGo JSON API

```
GET https://api.duckduckgo.com/?q=query&format=json
```

### Bing Search API

```
GET https://api.bing.microsoft.com/v7.0/search?q=query
Header: Ocp-Apim-Subscription-Key: YOUR_KEY
```

### SerpStack

```
GET http://api.serpstack.com/search?access_key=KEY&query=query
```

## 许可证

- DuckDuckGo：免费使用
- Bing：需要付费订阅
- SerpStack：需要付费订阅
- Jina：免费使用

## 更多资源

- [DuckDuckGo API 文档](https://duckduckgo.com/api)
- [Bing Search API 文档](https://docs.microsoft.com/en-us/bing/search-apis/bing-web-search/overview)
- [SerpStack 文档](https://serpstack.com/documentation)
