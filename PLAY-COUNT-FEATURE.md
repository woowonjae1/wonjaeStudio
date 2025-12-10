# 播放次数实时更新功能

## ✅ 功能说明

### 1. 播放次数统计

- **自动计数**：当用户播放歌曲超过 30 秒或播放到一半（取较小值）时，自动计数
- **防止重复计数**：同一次播放只计数一次
- **持久化存储**：使用 localStorage 保存数据，刷新页面不会丢失

### 2. 显示位置

#### About 区域

- 显示总播放次数
- 格式：50K+, 1.2M+ 等
- 实时更新

#### 音乐卡片

- 每首歌显示独立的播放次数
- 只有播放过的歌曲才显示
- 格式：123 plays, 1.2K plays 等

### 3. 数据存储

使用 localStorage 存储两种数据：

```javascript
// 每首歌的播放次数
{
  "Crush": 15,
  "傍晚的 Romantic": 23,
  "Nobody Gets Me": 8,
  "Can't Chat With You": 12
}

// 总播放次数
50058
```

### 4. 计数规则

播放次数在以下情况下增加：

- ✅ 播放时间 ≥ 30 秒
- ✅ 或播放进度 ≥ 50%（对于短于 1 分钟的歌曲）
- ❌ 快速切歌不计数
- ❌ 同一次播放只计数一次

### 5. 格式化显示

```
0-999:     显示原数字 (123)
1,000-999,999:  显示 K (1.2K, 15.3K)
1,000,000+:     显示 M (1.2M, 5.8M)
```

## 🎯 使用示例

### 查看总播放次数

1. 滚动到 About 区域
2. 查看 "Plays" 统计数字
3. 每次播放歌曲后会自动更新

### 查看单曲播放次数

1. 在音乐卡片区域
2. 播放过的歌曲会显示 "X plays"
3. 未播放的歌曲不显示

### 测试功能

1. 播放任意歌曲超过 30 秒
2. 查看控制台日志：`Play counted for: [歌曲名]`
3. 刷新页面，数据仍然保留

## 🔧 技术实现

### 文件结构

```
src/
├── lib/
│   └── playCountStorage.ts      # 播放次数存储逻辑
├── contexts/
│   └── MusicPlayerContext.tsx   # 播放器上下文（包含计数逻辑）
└── components/
    ├── AboutSection/            # 显示总播放次数
    └── MusicCards/              # 显示单曲播放次数
```

### 核心函数

```typescript
// 获取播放次数
getPlayCounts(): PlayCounts
getTotalPlays(): number
getTrackPlayCount(trackTitle: string): number

// 增加播放次数
incrementPlayCount(trackTitle: string): void

// 格式化显示
formatPlayCount(count: number): string
```

## 📊 数据管理

### 清除数据

如果需要重置播放次数，在浏览器控制台执行：

```javascript
localStorage.removeItem("woowonjae_play_counts");
localStorage.removeItem("woowonjae_total_plays");
```

### 查看当前数据

在浏览器控制台执行：

```javascript
// 查看所有歌曲播放次数
JSON.parse(localStorage.getItem("woowonjae_play_counts"));

// 查看总播放次数
localStorage.getItem("woowonjae_total_plays");
```

### 手动设置播放次数

在浏览器控制台执行：

```javascript
// 设置总播放次数为 100,000
localStorage.setItem("woowonjae_total_plays", "100000");

// 刷新页面查看效果
location.reload();
```

## 🎨 样式特点

- **微妙显示**：播放次数使用较小的字体和低透明度
- **高级感**：使用等宽数字字体（tabular-nums）
- **一致性**：与整体暗黑主题保持一致

## 🚀 未来扩展

可以考虑添加：

- 后端 API 集成（真实的播放统计）
- 播放历史记录
- 最受欢迎的歌曲排行
- 播放趋势图表
- 分享播放成就
