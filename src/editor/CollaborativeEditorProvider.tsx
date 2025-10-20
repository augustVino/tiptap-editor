/**
 * CollaborativeEditorProvider - 协作编辑器上下文提供者
 * 统一管理 Yjs、Awareness 和编辑器实例
 * @module editor/CollaborativeEditorProvider
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import type { Editor as TiptapEditor } from '@tiptap/core'
import { YjsProvider, useYjsContext } from '../collaboration/YjsProvider'
import { AwarenessManager } from '../collaboration/AwarenessManager'
import { useEditor } from './useEditor'
import { getConsistentColor } from '../utils/colorPalette'
import { ConnectionStatus } from '../types'
import type { AwarenessUser } from '../collaboration/types'
import type {
  CollaborativeEditorProviderProps,
  CollaborativeEditorContextValue
} from './CollaborativeEditorProvider.types'

/**
 * 协作编辑器上下文
 */
const CollaborativeEditorContext = createContext<CollaborativeEditorContextValue | null>(null)

/**
 * 内部编辑器组件（在 YjsProvider 内部使用）
 */
function CollaborativeEditorContent(props: Omit<CollaborativeEditorProviderProps, 'webSocket' | 'indexedDB'>) {
  const {
    documentId,
    user,
    initialContent,
    placeholder,
    editable,
    children,
    onEditorReady,
    onChange,
    onConnectionStatusChange,
    onCollaboratorsChange
  } = props

  const { ydoc, wsProvider, awareness, isConnected, isSynced } = useYjsContext()
  const [collaborators, setCollaborators] = useState<AwarenessUser[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.Offline)

  // 生成用户颜色（如果未提供）
  const userColor = useMemo(() => user.color || getConsistentColor(user.name), [user.color, user.name])
  const userId = useMemo(() => user.id || `user-${Date.now()}`, [user.id])

  // 当前用户信息
  const currentUser = useMemo(() => ({
    id: userId,
    name: user.name,
    color: userColor
  }), [userId, user.name, userColor])

  // 创建 AwarenessManager
  const awarenessManager = useMemo(() => {
    if (!wsProvider || !awareness) return null

    const manager = new AwarenessManager(awareness, currentUser)

    // 监听用户变化
    const updateCollaborators = () => {
      const users = manager.getOnlineUsers()
      setCollaborators(users)
      onCollaboratorsChange?.(users)
    }

    manager.on('userJoined', updateCollaborators)
    manager.on('userLeft', updateCollaborators)

    // 初始化协作者列表
    updateCollaborators()

    return manager
  }, [awareness, wsProvider, currentUser, onCollaboratorsChange])

  // 更新连接状态
  useEffect(() => {
    let status: ConnectionStatus
    if (isConnected && isSynced) {
      status = ConnectionStatus.Connected
    } else if (isConnected && !isSynced) {
      status = ConnectionStatus.Connecting
    } else {
      status = ConnectionStatus.Offline
    }

    setConnectionStatus(status)
    onConnectionStatusChange?.(status)
  }, [isConnected, isSynced, onConnectionStatusChange])

  // 监听 Yjs 文档更新（调试）
  useEffect(() => {
    const handleUpdate = (update: Uint8Array, origin: any) => {
      console.log('[CollaborativeEditorProvider] Yjs document updated', {
        updateSize: update.length,
        origin: origin?.constructor?.name || 'unknown'
      })
    }

    ydoc.on('update', handleUpdate)
    return () => {
      ydoc.off('update', handleUpdate)
    }
  }, [ydoc])

  // 协作配置
  const collaborationConfig = useMemo(() => {
    if (!awarenessManager || !wsProvider) return undefined

    return {
      ydoc,
      wsProvider,
      awareness: awarenessManager.awareness,
      user: {
        name: currentUser.name,
        color: currentUser.color
      }
    }
  }, [awarenessManager, wsProvider, ydoc, currentUser])

  // 清理 AwarenessManager
  useEffect(() => {
    return () => {
      awarenessManager?.destroy()
    }
  }, [awarenessManager])

  // 如果协作配置未准备好，不渲染编辑器（避免 hooks 顺序问题）
  if (!collaborationConfig) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        正在连接协作服务器...
      </div>
    )
  }

  // 协作配置准备好后才渲染编辑器
  return (
    <EditorWrapper
      documentId={documentId}
      initialContent={initialContent}
      placeholder={placeholder}
      editable={editable}
      collaborationConfig={collaborationConfig}
      onEditorReady={onEditorReady}
      onChange={onChange}
      ydoc={ydoc}
      wsProvider={wsProvider}
      awareness={awareness}
      awarenessManager={awarenessManager}
      collaborators={collaborators}
      currentUser={currentUser}
      connectionStatus={connectionStatus}
      isConnected={isConnected}
      isSynced={isSynced}
    >
      {children}
    </EditorWrapper>
  )
}

