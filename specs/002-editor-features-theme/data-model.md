# Data Model: 编辑器功能增强与主题切换

**Created**: 2025-10-20
**Feature**: 编辑器功能增强与主题切换
**Branch**: 002-editor-features-theme

## Purpose

本文档定义主题配置、用户偏好、编辑历史和格式化状态的数据结构。所有类型定义遵循 TypeScript strict 模式，确保类型安全。

---

## Entity 1: Theme Configuration (主题配置)

### Description

主题配置定义了编辑器 UI 的颜色方案，包括背景色、文本色、边框色等所有视觉元素。

### Data Structure

```typescript
/**
 * 主题名称枚举
 */
export type ThemeName = 'light' | 'dark'

/**
 * 主题颜色配置接口
 * 包含所有 UI 元素的颜色定义
 */
export interface ThemeColors {
  // 背景色系
  /** 主背景色（编辑器、页面背景） */
  background: string
  /** 次要背景色（工具栏、侧边栏） */
  backgroundSecondary: string
  /** 第三背景色（hover 状态、下拉菜单） */
  backgroundTertiary: string

  // 文本色系
  /** 主文本色（正文内容） */
  text: string
  /** 次要文本色（说明文字） */
  textSecondary: string
  /** 淡化文本色（禁用状态、placeholder） */
  textMuted: string

  // 边框色系
  /** 主边框色（分隔线、按钮边框） */
  border: string
  /** 浅边框色（悬停状态、表格边框） */
  borderLight: string

  // 交互色系
  /** 主要交互色（按钮、链接） */
  primary: string
  /** 主要交互色悬停状态 */
  primaryHover: string

  // 功能色系
  /** 成功状态色 */
  success: string
  /** 警告状态色 */
  warning: string
  /** 错误状态色 */
  error: string

  // 编辑器专用色
  /** 高亮背景色（Highlight 扩展） */
  highlight: string
  /** 代码块背景色（Code 扩展） */
  codeBackground: string
  /** 引用块边框色（Blockquote 扩展） */
  blockquoteBorder: string
}

/**
 * 主题配置集合
 * 包含所有可用主题
 */
export const themes: Record<ThemeName, ThemeColors> = {
  light: { /* 亮色主题配置 */ },
  dark: { /* 暗色主题配置 */ },
}
```

### Validation Rules

- 所有颜色值必须是有效的 CSS 颜色格式（十六进制、RGB、HSL）
- 主题名称必须是 `'light'` 或 `'dark'`
- 颜色对比度必须满足 WCAG AA 标准（文本色与背景色对比度 ≥4.5:1）

### State Transitions

```
初始状态: 未加载主题
    ↓
加载默认主题 (light)
    ↓
从 localStorage 读取用户偏好
    ↓
应用用户偏好主题 (light 或 dark)
    ↓
用户切换主题
    ↓
更新 CSS 变量 + 保存到 localStorage
```

### Example Data

```typescript
// 亮色主题示例
const lightTheme: ThemeColors = {
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

  highlight: '#fff566',
  codeBackground: '#f0f0f0',
  blockquoteBorder: '#d0d0d0',
}

// 暗色主题示例
const darkTheme: ThemeColors = {
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

  highlight: '#fffb8f',
  codeBackground: '#2a2a2a',
  blockquoteBorder: '#4a4a4a',
}
```

---

## Entity 2: User Preferences (用户偏好)

### Description

用户个性化配置，存储在 localStorage 中，包含主题选择、键盘快捷键偏好等。

### Data Structure

```typescript
/**
 * 用户偏好配置接口
 */
export interface UserPreferences {
  /** 选择的主题名称 */
  theme: ThemeName

  /** 键盘快捷键是否启用 */
  keyboardShortcutsEnabled: boolean

  /** 工具栏布局偏好（预留，当前版本未实现） */
  toolbarLayout?: 'horizontal' | 'vertical'

  /** 最后更新时间（ISO 8601 格式） */
  lastUpdated: string
}
```

