/**
 * BlockTools Component - 块级格式化工具栏
 * @module components/Toolbar/BlockTools
 */

import React from 'react'
import { useEditorContext } from '../../editor/EditorProvider'
import { ToolbarButton } from './ToolbarButton'
import { ToolbarDivider } from './ToolbarDivider'

export function BlockTools(): React.ReactElement | null {
  const { editor } = useEditorContext()

  if (!editor) {
    return null
  }

  return (
    <>
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
    </>
  )
}
