# Implementation Plan: 编辑器功能增强与主题切换

**Branch**: `002-editor-features-theme` | **Date**: 2025-10-20 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-editor-features-theme/spec.md`

## Summary

为 TipTap 编辑器添加完整的文本格式化工具栏功能（撤销/重做、引用块、代码、高亮、链接、上下标、对齐方式）以及亮色/暗色主题切换系统。主题切换按钮位于工具栏右侧，支持本地持久化和即时切换动画。

技术方法：
- 使用 TipTap 官方扩展（History、Blockquote、Code、Highlight、Link、Superscript、Subscript、TextAlign）
- CSS 变量系统实现主题切换
- localStorage 存储主题偏好
- React Context 管理主题状态

## Technical Context

**Language/Version**: TypeScript 5.9.2 (strict mode enabled)
**Primary Dependencies**:
- React 18.3.1
- TipTap 3.7.2 (core + extensions)
- Vite 5.4.1 (build tool)
- Less 4.4.0 (CSS preprocessor)

**Storage**: localStorage (theme preference persistence)
**Testing**: Vitest 3.2.4 + @testing-library/react 16.3.0
**Target Platform**: Web (modern browsers: Chrome/Safari/Firefox latest 2 versions)
**Project Type**: Single web application (React SPA)
**Performance Goals**:
- 主题切换 <300ms
- 工具栏按钮响应 <100ms
- 格式化操作完成 <2s

**Constraints**:
- 编辑器初始化保持 <200ms（constitution requirement）
- Bundle size 增长 <20KB gzipped
- 支持 IME 输入（中文输入法）
- 无障碍：键盘导航 + ARIA 标签

**Scale/Scope**:
- 新增 14 个工具栏按钮组件
- 2 个主题配置（亮色/暗色）
- ~30 个 CSS 变量（颜色系统）
- 约 500-800 行新代码

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Type Safety & Code Quality ✅

- [x] TypeScript strict mode enabled (already true in tsconfig.json)
- [x] No `any` types in new code
- [x] Explicit return types for exported functions
- [x] Type guards for theme configuration runtime validation
- [x] TSDoc comments for complex theme types

**Status**: PASS - Project already uses strict TypeScript. New code will maintain this standard.

### Testing Discipline ⚠️

**Mandatory Testing** (before implementation):
- [x] 工具栏按钮交互（用户点击、键盘快捷键触发）
- [x] 主题切换状态管理（切换逻辑、持久化）
- [x] TipTap 扩展集成（确保格式化命令正确触发）

**Optional Testing**:
- [ ] UI component styling (工具栏按钮视觉样式)
- [ ] 主题 CSS 变量生成（静态配置）

**Status**: CONDITIONAL PASS - 核心交互逻辑必须测试，UI 渲染可选。

**Test Plan**:
```
tests/
├── unit/
│   ├── theme-manager.test.ts      # 主题状态管理
│   ├── toolbar-actions.test.ts    # 工具栏按钮行为
│   └── keyboard-shortcuts.test.ts # 快捷键触发
└── integration/
    └── editor-formatting.test.ts  # TipTap 扩展集成测试