### Storage Format

```typescript
// localStorage key
const PREFERENCES_KEY = 'tiptap-editor-preferences'

// 存储的 JSON 数据结构
interface StoredPreferences {
  theme: 'light' | 'dark'
  keyboardShortcutsEnabled: boolean
  lastUpdated: string
}

// 示例数据
const storedData: StoredPreferences = {
  theme: 'dark',
  keyboardShortcutsEnabled: true,
  lastUpdated: '2025-10-20T10:30:00.000Z',
}
```

### Validation Rules

- `theme` 必须是 `'light'` 或 `'dark'`
- `lastUpdated` 必须是有效的 ISO 8601 日期字符串
- localStorage 不可用时，使用内存存储（会话期间有效）

### Error Handling

```typescript
/**
 * 读取用户偏好，处理所有错误情况
 */
export function getUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY)
    if (!stored) {
      return getDefaultPreferences()
    }

    const parsed: StoredPreferences = JSON.parse(stored)

    // 验证数据有效性
    if (!isValidThemeName(parsed.theme)) {
      console.warn('Invalid theme in stored preferences, using default')
      return getDefaultPreferences()
    }

    return {
      theme: parsed.theme,
      keyboardShortcutsEnabled: parsed.keyboardShortcutsEnabled ?? true,
      lastUpdated: parsed.lastUpdated,
    }
  } catch (error) {
    // localStorage 不可用或 JSON 解析失败
    console.error('Failed to load user preferences:', error)
    return getDefaultPreferences()
  }
}

function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'light',
    keyboardShortcutsEnabled: true,
    lastUpdated: new Date().toISOString(),
  }
}
```

---

## Entity 3: Edit History (编辑历史)

### Description

TipTap History 扩展内部管理的撤销/重做历史记录。此实体由 ProseMirror 状态管理，开发者无需手动维护。

### Data Structure (Internal - Read Only)

```typescript
/**
 * 编辑历史项（ProseMirror 内部结构，仅供参考）
 */
interface HistoryItem {
  /** 操作类型（由 ProseMirror 自动记录） */
  type: 'transaction'

  /** 操作前的文档状态（JSON 格式） */
  prevState: unknown

  /** 操作后的文档状态（JSON 格式） */
  nextState: unknown

  /** 时间戳 */
  timestamp: number
}

/**
 * 历史栈（ProseMirror 内部维护）
 */
interface HistoryState {
  /** 撤销栈（最近的操作在栈顶） */
  done: HistoryItem[]

  /** 重做栈 */
  undone: HistoryItem[]

  /** 最大历史深度（配置为 30） */
  depth: number
}
```

### API Access

开发者通过 TipTap 编辑器 API 访问历史功能，无需直接操作数据结构：

```typescript
// 检查是否可以撤销
const canUndo = editor.can().undo()

// 执行撤销
editor.chain().focus().undo().run()

// 检查是否可以重做
const canRedo = editor.can().redo()

// 执行重做
editor.chain().focus().redo().run()
```

### Configuration

```typescript
// 在编辑器初始化时配置历史深度（FR-003 要求至少 30 步）
History.configure({
  depth: 30, // 最大历史记录数
  newGroupDelay: 500, // 操作分组延迟（ms）
})
```

---

## Entity 4: Format State (格式化状态)

### Description

当前光标位置或选中内容的格式状态，用于更新工具栏按钮的激活状态。由 TipTap 编辑器自动维护。

### Data Structure (Internal - Read Only)

