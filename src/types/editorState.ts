/**
 * 编辑器状态相关类型定义
 * @module types/editorState
 */

import type { Document } from './document'
import type { Collaborator, EditorSelection } from './collaborator'
import type { TextFormat } from './format'

/**
 * 编辑操作表示对文档的单次修改，用于协作同步和历史记录
 */
export interface EditOperation {
  /** 操作唯一标识符 */
  id: string

  /** 操作类型 */
  type: OperationType

  /** 操作发生的位置（ProseMirror position） */
  position: number

  /** 操作的内容数据 */
  data: OperationData

  /** 操作时间戳（Lamport 时间戳或 UNIX 时间戳） */
  timestamp: number

  /** 执行操作的协作者 ID */
  userId: string

  /** Yjs 事务 ID（用于 CRDT 冲突解决） */
  transactionId?: string
}

/**
 * 操作类型枚举
 */
export enum OperationType {
  /** 插入文本或节点 */
  Insert = 'insert',

  /** 删除文本或节点 */
  Delete = 'delete',

  /** 应用格式（加粗、斜体等） */
  Format = 'format',

  /** 修改节点属性（如标题级别） */
  UpdateAttrs = 'update_attrs'
}

/**
 * 操作数据
 */
export interface OperationData {
  /** 插入或删除的内容（文本或 JSON 节点） */
  content?: string | Record<string, unknown>

  /** 应用或移除的标记类型 */
  mark?: string

  /** 修改的属性键值对 */
  attrs?: Record<string, unknown>
}

/**
 * 编辑器状态包含当前编辑器的配置、文档、选中范围等信息
 */
export interface EditorState {
  /** 当前文档 */
  doc: Document

  /** 当前选中范围 */
  selection: EditorSelection

  /** 当前活跃的格式列表 */
  activeFormats: TextFormat[]

  /** 撤销栈（最多 50 步） */
  undoStack: EditOperation[]

  /** 重做栈 */
  redoStack: EditOperation[]

  /** 编辑器是否可编辑 */
  editable: boolean

  /** 编辑器是否为空 */
  isEmpty: boolean

  /** 字数统计 */
  wordCount: number

  /** 当前文档的所有协作者 */
  collaborators: Collaborator[]

  /** 当前用户 */
  currentUser: Collaborator

  /** 网络连接状态 */
  connectionStatus: ConnectionStatus
}

/**
 * 网络连接状态枚举
 */
export enum ConnectionStatus {
  /** 已连接到 WebSocket 服务器 */
  Connected = 'connected',

  /** 正在连接 */
  Connecting = 'connecting',

  /** 离线（使用本地缓存） */
  Offline = 'offline',

  /** 连接错误 */
  Error = 'error'
}
