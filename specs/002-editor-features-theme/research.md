# Research & Design Decisions: 编辑器功能增强与主题切换

**Created**: 2025-10-20
**Feature**: 编辑器功能增强与主题切换
**Branch**: 002-editor-features-theme

## Purpose

本文档记录了实现编辑器功能增强和主题切换系统的研究发现和设计决策。所有技术选择都基于 TipTap 官方文档、React 最佳实践以及项目 constitution 要求。

---

## Research Area 1: TipTap 扩展集成最佳实践

### Decision: 使用官方扩展，避免自定义实现

**Rationale**:
- TipTap 官方已提供所有需要的扩展（History、Blockquote、Code、Highlight、Link、Superscript、Subscript、TextAlign）
- 官方扩展经过充分测试，兼容性和稳定性有保障
- 减少维护成本，未来升级 TipTap 版本时不会出现兼容性问题
- 符合 constitution 的"最小修改原则"（避免修改 `src/core/`）

**Alternatives Considered**:
1. **自定义扩展**: 灵活性更高，但增加维护成本，且 constitution 要求最小化核心修改
2. **混合方案（部分官方 + 部分自定义）**: 增加复杂性，不符合"简单优先"原则

**Implementation Details**:

```typescript
// src/editor/useEditor.ts 中添加扩展配置
import { useEditor } from '@tiptap/react'
import History from '@tiptap/extension-history'
import Blockquote from '@tiptap/extension-blockquote'
import Code from '@tiptap/extension-code'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import TextAlign from '@tiptap/extension-text-align'

const editor = useEditor({
  extensions: [
    History.configure({
      depth: 30, // FR-003: 至少 30 步撤销历史
    }),
    Blockquote,
    Code,
    Highlight.configure({
      multicolor: false, // 单一高亮颜色，简化 UI
    }),
    Link.configure({
      openOnClick: false, // 编辑模式下不自动打开链接
      HTMLAttributes: {
        target: '_blank', // 新标签页打开
        rel: 'noopener noreferrer', // 安全性
      },
    }),
    Superscript,
    Subscript,
    TextAlign.configure({
      types: ['heading', 'paragraph'], // 仅支持标题和段落对齐
      alignments: ['left', 'center', 'right', 'justify'], // spec 要求 justify
    }),
  ],
})
```

**References**:
- TipTap Extensions: https://tiptap.dev/docs/editor/extensions/overview
- History Extension: https://tiptap.dev/docs/editor/extensions/functionality/history
- Link Extension: https://tiptap.dev/docs/editor/extensions/marks/link

---

## Research Area 2: 主题切换系统设计

### Decision: CSS 变量 + React Context + localStorage

**Rationale**:
- **CSS 变量**: 最轻量的主题切换方案，无需重新渲染组件，符合性能要求（<300ms）
- **React Context**: 全局主题状态管理，避免 prop drilling
- **localStorage**: 简单可靠的持久化方案，无需后端支持

**Alternatives Considered**:
1. **CSS-in-JS (styled-components/emotion)**:
   - 优点：类型安全，动态样式
   - 缺点：增加 bundle size（~15-20KB），违反 constitution 的 CSS Modules 标准

2. **Less 变量 + 类名切换**:
   - 优点：符合现有 Less 工具链
   - 缺点：需要编译两套 CSS 文件，bundle size 增加更多

3. **预编译主题类（`.light-theme`, `.dark-theme`）**:
   - 优点：兼容性最好（IE11）
   - 缺点：CSS 重复定义，bundle size 大

**Implementation Details**:

#### 1. 主题配置（TypeScript 类型安全）

```typescript
// src/theme/themeConfig.ts
export type ThemeName = 'light' | 'dark'

export interface ThemeColors {
  // 背景色
  background: string
  backgroundSecondary: string
  backgroundTertiary: string

  // 文本色
  text: string
  textSecondary: string
  textMuted: string

  // 边框色
  border: string
  borderLight: string

  // 交互色
  primary: string
  primaryHover: string

  // 功能色
  success: string
  warning: string
  error: string

  // 编辑器专用
  highlight: string
  codeBackground: string
  blockquoteBorder: string
}

export const lightTheme: ThemeColors = {
  background: '#ffffff',
  backgroundSecondary: '#f5f5f5',
  backgroundTertiary: '#e8e8e8',

  text: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#8a8a8a',

  border: '#d0d0d0',
  borderLight: '#e0e0e0',

  primary: '#1890ff',
  primaryHover: '#40a9ff',

  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',

  highlight: '#fff566', // 黄色高亮（亮色主题）
  codeBackground: '#f0f0f0',
  blockquoteBorder: '#d0d0d0',
}

export const darkTheme: ThemeColors = {
  background: '#1a1a1a',
  backgroundSecondary: '#2a2a2a',
  backgroundTertiary: '#3a3a3a',

  text: '#e8e8e8',
  textSecondary: '#b8b8b8',
  textMuted: '#888888',

  border: '#4a4a4a',
  borderLight: '#3a3a3a',

  primary: '#1890ff',
  primaryHover: '#40a9ff',

  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',

  highlight: '#fffb8f', // 柔和黄色（暗色主题，避免过于刺眼）
  codeBackground: '#2a2a2a',
  blockquoteBorder: '#4a4a4a',
}

export const themes: Record<ThemeName, ThemeColors> = {
  light: lightTheme,
  dark: darkTheme,
}
```

