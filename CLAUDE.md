# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 TipTap 的富文本编辑器项目，重点实现了高度自定义的 Mention（@提及）功能。项目使用 React + TypeScript + Vite，采用 pnpm 作为包管理工具。

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

1. **RichInput** (`src/components/RichInput/`)
   - 项目的核心可复用组件，封装了完整的 TipTap 编辑器功能
   - 通过 `useTiptapEditor` hook 管理编辑器实例和扩展
   - 支持三种内容输出类型：`html`、`text`、`json`
   - 提供 ref API 用于外部控制编辑器（focus、clear、setContent 等）

2. **自定义 TipTap 核心** (`src/core/`)
   - `suggestion/`: 修改自 `@tiptap/suggestion`，用于实现自定义建议逻辑
   - `extension-mention/`: 修改自 `@tiptap/extension-mention`，实现自定义 mention 功能
   - 这些是从官方包复制并修改的版本，用于实现特定业务需求

3. **Mention 扩展系统** (`src/components/RichInput/extensions/mentions/`)
   - `MentionNodeView/`: 自定义 mention 节点的渲染
   - `configure/`: mention 交互逻辑配置
     - `withMentionInteraction.tsx`: 高阶组件，为列表组件添加交互功能（键盘导航、选择等）
     - `CompositionStateManager.ts`: 管理中文输入法状态
     - `List/index.tsx`: mention 列表的默认实现
   - 支持自定义列表组件和渲染组件

4. **AtMention 组件** (`src/components/AtMention/`)
   - 业务层的 mention 实现示例
   - `AtList`: 显示客户和职位的 mention 列表
   - `AtMentionTag`: mention 标签的渲染
   - `Highlight`: 高亮搜索关键词的工具组件

### 关键设计模式

1. **扩展配置系统**
   - 通过 `MentionExtensionOption` 配置 mention 功能
   - 每个 mention 类型需要提供：
     - `name`: 唯一标识符
     - `suggestion`: 建议配置（触发字符、items 获取函数等）
     - `listComponent`: 列表渲染组件
     - `renderComponent`: mention 标签渲染组件
     - `addSourceAttr`: 是否添加源数据属性

2. **响应式扩展更新**
   - `useTiptapEditor` 监听 mentions 配置变化，动态更新编辑器扩展
   - 使用 `useLatest` hook 确保回调始终引用最新值

3. **内容类型处理**
   - 根据 `submitType` 参数决定内容的获取和比较方式
   - 支持受控和非受控模式

## TypeScript 配置

- 当前 TypeScript 配置较为宽松（`strict: false`）
- 允许隐式 any、未使用变量等
- 如需添加类型检查，可逐步收紧 `tsconfig.json` 配置

## 样式系统

- 使用 CSS Modules + Less
- 类名生成规则：`[name]__[local]___[hash:base64:5]`
- 支持驼峰命名（camelCase）
- 全局 Less 变量可在 `vite.config.ts` 中的 `modifyVars` 配置

## 注意事项

1. **自定义核心模块**
   - `src/core/` 中的代码是从 TipTap 官方包修改而来
   - 更新时需谨慎，避免与官方版本混淆

2. **Mention 交互**
   - `withMentionInteraction` HOC 为列表组件提供完整的键盘和鼠标交互
   - 处理中文输入法时使用 `CompositionStateManager` 避免冲突

3. **异步数据加载**
   - `suggestion.items` 函数支持异步返回
   - 示例见 `App.tsx` 中的 `getAtListAjax` 实现

4. **性能优化**
   - mention 配置使用 `useMemo` 缓存
   - 大量数据时考虑虚拟滚动（当前未实现）
