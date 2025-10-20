/**
 * Underline 扩展包装器
 * @module extensions/formatting/Underline
 */

import UnderlineExtension from '@tiptap/extension-underline'

/**
 * Underline extension for text formatting
 * 提供下划线文本功能
 *
 * Commands:
 * - toggleUnderline(): 切换下划线状态
 * - setUnderline(): 设置为下划线
 * - unsetUnderline(): 取消下划线
 *
 * Keyboard shortcuts:
 * - Ctrl/Cmd+U: 切换下划线
 */
export const Underline = UnderlineExtension.configure({
  HTMLAttributes: {
    class: 'underline'
  }
})

export default Underline
