/**
 * History Tools Component
 *
 * Provides Undo/Redo buttons for editor history navigation.
 */

import type { Editor } from '@tiptap/core'
import { getShortcutDisplay } from '../../editor/keyboardShortcuts'

export interface HistoryToolsProps {
  /** TipTap editor instance */
  editor: Editor | null
}

/**
 * History Tools - Undo/Redo buttons
 *
 * Buttons are automatically disabled when no undo/redo actions are available.
 */
export function HistoryTools({ editor }: HistoryToolsProps): JSX.Element | null {
  if (!editor) {
    return null
  }

  const canUndo = editor.can().undo()
  const canRedo = editor.can().redo()

  const undoShortcut = getShortcutDisplay('undo')
  const redoShortcut = getShortcutDisplay('redo')

  return (
    <>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!canUndo}
        aria-label={`撤销 (${undoShortcut})`}
        title={`撤销 (${undoShortcut})`}
        type="button"
      >
        ↶ 撤销
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!canRedo}
        aria-label={`重做 (${redoShortcut})`}
        title={`重做 (${redoShortcut})`}
        type="button"
      >
        ↷ 重做
      </button>
    </>
  )
}
