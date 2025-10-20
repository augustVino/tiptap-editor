/**
 * Heading 扩展包装器
 * @module extensions/formatting/Heading
 */

import HeadingExtension from '@tiptap/extension-heading'

/**
 * Heading extension for heading levels 1-3
 * 提供标题功能（仅支持 H1-H3）
 *
 * Commands:
 * - setHeading({ level: 1 | 2 | 3 }): 设置标题级别
 * - toggleHeading({ level: 1 | 2 | 3 }): 切换标题级别
 *
 * Keyboard shortcuts:
 * - Ctrl/Cmd+Alt+1: H1
 * - Ctrl/Cmd+Alt+2: H2
 * - Ctrl/Cmd+Alt+3: H3
 */
export const Heading = HeadingExtension.configure({
  levels: [1, 2, 3], // 仅支持 H1-H3（规格要求）
  HTMLAttributes: {
    class: 'heading'
  }
})

export default Heading
