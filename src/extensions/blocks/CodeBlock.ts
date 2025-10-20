/**
 * CodeBlock Extension (代码块)
 * @module extensions/blocks/CodeBlock
 */

import CodeBlock from '@tiptap/extension-code-block'

/**
 * 代码块扩展
 * 等宽字体，保留空格和换行
 *
 * 快捷键: Ctrl/Cmd+Alt+C
 */
export const CodeBlockExtension = CodeBlock.configure({
  HTMLAttributes: {
    class: 'code-block'
  }
})

export default CodeBlockExtension
