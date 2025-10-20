# 多人协作文档编辑器

基于 TipTap 3.x + Yjs 构建的现代化富文本编辑器，支持实时多人协作。

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动前端开发服务器
pnpm dev

# 启动 WebSocket 协作服务器（可选，用于测试协作功能）
pnpm server
```

访问 http://localhost:3000 查看编辑器。

**测试协作功能**：
1. 在终端 1 运行: `pnpm server`（启动 WebSocket 服务器）
2. 在终端 2 运行: `pnpm dev`（启动前端）
3. 在多个浏览器标签页中打开编辑器
4. 实时看到多人编辑效果

📖 **完整测试指南**: 查看 [COLLABORATION_TESTING.md](./COLLABORATION_TESTING.md) 了解详细的功能测试清单

### 构建生产版本

```bash
pnpm build
```

### 运行测试

```bash
# 运行所有测试
pnpm vitest run

# 监听模式
pnpm vitest

# 带 UI
pnpm vitest --ui
```

## ✨ 功能特性

### User Story 1: 基础富文本编辑 (P1) ✅

- ✅ 富文本编辑器
- ✅ 加粗 (Ctrl+B)
- ✅ 斜体 (Ctrl+I)
- ✅ 下划线 (Ctrl+U)
- ✅ 删除线 (Ctrl+Shift+X)
- ✅ 标题 H1-H3 (Ctrl+Alt+1/2/3)
- ✅ 撤销/重做 (Ctrl+Z / Ctrl+Shift+Z)
- ✅ 占位符显示

### User Story 2: 实时多人协作 (P2) ✅

**已实现功能**:
- ✅ Yjs CRDT 集成
- ✅ AwarenessManager（用户状态管理）
- ✅ Collaboration Extension（文档实时同步）
- ✅ CollaborationCaret Extension（用户光标显示）- TipTap 3.x
- ✅ YjsProvider React 组件
- ✅ CollaboratorList UI（在线用户列表）
- ✅ NetworkStatus 组件（连接状态）
- ✅ 协作同步测试
- ✅ WebSocket Server（本地测试服务器）
- ✅ CollaborativeEditor 示例组件
- ✅ App 集成（默认协作模式）
- ✅ CollaborativeToolbar（独立工具栏）

**当前状态**：
- ✅ 文档内容实时同步正常工作
- ✅ 在线用户列表正常显示
- ✅ 用户光标位置实时显示（已修复）

**技术要点**：
- **版本兼容性**: TipTap 3.x 使用 `@tiptap/extension-collaboration-caret` (不是 2.x 的 `collaboration-cursor`)
- **Provider 配置**: CollaborationCaret 需要 WebsocketProvider 实例作为 provider 参数
- **CSS 类名**: 需要添加 `.collaboration-carets__*` 类（注意是复数 `carets`）
  - `.collaboration-carets__caret`: 光标样式
  - `.collaboration-carets__label`: 用户名标签样式
  - `.collaboration-carets__selection`: 选择区域样式

**生产环境部署**：参见 [QUICKSTART.md](./QUICKSTART.md) 的部署章节

### User Story 3: 高级格式 (P3) ✅

**已实现功能**:
- ✅ 文本对齐 (左对齐/居中/右对齐/两端对齐)
- ✅ 有序列表 (Ctrl+Shift+7)
- ✅ 无序列表 (Ctrl+Shift+8)
- ✅ 嵌套列表（支持3级）
- ✅ 代码块 (Ctrl+Alt+C)
- ✅ 列表和代码块样式

### User Story 4: 表格支持 (P4) ✅

**已实现功能**:
- ✅ 插入表格 (默认 3x3，带表头行)
- ✅ 编辑单元格内容 (支持富文本格式)
- ✅ 添加行 (在当前行下方插入)
- ✅ 删除行
- ✅ 添加列 (在当前列右侧插入)
- ✅ 删除列
- ✅ 合并单元格
- ✅ 拆分单元格
- ✅ 切换表头行
- ✅ 删除整个表格
- ✅ 列宽调整 (可拖动调整)

**使用方式**:
- 点击工具栏"表格"图标插入 3x3 表格
- 选中表格或光标在表格内时，自动显示**浮动操作菜单**
- 浮动菜单提供所有表格操作（添加/删除行列、合并/拆分单元格等）
- 在单元格内可以应用文本格式（加粗、斜体等）
- 使用 Tab 键在单元格间导航（从左到右，从上到下）

## 🎹 键盘快捷键

| 功能 | Windows/Linux | Mac |
|------|---------------|-----|
| 加粗 | Ctrl+B | ⌘+B |
| 斜体 | Ctrl+I | ⌘+I |
| 下划线 | Ctrl+U | ⌘+U |
| 删除线 | Ctrl+Shift+X | ⌘+Shift+X |
| 标题 1 | Ctrl+Alt+1 | ⌘+⌥+1 |
| 标题 2 | Ctrl+Alt+2 | ⌘+⌥+2 |
| 标题 3 | Ctrl+Alt+3 | ⌘+⌥+3 |
| 撤销 | Ctrl+Z | ⌘+Z |
| 重做 | Ctrl+Shift+Z | ⌘+Shift+Z |
| 左对齐 | Ctrl+Shift+L | ⌘+Shift+L |
| 居中 | Ctrl+Shift+E | ⌘+Shift+E |
| 右对齐 | Ctrl+Shift+R | ⌘+Shift+R |
| 有序列表 | Ctrl+Shift+7 | ⌘+Shift+7 |
| 无序列表 | Ctrl+Shift+8 | ⌘+Shift+8 |
| 代码块 | Ctrl+Alt+C | ⌘+⌥+C |

## 🏗️ 技术栈

- **框架**: React 18.3 + TypeScript 5.9
- **编辑器**: TipTap 3.7.2
- **协作**: Yjs 13.6 + y-websocket + y-indexeddb ✅
- **构建工具**: Vite 5.4
- **样式**: CSS Modules + Less
- **测试**: Vitest + Testing Library
- **包管理**: pnpm

## 📁 项目结构

```
src/
├── editor/              # 编辑器核心
│   ├── EditorProvider.tsx
│   ├── useEditor.ts
│   ├── EditorConfig.ts
│   ├── types.ts
│   └── keyboardShortcuts.ts
├── collaboration/       # 协作功能
│   ├── YjsProvider.tsx
│   ├── AwarenessManager.ts
│   └── types.ts
├── extensions/          # TipTap 扩展
│   ├── formatting/      # 格式化扩展
│   └── collaboration/   # 协作扩展
├── components/          # React 组件
│   ├── Editor/          # 编辑器组件
│   ├── Toolbar/         # 工具栏组件
│   ├── Sidebar/         # 侧边栏（用户列表）
│   └── common/          # 通用组件
├── types/               # TypeScript 类型定义
└── utils/               # 工具函数
```

## 🧪 测试

当前测试覆盖：

```
Test Files  6 passed | 1 failed (7)
Tests      29 passed | 2 failed (31)
```

注：IndexedDB 测试需要浏览器环境，在 Node.js 环境中会失败。所有功能测试均通过。

## 📊 性能指标

- 编辑器初始化: < 15ms ✅ (目标 <200ms)
- Bundle 大小: 213.90 KB gzipped (⚠️ 超出目标 13.90 KB)
- 包含完整协作、高级格式、表格和浮动菜单功能
- 198 个模块已转换

## 📝 开发计划

查看 [tasks.md](./specs/001-collaborative-doc-editor/tasks.md) 了解完整任务列表。

当前进度：
- **Phase 3: User Story 1 (MVP)** ✅ 100% 完成
- **Phase 4: User Story 2 (协作)** ✅ 100% 完成
- **Phase 5: User Story 3 (高级格式)** ✅ 100% 完成
- **Phase 6: User Story 4 (表格)** ✅ 100% 完成

**🎉 所有用户故事已完成！**

## 🤝 使用协作功能

### 示例代码

```tsx
import { CollaborativeEditor } from './examples/CollaborativeEditor'

function App() {
  return (
    <CollaborativeEditor
      documentId="my-doc-001"
      wsUrl="ws://localhost:1234"
      userName="Alice"
    />
  )
}
```

### 架构说明

1. **YjsProvider**: 管理 Yjs 文档和 WebSocket 连接
2. **AwarenessManager**: 跟踪在线用户和光标位置
3. **CollaborationExtension**: 集成 Yjs CRDT 到 TipTap
4. **CollaborationCursor**: 显示其他用户的光标
5. **CollaboratorList**: 显示在线用户列表
6. **NetworkStatus**: 连接状态指示器

详细文档见 `specs/001-collaborative-doc-editor/`

## 📄 许可证

MIT
