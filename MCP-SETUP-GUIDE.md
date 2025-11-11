# VS Code Copilot 配置 MCP 服务指南

本指南将帮助你在VS Code的GitHub Copilot中配置以下MCP (Model Context Protocol) 服务：
- Context7
- Sequential Thinking
- Feedback Enhanced

## 前提条件

1. 已安装 VS Code
2. 已安装 GitHub Copilot 扩展
3. 已登录 GitHub Copilot 账号

## 配置步骤

### 方法一：通过 VS Code 设置界面

1. **打开设置**
   - 按 `Ctrl + ,` (Windows/Linux) 或 `Cmd + ,` (Mac)
   - 或点击 `文件` > `首选项` > `设置`

2. **搜索 MCP 设置**
   - 在搜索框中输入 `copilot.mcp` 或 `github.copilot`
   - 找到 `GitHub Copilot: MCP Servers` 设置

3. **添加 MCP 服务**
   点击 "在 settings.json 中编辑"

### 方法二：直接编辑 settings.json（推荐）

1. **打开 settings.json**
   - 按 `Ctrl + Shift + P` (Windows/Linux) 或 `Cmd + Shift + P` (Mac)
   - 输入 `Preferences: Open User Settings (JSON)`
   - 按 Enter

2. **添加 MCP 配置**

在 `settings.json` 文件中添加以下配置：

```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-context7"],
      "env": {
        "CONTEXT7_API_KEY": "your-context7-api-key-here"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "feedback-enhanced": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-feedback-enhanced"]
    }
  }
}
```

### 配置说明

#### Context7
- **功能**: 提供增强的上下文理解能力
- **需要**: API密钥
- **获取API密钥**: 访问 [Context7官网](https://context7.ai) 注册并获取API密钥
- **配置**: 将 `your-context7-api-key-here` 替换为你的实际API密钥

#### Sequential Thinking
- **功能**: 提供序列化思考能力，帮助Copilot进行逐步推理
- **优势**: 提高复杂问题的解决能力
- **无需API密钥**: 直接启用即可

#### Feedback Enhanced
- **功能**: 增强反馈机制，提供更智能的代码建议
- **优势**: 根据你的反馈持续优化建议质量
- **无需API密钥**: 直接启用即可

## 验证配置

1. **重启 VS Code**
   - 关闭所有VS Code窗口
   - 重新打开VS Code

2. **检查MCP服务状态**
   - 按 `Ctrl + Shift + P` / `Cmd + Shift + P`
   - 输入 `GitHub Copilot: Show Chat`
   - 在聊天窗口中，你应该能看到配置的MCP服务

3. **测试功能**
   ```
   在Copilot Chat中输入：
   "使用sequential thinking帮我分析这段代码的优化方案"
   ```

## 常见问题

### 1. MCP服务无法启动

**解决方法**:
```bash
# 确保Node.js已安装
node --version

# 确保npx可用
npx --version

# 手动安装MCP包（可选）
npm install -g @modelcontextprotocol/server-context7
npm install -g @modelcontextprotocol/server-sequential-thinking
npm install -g @modelcontextprotocol/server-feedback-enhanced
```

### 2. Context7 API密钥无效

**解决方法**:
- 检查API密钥是否正确复制
- 确认API密钥是否已激活
- 访问Context7控制台检查配额

### 3. 找不到 MCP 设置选项

**解决方法**:
- 确保GitHub Copilot扩展已更新到最新版本
- 检查是否为Copilot Chat或Copilot Pro订阅用户
- 部分MCP功能可能需要特定的Copilot计划

## 高级配置

### 配置日志输出

```json
{
  "github.copilot.chat.mcp.servers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-context7"],
      "env": {
        "CONTEXT7_API_KEY": "your-api-key",
        "DEBUG": "mcp:*"
      }
    }
  }
}
```

### 设置超时时间

```json
{
  "github.copilot.chat.mcp.timeout": 30000,  // 30秒
  "github.copilot.chat.mcp.servers": {
    // ... 服务配置
  }
}
```

## 使用技巧

### 1. 利用Sequential Thinking

在复杂问题前加入提示：
```
@copilot 使用sequential thinking，一步步帮我：
1. 分析当前代码结构
2. 找出性能瓶颈
3. 提供优化方案
```

### 2. 利用Context7增强上下文

```
@copilot 考虑整个项目的上下文，帮我重构这个组件
```

### 3. 利用Feedback Enhanced

主动提供反馈：
```
这个建议很好，但我需要更简洁的写法
```

## 更多资源

- [GitHub Copilot 文档](https://docs.github.com/en/copilot)
- [MCP 协议规范](https://modelcontextprotocol.io)
- [VS Code 扩展市场](https://marketplace.visualstudio.com/)

## 注意事项

⚠️ **重要提示**:
1. 某些MCP服务可能需要付费订阅
2. API密钥请妥善保管，不要提交到版本控制系统
3. 建议使用环境变量管理敏感信息
4. 定期检查MCP服务的更新和变更

## 故障排除

如果遇到问题，请按以下步骤排查：

1. **查看输出日志**
   - 打开 `查看` > `输出`
   - 选择 `GitHub Copilot` 或 `GitHub Copilot Chat`

2. **清除缓存**
   ```bash
   # 删除Copilot缓存
   rm -rf ~/.vscode/extensions/github.copilot-*/
   ```

3. **重新安装Copilot扩展**
   - 卸载 GitHub Copilot 扩展
   - 重启 VS Code
   - 重新安装扩展

---

**最后更新**: 2025年10月21日
**版本**: 1.0.0
