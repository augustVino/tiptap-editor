/**
 * 格式相关类型定义
 * @module types/format
 */

/**
 * 文本格式（内联标记）
 */
export interface TextFormat {
  /** 格式类型 */
  type: TextFormatType

  /** 格式是否激活（用于工具栏高亮） */
  isActive: boolean

  /** 格式属性（如链接的 URL） */
  attrs?: Record<string, unknown>
}

/**
 * 文本格式类型枚举
 */
export enum TextFormatType {
  /** 粗体 */
  Bold = 'bold',

  /** 斜体 */
  Italic = 'italic',

  /** 下划线 */
  Underline = 'underline',

  /** 删除线 */
  Strike = 'strike',

  /** 行内代码 */
  Code = 'code',

  /** 链接 */
  Link = 'link'
}

/**
 * 块级格式
 */
export interface BlockFormat {
  /** 块级格式类型 */
  type: BlockFormatType

  /** 块级属性 */
  attrs: BlockFormatAttrs
}

/**
 * 块级格式类型枚举
 */
export enum BlockFormatType {
  /** 段落 */
  Paragraph = 'paragraph',

  /** 标题 */
  Heading = 'heading',

  /** 代码块 */
  CodeBlock = 'codeBlock',

  /** 有序列表 */
  OrderedList = 'orderedList',

  /** 无序列表 */
  BulletList = 'bulletList',

  /** 列表项 */
  ListItem = 'listItem'
}

/**
 * 块级格式属性
 */
export interface BlockFormatAttrs {
  /** 标题级别（1-3） */
  level?: 1 | 2 | 3

  /** 文本对齐方式 */
  textAlign?: 'left' | 'center' | 'right' | 'justify'

  /** 代码块语言（用于语法高亮） */
  language?: string
}
