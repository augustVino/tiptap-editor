# Data Model: 多人协作文档编辑器

**Created**: 2025-10-17
**Purpose**: Phase 1 设计 - 定义核心数据实体和关系

## 概述

本文档定义编辑器的核心数据模型，所有实体使用 TypeScript 接口描述。数据层分为三类：
1. **文档数据**: 编辑器内容和元数据
2. **协作数据**: 用户在线状态和光标信息
3. **配置数据**: 编辑器设置和扩展选项

## 1. Document (文档)

文档是编辑器的核心实体，包含可编辑的内容和元数据。

```typescript
interface Document {
  /** 文档唯一标识符（UUID v4） */
  id: string

  /** 文档标题，用于显示在标签页或列表中 */
  title: string

  /** 文档内容（TipTap JSON 格式，对应 ProseMirror 文档模型） */
  content: JSONContent

  /** 创建时间戳（ISO 8601 格式） */
  createdAt: string

  /** 最后修改时间戳（ISO 8601 格式） */
  updatedAt: string

  /** 最后编辑的协作者 ID */
  lastEditedBy?: string

  /** 文档元数据（可选） */
  metadata?: DocumentMetadata
}

interface DocumentMetadata {
  /** 文档描述或摘要 */
  description?: string

  /** 文档标签（用于分类） */
  tags?: string[]

  /** 文档字数统计 */
  wordCount?: number

  /** 是否公开（公开文档可通过 URL 分享） */
  isPublic?: boolean
}

interface JSONContent {
  /** 节点类型（doc, paragraph, heading, text 等） */
  type: string

  /** 节点属性（如 heading 的 level，text 的 marks） */
  attrs?: Record<string, any>

  /** 子节点数组 */
  content?: JSONContent[]

  /** 文本内容（仅 text 节点） */
  text?: string

  /** 标记（如 bold, italic, underline） */
  marks?: Mark[]
}

interface Mark {
  /** 标记类型（bold, italic, underline, strike, code 等） */
  type: string

  /** 标记属性（如 link 的 href） */
  attrs?: Record<string, any>
}
```

**存储位置**:
- 前端：IndexedDB (通过 y-indexeddb 存储 Yjs Y.Doc)
- 后端（可选）：WebSocket 服务器内存或 Redis

**关系**:
- 一个文档可以有多个协作者（1:N）
- 一个文档包含多个编辑操作的历史记录（1:N）

---

## 2. Collaborator (协作者)

协作者表示当前正在编辑文档的用户，包含身份信息和在线状态。

```typescript
interface Collaborator {
  /** 协作者唯一标识符（UUID 或用户 ID） */
  id: string

  /** 协作者显示名称（用户名或匿名名称如 "访客 1"） */
  name: string

  /** 协作者头像 URL（可选，默认使用首字母生成） */
  avatar?: string

  /** 协作者光标颜色（用于区分不同用户） */
  cursorColor: string

  /** 在线状态 */
  status: CollaboratorStatus

  /** 最后活跃时间戳（用于超时检测） */
  lastActiveAt: number

  /** 当前光标位置和选中范围 */
  selection?: EditorSelection
}

enum CollaboratorStatus {
  /** 在线并活跃编辑 */
  Active = 'active',

  /** 在线但暂无操作（>2分钟未编辑） */
  Idle = 'idle',

  /** 离线（网络断开或关闭页面） */
  Offline = 'offline'
}

interface EditorSelection {
  /** 选中范围起始位置（ProseMirror position） */
  from: number

  /** 选中范围结束位置 */
  to: number

  /** 是否为光标（from === to） */
  empty: boolean

  /** 光标所在的文本内容（用于显示协作者编辑位置） */
  text?: string
}
```

**管理方式**:
- 使用 Yjs Awareness API 跟踪协作者状态
- 每 30 秒发送心跳，超时 60 秒标记为离线
- 光标位置实时同步（debounce 100ms）

**颜色分配**:
- 使用预定义调色板（5+ 种高对比度颜色）
- 按加入顺序分配，循环使用
- 颜色持久化到用户 session（刷新页面保持一致）

---

## 3. EditOperation (编辑操作)

编辑操作表示对文档的单次修改，用于协作同步和历史记录。

```typescript
interface EditOperation {
  /** 操作唯一标识符 */
  id: string

  /** 操作类型 */
  type: OperationType

  /** 操作发生的位置（ProseMirror position） */
  position: number

  /** 操作的内容数据 */
  data: OperationData

  /** 操作时间戳（Lamport 时间戳或 UNIX 时间戳） */
  timestamp: number

  /** 执行操作的协作者 ID */
  userId: string

  /** Yjs 事务 ID（用于 CRDT 冲突解决） */
  transactionId?: string
}

enum OperationType {
  /** 插入文本或节点 */
  Insert = 'insert',

  /** 删除文本或节点 */
  Delete = 'delete',

  /** 应用格式（加粗、斜体等） */
  Format = 'format',

  /** 修改节点属性（如标题级别） */
  UpdateAttrs = 'update_attrs'
}

interface OperationData {
  /** 插入或删除的内容（文本或 JSON 节点） */
  content?: string | JSONContent

  /** 应用或移除的标记类型 */
  mark?: string

  /** 修改的属性键值对 */
  attrs?: Record<string, any>
}
```

