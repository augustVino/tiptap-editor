/**
 * Collaboration types for Yjs integration
 * @module collaboration/types
 */

import type * as Y from 'yjs'
import type { WebsocketProvider } from 'y-websocket'
import type { IndexeddbPersistence } from 'y-indexeddb'
import type * as awarenessProtocol from 'y-protocols/awareness'

/**
 * WebSocket 配置
 */
export interface WebSocketConfig {
  /** WebSocket 服务器 URL */
  url: string
  /** 房间名称（文档ID） */
  roomName: string
  /** 连接超时时间（毫秒） */
  connectTimeout?: number
  /** 是否启用 awareness */
  enableAwareness?: boolean
}

/**
 * IndexedDB 配置
 */
export interface IndexedDBConfig {
  /** 数据库名称 */
  dbName: string
  /** 是否启用离线持久化 */
  enabled?: boolean
}

/**
 * Yjs Provider Props
 */
export interface YjsProviderProps {
  /** 文档 ID */
  documentId: string
  /** WebSocket 配置 */
  webSocket?: WebSocketConfig
  /** IndexedDB 配置 */
  indexedDB?: IndexedDBConfig
  /** 子组件 */
  children: React.ReactNode
}

/**
 * Yjs 协作上下文值
 */
export interface YjsContextValue {
  /** Yjs 文档实例 */
  ydoc: Y.Doc
  /** WebSocket Provider */
  wsProvider: WebsocketProvider | null
  /** IndexedDB Provider */
  indexedDBProvider: IndexeddbPersistence | null
  /** Awareness 实例（用于用户状态同步） */
  awareness: awarenessProtocol.Awareness | null
  /** 连接状态 */
  isConnected: boolean
  /** 同步状态 */
  isSynced: boolean
}

/**
 * Awareness 用户状态
 */
export interface AwarenessUser {
  /** 用户 ID */
  id: string
  /** 用户名 */
  name: string
  /** 光标颜色 */
  color: string
  /** 光标位置 */
  cursor?: {
    anchor: number
    head: number
  }
}

/**
 * 连接事件类型
 */
export type ConnectionEvent = 'connected' | 'disconnected' | 'synced' | 'error'

/**
 * 连接事件处理器
 */
export type ConnectionEventHandler = (event: ConnectionEvent, data?: any) => void
