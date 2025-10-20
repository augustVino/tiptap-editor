/**
 * Strike 扩展包装器
 * @module extensions/formatting/Strike
 */

import StrikeExtension from '@tiptap/extension-strike'

/**
 * Strike extension for text formatting
 * 提供删除线文本功能
 *
 * Commands:
 * - toggleStrike(): 切换删除线状态
 * - setStrike(): 设置为删除线
 * - unsetStrike(): 取消删除线
 *
 * Keyboard shortcuts:
 * - Ctrl/Cmd+Shift+X: 切换删除线
 */
export const Strike = StrikeExtension.configure({
  HTMLAttributes: {
    class: 'strike'
  }
})

export default Strike
