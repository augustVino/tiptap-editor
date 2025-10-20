/**
 * EditorContainer - 编辑器容器组件
 * @module components/Editor/EditorContainer
 */

import React from 'react'

export interface EditorContainerProps {
  /** 子组件 */
  children: React.ReactNode
  /** 自定义类名 */
  className?: string
}

/**
 * EditorContainer 组件
 * 编辑器外层容器，提供布局和样式
 */
export function EditorContainer(props: EditorContainerProps): React.ReactElement {
  const { children, className = '' } = props

  return (
    <div className={`editor-container ${className}`}>
      {children}
    </div>
  )
}
