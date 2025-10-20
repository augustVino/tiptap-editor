# Implementation Plan: 多人协作文档编辑器

**Branch**: `001-collaborative-doc-editor` | **Date**: 2025-10-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-collaborative-doc-editor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

创建一个支持实时多人协作的富文本编辑器，基于 TipTap + Yjs 实现 CRDT 冲突解决，提供丰富的格式化功能（加粗、斜体、标题、对齐、列表、代码块、表格）。采用模块化架构设计，将编辑器核心、扩展系统、协作层、UI组件清晰分离，确保可扩展性和可维护性。技术方案：使用 TipTap 的扩展机制构建可插拔的格式化功能，Yjs 提供 CRDT 数据结构实现协作同步，WebSocket 或 WebRTC 提供实时通信通道，React 组件化构建 UI 层。

## Technical Context

**Language/Version**: TypeScript 5.9+（启用 strict mode）
**Primary Dependencies**:
  - React 18.3+ (UI 框架)
  - TipTap 2.25+ (@tiptap/react, @tiptap/starter-kit, @tiptap/extension-*)
  - Yjs 13+ (CRDT 协作核心)
  - y-websocket 或 y-webrtc (协作同步传输层)
  - Vite 5.4+ (构建工具)
  - CSS Modules + Less (样式方案)

**Storage**:
  - 前端：IndexedDB（通过 y-indexeddb 提供离线缓存和持久化）
  - 后端（可选）：简单的 WebSocket 服务器用于协作同步中转，文档数据可存储在内存或 Redis（MVP 阶段）

**Testing**: Vitest (与 Vite 生态集成)，@testing-library/react (组件测试)，Playwright（可选，端到端测试）

**Target Platform**: Web 浏览器（Chrome、Safari、Firefox 最新两个版本），桌面优先，移动端基础支持

**Project Type**: 单一前端项目（Single Project），可能需要简单的后端协作服务

**Performance Goals**:
  - 编辑器初始化时间 <200ms（空文档）
  - 字符输入延迟 <16ms（60fps）
  - 格式应用响应 <100ms
  - 协作同步延迟 <1秒

**Constraints**:
  - 主包体积 <150KB gzipped
  - 支持 10+ 并发协作用户
  - 大文档（10000字）编辑延迟 <100ms
  - 离线编辑能力（本地缓存 + 自动同步）

**Scale/Scope**:
  - 单文档并发用户数：10-50人
  - 文档大小：支持至少 50000 字
  - 表格规模：10x10 单元格
  - 格式化操作种类：15+ 种（加粗、斜体、标题、对齐、列表、代码块、表格等）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Type Safety & Code Quality ✅

- **Status**: PASS
- **Justification**: 项目将使用 TypeScript strict mode，所有新代码遵循类型安全原则
- **Action**: 在新代码模块中启用 `strict: true`，对编辑器核心、扩展系统、协作层提供明确类型定义

### II. Testing Discipline ⚠️

- **Status**: PARTIAL (需明确测试策略)
- **Mandatory Areas**:
  - TipTap 扩展（格式化扩展、表格扩展）
  - Yjs 协作同步逻辑
  - 编辑器状态转换
  - 离线同步恢复
- **Optional Areas**:
  - UI 组件渲染
  - 工具栏按钮样式
- **Action**: Phase 1 设计时明确测试边界，Phase 2 任务生成时为 mandatory 区域创建 TDD 任务

### III. User Experience Consistency ✅

- **Status**: PASS
- **IME Support**: 已在规格中明确键盘交互需求，需使用 CompositionEvent 处理中文输入
- **Keyboard Navigation**: 工具栏、表格单元格导航需支持键盘操作
- **Accessibility**: 工具栏按钮需 ARIA 标签，编辑器需支持屏幕阅读器
- **Action**: Phase 1 设计时确保 IME 兼容性，所有交互组件提供键盘和 ARIA 支持

### IV. Performance Requirements ✅

- **Status**: PASS (目标明确)
- **Targets**: 规格中的性能目标与 constitution 一致（<200ms 初始化，<16ms 输入，<100ms 格式应用）
- **Action**:
  - 使用 `useMemo` 缓存扩展配置
  - 代码分割（按需加载表格扩展等）
  - 使用 Yjs 的增量更新避免全量同步
  - Phase 1 设计时制定性能监控策略

### Development Standards ✅

- **Component Architecture**:
  - 编辑器核心：`src/editor/` (TipTap 初始化、配置管理)
  - 扩展系统：`src/extensions/` (格式化扩展、协作扩展)
  - 协作层：`src/collaboration/` (Yjs 集成、同步逻辑)
  - UI 组件：`src/components/` (工具栏、侧边栏、编辑器容器)
  - 工具函数：`src/utils/` (类型转换、存储管理)
