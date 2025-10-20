# Editor API Contracts: 多人协作文档编辑器

**Created**: 2025-10-17
**Purpose**: Phase 1 设计 - 定义编辑器 API 接口和命令

## 概述

本文档定义编辑器对外暴露的 API 接口，包括：
1. **React组件 API**: EditorProvider 和 Editor 组件的 props 和 ref 方法
2. **Editor 命令 API**: 格式化、协作、表格操作等命令
3. **Event Hooks**: 编辑器事件监听和回调
4. **协作 WebSocket 协议**: 客户端与服务器的消息格式

---

## 1. React 组件 API

### 1.1 EditorProvider

`EditorProvider` 是最外层组件，提供编辑器上下文（Context）。

```typescript
interface EditorProviderProps {
  /** 编辑器配置 */
  config: EditorConfig

  /** 子组件 */
  children: React.ReactNode

  /** 编辑器初始化完成回调 */
  onReady?: (editor: Editor) => void

  /** 编辑器销毁回调 */
  onDestroy?: () => void
}

// 使用示例
<EditorProvider config={editorConfig} onReady={(editor) => console.log('编辑器就绪', editor)}>
  <Toolbar />
  <EditorContent />
  <Sidebar />
</EditorProvider>
```

---

### 1.2 EditorContent

`EditorContent` 是编辑器主要编辑区域组件。

```typescript
interface EditorContentProps {
  /** 编辑器类名（用于自定义样式） */
  className?: string

  /** 占位符文本 */
  placeholder?: string

  /** 是否显示占位符 */
  showPlaceholder?: boolean

  /** 编辑器样式 */
  style?: React.CSSProperties
}

// 使用示例
<EditorContent
  className="editor-content"
  placeholder="开始输入..."
  showPlaceholder={true}
/>
```

---

### 1.3 Toolbar

`Toolbar` 是工具栏组件，提供格式化按钮。

```typescript
interface ToolbarProps {
  /** 工具栏位置 */
  position?: 'top' | 'bottom' | 'floating'

  /** 显示的工具组（默认全部显示） */
  tools?: ToolGroup[]

  /** 自定义样式 */
  className?: string
}

enum ToolGroup {
  /** 文本格式（加粗、斜体、下划线） */
  TextFormat = 'textFormat',

  /** 段落格式（标题、对齐） */
  BlockFormat = 'blockFormat',

  /** 列表 */
  List = 'list',

  /** 插入内容（代码块、表格） */
  Insert = 'insert',

  /** 历史操作（撤销、重做） */
  History = 'history'
}

// 使用示例
<Toolbar
  position="top"
  tools={[ToolGroup.TextFormat, ToolGroup.BlockFormat, ToolGroup.List]}
/>
```

---

### 1.4 CollaboratorList

`CollaboratorList` 显示当前在线用户列表。

```typescript
interface CollaboratorListProps {
  /** 最多显示的用户数量（超过显示 +N） */
  maxDisplay?: number

  /** 点击用户头像的回调 */
  onClickUser?: (user: Collaborator) => void

  /** 自定义样式 */
  className?: string
}

// 使用示例
<CollaboratorList
  maxDisplay={5}
  onClickUser={(user) => console.log('点击用户', user)}
/>
```

---

## 2. Editor Ref API

通过 `useEditor` Hook 或 `onReady` 回调获取 `Editor` 实例，可以调用以下方法。

### 2.1 内容操作

```typescript
interface EditorContentAPI {
  /** 获取编辑器 HTML 内容 */
  getHTML(): string

  /** 获取编辑器 JSON 内容 */
  getJSON(): JSONContent

  /** 获取纯文本内容（去除格式） */
  getText(options?: { blockSeparator?: string }): string

  /** 设置编辑器内容 */
  setContent(content: string | JSONContent, emitUpdate?: boolean): void

  /** 清空编辑器内容 */
  clearContent(emitUpdate?: boolean): void

  /** 判断编辑器是否为空 */
  isEmpty(): boolean

  /** 获取字数统计 */
  getWordCount(): number
}

// 使用示例
const html = editor.getHTML()
const json = editor.getJSON()
const text = editor.getText({ blockSeparator: '\n\n' })

editor.setContent('<p>Hello <strong>World</strong></p>')
editor.setContent({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }] })

editor.clearContent()
console.log(editor.isEmpty()) // true
console.log(editor.getWordCount()) // 0
```

