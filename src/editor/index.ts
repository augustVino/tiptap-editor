/**
 * Editor module exports
 * @module editor
 */

// 协作编辑器
export {
  CollaborativeEditorProvider,
  useCollaborativeEditor,
  useCollaborativeEditorInstance
} from './CollaborativeEditorProvider'
export type {
  CollaborativeEditorProviderProps,
  CollaborativeEditorContextValue
} from './CollaborativeEditorProvider.types'

// Hooks
export { useEditor } from './useEditor'
export type { UseEditorOptions } from './types'

// Config
export { DEFAULT_EDITOR_CONFIG, mergeEditorConfig } from './EditorConfig'
