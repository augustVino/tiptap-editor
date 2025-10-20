/**
 * TextAlign Extension (文本对齐)
 * @module extensions/formatting/TextAlign
 */

import TextAlign from '@tiptap/extension-text-align'

/**
 * 文本对齐扩展
 * 支持左对齐、居中、右对齐、两端对齐
 *
 * 快捷键:
 * - Ctrl/Cmd+Shift+L: 左对齐
 * - Ctrl/Cmd+Shift+E: 居中
 * - Ctrl/Cmd+Shift+R: 右对齐
 * - Ctrl/Cmd+Shift+J: 两端对齐
 */
export const TextAlignExtension = TextAlign.configure({
  types: ['heading', 'paragraph'],
  alignments: ['left', 'center', 'right', 'justify'],
  defaultAlignment: 'left'
})

export default TextAlignExtension
