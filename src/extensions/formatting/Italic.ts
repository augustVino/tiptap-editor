/**
 * Italic 扩展包装器
 * @module extensions/formatting/Italic
 */

import ItalicExtension from '@tiptap/extension-italic'

/**
 * Italic extension for text formatting
 * 提供斜体文本功能
 *
 * Commands:
 * - toggleItalic(): 切换斜体状态
 * - setItalic(): 设置为斜体
 * - unsetItalic(): 取消斜体
 *
 * Keyboard shortcuts:
 * - Ctrl/Cmd+I: 切换斜体
 */
export const Italic = ItalicExtension.configure({
  HTMLAttributes: {
    class: 'italic'
  }
})

export default Italic