#### 2. 主题上下文（React Context）

```typescript
// src/theme/ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { ThemeName, ThemeColors, themes } from './themeConfig'
import { getStoredTheme, setStoredTheme } from '../utils/storage'

interface ThemeContextValue {
  theme: ThemeName
  colors: ThemeColors
  toggleTheme: () => void
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [theme, setTheme] = useState<ThemeName>(() => getStoredTheme() || 'light')

  // 应用 CSS 变量
  useEffect(() => {
    const colors = themes[theme]
    const root = document.documentElement

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })

    // 保存到 localStorage
    setStoredTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const contextValue = useMemo(() => ({
    theme,
    colors: themes[theme],
    toggleTheme,
    setTheme,
  }), [theme])

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

#### 3. localStorage 工具（类型安全）

```typescript
// src/utils/storage.ts
import { ThemeName } from '../theme/themeConfig'

const THEME_STORAGE_KEY = 'tiptap-editor-theme'

export function getStoredTheme(): ThemeName | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
    return null
  } catch (error) {
    // FR-025: localStorage 不可用时返回 null（使用默认主题）
    console.warn('localStorage not available:', error)
    return null
  }
}

export function setStoredTheme(theme: ThemeName): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (error) {
    console.warn('Failed to save theme preference:', error)
  }
}
```

**Performance Optimization**:
- CSS 变量切换不触发 React 重新渲染（仅更新 DOM 属性）
- `useMemo` 缓存 context value，避免不必要的 re-render
- 主题过渡动画通过 CSS `transition` 实现（<200ms）

**References**:
- CSS Variables: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- React Context: https://react.dev/reference/react/useContext

---

## Research Area 3: 工具栏按钮状态管理

### Decision: TipTap 内置 `isActive()` API

**Rationale**:
- TipTap 编辑器提供 `editor.isActive(name)` API，实时反映当前选中内容的格式状态
- 无需手动跟踪状态，减少代码复杂度
- 自动处理 ProseMirror 状态更新，确保准确性

**Implementation Details**:

```typescript
// src/components/Toolbar/FormattingTools.tsx
import { Editor } from '@tiptap/core'

interface ToolbarButtonProps {
  editor: Editor
  format: string
  label: string
  onClick: () => void
}

function ToolbarButton({ editor, format, label, onClick }: ToolbarButtonProps) {
  const isActive = editor.isActive(format) // 自动检测激活状态

  return (
    <button
      onClick={onClick}
      className={isActive ? 'active' : ''}
      aria-pressed={isActive} // 无障碍：ARIA 状态
      aria-label={label}
    >
      {/* 图标 */}
    </button>
  )
}

// 使用示例
<ToolbarButton
  editor={editor}
  format="bold"
  label="加粗"
  onClick={() => editor.chain().focus().toggleBold().run()}