```

### User Experience Consistency ✅

- [x] IME Support: 格式化操作不干扰 IME 输入（使用现有 CompositionStateManager 模式）
- [x] Keyboard Navigation: 工具栏按钮支持 Tab 导航 + Space/Enter 激活
- [x] Accessibility:
  - ARIA labels for all toolbar buttons
  - 主题切换按钮 aria-label="切换主题"
  - 快捷键提示（Tooltip 显示）
- [x] Visual Feedback:
  - 按钮激活状态（光标在格式化文本中时高亮）
  - 主题切换过渡动画（<200ms）
- [x] Mobile Responsiveness: 触摸目标 ≥44px，工具栏按钮适配触摸

**Status**: PASS - 设计符合 constitution UX 要求。

### Performance Requirements ✅

**Non-Negotiable Targets**:
- [x] Editor initialization: <200ms (不增加初始化时间)
- [x] Keystroke response: <16ms (格式化命令异步执行，不阻塞输入)
- [x] 主题切换: <300ms (spec requirement，优于 constitution 的通用标准)
- [x] Bundle size: +15KB gzipped (未超过 constitution 的 150KB 总限制)

**Optimization Strategies**:
- `useMemo` for theme configuration objects
- CSS 变量切换（避免重新渲染所有组件）
- 懒加载图标库（如果引入新图标）
- 防抖：主题切换动画期间禁用重复点击

**Status**: PASS - 性能目标明确且可实现。

## Development Standards Compliance

**Component Architecture** ✅:
- 工具栏按钮组件: `src/components/Toolbar/`（扩展现有）
- 主题管理: `src/theme/` (新建)
  - `ThemeProvider.tsx` (React Context)
  - `themeConfig.ts` (颜色变量定义)
  - `useTheme.ts` (自定义 Hook)

**Extension Configuration** ✅:
- TipTap 扩展在 `src/editor/useEditor.ts` 中配置
- 使用官方扩展，无需修改 `src/core/`（符合 constitution 最小修改原则）

**Styling Standards** ✅:
- CSS Modules + Less（已有模式）
- 主题变量定义在 Less 全局变量（`vite.config.ts` modifyVars）
- BEM 命名通过 CSS Modules 自动生成

**Dependency Management** ✅:
- 新增 TipTap 扩展（如果未安装）：
  - `@tiptap/extension-blockquote` (已安装)
  - `@tiptap/extension-code` (需确认)
  - `@tiptap/extension-highlight` (需安装)
  - `@tiptap/extension-link` (需安装)
  - `@tiptap/extension-superscript` (需安装)
  - `@tiptap/extension-subscript` (需安装)
- Pin exact versions (遵循 pnpm + package.json 现有模式)

## Project Structure

### Documentation (this feature)

```
specs/002-editor-features-theme/
├── plan.md              # This file
├── research.md          # Phase 0 output (研究 TipTap 扩展最佳实践)
├── data-model.md        # Phase 1 output (主题配置数据模型)
├── quickstart.md        # Phase 1 output (使用指南)
├── contracts/           # Phase 1 output (API contracts - 如果需要)
└── tasks.md             # Phase 2 output (NOT created by this command)
```

### Source Code (repository root)

```
src/
├── components/
│   ├── Toolbar/
│   │   ├── CollaborativeToolbar.tsx         # 现有（需扩展）
│   │   ├── FormattingTools.tsx              # 新增：格式化按钮组
│   │   ├── HistoryTools.tsx                 # 新增：撤销/重做按钮
│   │   ├── AlignmentTools.tsx               # 新增：对齐按钮
│   │   ├── ThemeToggle.tsx                  # 新增：主题切换按钮
│   │   └── Toolbar.module.less              # 扩展样式
│   └── common/
│       └── Button/                          # 现有（复用）
│
├── theme/                                   # 新建目录
│   ├── ThemeProvider.tsx                    # 主题上下文提供者
│   ├── useTheme.ts                          # 主题 Hook
│   ├── themeConfig.ts                       # 主题颜色配置
│   └── themes.less                          # 主题 CSS 变量
│
├── editor/
│   ├── useEditor.ts                         # 扩展：添加新 TipTap 扩展
│   └── keyboardShortcuts.ts                 # 扩展：添加新快捷键
│
└── utils/
    └── storage.ts                           # 新增：localStorage 工具

tests/
├── unit/
│   ├── theme-manager.test.ts
│   ├── toolbar-actions.test.ts
│   └── keyboard-shortcuts.test.ts
└── integration/
    └── editor-formatting.test.ts
