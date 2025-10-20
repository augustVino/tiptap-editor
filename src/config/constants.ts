/**
 * 应用常量配置
 * 集中管理所有魔法字符串和硬编码值
 * @module config/constants
 */

import { env } from './env'

/**
 * WebSocket 配置常量
 */
export const WEBSOCKET = {
  /** 默认 URL */
  DEFAULT_URL: env.wsUrl,
  /** 重连超时时间（毫秒） */
  RECONNECT_TIMEOUT: env.wsReconnectTimeout,
  /** 最大重连次数 */
  MAX_RECONNECT_ATTEMPTS: env.wsMaxReconnectAttempts,
  /** 连接状态 */
  STATUS: {
    CONNECTED: 'connected',
    CONNECTING: 'connecting',
    DISCONNECTED: 'disconnected'
  }
} as const

/**
 * 编辑器配置常量
 */
export const EDITOR = {
  /** 默认占位符文本 */
  DEFAULT_PLACEHOLDER: env.editorPlaceholder,
  /** 历史记录深度 */
  HISTORY_DEPTH: 50,
  /** 自动保存间隔（毫秒） */
  AUTOSAVE_INTERVAL: 5000,
  /** 最大文档大小（字符数） */
  MAX_DOCUMENT_SIZE: 1000000
} as const

/**
 * IndexedDB 配置常量
 */
export const INDEXEDDB = {
  /** 数据库名称前缀 */
  DB_PREFIX: 'yjs-',
  /** 是否默认启用 */
  ENABLED: env.indexedDBEnabled
} as const

/**
 * CSS 类名常量
 */
export const CSS_CLASSES = {
  /** 编辑器根元素 */
  EDITOR: 'tiptap-editor',
  /** 表格元素 */
  TABLE: 'tiptap-table',
  /** 表格单元格 */
  TABLE_CELL: 'tiptap-table-cell',
  /** 表格头部 */
  TABLE_HEADER: 'tiptap-table-header',
  /** 代码块 */
  CODE_BLOCK: 'tiptap-code-block',
  /** 占位符 */
  PLACEHOLDER: 'tiptap-placeholder'
} as const

/**
 * 键盘快捷键常量
 */
export const KEYBOARD_SHORTCUTS = {
  BOLD: 'Mod-b',
  ITALIC: 'Mod-i',
  UNDERLINE: 'Mod-u',
  STRIKE: 'Mod-Shift-x',
  HEADING_1: 'Mod-Alt-1',
  HEADING_2: 'Mod-Alt-2',
  HEADING_3: 'Mod-Alt-3',
  UNDO: 'Mod-z',
  REDO: 'Mod-Shift-z'
} as const

/**
 * 颜色配置常量
 */
export const COLORS = {
  /** 用户颜色调色板 */
  USER_PALETTE: [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
    '#F8B739',
    '#52B788'
  ],
  /** 连接状态颜色 */
  CONNECTION_STATUS: {
    CONNECTED: '#52c41a',
    CONNECTING: '#faad14',
    OFFLINE: '#f5222d'
  }
} as const

/**
 * 性能监控常量
 */
export const PERFORMANCE = {
  /** 慢操作阈值（毫秒） */
  SLOW_OPERATION_THRESHOLD: 100,
  /** 是否启用性能监控 */
  ENABLE_MONITORING: env.isDev
} as const

/**
 * 错误消息常量
 */
export const ERROR_MESSAGES = {
  /** Provider 错误 */
  PROVIDER_NOT_FOUND: 'Provider not found. Make sure to use this hook within the Provider component.',
  /** 编辑器未初始化 */
  EDITOR_NOT_INITIALIZED: 'Editor is not initialized',
  /** WebSocket 连接失败 */
  WEBSOCKET_CONNECTION_FAILED: 'WebSocket connection failed',
  /** IndexedDB 不可用 */
  INDEXEDDB_UNAVAILABLE: 'IndexedDB is not available in this browser'
} as const

/**
 * 应用配置
 */
export const APP = {
  /** 应用名称 */
  NAME: '多人协作文档编辑器',
  /** 版本号 */
  VERSION: '1.0.0',
  /** 描述 */
  DESCRIPTION: '基于 TipTap 3.x + Yjs 构建的现代化富文本编辑器'
} as const
