/**
 * BulletList Extension (无序列表)
 * @module extensions/blocks/BulletList
 */

import BulletList from '@tiptap/extension-bullet-list'

/**
 * 无序列表扩展
 * 支持嵌套列表
 *
 * 快捷键: Ctrl/Cmd+Shift+8
 */
export const BulletListExtension = BulletList.configure({
  HTMLAttributes: {
    class: 'bullet-list'
  }
})

export default BulletListExtension
