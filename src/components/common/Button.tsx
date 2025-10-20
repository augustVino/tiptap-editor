/**
 * 通用按钮组件
 * @module components/common/Button
 */

import React from 'react'

export interface ButtonProps {
  /** 按钮文本或子元素 */
  children: React.ReactNode
  /** 是否为主要按钮 */
  primary?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否激活状态 */
  active?: boolean
  /** 点击事件 */
  onClick?: () => void
  /** 按钮类型 */
  type?: 'button' | 'submit' | 'reset'
  /** 自定义类名 */
  className?: string
  /** 标题提示 */
  title?: string
}

/**
 * 通用按钮组件
 */
export function Button(props: ButtonProps): React.ReactElement {
  const {
    children,
    primary = false,
    disabled = false,
    active = false,
    onClick,
    type = 'button',
    className = '',
    title
  } = props

  const classNames = [
    'button',
    primary && 'button--primary',
    active && 'button--active',
    disabled && 'button--disabled',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  )
}
