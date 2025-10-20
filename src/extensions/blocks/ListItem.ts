/**
 * ListItem Extension (列表项)
 * @module extensions/blocks/ListItem
 */

import ListItem from '@tiptap/extension-list-item'

/**
 * 列表项扩展
 * OrderedList 和 BulletList 的子元素
 */
export const ListItemExtension = ListItem.configure({
  HTMLAttributes: {
    class: 'list-item'
  }
})

export default ListItemExtension
