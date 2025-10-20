/**
 * 编辑器配置相关类型定义
 * @module types/editorConfig
 */

import type { JSONContent } from './document'

/**
 * 编辑器配置定义初始化参数和扩展选项
 */
export interface EditorConfig {
  /** 文档 ID（用于协作房间标识） */
  documentId: string

  /** 初始内容（可选，默认为空文档） */
  initialContent?: JSONContent

  /** 占位符文本 */
  placeholder?: string

  /** 是否可编辑 */
  editable?: boolean

  /** 启用的扩展列表 */
  extensions: ExtensionConfig[]

  /** 协作配置 */
  collaboration?: CollaborationConfig

  /** 性能配置 */
  performance?: PerformanceConfig
}

/**
 * 扩展配置
 */
export interface ExtensionConfig {
  /** 扩展名称 */
  name: string

  /** 扩展选项 */
  options?: Record<string, unknown>
}

/**
 * 协作配置
 */
export interface CollaborationConfig {
  /** WebSocket 服务器 URL */
  websocketUrl: string

  /** 当前用户信息 */
  user: {
    id: string
    name: string
    avatar?: string
  }

  /** 是否启用光标同步 */
  enableCursor?: boolean

  /** 是否启用离线缓存 */
  enableOffline?: boolean
}

/**
 * 性能配置
 */
export interface PerformanceConfig {
  /** 是否启用代码分割 */
  enableCodeSplitting?: boolean

  /** 协作同步 debounce 延迟（毫秒） */
  syncDebounce?: number

  /** Undo/Redo 历史记录上限 */
  historyDepth?: number
}
