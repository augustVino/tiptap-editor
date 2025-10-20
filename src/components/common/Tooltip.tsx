/**
 * Tooltip 提示组件
 * @module components/common/Tooltip
 */

import React from 'react'

export interface TooltipProps {
  /** 提示内容 */
  content: string
  /** 子元素 */
  children: React.ReactElement
  /** 位置 */
  position?: 'top' | 'bottom' | 'left' | 'right'
}

/**
 * Tooltip 组件
 * 简单的 title 属性实现
 */
export function Tooltip(props: TooltipProps): React.ReactElement {
  const { content, children } = props

  return React.cloneElement(children, {
    title: content
  })
}