- **Status**: PASS (架构清晰分层)

### Review & Quality Gates ✅

- **Type Checking**: 所有代码通过 `pnpm type-check`
- **Build**: 通过 `pnpm build`，bundle size 监控
- **Browser Testing**: Chrome、Safari、Firefox 最新两版本
- **Status**: PASS (已纳入 CI 流程)

### 总体评估

✅ **PASS** - 所有 constitution 检查项已满足或已制定明确行动计划

## Project Structure

### Documentation (this feature)

```
specs/001-collaborative-doc-editor/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── editor-api.md    # 编辑器 API 接口定义
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── editor/                    # 编辑器核心
│   ├── EditorProvider.tsx     # React Context 提供编辑器实例
│   ├── useEditor.ts           # 自定义 Hook，封装 TipTap 初始化
│   ├── EditorConfig.ts        # 编辑器配置管理
│   └── types.ts               # 编辑器核心类型定义
│
├── extensions/                # TipTap 扩展
│   ├── index.ts               # 扩展集合导出
│   ├── formatting/            # 格式化扩展
│   │   ├── Bold.ts
│   │   ├── Italic.ts
│   │   ├── Heading.ts
│   │   ├── TextAlign.ts
│   │   └── index.ts
│   ├── blocks/                # 块级扩展
│   │   ├── CodeBlock.ts
│   │   ├── OrderedList.ts
│   │   ├── BulletList.ts
│   │   └── index.ts
│   ├── table/                 # 表格扩展
│   │   ├── Table.ts
│   │   ├── TableRow.ts
│   │   ├── TableCell.ts
│   │   ├── TableMenu.tsx      # 表格操作菜单
│   │   └── index.ts
│   └── collaboration/         # 协作扩展
│       ├── CollaborationCursor.ts
│       ├── CollaborationExtension.ts
│       └── index.ts
│
├── collaboration/             # 协作层
│   ├── YjsProvider.tsx        # Yjs React Provider
│   ├── WebSocketProvider.ts  # WebSocket 同步提供者
│   ├── IndexedDBProvider.ts  # 本地持久化提供者
│   ├── AwarenessManager.ts   # 用户在线状态管理
│   └── types.ts               # 协作相关类型
│
├── components/                # UI 组件
│   ├── Editor/                # 编辑器容器
│   │   ├── EditorContainer.tsx
│   │   ├── EditorContent.tsx
│   │   └── EditorPlaceholder.tsx
│   ├── Toolbar/               # 工具栏
│   │   ├── Toolbar.tsx
│   │   ├── ToolbarButton.tsx
│   │   ├── ToolbarDivider.tsx
│   │   ├── FormattingTools.tsx
│   │   ├── BlockTools.tsx
│   │   ├── TableTools.tsx
│   │   └── index.ts
│   ├── Sidebar/               # 侧边栏（协作用户列表）
│   │   ├── CollaboratorList.tsx
│   │   ├── CollaboratorAvatar.tsx
│   │   └── index.ts
│   └── common/                # 通用组件
│       ├── Button.tsx
│       ├── Tooltip.tsx
│       └── Icon.tsx
│
├── utils/                     # 工具函数
│   ├── storage.ts             # IndexedDB 封装
│   ├── documentId.ts          # 文档 ID 生成和解析
│   ├── colorPalette.ts        # 协作者颜色分配
│   └── performance.ts         # 性能监控工具
│
├── types/                     # 全局类型定义
│   ├── document.ts            # 文档实体类型
│   ├── collaborator.ts        # 协作者类型
│   └── index.ts
│
├── App.tsx                    # 应用入口
├── main.tsx                   # React 渲染入口
└── vite-env.d.ts              # Vite 类型声明

tests/                         # 测试目录
├── unit/                      # 单元测试
│   ├── extensions/
│   ├── collaboration/
│   └── utils/
├── integration/               # 集成测试
│   ├── editor-initialization.test.ts
│   ├── collaboration-sync.test.ts
│   └── offline-recovery.test.ts
└── e2e/                       # 端到端测试（可选）
    └── multi-user-editing.spec.ts
```

**Structure Decision**:
采用 **单一前端项目（Single Project）** 结构。理由：
1. 编辑器是纯前端应用，协作同步通过 Yjs 提供的 WebSocket/WebRTC 传输层实现
2. 暂不需要复杂的后端 API，WebSocket 服务器可以是简单的中转服务或使用 Yjs 提供的开源服务器（y-websocket-server）
3. 模块化架构通过目录结构清晰分层：editor（核心）、extensions（功能扩展）、collaboration（协作层）、components（UI）、utils（工具）
4. 这种结构便于独立开发和测试各个模块，符合可扩展和可维护的架构要求

## Complexity Tracking

*所有 Constitution Check 项已通过，无需跟踪违规项*
