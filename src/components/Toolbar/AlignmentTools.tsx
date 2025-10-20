/**
 * Alignment Tools Component
 *
 * Provides text alignment button (justify).
 */

import type { Editor } from '@tiptap/core'

export interface AlignmentToolsProps {
  /** TipTap editor instance */
  editor: Editor | null
}

/**
 * Alignment Tools - Text alignment button
 *
 * Currently only provides Justify alignment.
 * Other alignments (left, center, right) can be added in the future.
 */
export function AlignmentTools({ editor }: AlignmentToolsProps): JSX.Element | null {
  if (!editor) {
    return null
  }

  const isJustifyActive = editor.isActive({ textAlign: 'justify' })

  return (
    <button
      onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      className={isJustifyActive ? 'active' : ''}
      aria-pressed={isJustifyActive}
      aria-label="两端对齐"
      title="两端对齐"
      type="button"
    >
      ≣ 两端对齐
    </button>
  )
}
