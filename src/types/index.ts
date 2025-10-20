/**
 * 类型定义索引文件
 * 导出所有公共类型定义
 * @module types
 */

// Document types
export type { Document, DocumentMetadata, JSONContent, Mark } from './document'

// Collaborator types
export type { Collaborator, EditorSelection } from './collaborator'
export { CollaboratorStatus } from './collaborator'

// Format types
export type { TextFormat, BlockFormat, BlockFormatAttrs } from './format'
export { TextFormatType, BlockFormatType } from './format'

// Editor State types
export type { EditOperation, OperationData, EditorState } from './editorState'
export { OperationType, ConnectionStatus } from './editorState'

// Editor Config types
export type {
  EditorConfig,
  ExtensionConfig,
  CollaborationConfig,
  PerformanceConfig
} from './editorConfig'
