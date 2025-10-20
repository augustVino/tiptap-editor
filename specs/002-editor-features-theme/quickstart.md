# Quick Start Guide: 编辑器功能增强与主题切换

**Created**: 2025-10-20
**Feature**: 编辑器功能增强与主题切换
**Branch**: 002-editor-features-theme

## 目标读者

本指南面向使用 TipTap 编辑器的开发者和最终用户，介绍如何使用新增的格式化工具和主题切换功能。

---

## For Developers (开发者指南)

### 安装依赖

首先，确保安装所需的 TipTap 扩展：

```bash
pnpm add @tiptap/extension-blockquote@3.7.2 \
         @tiptap/extension-code@3.7.2 \
         @tiptap/extension-highlight@3.7.2 \
         @tiptap/extension-link@3.7.2 \
         @tiptap/extension-superscript@3.7.2 \
         @tiptap/extension-subscript@3.7.2
```

注意：`@tiptap/extension-history` 和 `@tiptap/extension-text-align` 已经在 package.json 中安装。

### 集成主题提供者

在应用根组件中包裹 `ThemeProvider`：

```tsx
// src/App.tsx
import { ThemeProvider } from './theme/ThemeProvider'

function App() {
  return (
    <ThemeProvider>
      {/* 你的应用组件 */}
      <CollaborativeEditor documentId="doc-001" userName="User" />
    </ThemeProvider>
  )
}
```

### 使用主题切换

在任何组件中使用 `useTheme` Hook：

```tsx
// src/components/Toolbar/ThemeToggle.tsx
import { useTheme } from '../../theme/useTheme'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'light' ? '切换到暗色主题' : '切换到亮色主题'}
      className={styles.themeToggle}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

### 添加格式化按钮

在工具栏中添加新的格式化按钮：

```tsx
// src/components/Toolbar/FormattingTools.tsx
import { Editor } from '@tiptap/core'

interface FormattingToolsProps {
  editor: Editor
}

export function FormattingTools({ editor }: FormattingToolsProps) {
  return (
    <div className={styles.formattingTools}>
      {/* 撤销/重做 */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        aria-label="撤销"
      >
        ↶ Undo
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        aria-label="重做"
      >
        ↷ Redo
      </button>

      {/* 引用块 */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'active' : ''}
        aria-pressed={editor.isActive('blockquote')}
        aria-label="引用块"
      >
        " Quote
      </button>

      {/* 内联代码 */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'active' : ''}
        aria-pressed={editor.isActive('code')}
        aria-label="代码"
      >
        {'<>'} Code
      </button>

      {/* 高亮 */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'active' : ''}
        aria-pressed={editor.isActive('highlight')}
        aria-label="高亮"
      >
        🖍 Highlight
      </button>

      {/* 链接 */}
      <button
        onClick={() => setLink(editor)}
        className={editor.isActive('link') ? 'active' : ''}
        aria-pressed={editor.isActive('link')}
        aria-label="插入链接"
      >
        🔗 Link
      </button>

      {/* 上标/下标 */}
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={editor.isActive('superscript') ? 'active' : ''}
        aria-pressed={editor.isActive('superscript')}
        aria-label="上标"
      >
        x²
      </button>

      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={editor.isActive('subscript') ? 'active' : ''}
        aria-pressed={editor.isActive('subscript')}
        aria-label="下标"
      >
        x₂
      </button>

      {/* 对齐方式 */}
      <button
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}
        aria-pressed={editor.isActive({ textAlign: 'justify' })}
        aria-label="两端对齐"
      >
        ≣ Justify
      </button>
    </div>
  )
}

