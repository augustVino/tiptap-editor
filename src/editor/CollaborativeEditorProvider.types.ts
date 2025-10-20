/**
 * 协作编辑器 Provider 类型定义
 * @module editor/CollaborativeEditorProvider.types
 */

import type { Editor as TiptapEditor } from '@tiptap/core'
import type * as Y from 'yjs'
import type { WebsocketProvider } from 'y-websocket'
import type * as awarenessProtocol from 'y-protocols/awareness'
import type { AwarenessUser, WebSocketConfig, IndexedDBConfig } from '../collaboration/types'
import type { ConnectionStatus } from '../types'
import type { AwarenessManager } from '../collaboration/AwarenessManager'

/**
 * CollaborativeEditorProvider Props
 */
export interface CollaborativeEditorProviderProps {
  /** 文档 ID */
  documentId: string

  /** WebSocket 配置 */
  webSocket?: WebSocketConfig

  /** IndexedDB 配置 */
  indexedDB?: IndexedDBConfig

  /** 当前用户信息 */
  user: {
    /** 用户 ID */
    id?: string
    /** 用户名 */
    name: string
    /** 光标颜色（可选，自动生成） */
    color?: string
  }

  /** 初始内容 */
  initialContent?: string | Record<string, unknown>

  /** 占位符文本 */
  placeholder?: string

  /** 是否可编辑 */
  editable?: boolean

  /** 子组件 */
  children: React.ReactNode

  /** 编辑器就绪回调 */
  onEditorReady?: (editor: TiptapEditor) => void

  /** 内容变化回调 */
  onChange?: (content: string) => void

  /** 连接状态变化回调 */
  onConnectionStatusChange?: (status: ConnectionStatus) => void

  /** 协作者变化回调 */
  onCollaboratorsChange?: (collaborators: AwarenessUser[]) => void
}

/**
 * CollaborativeEditor Context Value
 */
export interface CollaborativeEditorContextValue {
  /** TipTap 编辑器实例 */
  editor: TiptapEditor | null

  /** Yjs 文档实例 */
  ydoc: Y.Doc

  /** WebSocket Provider */
  wsProvider: WebsocketProvider | null

  /** Awareness 实例 */
  awareness: awarenessProtocol.Awareness | null

  /** Awareness Manager */
  awarenessManager: AwarenessManager | null

  /** 在线协作者列表 */
  collaborators: AwarenessUser[]

  /** 当前用户信息 */
  currentUser: {
    id: string
    name: string
    color: string
  }

  /** 连接状态 */
  connectionStatus: ConnectionStatus

  /** 是否已连接 */
  isConnected: boolean

  /** 是否已同步 */
  isSynced: boolean
}
