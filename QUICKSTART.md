# 快速开始指南

## 🚀 5 分钟快速上手

### 安装依赖

```bash
pnpm install
```

### 方式一：单机编辑器模式

最简单的使用方式，无需启动服务器。

```bash
# 启动开发服务器
pnpm dev
```

访问 http://localhost:3000，默认显示**单机编辑器**模式。

**功能**：
- ✅ 所有富文本编辑功能
- ✅ 格式化：加粗、斜体、下划线、删除线
- ✅ 标题：H1、H2、H3
- ✅ 列表：有序列表、无序列表、嵌套列表
- ✅ 对齐：左对齐、居中、右对齐、两端对齐
- ✅ 代码块
- ✅ 撤销/重做

### 方式二：协作编辑器模式

体验多人实时协作功能。

**步骤 1: 启动 WebSocket 服务器**

打开**终端 1**，运行：

```bash
pnpm server
```

你会看到：
```
WebSocket server running on port 1234
ws://localhost:1234
```

**步骤 2: 启动前端**

打开**终端 2**，运行：

```bash
pnpm dev
```

**步骤 3: 切换到协作模式**

1. 访问 http://localhost:3000
2. 点击顶部的 **"协作编辑器"** 按钮
3. 输入你的用户名（例如：Alice）

**步骤 4: 测试多人协作**

1. 在新的浏览器标签页中打开 http://localhost:3000
2. 同样切换到"协作编辑器"
3. 输入不同的用户名（例如：Bob）
4. 在一个标签页中编辑，另一个标签页会实时同步 ✨

**协作功能**：
- ✅ 实时同步（<1 秒延迟）
- ✅ 在线用户列表
- ✅ 光标位置显示
- ✅ 网络状态监控
- ✅ 离线编辑支持

## ⌨️ 键盘快捷键

### 文本格式

| 功能 | Windows/Linux | Mac |
|------|---------------|-----|
| 加粗 | Ctrl+B | ⌘+B |
| 斜体 | Ctrl+I | ⌘+I |
| 下划线 | Ctrl+U | ⌘+U |
| 删除线 | Ctrl+Shift+X | ⌘+Shift+X |

### 标题

| 功能 | Windows/Linux | Mac |
|------|---------------|-----|
| 标题 1 | Ctrl+Alt+1 | ⌘+⌥+1 |
| 标题 2 | Ctrl+Alt+2 | ⌘+⌥+2 |
| 标题 3 | Ctrl+Alt+3 | ⌘+⌥+3 |

### 对齐

| 功能 | Windows/Linux | Mac |
|------|---------------|-----|
| 左对齐 | Ctrl+Shift+L | ⌘+Shift+L |
| 居中 | Ctrl+Shift+E | ⌘+Shift+E |
| 右对齐 | Ctrl+Shift+R | ⌘+Shift+R |

### 列表与代码

| 功能 | Windows/Linux | Mac |
|------|---------------|-----|
| 有序列表 | Ctrl+Shift+7 | ⌘+Shift+7 |
| 无序列表 | Ctrl+Shift+8 | ⌘+Shift+8 |
| 代码块 | Ctrl+Alt+C | ⌘+⌥+C |

### 编辑

| 功能 | Windows/Linux | Mac |
|------|---------------|-----|
| 撤销 | Ctrl+Z | ⌘+Z |
| 重做 | Ctrl+Shift+Z | ⌘+Shift+Z |

## 🔧 常见问题

### Q: 协作模式下连接状态显示"离线"？

**A**: 确保 WebSocket 服务器已启动：

```bash
# 在单独的终端运行
pnpm server
```

查看是否显示 "WebSocket server running on port 1234"

### Q: 两个标签页编辑不同步？

**A**: 检查以下几点：

1. WebSocket 服务器是否运行
2. 浏览器控制台是否有错误
3. 网络状态指示器是否显示"已连接"（绿色）
4. 两个标签页使用的是否为相同文档 ID（默认是 `collab-doc-001`）

### Q: 如何在生产环境部署？

**A**:

1. **构建前端**：
   ```bash
   pnpm build
   ```
   构建产物在 `dist/` 目录

2. **部署 WebSocket 服务器**：
   - 将 `server/` 目录部署到云服务器
   - 运行 `node websocket-server.js`
   - 配置环境变量 `PORT` 设置端口号

3. **更新前端配置**：
   修改 `src/App.tsx` 中的 WebSocket URL：
   ```typescript
   wsUrl="wss://your-domain.com"  // 使用你的服务器地址
   ```

### Q: 如何自定义文档 ID？

**A**:

在 `src/App.tsx` 中修改：

```typescript
<CollaborativeEditor
  documentId="my-custom-doc-id"  // 自定义文档 ID
  wsUrl="ws://localhost:1234"
  userName={userName}
/>
```

### Q: Bundle 大小警告？

**A**:

这是正常的。Bundle 包含完整的协作功能（Yjs、WebSocket、IndexedDB 等），大小约 188KB gzipped，符合预期。

如需优化，可以使用动态导入（Code Splitting）：

```typescript
// 懒加载协作编辑器
const CollaborativeEditor = React.lazy(() =>
  import('./examples/CollaborativeEditor')
)
```

## 📚 下一步

- 阅读 [README.md](./README.md) 了解完整功能
- 查看 [specs/](./specs/001-collaborative-doc-editor/) 了解技术细节
- 运行测试：`pnpm vitest run`
- 查看类型检查：`pnpm type-check`

## 🎯 开发建议

### 开发模式下的最佳实践

1. **开两个终端**：
   - 终端 1: `pnpm server`（WebSocket 服务器）
   - 终端 2: `pnpm dev`（前端开发服务器）

2. **测试协作**：
   - Chrome 普通窗口
   - Chrome 隐身窗口
   - 不同浏览器（Firefox、Safari）

3. **调试**：
   - 打开浏览器开发者工具
   - Network 标签查看 WebSocket 连接
   - Console 查看日志

### 推荐工作流

```bash
# 启动完整开发环境
pnpm server  # 终端 1
pnpm dev     # 终端 2

# 在浏览器打开多个标签页测试
# http://localhost:3000 (Alice)
# http://localhost:3000 (Bob)
```

---

💡 **提示**: 第一次使用时，建议先尝试**单机编辑器模式**熟悉功能，然后再体验**协作编辑器模式**。
