/**
 * Collaborative Editor Example
 * Demonstrates real-time collaboration with Yjs
 * @module examples/CollaborativeEditor
 */

import React from 'react'
import { EditorContent } from '@tiptap/react'
import {
  CollaborativeEditorProvider,
  useCollaborativeEditor
} from '../editor/CollaborativeEditorProvider'
import { CollaborativeToolbar } from '../components/Toolbar/CollaborativeToolbar'
import { CollaboratorList } from '../components/Sidebar'
import { NetworkStatus } from '../components/common'
import { TableBubbleMenu } from '../components/Table/TableBubbleMenu'
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
 * 编辑器 UI 组件（在 CollaborativeEditorProvider 内部使用）
 */
function EditorUI(): React.ReactElement {
  const {
    editor,
    collaborators,
    connectionStatus,
    awarenessManager
  } = useCollaborativeEditor()

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
            {editor && <TableBubbleMenu editor={editor} />}
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
    <CollaborativeEditorProvider
      documentId={documentId}
      user={{ name: userName }}
      placeholder="开始输入..."
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
      <EditorUI />
    </CollaborativeEditorProvider>
  )
}