---

### 2.2 格式化命令

```typescript
interface EditorFormattingAPI {
  /** 切换粗体格式 */
  toggleBold(): ChainedCommands

  /** 切换斜体格式 */
  toggleItalic(): ChainedCommands

  /** 切换下划线格式 */
  toggleUnderline(): ChainedCommands

  /** 切换删除线格式 */
  toggleStrike(): ChainedCommands

  /** 切换行内代码格式 */
  toggleCode(): ChainedCommands

  /** 设置标题级别（1-3） */
  setHeading(level: 1 | 2 | 3): ChainedCommands

  /** 切换有序列表 */
  toggleOrderedList(): ChainedCommands

  /** 切换无序列表 */
  toggleBulletList(): ChainedCommands

  /** 切换代码块 */
  toggleCodeBlock(): ChainedCommands

  /** 设置文本对齐方式 */
  setTextAlign(align: 'left' | 'center' | 'right' | 'justify'): ChainedCommands

  /** 清除所有格式 */
  clearNodes(): ChainedCommands

  /** 检查格式是否激活 */
  isActive(name: string, attrs?: Record<string, any>): boolean
}

// 使用示例
editor.chain().toggleBold().run()
editor.chain().setHeading(1).run()
editor.chain().setTextAlign('center').run()
editor.chain().toggleBold().toggleItalic().run() // 链式调用

// 检查格式状态
const isBold = editor.isActive('bold')
const isHeading1 = editor.isActive('heading', { level: 1 })
```

---

### 2.3 表格命令

```typescript
interface EditorTableAPI {
  /** 插入表格 */
  insertTable(options: { rows: number; cols: number; withHeaderRow?: boolean }): ChainedCommands

  /** 删除表格 */
  deleteTable(): ChainedCommands

  /** 在当前行前插入行 */
  addRowBefore(): ChainedCommands

  /** 在当前行后插入行 */
  addRowAfter(): ChainedCommands

  /** 删除当前行 */
  deleteRow(): ChainedCommands

  /** 在当前列前插入列 */
  addColumnBefore(): ChainedCommands

  /** 在当前列后插入列 */
  addColumnAfter(): ChainedCommands

  /** 删除当前列 */
  deleteColumn(): ChainedCommands

  /** 合并单元格 */
  mergeCells(): ChainedCommands

  /** 拆分单元格 */
  splitCell(): ChainedCommands

  /** 跳转到下一个单元格（Tab 键行为） */
  goToNextCell(): ChainedCommands

  /** 跳转到上一个单元格（Shift+Tab 键行为） */
  goToPreviousCell(): ChainedCommands
}

// 使用示例
editor.chain().insertTable({ rows: 3, cols: 4, withHeaderRow: true }).run()
editor.chain().addRowAfter().run()
editor.chain().deleteColumn().run()
editor.chain().mergeCells().run()
```

---

### 2.4 历史操作

```typescript
interface EditorHistoryAPI {
  /** 撤销 */
  undo(): ChainedCommands

  /** 重做 */
  redo(): ChainedCommands

  /** 是否可以撤销 */
  canUndo(): boolean

  /** 是否可以重做 */
  canRedo(): boolean
}

// 使用示例
editor.chain().undo().run()
editor.chain().redo().run()

const canUndo = editor.canUndo()
const canRedo = editor.canRedo()
```

---

### 2.5 选中和焦点

```typescript
interface EditorSelectionAPI {
  /** 获取当前选中范围 */
  getSelection(): EditorSelection

  /** 设置选中范围 */
  setSelection(range: { from: number; to: number }): ChainedCommands

  /** 聚焦编辑器 */
  focus(position?: 'start' | 'end' | number): ChainedCommands

  /** 使编辑器失焦 */
  blur(): void

  /** 判断编辑器是否聚焦 */
  isFocused(): boolean
}

// 使用示例
const selection = editor.getSelection()
editor.chain().setSelection({ from: 0, to: 10 }).run()
editor.chain().focus('end').run()
editor.blur()
console.log(editor.isFocused())
```

---

### 2.6 协作相关