// 链接输入辅助函数
function setLink(editor: Editor) {
  const { from, to } = editor.state.selection

  if (from === to) {
    alert('请先选择要添加链接的文本')
    return
  }

  const url = window.prompt('请输入链接 URL:')

  if (url) {
    // 基本 URL 验证
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

### 配置 TipTap 扩展

在编辑器初始化时添加新扩展：

```tsx
// src/editor/useEditor.ts
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import History from '@tiptap/extension-history'
import Blockquote from '@tiptap/extension-blockquote'
import Code from '@tiptap/extension-code'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import TextAlign from '@tiptap/extension-text-align'

export function useCollaborativeEditor(config) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // 使用独立的 History 扩展
      }),

      // 新增扩展
      History.configure({
        depth: 30, // 至少 30 步撤销历史
      }),
      Blockquote,
      Code,
      Highlight.configure({
        multicolor: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Superscript,
      Subscript,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),

      // ... 其他现有扩展
    ],
    // ... 其他配置
  })

  return editor
}
```

### 使用 CSS 变量

在组件样式中引用主题变量：

```less
// src/components/Toolbar/Toolbar.module.less
.toolbar {
  background-color: var(--theme-backgroundSecondary);
  border-bottom: 1px solid var(--theme-border);
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 4px;

  button {
    background-color: var(--theme-background);
    color: var(--theme-text);
    border: 1px solid var(--theme-borderLight);
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--theme-backgroundTertiary);
      border-color: var(--theme-border);
    }

    &.active {
      background-color: var(--theme-primary);
      color: white;
      border-color: var(--theme-primary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}
```

---

## For End Users (最终用户指南)

### 使用格式化工具

#### 撤销和重做

- **撤销**: 点击工具栏的 ↶ 按钮，或按 `Ctrl+Z` (macOS: `Cmd+Z`)
- **重做**: 点击工具栏的 ↷ 按钮，或按 `Ctrl+Y` / `Ctrl+Shift+Z` (macOS: `Cmd+Shift+Z`)

#### 引用块

1. 选中要引用的文本
2. 点击工具栏的 " Quote 按钮
3. 选中的文本将显示为引用块样式（左侧有垂直边框）
4. 再次点击按钮可移除引用格式

#### 代码

1. 选中要标记为代码的文本
2. 点击工具栏的 <> Code 按钮
3. 文本将显示为等宽字体，并带有灰色背景
4. 适用于标记变量名、函数名等

#### 高亮

1. 选中要高亮显示的文本
2. 点击工具栏的 🖍 Highlight 按钮
3. 文本背景将变为黄色（亮色主题）或柔和黄色（暗色主题）
4. 再次点击可移除高亮

#### 插入链接

1. 选中要添加链接的文本
2. 点击工具栏的 🔗 Link 按钮，或按 `Ctrl+K` (macOS: `Cmd+K`)
3. 在弹出的对话框中输入完整的 URL（必须包含 `http://` 或 `https://`）
4. 点击确定，文本将变为蓝色可点击的链接

**提示**: 要移除链接，将光标放在链接文本中，再次点击 Link 按钮。

#### 上标和下标

- **上标** (如 x²):
  1. 选中要变为上标的文本
  2. 点击 x² 按钮
  3. 文本将显示在基线上方（适用于数学公式、脚注标记）

- **下标** (如 H₂O):
  1. 选中要变为下标的文本
  2. 点击 x₂ 按钮
  3. 文本将显示在基线下方（适用于化学式）

#### 文本对齐

- 点击 ≣ Justify 按钮可将段落设置为两端对齐
- 配合其他对齐按钮（左对齐、居中、右对齐）使用

### 切换主题

1. 在编辑器工具栏右侧找到主题切换按钮
2. 点击按钮：
   - 🌙 图标：当前为亮色主题，点击切换到暗色主题
   - ☀️ 图标：当前为暗色主题，点击切换到亮色主题
3. 主题立即生效，所有颜色（背景、文本、按钮等）会平滑过渡
4. 你的选择会自动保存，下次打开编辑器时会使用相同主题

**场景建议**:
- **亮色主题**: 适合光线充足的环境（白天、办公室）
- **暗色主题**: 适合低光环境（夜间、减少眼睛疲劳）

### 键盘快捷键

| 功能 | Windows/Linux | macOS |
|-----|--------------|-------|
| 撤销 | Ctrl + Z | Cmd + Z |
| 重做 | Ctrl + Y 或 Ctrl + Shift + Z | Cmd + Shift + Z |
| 插入链接 | Ctrl + K | Cmd + K |

**提示**: 将鼠标悬停在工具栏按钮上可以看到快捷键提示。

---

## Troubleshooting (常见问题)

### 主题切换后页面闪烁

**原因**: 浏览器可能缓存了旧的主题样式。

**解决方案**:
1. 硬刷新页面（Ctrl+Shift+R / Cmd+Shift+R）
2. 清除浏览器缓存

### 主题偏好没有保存

**原因**: localStorage 可能被禁用或浏览器处于隐私模式。

**解决方案**:
1. 检查浏览器设置，确保允许网站存储数据
2. 退出隐私/无痕浏览模式
3. 如果 localStorage 不可用，主题仍会在当前会话中保持

### 撤销/重做按钮禁用

**原因**: 没有可撤销/重做的操作。

**说明**: 这是正常行为。当没有编辑历史时，撤销按钮会自动禁用。开始编辑后按钮会启用。

### 链接按钮点击无反应

**原因**: 没有选中文本。

**解决方案**:
1. 先选中要添加链接的文本
2. 然后点击链接按钮

### 格式化按钮不显示激活状态

**原因**: 可能是扩展未正确加载。

**解决方案**:
1. 检查浏览器控制台是否有错误
2. 确保所有 TipTap 扩展已正确安装
3. 尝试刷新页面

---

## Performance Tips (性能优化建议)

### For Developers

1. **懒加载图标**: 如果使用图标库，考虑按需加载：
   ```tsx
   const BoldIcon = lazy(() => import('./icons/BoldIcon'))
   ```

2. **Memoize 工具栏组件**: 避免不必要的重新渲染：
   ```tsx
   const FormattingTools = React.memo(({ editor }) => {
     // ...
   })
   ```

3. **防抖主题切换**: 防止用户快速点击：
   ```tsx
   const [isChanging, setIsChanging] = useState(false)

   const handleToggle = () => {
     if (isChanging) return
     setIsChanging(true)
     toggleTheme()
     setTimeout(() => setIsChanging(false), 300)
   }
   ```

### For Users

- **关闭未使用的浏览器标签页**: 减少内存占用
- **使用最新版本的浏览器**: 获得最佳性能

---

## Next Steps

- **阅读完整规格**: [spec.md](./spec.md)
- **查看实现计划**: [plan.md](./plan.md)
- **了解数据模型**: [data-model.md](./data-model.md)
- **执行任务**: 运行 `/speckit.tasks` 生成实现任务清单

---

**Questions or Issues?**
请查阅 TipTap 官方文档: https://tiptap.dev/docs
