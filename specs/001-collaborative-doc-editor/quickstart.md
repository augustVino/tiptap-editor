# Quick Start: 多人协作文档编辑器

**Created**: 2025-10-17
**Purpose**: Phase 1 设计 - 开发者快速开始指南

## 概述

本指南帮助开发者快速搭建和运行多人协作文档编辑器。完成后，你将拥有一个功能完整的实时协作编辑器。

**预计时间**: 30 分钟

---

## 前置条件

确保你的开发环境已安装：

- **Node.js** 18+ ([下载](https://nodejs.org/))
- **pnpm** 10+ (运行 `npm install -g pnpm`)
- **Git** (用于版本控制)
- **现代浏览器** (Chrome 120+、Safari 17+、Firefox 120+)

---

## 第一步：安装依赖

```bash
# 克隆或进入项目目录
cd tiptap-editor

# 安装所有依赖
pnpm install

# 额外安装协作相关依赖（如果 package.json 中没有）
pnpm add yjs @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor
pnpm add y-websocket y-indexeddb

# 安装开发依赖
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

**预期输出**:
```
dependencies:
  @tiptap/core@2.25.0
  @tiptap/extension-collaboration@2.25.0
  @tiptap/extension-collaboration-cursor@2.25.0
  @tiptap/extension-table@2.25.0
  @tiptap/react@2.25.0
  @tiptap/starter-kit@2.25.0
  yjs@13.6.10
  y-websocket@1.5.4
  y-indexeddb@9.0.12
  ...
```

---

## 第二步：启动 WebSocket 服务器（协作后端）

协作功能需要一个 WebSocket 服务器用于同步。我们使用 Yjs 提供的轻量级服务器。

### 方案A：使用 npx 快速启动（推荐）

```bash
# 在新的终端窗口中运行
npx y-websocket-server --port 1234

# 预期输出：
# y-websocket-server running on ws://localhost:1234
```

### 方案B：自建服务器（可选，用于生产环境）

创建 `server/websocket.js`:

```javascript
const WebSocket = require('ws')
const http = require('http')
const Y = require('yjs')
const syncProtocol = require('y-protocols/sync')
const awarenessProtocol = require('y-protocols/awareness')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('WebSocket server is running')
})

const wss = new WebSocket.Server({ server })

const docs = new Map() // 存储文档

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const docName = url.pathname.slice(1)

  // 获取或创建文档
  let doc = docs.get(docName)
  if (!doc) {
    doc = { ydoc: new Y.Doc(), conns: new Set() }
    docs.set(docName, doc)
  }

  doc.conns.add(ws)

  // 发送初始状态
  const encoder = syncProtocol.createEncoder()
  syncProtocol.writeSyncStep1(encoder, doc.ydoc)
  ws.send(syncProtocol.encode(encoder))

  // 监听消息
  ws.on('message', (message) => {
    syncProtocol.readSyncMessage(message, encoder, doc.ydoc, ws)
    // 广播到其他客户端
    doc.conns.forEach((conn) => {
      if (conn !== ws && conn.readyState === WebSocket.OPEN) {
        conn.send(message)
      }
    })
  })

  ws.on('close', () => {
    doc.conns.delete(ws)
    if (doc.conns.size === 0) {
      // 可选：30分钟后清理无人文档
      setTimeout(() => {
        if (doc.conns.size === 0) docs.delete(docName)
      }, 30 * 60 * 1000)
    }
  })
})

server.listen(1234, () => {
  console.log('WebSocket server running on ws://localhost:1234')
})
```

运行服务器：
```bash
node server/websocket.js
```

---

## 第三步：配置编辑器

### 3.1 创建编辑器配置

创建 `src/config/editorConfig.ts`:

```typescript
import { EditorConfig } from '@/types'