```typescript
interface EditorCollaborationAPI {
  /** 获取当前在线用户列表 */
  getCollaborators(): Collaborator[]

  /** 获取当前用户 */
  getCurrentUser(): Collaborator

  /** 获取连接状态 */
  getConnectionStatus(): ConnectionStatus

  /** 手动触发同步 */
  sync(): void

  /** 断开连接 */
  disconnect(): void

  /** 重新连接 */
  reconnect(): void
}

// 使用示例
const collaborators = editor.getCollaborators()
const currentUser = editor.getCurrentUser()
const status = editor.getConnectionStatus()

editor.sync()
editor.disconnect()
editor.reconnect()
```

---

## 3. Event Hooks

编辑器提供事件监听机制，用于响应编辑器状态变化。

```typescript
interface EditorEvents {
  /** 编辑器内容更新 */
  update: (context: { editor: Editor; transaction: Transaction }) => void

  /** 编辑器选中范围变化 */
  selectionUpdate: (context: { editor: Editor }) => void

  /** 编辑器获得焦点 */
  focus: (context: { editor: Editor; event: FocusEvent }) => void

  /** 编辑器失去焦点 */
  blur: (context: { editor: Editor; event: FocusEvent }) => void

  /** 协作者加入 */
  collaboratorJoin: (collaborator: Collaborator) => void

  /** 协作者离开 */
  collaboratorLeave: (collaborator: Collaborator) => void

  /** 协作者光标更新 */
  collaboratorUpdate: (collaborator: Collaborator) => void

  /** 网络连接状态变化 */
  connectionStatusChange: (status: ConnectionStatus) => void

  /** 同步完成 */
  synced: () => void

  /** 错误发生 */
  error: (error: Error) => void
}

// 使用示例
editor.on('update', ({ editor, transaction }) => {
  console.log('内容已更新', editor.getJSON())
})

editor.on('collaboratorJoin', (collaborator) => {
  console.log(`${collaborator.name} 已加入`)
})

editor.on('connectionStatusChange', (status) => {
  if (status === ConnectionStatus.Offline) {
    alert('网络已断开，编辑将保存到本地')
  }
})

editor.on('error', (error) => {
  console.error('编辑器错误', error)
})
```

---

## 4. 协作 WebSocket 协议

### 4.1 客户端 → 服务器消息

```typescript
// 客户端连接
{
  "type": "connect",
  "payload": {
    "documentId": "doc-123456",
    "userId": "user-789",
    "userName": "张三",
    "cursorColor": "#FF5733"
  }
}

// Yjs 更新（二进制编码）
{
  "type": "sync",
  "payload": {
    "documentId": "doc-123456",
    "update": Uint8Array, // Yjs 编码的增量更新
    "timestamp": 1697501234567
  }
}

// Awareness 更新（用户状态）
{
  "type": "awareness",
  "payload": {
    "documentId": "doc-123456",
    "userId": "user-789",
    "awareness": {
      "selection": { "from": 100, "to": 105 },
      "status": "active",
      "lastActiveAt": 1697501234567
    }
  }
}

// 心跳（每 30 秒）
{
  "type": "ping",
  "payload": {
    "timestamp": 1697501234567
  }
}
```

---

### 4.2 服务器 → 客户端消息

```typescript
// 连接成功响应
{
  "type": "connected",
  "payload": {
    "documentId": "doc-123456",
    "serverTime": 1697501234567,
    "activeUsers": [
      { "userId": "user-123", "userName": "李四", "cursorColor": "#3498DB" }
    ]
  }
}

// Yjs 更新广播
{
  "type": "sync",
  "payload": {
    "documentId": "doc-123456",
    "update": Uint8Array, // 其他用户的编辑更新
    "userId": "user-123", // 更新来源用户
    "timestamp": 1697501234567
  }
}

// Awareness 广播
{
  "type": "awareness",
  "payload": {
    "documentId": "doc-123456",
    "userId": "user-123",
    "awareness": {
      "selection": { "from": 50, "to": 50 },
      "status": "active"
    }
  }
}

// 用户加入通知
{
  "type": "user_joined",
  "payload": {
    "user": {
      "userId": "user-456",
      "userName": "王五",
      "cursorColor": "#E74C3C"
    }
  }
}

// 用户离开通知
{
  "type": "user_left",
  "payload": {
    "userId": "user-456"
  }
}

// 心跳响应
{
  "type": "pong",
  "payload": {
    "timestamp": 1697501234567
  }
}

// 错误消息
{
  "type": "error",
  "payload": {
    "code": "INVALID_DOCUMENT",
    "message": "文档不存在或已删除"
  }
}
```