**注意**:
- 编辑操作由 Yjs 自动生成和同步，应用层通常不直接操作
- 用于 Undo/Redo 功能的历史记录栈
- 可选：持久化到服务器用于审计和回溯

---

## 4. Format (格式)

格式表示应用于文本或段落的样式，包括内联标记和块级属性。

```typescript
interface TextFormat {
  /** 格式类型 */
  type: TextFormatType

  /** 格式是否激活（用于工具栏高亮） */
  isActive: boolean

  /** 格式属性（如链接的 URL） */
  attrs?: Record<string, any>
}

enum TextFormatType {
  /** 粗体 */
  Bold = 'bold',

  /** 斜体 */
  Italic = 'italic',

  /** 下划线 */
  Underline = 'underline',

  /** 删除线 */
  Strike = 'strike',

  /** 行内代码 */
  Code = 'code',

  /** 链接 */
  Link = 'link'
}

interface BlockFormat {
  /** 块级格式类型 */
  type: BlockFormatType

  /** 块级属性 */
  attrs: BlockFormatAttrs
}

enum BlockFormatType {
  /** 段落 */
  Paragraph = 'paragraph',

  /** 标题 */
  Heading = 'heading',

  /** 代码块 */
  CodeBlock = 'codeBlock',

  /** 有序列表 */
  OrderedList = 'orderedList',

  /** 无序列表 */
  BulletList = 'bulletList',

  /** 列表项 */
  ListItem = 'listItem'
}

interface BlockFormatAttrs {
  /** 标题级别（1-3） */
  level?: 1 | 2 | 3

  /** 文本对齐方式 */
  textAlign?: 'left' | 'center' | 'right' | 'justify'

  /** 代码块语言（用于语法高亮） */
  language?: string
}
```

**格式应用规则**:
- 文本格式（TextFormat）通过 ProseMirror marks 实现，可叠加
- 块级格式（BlockFormat）通过节点类型和属性实现，互斥
- 格式状态通过 `editor.isActive('bold')` 查询

---

## 5. Table (表格)

表格是特殊的块级节点，包含行、列和单元格。

```typescript
interface Table {
  /** 表格节点类型（固定为 'table'） */
  type: 'table'

  /** 表格内容（行数组） */
  content: TableRow[]

  /** 表格属性 */
  attrs?: TableAttrs
}

interface TableRow {
  /** 行节点类型（固定为 'tableRow'） */
  type: 'tableRow'

  /** 行内容（单元格数组） */
  content: TableCell[]
}

interface TableCell {
  /** 单元格节点类型（'tableCell' 或 'tableHeader'） */
  type: 'tableCell' | 'tableHeader'

  /** 单元格内容（可包含段落、文本等） */
  content: JSONContent[]

  /** 单元格属性 */
  attrs?: TableCellAttrs
}

interface TableAttrs {
  /** 表格总行数 */
  rows?: number

  /** 表格总列数 */
  cols?: number
}

interface TableCellAttrs {
  /** 跨列数（colspan） */
  colspan?: number

  /** 跨行数（rowspan） */
  rowspan?: number

  /** 单元格对齐方式 */
  textAlign?: 'left' | 'center' | 'right'

  /** 单元格背景色（可选） */
  background?: string
}
```

**表格操作**:
- 插入表格：`editor.chain().insertTable({ rows: 3, cols: 4 }).run()`
- 插入行：`editor.chain().addRowBefore().run()` / `addRowAfter()`
- 删除行：`editor.chain().deleteRow().run()`
- 插入列：`editor.chain().addColumnBefore().run()` / `addColumnAfter()`
- 删除列：`editor.chain().deleteColumn().run()`
- 合并单元格：`editor.chain().mergeCells().run()`
- 拆分单元格：`editor.chain().splitCell().run()`

**约束**:
- 表格最大支持 10x10 单元格（规格要求）
- 单元格内可包含文本格式和内联标记
- 表格不可嵌套（ProseMirror 限制）

---

## 6. EditorState (编辑器状态)

编辑器状态包含当前编辑器的配置、文档、选中范围等信息。

