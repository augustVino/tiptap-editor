/**
 * Collaborative Editor Example
 * Demonstrates real-time collaboration with Yjs
 * @module examples/CollaborativeEditor
 */

import React, { useState, useEffect, useMemo } from 'react'
import { EditorContent } from '@tiptap/react'
import { YjsProvider, useYjsContext } from '../collaboration/YjsProvider'
import { AwarenessManager } from '../collaboration/AwarenessManager'
import { useEditor } from '../editor/useEditor'
import { CollaborativeToolbar } from '../components/Toolbar/CollaborativeToolbar'
import { CollaboratorList } from '../components/Sidebar'
import { NetworkStatus } from '../components/common'
import { getConsistentColor } from '../utils/colorPalette'
import { ConnectionStatus } from '../types'
import type { AwarenessUser } from '../collaboration/types'
import styles from './CollaborativeEditor.module.less'
import '../components/Editor/CollaborationCursor.module.less'

export interface CollaborativeEditorProps {
  /** 文档 ID */
  documentId: string
  /** WebSocket 服务器 URL */
  wsUrl?: string
  /** 用户名 */
  userName?: string
}

/**
 * 编辑器内容组件（需要在 YjsProvider 内部使用）
 */
function EditorContentComponent({ documentId, userName }: { documentId: string; userName: string }) {
  const { ydoc, wsProvider, awareness, isConnected, isSynced } = useYjsContext()
  const [collaborators, setCollaborators] = useState<AwarenessUser[]>([])
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.Offline)

  // 生成用户颜色
  const userColor = useMemo(() => getConsistentColor(userName || 'anonymous'), [userName])

  // 创建 AwarenessManager（使用共享的 awareness 实例）
  const awarenessManager = useMemo(() => {
    if (!wsProvider || !awareness) return null

    const manager = new AwarenessManager(awareness, {
      id: `user-${Date.now()}`,
      name: userName || 'Anonymous',
      color: userColor
    })

    // 监听用户变化
    manager.on('userJoined', () => {
      setCollaborators(manager.getOnlineUsers())
    })

    manager.on('userLeft', () => {
      setCollaborators(manager.getOnlineUsers())
    })

    // 初始化协作者列表
    setCollaborators(manager.getOnlineUsers())

    return manager
  }, [awareness, wsProvider, userName, userColor])

  // 更新连接状态
  useEffect(() => {
    if (isConnected && isSynced) {
      setConnectionStatus(ConnectionStatus.Connected)
    } else if (isConnected && !isSynced) {
      setConnectionStatus(ConnectionStatus.Connecting)
    } else {
      setConnectionStatus(ConnectionStatus.Offline)
    }
  }, [isConnected, isSynced])

  // 监听 Yjs 文档更新（用于调试）
  useEffect(() => {
    const handleUpdate = (update: Uint8Array, origin: any) => {
      console.log('[CollaborativeEditor] Yjs document updated', {
        updateSize: update.length,
        origin: origin?.constructor?.name || 'unknown'
      })
    }

    ydoc.on('update', handleUpdate)
    return () => {
      ydoc.off('update', handleUpdate)
    }
  }, [ydoc])

  // 稳定的协作配置对象
  const collaborationConfig = useMemo(() => {
    if (!awarenessManager || !wsProvider) return undefined

    return {
      ydoc,
      wsProvider,  // CollaborationCursor 需要 WebsocketProvider
      awareness: awarenessManager.awareness,
      user: {
        name: userName || 'Anonymous',
        color: userColor
      }
    }
  }, [awarenessManager, wsProvider, ydoc, userName, userColor])

  // 清理
  useEffect(() => {
    return () => {
      awarenessManager?.destroy()
    }
  }, [awarenessManager])

  // 只在协作配置准备好后才渲染编辑器
  // 这样可以完全避免在 awareness 未准备好时初始化 CollaborationCursor
  if (!collaborationConfig) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>协作编辑器示例</h1>
          <NetworkStatus status={connectionStatus} />
        </div>
        <div className={styles.main}>
          <div className={styles.editorArea}>
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              正在连接协作服务器...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <EditorWrapper
      documentId={documentId}
      collaborationConfig={collaborationConfig}
      collaborators={collaborators}
      connectionStatus={connectionStatus}
      awarenessManager={awarenessManager}
    />
  )
}

/**
 * 编辑器包装组件（只在 collaboration 准备好后渲染）
 */
function EditorWrapper({
  documentId,
  collaborationConfig,
  collaborators,
  connectionStatus,
  awarenessManager
}: {
  documentId: string
  collaborationConfig: any
  collaborators: AwarenessUser[]
  connectionStatus: ConnectionStatus
  awarenessManager: AwarenessManager
}) {
  // 初始化编辑器（此时 collaborationConfig 一定存在）
  const editor = useEditor({
    documentId,
    placeholder: '开始输入...',
    collaboration: collaborationConfig
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>协作编辑器示例</h1>
        <NetworkStatus status={connectionStatus} />
      </div>

      <div className={styles.main}>
        <div className={styles.editorArea}>
          <CollaborativeToolbar editor={editor} />
          <div className={styles.editorContent}>
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className={styles.sidebar}>
          <CollaboratorList
            collaborators={collaborators}
            currentUserId={awarenessManager?.awareness.clientID.toString()}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.hint}>
          💡 提示：在新标签页中打开相同 URL 以测试多人协作
        </p>
      </div>
    </div>
  )
}

/**
 * 协作编辑器组件
 */
export function CollaborativeEditor(props: CollaborativeEditorProps): React.ReactElement {
  const { documentId, wsUrl = 'ws://localhost:1234', userName = 'User' } = props

  return (
    <YjsProvider
      documentId={documentId}
      webSocket={{
        url: wsUrl,
        roomName: documentId,
        enableAwareness: true
      }}
      indexedDB={{
        dbName: `yjs-${documentId}`,
        enabled: true
      }}
    >
      <EditorContentComponent documentId={documentId} userName={userName} />
    </YjsProvider>
  )
}
