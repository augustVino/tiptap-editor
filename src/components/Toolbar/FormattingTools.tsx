/**
 * Formatting Tools Component
 *
 * Provides rich text formatting buttons: Blockquote, Code, Highlight, Link, Superscript, Subscript.
 */

import type { Editor } from '@tiptap/core'
import { isValidUrl } from '../../utils/storage'
import { getShortcutDisplay } from '../../editor/keyboardShortcuts'

export interface FormattingToolsProps {
  /** TipTap editor instance */
  editor: Editor | null
}

/**
 * Formatting Tools - Rich text formatting buttons
 *
 * Includes: Blockquote, Code, Highlight, Link, Superscript, Subscript
 */
export function FormattingTools({ editor }: FormattingToolsProps): JSX.Element | null {
  if (!editor) {
    return null
  }

  /**
   * Handle link insertion with URL validation
   */
  const handleSetLink = (): void => {
    const { from, to } = editor.state.selection

    // Check if text is selected
    if (from === to) {
      alert('请先选择要添加链接的文本')
      return
    }

    // Prompt for URL
    const url = window.prompt('请输入链接 URL:')

    if (url) {
      // Validate URL format
      if (!isValidUrl(url)) {
        alert('请输入有效的 URL（需包含协议，如 https://）')
        return
      }

      // Set link
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  /**
   * Handle link removal
   */
  const handleUnsetLink = (): void => {
    editor.chain().focus().unsetLink().run()
  }

  const isLinkActive = editor.isActive('link')
  const linkShortcut = getShortcutDisplay('link')

  return (
    <>
      {/* Blockquote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'active' : ''}
        aria-pressed={editor.isActive('blockquote')}
        aria-label="引用块"
        title="引用块"
        type="button"
      >
        ❝ 引用
      </button>

      {/* Inline Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'active' : ''}
        aria-pressed={editor.isActive('code')}
        aria-label="代码"
        title="代码"
        type="button"
      >
        {'<>'} 代码
      </button>

      {/* Highlight */}
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'active' : ''}
        aria-pressed={editor.isActive('highlight')}
        aria-label="高亮"
        title="高亮"
        type="button"
      >
        🖍 高亮
      </button>

      {/* Link */}
      <button
        onClick={isLinkActive ? handleUnsetLink : handleSetLink}
        className={isLinkActive ? 'active' : ''}
        aria-pressed={isLinkActive}
        aria-label={isLinkActive ? '移除链接' : `插入链接 (${linkShortcut})`}
        title={isLinkActive ? '移除链接' : `插入链接 (${linkShortcut})`}
        type="button"
      >
        🔗 {isLinkActive ? '移除链接' : '链接'}
      </button>

      {/* Superscript */}
      <button
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={editor.isActive('superscript') ? 'active' : ''}
        aria-pressed={editor.isActive('superscript')}
        aria-label="上标"
        title="上标"
        type="button"
      >
        x²
      </button>

      {/* Subscript */}
      <button
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={editor.isActive('subscript') ? 'active' : ''}
        aria-pressed={editor.isActive('subscript')}
        aria-label="下标"
        title="下标"
        type="button"
      >
        x₂
      </button>
    </>
  )
}
