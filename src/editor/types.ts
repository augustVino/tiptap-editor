/**
 * 编辑器实例相关类型定义
 * @module editor/types
 */

import type { Editor as TiptapEditor } from '@tiptap/core'
import type { Doc } from 'yjs'
import type { WebsocketProvider } from 'y-websocket'
import type { Awareness } from 'y-protocols/awareness'
import type { EditorConfig, EditorState } from '../types'

/**
 * 编辑器实例（扩展 TipTap Editor）
 */
export interface EditorInstance extends TiptapEditor {
  /** 编辑器配置 */
  config: EditorConfig
}

/**
 * Editor Provider Props
 */
export interface EditorProviderProps {
  /** 文档 ID（必需） */
  documentId: string

  /** 初始内容（可选） */
  initialContent?: string | Record<string, unknown>

  /** 占位符文本 */
  placeholder?: string

  /** 是否可编辑 */
  editable?: boolean

  /** 子组件 */
  children: React.ReactNode

  /** 编辑器创建完成回调 */
  onEditorReady?: (editor: TiptapEditor) => void

  /** 内容变化回调 */
  onChange?: (content: string) => void
}

/**
 * Editor Context Value
 */
export interface EditorContextValue {
  /** TipTap 编辑器实例 */
  editor: TiptapEditor | null

  /** 编辑器状态 */
  state: Partial<EditorState>

  /** 编辑器配置 */
  config: EditorConfig
}

/**
 * useEditor Hook 选项
 */
export interface UseEditorOptions {
  /** 文档 ID */
  documentId: string

  /** 初始内容 */
  initialContent?: string | Record<string, unknown>

  /** 占位符 */
  placeholder?: string

  /** 是否可编辑 */
  editable?: boolean

  /** 编辑器就绪回调 */
  onEditorReady?: (editor: TiptapEditor) => void

  /** 内容变化回调 */
  onChange?: (content: string) => void

  /** 协作配置（可选） */
  collaboration?: CollaborationConfig
}

/**
 * 协作编辑配置
 */
export interface CollaborationConfig {
  /** Yjs 文档实例 */
  ydoc: Doc
  /** WebSocket Provider 实例（用于 CollaborationCursor） */
  wsProvider: WebsocketProvider
  /** Awareness 实例（用于用户状态管理） */
  awareness?: Awareness
  /** 当前用户信息 */
  user: {
    name: string
    color: string
  }
}