```typescript
/**
 * 格式化状态接口（派生自 ProseMirror EditorState）
 */
export interface FormatState {
  /** 是否粗体 */
  isBold: boolean

  /** 是否斜体 */
  isItalic: boolean

  /** 是否下划线 */
  isUnderline: boolean

  /** 是否删除线 */
  isStrike: boolean

  /** 是否代码 */
  isCode: boolean

  /** 是否高亮 */
  isHighlight: boolean

  /** 是否链接 */
  isLink: boolean

  /** 当前链接的 href（如果是链接） */
  linkHref: string | null

  /** 是否上标 */
  isSuperscript: boolean

  /** 是否下标 */
  isSubscript: boolean

  /** 是否引用块 */
  isBlockquote: boolean

  /** 当前文本对齐方式 */
  textAlign: 'left' | 'center' | 'right' | 'justify' | null

  /** 当前标题级别（1-6，null 表示非标题） */
  headingLevel: number | null
}
```

### API Access

```typescript
/**
 * 获取当前格式化状态（实时计算）
 */
export function getFormatState(editor: Editor): FormatState {
  return {
    isBold: editor.isActive('bold'),
    isItalic: editor.isActive('italic'),
    isUnderline: editor.isActive('underline'),
    isStrike: editor.isActive('strike'),
    isCode: editor.isActive('code'),
    isHighlight: editor.isActive('highlight'),
    isLink: editor.isActive('link'),
    linkHref: editor.getAttributes('link').href || null,
    isSuperscript: editor.isActive('superscript'),
    isSubscript: editor.isActive('subscript'),
    isBlockquote: editor.isActive('blockquote'),
    textAlign: editor.getAttributes('textAlign').textAlign || null,
    headingLevel: editor.isActive('heading')
      ? editor.getAttributes('heading').level
      : null,
  }
}
```

### Usage in Components

```tsx
// 工具栏按钮自动响应格式化状态变化
function BoldButton({ editor }: { editor: Editor }) {
  const isBold = editor.isActive('bold')

  return (
    <button
      onClick={() => editor.chain().focus().toggleBold().run()}
      className={isBold ? 'active' : ''}
      aria-pressed={isBold}
    >
      <BoldIcon />
    </button>
  )
}
```

---

## Relationships

```
UserPreferences (用户偏好)
    ├── theme: ThemeName ──→ themes[ThemeName]: ThemeColors
    └── lastUpdated: string

ThemeColors (主题配置)
    ├── 应用到 CSS 变量 (--theme-*)
    └── 被所有 UI 组件引用

EditHistory (编辑历史)
    ├── 由 TipTap History 扩展管理
    └── 影响工具栏按钮禁用状态（canUndo/canRedo）

FormatState (格式化状态)
    ├── 由 ProseMirror EditorState 派生
    └── 影响工具栏按钮激活状态（isActive）
```

---

## Data Flow Diagram

```
User Action (点击主题切换按钮)
    ↓
ThemeProvider.toggleTheme()
    ↓
setTheme(newTheme)
    ↓
useEffect (theme 变化)
    ↓
应用 CSS 变量 (document.documentElement.style.setProperty)
    ↓
保存到 localStorage (setStoredTheme)
    ↓
UI 重新渲染（CSS 变量生效）

---

User Action (点击格式化按钮)
    ↓
editor.chain().focus().toggleBold().run()
    ↓
ProseMirror transaction
    ↓
更新 EditorState
    ↓
触发 History 扩展记录操作
    ↓
触发 React 更新（editor.on('update')）
    ↓
工具栏按钮重新计算 isActive 状态
    ↓
UI 反映新的激活状态
```

---

## Summary

所有数据实体遵循以下设计原则：

1. **类型安全**: 使用 TypeScript 严格类型，避免 `any`
2. **不可变性**: 主题配置和用户偏好使用不可变数据结构
3. **单一数据源**:
   - 主题状态：React Context
   - 编辑状态：TipTap/ProseMirror
   - 用户偏好：localStorage
4. **错误处理**: 所有 localStorage 操作都有 fallback 机制
5. **性能优化**: 使用 `useMemo` 缓存派生状态，避免不必要的计算

**All data models align with TypeScript strict mode and constitution requirements.**
