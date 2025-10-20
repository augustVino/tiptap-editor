/**
 * 格式化工具栏组件
 * @module components/Toolbar/FormattingTools
 */

import React from 'react'
import { useEditorContext } from '../../editor/EditorProvider'
import { ToolbarButton } from './ToolbarButton'

/**
 * 格式化工具栏
 * 提供加粗、斜体、下划线、删除线按钮
 */
export function FormattingTools(): React.ReactElement {
  const { editor } = useEditorContext()

  if (!editor) {
    return <></>
  }

  return (
    <div className="formatting-tools">
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
        tooltip="删除线"
        isActive={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
    </div>
  )
}