export const defaultEditorConfig: EditorConfig = {
  // 文档 ID（从 URL 获取或生成）
  documentId: window.location.pathname.split('/').pop() || 'default-doc',

  // 占位符
  placeholder: '开始输入...',

  // 可编辑
  editable: true,

  // 启用的扩展
  extensions: [
    { name: 'bold' },
    { name: 'italic' },
    { name: 'underline' },
    { name: 'strike' },
    { name: 'code' },
    { name: 'heading', options: { levels: [1, 2, 3] } },
    { name: 'paragraph' },
    { name: 'text' },
    { name: 'orderedList' },
    { name: 'bulletList' },
    { name: 'listItem' },
    { name: 'codeBlock' },
    { name: 'table', options: { resizable: true } },
    { name: 'tableRow' },
    { name: 'tableCell' },
    { name: 'tableHeader' },
    { name: 'textAlign', options: { types: ['heading', 'paragraph'] } },
    { name: 'history' }
  ],

  // 协作配置
  collaboration: {
    websocketUrl: 'ws://localhost:1234',
    user: {
      id: `user-${Math.random().toString(36).substring(7)}`,
      name: prompt('请输入你的名字') || `访客 ${Math.floor(Math.random() * 100)}`,
      avatar: undefined
    },
    enableCursor: true,
    enableOffline: true
  },

  // 性能配置
  performance: {
    enableCodeSplitting: true,
    syncDebounce: 100,
    historyDepth: 50
  }
}
```

---

### 3.2 创建编辑器 Hook

创建 `src/editor/useEditor.ts`:

```typescript
import { useEditor as useTiptapEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import { EditorConfig } from '@/types'

export function useEditor(config: EditorConfig) {
  // 创建 Yjs 文档
  const ydoc = new Y.Doc()

  // WebSocket 提供者（实时同步）
  const websocketProvider = new WebsocketProvider(
    config.collaboration!.websocketUrl,
    config.documentId,
    ydoc
  )

  // IndexedDB 提供者（离线缓存）
  const indexeddbProvider = new IndexeddbPersistence(config.documentId, ydoc)

  // 设置当前用户信息
  websocketProvider.awareness.setLocalStateField('user', {
    name: config.collaboration!.user.name,
    color: getRandomColor(),
    colorLight: getRandomColor(0.3)
  })

  // 创建编辑器
  const editor = useTiptapEditor({
    extensions: [
      StarterKit.configure({
        history: false // 使用 Yjs 的历史记录
      }),
      Collaboration.configure({
        document: ydoc
      }),
      CollaborationCursor.configure({
        provider: websocketProvider,
        user: {
          name: config.collaboration!.user.name,
          color: getRandomColor()
        }
      }),
      Table.configure({
        resizable: true
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline,
      Placeholder.configure({
        placeholder: config.placeholder
      })
    ],
    editorProps: {
      attributes: {
        class: 'editor-content'
      }
    }
  })

  return { editor, websocketProvider, indexeddbProvider }
}

// 辅助函数：生成随机颜色
function getRandomColor(opacity = 1) {
  const colors = [
    `rgba(255, 99, 71, ${opacity})`,   // 番茄红
    `rgba(54, 162, 235, ${opacity})`,  // 天蓝色
    `rgba(75, 192, 192, ${opacity})`,  // 青色
    `rgba(153, 102, 255, ${opacity})`, // 紫色
    `rgba(255, 159, 64, ${opacity})`   // 橙色
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
```

---

### 3.3 创建主应用组件

更新 `src/App.tsx`:

```typescript
import { useEditor } from './editor/useEditor'
import { EditorContent } from '@tiptap/react'
import { defaultEditorConfig } from './config/editorConfig'
import './App.css'

function App() {
  const { editor } = useEditor(defaultEditorConfig)

  if (!editor) {
    return <div>加载编辑器...</div>
  }

  return (
    <div className="app">
      <header className="header">
        <h1>多人协作文档编辑器</h1>
      </header>

      <div className="toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          粗体
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          斜体
        </button>
        <button
          onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          标题 1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          无序列表
        </button>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
        >
          插入表格
        </button>
      </div>

      <EditorContent editor={editor} className="editor-container" />
    </div>
  )
}

export default App
```

---

### 3.4 添加基础样式

创建 `src/App.css`:

```css
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.toolbar {
  display: flex;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 16px;
}

.toolbar button {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar button:hover {
  background: #e8e8e8;
}

.toolbar button.is-active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.editor-container {
  min-height: 500px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

/* 编辑器内容样式 */
.editor-content {
  outline: none;
}

.editor-content h1 {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

.editor-content h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

.editor-content h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin: 0.83em 0;
}

.editor-content code {
  background: #f4f4f4;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.editor-content pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

.editor-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}

.editor-content table td,
.editor-content table th {
  border: 1px solid #ddd;
  padding: 8px;
}

.editor-content table th {
  background: #f5f5f5;
  font-weight: bold;
}

/* 协作光标样式 */
.collaboration-cursor__caret {
  position: absolute;
  border-left: 2px solid;
  margin-left: -1px;
  pointer-events: none;
}

.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #fff;
  padding: 2px 6px;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}
```

---

## 第四步：启动应用

```bash
# 启动开发服务器
pnpm dev

# 预期输出：
# VITE v5.4.1  ready in 500 ms
# ➜  Local:   http://localhost:3000/
# ➜  Network: use --host to expose
```

---

## 第五步：测试协作功能

1. 在浏览器中打开 `http://localhost:3000/`
2. 输入你的名字（或使用默认的"访客"名称）
3. 在编辑器中输入一些文字，应用格式（加粗、标题等）
4. **打开第二个浏览器标签页**，访问同一 URL
5. 输入另一个名字，开始编辑

**预期效果**:
- 第一个标签页中的编辑会立即（1秒内）同步到第二个标签页
- 可以看到对方的光标位置（带颜色标识）
- 两个用户同时编辑不会产生冲突，内容正确合并

---

## 第六步：测试离线功能

1. 在编辑器中输入一些内容
2. **关闭 WebSocket 服务器**（停止 `npx y-websocket-server`）
3. 继续在编辑器中编辑，内容会保存到 IndexedDB
4. 刷新页面，编辑内容应该恢复（从 IndexedDB 加载）
5. **重新启动 WebSocket 服务器**
6. 页面会自动重连，离线期间的编辑会同步到服务器

---

## 验证清单

完成以下检查，确保编辑器功能正常：

- [ ] 编辑器成功加载，显示占位符文字
- [ ] 可以输入文本，应用粗体、斜体格式
- [ ] 可以设置标题（H1、H2、H3）
- [ ] 可以创建有序列表和无序列表
- [ ] 可以插入表格（3x3），编辑单元格内容
- [ ] 打开两个标签页，编辑会实时同步（<1秒）
- [ ] 可以看到对方的光标位置（不同颜色）
- [ ] 关闭 WebSocket 服务器，编辑仍可继续
- [ ] 刷新页面后，内容从 IndexedDB 恢复
- [ ] WebSocket 服务器重启后，编辑自动同步
- [ ] 使用快捷键 Ctrl/Cmd+B 可以切换粗体
- [ ] 使用快捷键 Ctrl/Cmd+Z 可以撤销操作

---

## 常见问题

### Q1: WebSocket 连接失败

**错误**: `WebSocket connection to 'ws://localhost:1234' failed`

**解决**:
1. 确保 WebSocket 服务器正在运行（`npx y-websocket-server --port 1234`）
2. 检查端口 1234 是否被其他程序占用（`lsof -i :1234`）
3. 尝试使用不同端口（修改 `websocketUrl` 和服务器启动命令）

---

### Q2: 编辑不同步

**症状**: 两个标签页的编辑互不可见

**解决**:
1. 打开浏览器开发者工具，查看 WebSocket 连接状态
2. 检查 `documentId` 是否一致（两个标签页应使用同一 URL）
3. 清除浏览器 IndexedDB 缓存（开发者工具 → Application → IndexedDB）
4. 重启 WebSocket 服务器和前端应用

---

### Q3: 表格无法插入

**错误**: `insertTable is not a function`

**解决**:
1. 确保已安装 `@tiptap/extension-table`
2. 检查编辑器配置中是否包含 Table、TableRow、TableCell 扩展
3. 重新运行 `pnpm install`

---

### Q4: 中文输入法异常

**症状**: 输入中文时，拼音字母被同步到其他用户

**解决**:
- 这是已知问题，需要实现 `CompositionEvent` 处理
- 在 Phase 2 实现时会解决（参考 research.md 第 6 节）

---

## 下一步

现在你已经搭建了一个基础的协作编辑器！接下来可以：

1. **添加更多格式化功能**: 文本对齐、代码块语法高亮、链接
2. **优化 UI**: 实现工具栏组件化、添加工具提示（Tooltip）
3. **实现协作者列表**: 在侧边栏显示在线用户
4. **性能优化**: 代码分割、懒加载表格扩展
5. **测试**: 编写单元测试和集成测试

**参考文档**:
- [plan.md](./plan.md) - 完整实现计划
- [data-model.md](./data-model.md) - 数据模型定义
- [contracts/editor-api.md](./contracts/editor-api.md) - API 接口文档
- [research.md](./research.md) - 技术调研和最佳实践

---

## 帮助与支持

遇到问题？查看以下资源：

- **TipTap 官方文档**: https://tiptap.dev/docs
- **Yjs 文档**: https://docs.yjs.dev/
- **项目 Constitution**: `.specify/memory/constitution.md`
- **项目 CLAUDE.md**: `/CLAUDE.md`

祝你开发愉快！
