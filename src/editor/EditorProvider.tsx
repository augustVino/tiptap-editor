/**
 * EditorProvider - 提供编辑器上下文
 * @module editor/EditorProvider
 */

import React, { createContext, useContext, useMemo } from 'react'
import type { Editor as TiptapEditor } from '@tiptap/core'
import type { EditorProviderProps, EditorContextValue } from './types'
import { useEditor } from './useEditor'
import { mergeEditorConfig } from './EditorConfig'
import { CollaboratorStatus, ConnectionStatus } from '../types'

/**
 * 编辑器上下文
 */
const EditorContext = createContext<EditorContextValue | null>(null)

/**
 * EditorProvider 组件
 * 初始化编辑器并通过 Context 提供给子组件
 *
 * @param props - Provider props
 */
export function EditorProvider(props: EditorProviderProps): React.ReactElement {
  const {
    documentId,
    initialContent,
    placeholder,
    editable,
    children,
    onEditorReady,
    onChange
  } = props

  // 初始化编辑器
  const editor = useEditor({
    documentId,
    initialContent,
    placeholder,
    editable,
    onEditorReady,
    onChange
  })

  // 合并配置
  const config = useMemo(() => {
    return mergeEditorConfig({
      documentId,
      placeholder,
      editable,
      extensions: []
    })
  }, [documentId, placeholder, editable])

  // Context value
  const contextValue: EditorContextValue = useMemo(() => {
    return {
      editor,
      state: {
        doc: {
          id: documentId,
          title: '',
          content: { type: 'doc' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        selection: { from: 0, to: 0, empty: true },
        activeFormats: [],
        undoStack: [],
        redoStack: [],
        editable: editable ?? true,
        isEmpty: editor?.isEmpty ?? true,
        wordCount: 0,
        collaborators: [],
        currentUser: {
          id: 'local-user',
          name: '本地用户',
          cursorColor: '#4ECDC4',
          status: CollaboratorStatus.Active,
          lastActiveAt: Date.now()
        },
        connectionStatus: ConnectionStatus.Offline
      },
      config
    }
  }, [editor, documentId, editable, config])

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  )
}

/**
 * useEditorContext Hook
 * 获取编辑器上下文
 *
 * @returns 编辑器上下文
 * @throws 如果在 EditorProvider 外部使用
 */
export function useEditorContext(): EditorContextValue {
  const context = useContext(EditorContext)

  if (!context) {
    throw new Error('useEditorContext must be used within EditorProvider')
  }

  return context
}

/**
 * useEditorInstance Hook
 * 获取 TipTap 编辑器实例
 *
 * @returns TipTap 编辑器实例
 * @throws 如果编辑器未初始化
 */
export function useEditorInstance(): TiptapEditor {
  const { editor } = useEditorContext()

  if (!editor) {
    throw new Error('Editor is not initialized')
  }

  return editor
}