---

### 4.3 错误代码

| 错误代码 | 描述 | 处理方式 |
|---------|------|---------|
| `INVALID_DOCUMENT` | 文档 ID 无效或文档不存在 | 提示用户并重定向到主页 |
| `UNAUTHORIZED` | 用户无权限访问文档 | 提示用户并请求登录 |
| `MAX_USERS_REACHED` | 文档协作用户数已达上限（50人） | 提示用户以只读模式打开 |
| `SYNC_CONFLICT` | 同步冲突，无法合并更新 | 刷新页面重新加载文档 |
| `SERVER_ERROR` | 服务器内部错误 | 显示错误提示，自动重连 |
| `NETWORK_TIMEOUT` | 网络请求超时 | 切换到离线模式 |

---

## 5. 快捷键映射

| 快捷键 | 命令 | 描述 |
|-------|------|------|
| `Ctrl/Cmd + B` | `toggleBold()` | 切换粗体 |
| `Ctrl/Cmd + I` | `toggleItalic()` | 切换斜体 |
| `Ctrl/Cmd + U` | `toggleUnderline()` | 切换下划线 |
| `Ctrl/Cmd + Shift + X` | `toggleStrike()` | 切换删除线 |
| `Ctrl/Cmd + E` | `toggleCode()` | 切换行内代码 |
| `Ctrl/Cmd + Alt + 1` | `setHeading(1)` | 设置为一级标题 |
| `Ctrl/Cmd + Alt + 2` | `setHeading(2)` | 设置为二级标题 |
| `Ctrl/Cmd + Alt + 3` | `setHeading(3)` | 设置为三级标题 |
| `Ctrl/Cmd + Shift + 7` | `toggleOrderedList()` | 切换有序列表 |
| `Ctrl/Cmd + Shift + 8` | `toggleBulletList()` | 切换无序列表 |
| `Ctrl/Cmd + Shift + C` | `toggleCodeBlock()` | 切换代码块 |
| `Ctrl/Cmd + Shift + L` | `setTextAlign('left')` | 左对齐 |
| `Ctrl/Cmd + Shift + E` | `setTextAlign('center')` | 居中对齐 |
| `Ctrl/Cmd + Shift + R` | `setTextAlign('right')` | 右对齐 |
| `Ctrl/Cmd + Z` | `undo()` | 撤销 |
| `Ctrl/Cmd + Shift + Z` | `redo()` | 重做 |
| `Tab` (在表格中) | `goToNextCell()` | 跳转到下一个单元格 |
| `Shift + Tab` (在表格中) | `goToPreviousCell()` | 跳转到上一个单元格 |

---

## 6. 性能指标

所有 API 操作应满足以下性能要求（符合 Constitution）：

| 操作 | 性能目标 | 测试方法 |
|-----|---------|---------|
| `getHTML()` | <10ms | Performance.now() 计时 |
| `setContent()` | <50ms（小文档），<200ms（大文档） | 测试 10000 字文档 |
| `toggleBold()` | <100ms | 从命令执行到 DOM 更新完成 |
| `insertTable()` | <200ms | 插入 5x5 表格到 DOM 更新完成 |
| WebSocket `sync` 延迟 | <1秒 | 两个客户端同时编辑，测量同步时间差 |
| `undo()`/`redo()` | <50ms | 单步撤销/重做到 DOM 更新完成 |

---

## 总结

API 接口涵盖：
1. ✅ React 组件 API（EditorProvider、EditorContent、Toolbar、CollaboratorList）
2. ✅ Editor Ref API（内容、格式化、表格、历史、选中、协作）
3. ✅ Event Hooks（内容更新、协作者事件、连接状态）
4. ✅ WebSocket 协议（客户端→服务器、服务器→客户端、错误处理）
5. ✅ 快捷键映射（15+ 快捷键）
6. ✅ 性能指标（符合 Constitution 要求）

**下一步**: 生成 quickstart.md
