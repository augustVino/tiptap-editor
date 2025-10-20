/**
 * 键盘快捷键配置
 * @module editor/keyboardShortcuts
 */

/**
 * 编辑器键盘快捷键列表
 */
export const KEYBOARD_SHORTCUTS = {
  // 格式化
  bold: {
    keys: ['Mod-b', 'Mod-B'],
    description: '加粗',
    displayKey: 'Ctrl+B (Mac: ⌘+B)'
  },
  italic: {
    keys: ['Mod-i', 'Mod-I'],
    description: '斜体',
    displayKey: 'Ctrl+I (Mac: ⌘+I)'
  },
  underline: {
    keys: ['Mod-u', 'Mod-U'],
    description: '下划线',
    displayKey: 'Ctrl+U (Mac: ⌘+U)'
  },
  strike: {
    keys: ['Mod-Shift-x', 'Mod-Shift-X'],
    description: '删除线',
    displayKey: 'Ctrl+Shift+X (Mac: ⌘+Shift+X)'
  },

  // 标题
  heading1: {
    keys: ['Mod-Alt-1'],
    description: '标题 1',
    displayKey: 'Ctrl+Alt+1 (Mac: ⌘+⌥+1)'
  },
  heading2: {
    keys: ['Mod-Alt-2'],
    description: '标题 2',
    displayKey: 'Ctrl+Alt+2 (Mac: ⌘+⌥+2)'
  },
  heading3: {
    keys: ['Mod-Alt-3'],
    description: '标题 3',
    displayKey: 'Ctrl+Alt+3 (Mac: ⌘+⌥+3)'
  },

  // 历史记录
  undo: {
    keys: ['Mod-z'],
    description: '撤销',
    displayKey: 'Ctrl+Z (Mac: ⌘+Z)'
  },
  redo: {
    keys: ['Mod-Shift-z', 'Mod-y'],
    description: '重做',
    displayKey: 'Ctrl+Shift+Z (Mac: ⌘+Shift+Z)'
  },

  // 链接
  link: {
    keys: ['Mod-k', 'Mod-K'],
    description: '插入链接',
    displayKey: 'Ctrl+K (Mac: ⌘+K)'
  },

  // 其他
  selectAll: {
    keys: ['Mod-a'],
    description: '全选',
    displayKey: 'Ctrl+A (Mac: ⌘+A)'
  }
} as const

/**
 * 获取快捷键显示文本（适配 Mac/Windows）
 */
export function getShortcutDisplay(shortcut: keyof typeof KEYBOARD_SHORTCUTS): string {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.platform)
  const config = KEYBOARD_SHORTCUTS[shortcut]

  if (!config) {
    return ''
  }

  // 简化显示
  if (isMac) {
    return config.displayKey.split('Mac: ')[1]?.replace(/[()]/g, '') || config.displayKey
  } else {
    return config.displayKey.split(' (Mac')[0] || config.displayKey
  }
}

/**
 * 获取所有快捷键列表
 */
export function getAllShortcuts(): Array<{
  key: keyof typeof KEYBOARD_SHORTCUTS
  description: string
  display: string
}> {
  return Object.keys(KEYBOARD_SHORTCUTS).map((key) => {
    const shortcutKey = key as keyof typeof KEYBOARD_SHORTCUTS
    return {
      key: shortcutKey,
      description: KEYBOARD_SHORTCUTS[shortcutKey].description,
      display: getShortcutDisplay(shortcutKey)
    }
  })
}

/**
 * Custom Keyboard Shortcuts Extension
 *
 * Adds Ctrl+K (Cmd+K on Mac) for link insertion with validation
 */
import { Extension } from '@tiptap/core'
import type { Editor } from '@tiptap/core'
import { isValidUrl } from '../utils/storage'

export const CustomKeyboardShortcuts = Extension.create({
  name: 'customKeyboardShortcuts',

  addKeyboardShortcuts() {
    return {
      // Ctrl+K / Cmd+K: Insert or edit link
      'Mod-k': () => {
        return handleLinkShortcut(this.editor)
      },
      'Mod-K': () => {
        return handleLinkShortcut(this.editor)
      },
    }
  },
})

/**
 * Handle Ctrl+K / Cmd+K link shortcut
 *
 * @param editor - TipTap editor instance
 * @returns True if command was handled
 */
function handleLinkShortcut(editor: Editor): boolean {
  const { from, to } = editor.state.selection

  // Check if text is selected
  if (from === to) {
    alert('请先选择要添加链接的文本')
    return true // Command handled (prevent default browser behavior)
  }

  // Check if already a link (allow editing/removing)
  const isLink = editor.isActive('link')

  if (isLink) {
    // Remove existing link
    const shouldRemove = window.confirm('已有链接。是否移除？')
    if (shouldRemove) {
      editor.chain().focus().unsetLink().run()
    }
    return true
  }

  // Prompt for URL
  const url = window.prompt('请输入链接 URL:')

  if (url) {
    // Validate URL format
    if (!isValidUrl(url)) {
      alert('请输入有效的 URL（需包含协议，如 https://）')
      return true
    }

    // Set link
    editor.chain().focus().setLink({ href: url }).run()
  }

  return true // Command handled
}
