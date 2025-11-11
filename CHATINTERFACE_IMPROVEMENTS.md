# ChatInterface 改进说明

## 新增功能

### 1. 模型信息显示

右侧边栏现在显示正在使用的模型的详细信息：

- **模型名称**：使用的模型名称（例：万擎 AI）
- **提供商**：模型提供商（例：Wanqing）
- **版本**：模型版本号
- **模型 ID**：完整的模型标识符（缩短显示）

### 2. 对话历史统计

实时追踪对话的进度：

- **当前轮次**：当前是第几轮对话
- **总消息数**：历史对话中的总消息数
- **用户消息**：用户发送的消息数
- **AI 回复**：AI 回复的消息数

### 3. Token 计数

详细的 token 使用统计：

- **本次使用**：最后一条消息使用的 token 数
- **总使用**：整个对话过程中使用的总 token 数
- **进度条**：可视化显示 token 使用比例
- **预计限制**：显示相对于 1000 tokens 的使用百分比

### 4. 网络搜索错误处理

改进的搜索错误提示：

- 显示搜索状态（搜索中...）
- 显示搜索错误信息
- 搜索失败时会自动降级到本地知识
- 在响应中包含搜索结果统计

## API 响应格式

### 增强的响应体

```json
{
  "reply": "AI 回复的内容",
  "tokens": {
    "prompt": 150, // 输入 token 数
    "completion": 50, // 输出 token 数
    "total": 200 // 总 token 数
  },
  "model": {
    "id": "ep-xxxx", // 模型 ID
    "name": "万擎 AI", // 模型名称
    "provider": "Wanqing", // 提供商
    "version": "1.0" // 版本
  },
  "conversation": {
    "currentTurn": 5, // 当前轮次
    "totalMessages": 8, // 总消息数
    "userMessages": 4, // 用户消息数
    "assistantMessages": 4 // AI 回复数
  },
  "search": {
    "enabled": true, // 是否启用搜索
    "resultsCount": 3, // 搜索结果数
    "resultsSources": ["DuckDuckGo"] // 搜索来源
  },
  "timestamp": "2025-01-01T12:00:00Z",
  "success": true,
  "mode": "non-stream"
}
```

## 使用示例

### 请求格式

```bash
POST /api/chat
Content-Type: application/json

{
  "message": "用户输入的消息",
  "conversationHistory": [
    {
      "role": "user",
      "content": "之前的用户消息"
    },
    {
      "role": "assistant",
      "content": "之前的 AI 回复"
    }
  ],
  "enableSearch": true
}
```

### 前端集成

ChatInterface 组件会自动：

1. 收集用户消息
2. 维护对话历史
3. 启用网络搜索（如果勾选）
4. 接收并处理 API 响应
5. 更新模型信息和统计数据
6. 显示 token 使用情况

## 状态管理

### 新增状态变量

```typescript
const [modelInfo, setModelInfo] = useState<any>(null); // 模型信息
const [conversationStats, setConversationStats] = useState<any>(null); // 对话统计
const [totalTokensUsed, setTotalTokensUsed] = useState(0); // 总 token 使用数
const [searching, setSearching] = useState(false); // 搜索状态
const [searchError, setSearchError] = useState<string | null>(null); // 搜索错误
```

## UI 组件

### 右侧边栏信息面板

| 面板       | 颜色 | 显示内容                         |
| ---------- | ---- | -------------------------------- |
| 模型信息   | 紫色 | 模型名称、提供商、版本、ID       |
| 对话统计   | 蓝色 | 轮次、总消息、用户消息、AI 回复  |
| Token 统计 | 橙色 | 本次使用、总使用、进度条、百分比 |
| 功能状态   | 绿色 | 实时对话、网络搜索、代码分析     |

### 搜索状态提示

| 状态     | 显示                    | 颜色   |
| -------- | ----------------------- | ------ |
| 搜索中   | 🔍 正在搜索网络信息...  | 蓝色   |
| 搜索失败 | ⚠️ 搜索失败: [错误信息] | 琥珀色 |
| 无结果   | ⚠️ 搜索未找到相关结果   | 琥珀色 |

## 对话流程

### 完整的消息流程

```
1. 用户输入消息并点击发送
   ↓
2. 消息添加到 UI
   ↓
3. 如果启用搜索：
   ├─ 显示搜索加载状态
   ├─ 调用搜索 API
   └─ 显示搜索结果或错误
   ↓
4. 调用 Chat API
   ├─ 发送用户消息和历史
   └─ 等待响应
   ↓
5. 接收响应
   ├─ 提取 reply（AI 回复）
   ├─ 更新 modelInfo（模型信息）
   ├─ 更新 conversationStats（对话统计）
   ├─ 累加 totalTokensUsed（token 计数）
   └─ 显示 AI 回复
   ↓
6. 更新 UI
   ├─ 右侧边栏显示最新信息
   ├─ 消息区域添加新回复
   └─ 清空搜索错误提示
```

## 数据持久化

### 当前数据管理

- **消息**：存储在 `messages` 状态中
- **对话历史**：存储在 `conversationHistory` 状态中
- **Token 统计**：存储在 `totalTokensUsed` 状态中
- **模型信息**：存储在 `modelInfo` 状态中（来自 API 响应）

### 新对话重置

点击"新对话"按钮时，以下数据会被重置：

- 所有消息
- 对话历史
- 模型信息
- 对话统计
- Token 统计
- 搜索错误

## 错误处理

### 搜索 API 错误

搜索错误会自动处理：

1. 显示错误提示给用户
2. 继续进行对话（不会中断）
3. AI 会使用本地知识回答

### Chat API 错误

Chat API 错误会：

1. 捕获异常
2. 显示错误消息
3. 在右侧边栏显示模型信息（如果可用）

## 性能优化

### 优化措施

1. **Token 计数**：只在接收响应时更新，避免频繁计算
2. **搜索超时**：设置 15 秒超时，防止搜索请求阻塞
3. **状态更新**：使用函数式更新避免竞态条件
4. **缓存**：搜索结果缓存 1 小时

## 测试检查清单

- [ ] 模型信息正确显示
- [ ] Token 计数准确
- [ ] 对话统计正确
- [ ] 搜索错误正确处理
- [ ] 新对话重置所有数据
- [ ] 复制回复功能正常
- [ ] 停止输出功能正常
- [ ] 网络搜索切换正常
- [ ] 响应速度在 5 秒以内

## 后续改进建议

1. **本地存储**：保存对话历史到 localStorage
2. **导出功能**：支持导出对话记录
3. **统计图表**：显示 token 使用趋势
4. **模型切换**：支持在对话中切换模型
5. **搜索过滤**：允许选择搜索来源
6. **语言支持**：多语言界面
7. **深色模式**：支持深色主题