```typescript
interface EditorState {
  /** 当前文档 */
  doc: Document

  /** 当前选中范围 */
  selection: EditorSelection

  /** 当前活跃的格式列表 */
  activeFormats: TextFormat[]

  /** 撤销栈（最多 50 步） */
  undoStack: EditOperation[]

  /** 重做栈 */
  redoStack: EditOperation[]

  /** 编辑器是否可编辑 */
  editable: boolean

  /** 编辑器是否为空 */
  isEmpty: boolean

  /** 字数统计 */
  wordCount: number

  /** 当前文档的所有协作者 */
  collaborators: Collaborator[]

  /** 当前用户 */
  currentUser: Collaborator

  /** 网络连接状态 */
  connectionStatus: ConnectionStatus
}

enum ConnectionStatus {
  /** 已连接到 WebSocket 服务器 */
  Connected = 'connected',

  /** 正在连接 */
  Connecting = 'connecting',

  /** 离线（使用本地缓存） */
  Offline = 'offline',

  /** 连接错误 */
  Error = 'error'
}
```

**状态管理**:
- 使用 React Context 提供编辑器状态给所有组件
- 使用 TipTap 的 `useEditor` Hook 订阅状态更新
- 状态变化触发相关 UI 组件重新渲染（如工具栏按钮高亮）

---

## 7. EditorConfig (编辑器配置)

编辑器配置定义初始化参数和扩展选项。

```typescript
interface EditorConfig {
  /** 文档 ID（用于协作房间标识） */
  documentId: string

  /** 初始内容（可选，默认为空文档） */
  initialContent?: JSONContent

  /** 占位符文本 */
  placeholder?: string

  /** 是否可编辑 */
  editable?: boolean

  /** 启用的扩展列表 */
  extensions: ExtensionConfig[]

  /** 协作配置 */
  collaboration?: CollaborationConfig

  /** 性能配置 */
  performance?: PerformanceConfig
}

interface ExtensionConfig {
  /** 扩展名称 */
  name: string

  /** 扩展选项 */
  options?: Record<string, any>
}

interface CollaborationConfig {
  /** WebSocket 服务器 URL */
  websocketUrl: string

  /** 当前用户信息 */
  user: {
    id: string
    name: string
    avatar?: string
  }

  /** 是否启用光标同步 */
  enableCursor?: boolean

  /** 是否启用离线缓存 */
  enableOffline?: boolean
}

interface PerformanceConfig {
  /** 是否启用代码分割 */
  enableCodeSplitting?: boolean

  /** 协作同步 debounce 延迟（毫秒） */
  syncDebounce?: number

  /** Undo/Redo 历史记录上限 */
  historyDepth?: number
}
```

**配置示例**:
```typescript
const config: EditorConfig = {
  documentId: 'doc-123456',
  placeholder: '开始输入...',
  editable: true,
  extensions: [
    { name: 'bold' },
    { name: 'italic' },
    { name: 'heading', options: { levels: [1, 2, 3] } },
    { name: 'table', options: { resizable: true } }
  ],
  collaboration: {
    websocketUrl: 'ws://localhost:1234',
    user: {
      id: 'user-789',
      name: '张三'
    },
    enableCursor: true,
    enableOffline: true
  },
  performance: {
    enableCodeSplitting: true,
    syncDebounce: 100,
    historyDepth: 50
  }
}
```

---

## 数据流图

```
用户输入
    ↓
EditorState 更新
    ↓
TipTap 事务 (Transaction)
    ↓
Yjs Y.Doc 更新 (CRDT)
    ↓
[分支1] IndexedDB 持久化
[分支2] WebSocket 同步到其他客户端
    ↓
其他客户端 Yjs Y.Doc 更新
    ↓
其他客户端 EditorState 更新
    ↓
其他客户端 UI 渲染
```

---

## 验证规则

### Document
- `id`: 必须是有效的 UUID v4 格式
- `title`: 长度 1-200 字符
- `content`: 必须符合 TipTap/ProseMirror JSON schema
- `createdAt`, `updatedAt`: 必须是 ISO 8601 格式的时间戳

### Collaborator
- `id`: 唯一标识符，非空
- `name`: 长度 1-50 字符
- `cursorColor`: 必须是有效的 CSS 颜色值（hex 或 rgb）
- `lastActiveAt`: 必须是 UNIX 时间戳（毫秒）

### Table
- 行数和列数范围：1-10（规格要求）
- 单元格 `colspan` 和 `rowspan` 范围：1-10
- 单元格内容必须是有效的 JSONContent 数组

---

## 总结

数据模型涵盖 7 个核心实体：
1. ✅ Document - 文档内容和元数据
2. ✅ Collaborator - 协作者信息和在线状态
3. ✅ EditOperation - 编辑操作历史
4. ✅ Format - 文本和块级格式
5. ✅ Table - 表格结构
6. ✅ EditorState - 编辑器状态
7. ✅ EditorConfig - 编辑器配置

所有类型定义将在 `src/types/` 目录中实现。

**下一步**: 生成 contracts/editor-api.md 和 quickstart.md
