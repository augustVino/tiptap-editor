/**
 * 文档相关类型定义
 * @module types/document
 */

/**
 * 文档是编辑器的核心实体，包含可编辑的内容和元数据
 */
export interface Document {
  /** 文档唯一标识符（UUID v4） */
  id: string

  /** 文档标题，用于显示在标签页或列表中 */
  title: string

  /** 文档内容（TipTap JSON 格式，对应 ProseMirror 文档模型） */
  content: JSONContent

  /** 创建时间戳（ISO 8601 格式） */
  createdAt: string

  /** 最后修改时间戳（ISO 8601 格式） */
  updatedAt: string

  /** 最后编辑的协作者 ID */
  lastEditedBy?: string

  /** 文档元数据（可选） */
  metadata?: DocumentMetadata
}

/**
 * 文档元数据
 */
export interface DocumentMetadata {
  /** 文档描述或摘要 */
  description?: string

  /** 文档标签（用于分类） */
  tags?: string[]

  /** 文档字数统计 */
  wordCount?: number

  /** 是否公开（公开文档可通过 URL 分享） */
  isPublic?: boolean
}

/**
 * TipTap/ProseMirror JSON 内容节点
 */
export interface JSONContent {
  /** 节点类型（doc, paragraph, heading, text 等） */
  type: string

  /** 节点属性（如 heading 的 level，text 的 marks） */
  attrs?: Record<string, unknown>

  /** 子节点数组 */
  content?: JSONContent[]

  /** 文本内容（仅 text 节点） */
  text?: string

  /** 标记（如 bold, italic, underline） */
  marks?: Mark[]
}

/**
 * 文本标记（内联格式）
 */
export interface Mark {
  /** 标记类型（bold, italic, underline, strike, code 等） */
  type: string

  /** 标记属性（如 link 的 href） */
  attrs?: Record<string, unknown>
}
