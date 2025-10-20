/**
 * Toolbar Dropdown Component
 * 工具栏下拉菜单组件
 */

import React, { useState, useRef, useEffect } from 'react'
import styles from './ToolbarDropdown.module.less'

export interface ToolbarDropdownItem {
  label: string
  value: string
  onClick: () => void
  isActive?: boolean
}

export interface ToolbarDropdownProps {
  icon: React.ReactNode
  items: ToolbarDropdownItem[]
  tooltip?: string
  isActive?: boolean
}

export function ToolbarDropdown(props: ToolbarDropdownProps): React.ReactElement {
  const { icon, items, tooltip, isActive = false } = props
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }

    return undefined
  }, [isOpen])

  const handleToggle = (): void => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = (item: ToolbarDropdownItem): void => {
    item.onClick()
    setIsOpen(false)
  }

  const buttonClass = [
    styles.dropdownButton,
    isActive && styles.active,
    isOpen && styles.open
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <button
        type="button"
        className={buttonClass}
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={tooltip}
      >
        {icon}
        <svg
          className={styles.chevron}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`${styles.menuItem} ${item.isActive ? styles.menuItemActive : ''}`}
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
