# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 TipTap 3.x + Yjs 构建的多人协作文档编辑器。项目使用 React + TypeScript + Vite，采用 pnpm 作为包管理工具。

### 核心功能

- **实时协作编辑**: 基于 Yjs 的多人实时协作
- **丰富的编辑功能**: 格式化、列表、表格、代码块等
- **用户感知**: 显示在线协作者和光标位置
- **离线持久化**: 支持 IndexedDB 本地存储

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器（自动在 http://localhost:3000 打开）
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview

# TypeScript 类型检查
pnpm type-check
```

## 核心架构

### 主要组件结构

1. **编辑器 Provider 架构** (`src/editor/`)
   - **CollaborativeEditorProvider**: 协作编辑器的统一上下文提供者
     - 整合 YjsProvider（Yjs 文档同步）和编辑器实例
     - 管理 Awareness（用户在线状态）和协作者列表
     - 提供 `useCollaborativeEditor` 和 `useCollaborativeEditorInstance` hooks
     - 自动处理连接状态和同步状态
   - **useEditor**: 编辑器初始化 hook，支持协作扩展

2. **协作基础设施** (`src/collaboration/`)
   - **YjsProvider**: Yjs 文档和 WebSocket 提供者
   - **AwarenessManager**: 管理用户在线状态和光标位置
   - 支持 IndexedDB 离线持久化

3. **配置系统** (`src/config/`)
   - **env.ts**: 类型安全的环境变量管理
   - **constants.ts**: 集中管理所有常量配置（WebSocket、编辑器、CSS类名等）

4. **工具函数** (`src/utils/`)
   - **logger.ts**: 统一的日志系统，支持模块化日志和环境控制
   - **performance.ts**: 性能监控工具
   - **colorPalette.ts**: 用户颜色生成工具

5. **通用组件** (`src/components/common/`)
   - **ErrorBoundary**: React 错误边界组件
   - **NetworkStatus**: 网络状态指示器
   - **Button/Tooltip**: 基础 UI 组件

6. **UI 组件**
   - **Toolbar** (`src/components/Toolbar/`): 编辑器工具栏
   - **Sidebar** (`src/components/Sidebar/`): 协作者列表
   - **Table** (`src/components/Table/`): 表格浮动菜单

### 关键设计模式

1. **统一的 Provider 架构**
   - **CollaborativeEditorProvider** 统一管理：
     - YjsProvider（文档同步）
     - 编辑器实例
     - Awareness（用户状态）
     - 协作者列表
     - 连接状态

2. **环境变量管理**
   - 通过 `.env.development` 和 `.env.production` 配置不同环境
   - `src/config/env.ts` 提供类型安全的访问接口
   - 支持 WebSocket URL、日志开关、重连配置等

3. **统一日志系统**
   - 模块化日志：每个模块创建独立 logger
   - 环境控制：开发环境显示所有日志，生产环境仅显示警告和错误
   - 彩色输出：DEBUG、INFO、WARN、ERROR 不同颜色

4. **类型安全**
   - 启用 TypeScript strict 模式
   - 完整的类型定义，消除所有 `any` 类型
   - 100% 类型检查通过

## TypeScript 配置

- ✅ 已启用 TypeScript **strict 模式**
- ✅ 启用 `noUnusedLocals`、`noUnusedParameters`、`noImplicitReturns`
- ✅ **0 个类型错误**，100% 类型安全
- ✅ 完整的类型定义，无 `any` 类型

## 样式系统

- 使用 CSS Modules + Less
- 类名生成规则：`[name]__[local]___[hash:base64:5]`
- 支持驼峰命名（camelCase）
- 全局 Less 变量可在 `vite.config.ts` 中的 `modifyVars` 配置

## 注意事项

1. **环境变量**
   - 开发环境使用 `.env.development`
   - 生产环境使用 `.env.production`
   - 通过 `src/config/env.ts` 访问配置，避免直接使用 `import.meta.env`

2. **日志系统**
   - 使用 `createLogger(moduleName)` 创建模块专属 logger
   - 开发环境显示所有日志，生产环境仅显示警告和错误
   - **避免使用 `console.log`**，统一使用 logger

3. **错误处理**
   - 所有用户交互区域已用 `ErrorBoundary` 包裹
   - 错误会被优雅地捕获并显示友好的 UI
   - 错误日志会自动记录到 logger

4. **类型安全**
   - 项目已启用 TypeScript strict 模式
   - 所有核心模块均有完整类型定义
   - **避免使用 `any` 类型**，使用 `unknown` 或具体类型

5. **性能优化**
   - 使用 `useMemo` 和 `useCallback` 缓存计算和回调
   - logger 在生产环境自动关闭 debug 日志
   - 性能监控工具会标记慢操作（>100ms）
