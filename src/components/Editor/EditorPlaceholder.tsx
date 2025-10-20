/**
 * EditorPlaceholder - 编辑器占位符组件
 * @module components/Editor/EditorPlaceholder
 */

import React from 'react'

export interface EditorPlaceholderProps {
  /** 占位符文本 */
  text: string
  /** 是否显示 */
  show: boolean
}

/**
 * EditorPlaceholder 组件
 * 当编辑器为空时显示的占位符
 *
 * 注意：TipTap 3.x 的 Placeholder 扩展已经内置处理了占位符显示
 * 这个组件主要用于需要自定义占位符样式的场景
 */
export function EditorPlaceholder(props: EditorPlaceholderProps): React.ReactElement | null {
  const { text, show } = props

  if (!show) {
    return null
  }

  return (
    <div className="editor-placeholder">
      {text}
    </div>
  )
}