```

**Structure Decision**: 单一项目结构（src/），符合现有架构。新增 `src/theme/` 目录统一管理主题相关逻辑，工具栏组件扩展在现有 `src/components/Toolbar/` 目录。

## Complexity Tracking

*No constitution violations detected. This section is empty.*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

**Justification**: 此功能完全符合 constitution 要求：
- 使用现有技术栈（React + TypeScript + TipTap）
- 无新增复杂抽象（直接使用 React Context）
- 遵循现有架构模式（CSS Modules + Less）
- 性能目标明确且可实现

---

## Post-Design Constitution Re-Check

*GATE: Re-evaluate after Phase 1 design complete.*

### Type Safety & Code Quality ✅

**Re-validation**:
- [x] All data models defined with strict TypeScript types (see data-model.md)
- [x] No `any` types in research.md examples
- [x] Explicit return types documented in all function signatures
- [x] Type guards implemented for `ThemeName` and `UserPreferences` validation
- [x] TSDoc comments added to all interfaces (ThemeColors, UserPreferences, etc.)

**Status**: PASS - Design phase maintains strict type safety standards.

**Evidence**:
- `ThemeColors` interface: 18 strictly typed properties
- `UserPreferences` with runtime validation functions
- Type guards: `isValidThemeName()`, `isValidUrl()`

### Testing Discipline ✅

**Re-validation**:
- [x] Test plan defined in plan.md (4 test files)
- [x] Core interactions identified for mandatory testing:
  - Theme state management (unit test)
  - Toolbar button behaviors (unit test)
  - TipTap extension integration (integration test)
- [x] UI rendering tests marked as optional

**Status**: PASS - Test coverage aligns with constitution mandatory/optional rules.

**Test Files Planned**:
```
tests/unit/theme-manager.test.ts       ✅ Mandatory
tests/unit/toolbar-actions.test.ts     ✅ Mandatory
tests/unit/keyboard-shortcuts.test.ts  ✅ Mandatory
tests/integration/editor-formatting.test.ts ✅ Mandatory
```

### User Experience Consistency ✅

**Re-validation**:
- [x] IME support: No keyboard event blocking (TipTap handles composition events)
- [x] Keyboard navigation: All buttons use native `<button>` elements (Tab navigation automatic)
- [x] Accessibility: ARIA labels documented in quickstart.md
  - Example: `aria-label="切换主题"`, `aria-pressed={isActive}`
- [x] Visual feedback: CSS transitions <200ms (documented in research.md)
- [x] Mobile responsiveness: Touch targets ≥44px (noted in constitution check)

**Status**: PASS - All UX requirements addressed in design.

**Evidence**:
- quickstart.md includes full ARIA implementation examples
- research.md specifies CSS transition duration: <200ms
- Button components designed with 44px minimum touch targets

### Performance Requirements ✅

**Re-validation**:
- [x] Editor initialization: No new extensions loaded synchronously (+0ms impact)
- [x] Theme switching: CSS variables only (<300ms, tested in research.md)
- [x] Bundle size: Estimated +15KB gzipped (breakdown below)
- [x] Optimization strategies documented in research.md

**Bundle Size Breakdown** (estimated):
```
主题系统代码:           ~3KB
TipTap 扩展 (6 个新增):  ~10KB
工具栏按钮组件:          ~2KB
-----------------------------------
Total:                  ~15KB gzipped
```

**Status**: PASS - All performance targets achievable with documented optimizations.

**Performance Optimizations**:
- `useMemo` for theme config objects
- CSS variable switching (no React re-renders)
- Lazy loading icons (if introduced)
- Debounced theme toggle

### Development Standards Compliance ✅

**Re-validation**:
- [x] Component architecture follows existing patterns (src/components/Toolbar/)
- [x] New directory `src/theme/` added for theme management (clean separation)
- [x] TipTap extensions configured in `src/editor/useEditor.ts` (no `src/core/` modifications)
- [x] CSS Modules + Less (consistent with existing codebase)
- [x] pnpm for dependency management (enforced by packageManager field)

**Status**: PASS - All development standards maintained.

**Directory Structure Verified**:
```
src/theme/               ✅ New directory (clean separation)
src/components/Toolbar/  ✅ Extends existing
src/editor/useEditor.ts  ✅ Extends existing
src/utils/storage.ts     ✅ New utility (follows pattern)
```

---

## Final Gate Approval

**Constitution Check Result**: ✅ **ALL GATES PASSED**

**Summary**:
- Type Safety: Strict TypeScript throughout
- Testing: Mandatory tests identified, optional tests skipped
- UX: Full IME, keyboard, accessibility, mobile support
- Performance: <300ms theme switch, +15KB bundle
- Standards: No constitution violations

**Approval for Phase 2 (Tasks Generation)**: ✅ **APPROVED**

Next step: Run `/speckit.tasks` to generate implementation task breakdown.
