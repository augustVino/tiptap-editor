/**
 * EditorContent - 编辑器内容组件
 * @module components/Editor/EditorContent
 */

import React from 'react'
import { EditorContent as TiptapEditorContent } from '@tiptap/react'
import { useEditorContext } from '../../editor/EditorProvider'
import styles from './EditorContent.module.less'

/**
 * EditorContent 组件
 * 渲染 TipTap 编辑器的可编辑内容区域
 */
export function EditorContent(): React.ReactElement {
  const { editor } = useEditorContext()

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <div className={styles.editorContentWrapper}>
      <TiptapEditorContent editor={editor} />
    </div>
  )
}