/**
 * 编辑器包装组件（只在协作配置准备好后渲染）
 */
function EditorWrapper(props: {
  documentId: string
  initialContent?: string | Record<string, unknown>
  placeholder?: string
  editable?: boolean
  collaborationConfig: any
  onEditorReady?: (editor: TiptapEditor) => void
  onChange?: (content: string) => void
  ydoc: any
  wsProvider: any
  awareness: any
  awarenessManager: any
  collaborators: AwarenessUser[]
  currentUser: { id: string; name: string; color: string }
  connectionStatus: ConnectionStatus
  isConnected: boolean
  isSynced: boolean
  children: React.ReactNode
}) {
  const {
    documentId,
    initialContent,
    placeholder,
    editable,
    collaborationConfig,
    onEditorReady,
    onChange,
    ydoc,
    wsProvider,
    awareness,
    awarenessManager,
    collaborators,
    currentUser,
    connectionStatus,
    isConnected,
    isSynced,
    children
  } = props

  // 创建编辑器（此时 collaborationConfig 一定存在）
  const editor = useEditor({
    documentId,
    initialContent,
    placeholder,
    editable,
    collaboration: collaborationConfig,
    onEditorReady,
    onChange
  })

  // Context value
  const contextValue: CollaborativeEditorContextValue = useMemo(() => ({
    editor,
    ydoc,
    wsProvider,
    awareness,
    awarenessManager,
    collaborators,
    currentUser,
    connectionStatus,
    isConnected,
    isSynced
  }), [
    editor,
    ydoc,
    wsProvider,
    awareness,
    awarenessManager,
    collaborators,
    currentUser,
    connectionStatus,
    isConnected,
    isSynced
  ])

  return (
    <CollaborativeEditorContext.Provider value={contextValue}>
      {children}
    </CollaborativeEditorContext.Provider>
  )
}

/**
 * CollaborativeEditorProvider 组件
 * 统一管理协作编辑器的所有上下文（Yjs + Editor + Awareness）
 */
export function CollaborativeEditorProvider(props: CollaborativeEditorProviderProps): React.ReactElement {
  const {
    documentId,
    webSocket,
    indexedDB,
    children,
    ...editorProps
  } = props

  // 默认 WebSocket 配置
  const defaultWebSocket = useMemo(() => ({
    url: webSocket?.url || 'ws://localhost:1234',
    roomName: webSocket?.roomName || documentId,
    enableAwareness: webSocket?.enableAwareness !== false
  }), [webSocket, documentId])

  // 默认 IndexedDB 配置
  const defaultIndexedDB = useMemo(() => ({
    dbName: indexedDB?.dbName || `yjs-${documentId}`,
    enabled: indexedDB?.enabled !== false
  }), [indexedDB, documentId])

  return (
    <YjsProvider
      documentId={documentId}
      webSocket={defaultWebSocket}
      indexedDB={defaultIndexedDB}
    >
      <CollaborativeEditorContent
        documentId={documentId}
        {...editorProps}
      >
        {children}
      </CollaborativeEditorContent>
    </YjsProvider>
  )
}

/**
 * useCollaborativeEditor Hook
 * 获取协作编辑器上下文
 *
 * @returns 协作编辑器上下文
 * @throws 如果在 CollaborativeEditorProvider 外部使用
 */
export function useCollaborativeEditor(): CollaborativeEditorContextValue {
  const context = useContext(CollaborativeEditorContext)

  if (!context) {
    throw new Error('useCollaborativeEditor must be used within CollaborativeEditorProvider')
  }

  return context
}

/**
 * useCollaborativeEditorInstance Hook
 * 获取 TipTap 编辑器实例
 *
 * @returns TipTap 编辑器实例
 * @throws 如果编辑器未初始化
 */
export function useCollaborativeEditorInstance(): TiptapEditor {
  const { editor } = useCollaborativeEditor()

  if (!editor) {
    throw new Error('Collaborative editor is not initialized')
  }

  return editor
}
