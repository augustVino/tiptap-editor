/**
 * CollaborativeToolbar Component - 协作编辑器工具栏
 * 不依赖 EditorProvider，直接接收 editor 实例
 * @module components/Toolbar/CollaborativeToolbar
 */

import React from 'react'
import type { Editor } from '@tiptap/react'
import { ToolbarButton } from './ToolbarButton'
import { ToolbarDivider } from './ToolbarDivider'
import styles from './Toolbar.module.less'

export interface CollaborativeToolbarProps {
  /** TipTap 编辑器实例 */
  editor: Editor | null
}

export function CollaborativeToolbar(props: CollaborativeToolbarProps): React.ReactElement | null {
  const { editor } = props

  if (!editor) {
    return null
  }

  return (
    <div className={styles.toolbar}>
      {/* 格式化工具 */}
      <ToolbarButton
        icon={<strong>B</strong>}
        tooltip="加粗 (Ctrl+B)"
        isActive={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon={<em>I</em>}
        tooltip="斜体 (Ctrl+I)"
        isActive={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        icon={<u>U</u>}
        tooltip="下划线 (Ctrl+U)"
        isActive={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        icon={<s>S</s>}
        tooltip="删除线 (Ctrl+Shift+X)"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <ToolbarDivider />

      {/* 标题 */}
      <ToolbarButton
        icon={<span>H1</span>}
        tooltip="标题 1 (Ctrl+Alt+1)"
        isActive={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        icon={<span>H2</span>}
        tooltip="标题 2 (Ctrl+Alt+2)"
        isActive={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        icon={<span>H3</span>}
        tooltip="标题 3 (Ctrl+Alt+3)"
        isActive={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />

      <ToolbarDivider />

      {/* 文本对齐 */}
      <ToolbarButton
        icon={<span>≡</span>}
        tooltip="左对齐 (Ctrl+Shift+L)"
        isActive={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      />
      <ToolbarButton
        icon={<span>≣</span>}
        tooltip="居中 (Ctrl+Shift+E)"
        isActive={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      />
      <ToolbarButton
        icon={<span>≡</span>}
        tooltip="右对齐 (Ctrl+Shift+R)"
        isActive={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      />

      <ToolbarDivider />

      {/* 列表 */}
      <ToolbarButton
        icon={<span>1.</span>}
        tooltip="有序列表 (Ctrl+Shift+7)"
        isActive={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        icon={<span>•</span>}
        tooltip="无序列表 (Ctrl+Shift+8)"
        isActive={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />

      <ToolbarDivider />

      {/* 代码块 */}
      <ToolbarButton
        icon={<span>{'<>'}</span>}
        tooltip="代码块 (Ctrl+Alt+C)"
        isActive={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />
    </div>
  )
}
