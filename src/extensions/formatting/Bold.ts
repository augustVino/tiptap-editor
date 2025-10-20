/**
 * Bold 扩展包装器
 * @module extensions/formatting/Bold
 */

import BoldExtension from '@tiptap/extension-bold'

/**
 * Bold extension for text formatting
 * 提供加粗文本功能
 *
 * Commands:
 * - toggleBold(): 切换加粗状态
 * - setBold(): 设置为加粗
 * - unsetBold(): 取消加粗
 *
 * Keyboard shortcuts:
 * - Ctrl/Cmd+B: 切换加粗
 */
export const Bold = BoldExtension.configure({
  HTMLAttributes: {
    class: 'bold'
  }
})

export default Bold