/>
```

**Edge Case Handling**:
- 撤销/重做按钮使用 `editor.can()` API 检查是否可执行
- 链接按钮：未选中文本时禁用（`editor.state.selection.empty`）

**References**:
- TipTap Editor Commands: https://tiptap.dev/docs/editor/api/commands

---

## Research Area 4: 键盘快捷键实现

### Decision: TipTap 内置快捷键系统

**Rationale**:
- TipTap 扩展自带快捷键配置（如 History 扩展已支持 Ctrl+Z/Ctrl+Y）
- 自定义快捷键可通过扩展配置或 `addKeyboardShortcuts` 方法添加
- 自动处理 macOS 的 Cmd 键映射

**Implementation Details**:

```typescript
// src/editor/keyboardShortcuts.ts
export const editorKeyboardShortcuts = {
  // History 扩展自带
  'Mod-z': () => editor.chain().focus().undo().run(),
  'Mod-Shift-z': () => editor.chain().focus().redo().run(),

  // 链接快捷键（自定义）
  'Mod-k': () => {
    const { from, to } = editor.state.selection
    if (from === to) return false // 未选中文本，不执行

    const url = window.prompt('输入链接 URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
    return true
  },
}
```

**Alternatives Considered**:
1. **全局键盘事件监听器**: 需要手动处理焦点、Cmd/Ctrl 映射，增加复杂度
2. **外部快捷键库（react-hotkeys）**: 引入额外依赖，TipTap 自带的已足够

**References**:
- TipTap Keyboard Shortcuts: https://tiptap.dev/docs/editor/extensions/functionality/keyboard-shortcuts

---

## Research Area 5: 无障碍（Accessibility）实现

### Decision: ARIA 标签 + 键盘导航

**Rationale**:
- Constitution 要求 ARIA labels 和键盘操作支持
- 工具栏按钮需要 `aria-label`、`aria-pressed`
- 键盘导航通过原生 `<button>` 元素自动支持（Tab + Space/Enter）

**Implementation Details**:

```tsx
// 工具栏按钮无障碍属性
<button
  onClick={handleClick}
  aria-label="加粗"                // 屏幕阅读器标签
  aria-pressed={isActive}          // 当前激活状态
  title="加粗 (Ctrl+B)"            // Tooltip 提示快捷键
  className={styles.toolbarButton}
>
  <BoldIcon />
</button>

// 主题切换按钮
<button
  onClick={toggleTheme}
  aria-label={theme === 'light' ? '切换到暗色主题' : '切换到亮色主题'}
  title={theme === 'light' ? '暗色模式' : '亮色模式'}
>
  {theme === 'light' ? <MoonIcon /> : <SunIcon />}
</button>
```

**Testing Checklist**:
- [ ] 所有按钮可通过 Tab 键聚焦
- [ ] Space/Enter 键可激活按钮
- [ ] 屏幕阅读器能正确读取按钮标签和状态
- [ ] 高对比度模式下按钮仍可见

**References**:
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/patterns/button/

---

## Research Area 6: 链接输入 UI 设计

### Decision: 浏览器原生 `prompt()` 初版，后续可升级为 Bubble Menu

**Rationale**:
- **初版（MVP）**: 使用 `window.prompt()` 快速实现，满足基本需求
- **未来优化**: 使用 TipTap Bubble Menu 提供更友好的浮动输入框
- 符合"简单优先"原则，避免过度设计

**Implementation Details**:

```typescript
// 初版：原生 prompt
function setLink(editor: Editor) {
  const { from, to } = editor.state.selection

  if (from === to) {
    alert('请先选择要添加链接的文本')
    return
  }

  const url = window.prompt('请输入链接 URL:')

  if (url) {
    // FR-009: 基本 URL 验证
    if (!isValidUrl(url)) {
      alert('请输入有效的 URL（需包含协议，如 https://）')
      return
    }

    editor.chain().focus().setLink({ href: url }).run()
  }
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}
```

**Future Enhancement**:
```typescript
// 未来版本：Bubble Menu（Out of scope for current spec）
import { BubbleMenu } from '@tiptap/react'

<BubbleMenu editor={editor}>
  <input
    type="url"
    placeholder="https://example.com"
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        editor.chain().focus().setLink({ href: e.currentTarget.value }).run()
      }
    }}
  />
</BubbleMenu>
```

**References**:
- TipTap Bubble Menu: https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu

---

## Research Area 7: 性能监控策略

### Decision: Lighthouse CI + 手动性能测试

**Rationale**:
- Constitution 要求 Lighthouse score ≥90
- 主题切换性能通过 Chrome DevTools Performance 面板测量
- 无需引入额外性能监控库（如 web-vitals）

**Performance Testing Plan**:

1. **主题切换性能** (<300ms)
   - 使用 Chrome DevTools Performance 记录主题切换过程
   - 测量 `toggleTheme()` 到 CSS 变量应用完成的时间
   - 确保无 layout shift（CLS = 0）

2. **Bundle Size** (+15KB gzipped)
   - 使用 `vite build` 生成生产构建
   - 检查 `dist/assets/*.js` 文件大小变化
   - 确保总 gzipped size < 150KB（constitution limit）

3. **Lighthouse CI**
   - 性能分数 ≥90
   - 无障碍分数 ≥90
   - 最佳实践分数 ≥90

**Tools**:
- Chrome DevTools Performance Panel
- Vite Bundle Visualizer: `pnpm build && npx vite-bundle-visualizer`

**References**:
- Web Performance: https://web.dev/vitals/

---

## Summary of Key Decisions

| 决策领域 | 选择方案 | 主要理由 |
|---------|---------|---------|
| TipTap 扩展 | 使用官方扩展 | 稳定性、兼容性、符合 constitution 最小修改原则 |
| 主题切换 | CSS 变量 + React Context | 性能最优（<300ms）、bundle size 最小 |
| 状态管理 | TipTap `isActive()` API | 简单可靠、自动同步 ProseMirror 状态 |
| 键盘快捷键 | TipTap 内置系统 | 自动处理 Cmd/Ctrl 映射、无额外依赖 |
| 持久化 | localStorage | 简单可靠、无需后端 |
| 链接输入 UI | 原生 `prompt()`（MVP） | 快速实现、未来可升级 Bubble Menu |
| 无障碍 | ARIA + 原生 `<button>` | 符合 constitution 要求、零学习成本 |

**All decisions align with constitution requirements and project constraints.**
