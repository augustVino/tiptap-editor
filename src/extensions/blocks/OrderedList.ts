/**
 * OrderedList Extension (有序列表)
 * @module extensions/blocks/OrderedList
 */

import OrderedList from '@tiptap/extension-ordered-list'

/**
 * 有序列表扩展
 * 支持嵌套列表
 *
 * 快捷键: Ctrl/Cmd+Shift+7
 */
export const OrderedListExtension = OrderedList.configure({
  HTMLAttributes: {
    class: 'ordered-list'
  }
})

export default OrderedListExtension
