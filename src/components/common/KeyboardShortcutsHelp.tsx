/**
 * 键盘快捷键帮助组件
 * @module components/common/KeyboardShortcutsHelp
 */

import React from 'react'
import { getAllShortcuts } from '../../editor/keyboardShortcuts'

export interface KeyboardShortcutsHelpProps {
  /** 是否显示 */
  visible?: boolean
  /** 关闭回调 */
  onClose?: () => void
}

/**
 * 键盘快捷键帮助组件
 * 显示所有可用的键盘快捷键
 */
export function KeyboardShortcutsHelp(props: KeyboardShortcutsHelpProps): React.ReactElement | null {
  const { visible = true, onClose } = props

  if (!visible) {
    return null
  }

  const shortcuts = getAllShortcuts()

  return (
    <div className="keyboard-shortcuts-help">
      <div className="keyboard-shortcuts-help__header">
        <h3>键盘快捷键</h3>
        {onClose && (
          <button onClick={onClose} className="keyboard-shortcuts-help__close">
            ×
          </button>
        )}
      </div>
      <div className="keyboard-shortcuts-help__content">
        {shortcuts.map(({ key, description, display }) => (
          <div key={key} className="keyboard-shortcuts-help__item">
            <span className="keyboard-shortcuts-help__description">{description}</span>
            <kbd className="keyboard-shortcuts-help__keys">{display}</kbd>
          </div>
        ))}
      </div>
    </div>
  )
}
