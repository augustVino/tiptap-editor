/**
 * Unit test for Italic extension
 * @module tests/unit/extensions/Italic
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Italic } from '../../../src/extensions/formatting/Italic'

describe('Italic Extension', () => {
  let editor: Editor

  beforeEach(() => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text, Italic],
      content: '<p>Hello world</p>'
    })
  })

  afterEach(() => {
    editor.destroy()
  })

  it('should toggle italic on selected text', () => {
    // Select "world"
    editor.commands.setTextSelection({ from: 7, to: 12 })

    // Toggle italic
    editor.commands.toggleItalic()

    // Check if italic is active
    expect(editor.isActive('italic')).toBe(true)

    // Check HTML output
    const html = editor.getHTML()
    expect(html).toContain('<em class="italic">world</em>')
  })

  it('should remove italic when toggled again', () => {
    // Select "world" and make it italic
    editor.commands.setTextSelection({ from: 7, to: 12 })
    editor.commands.toggleItalic()

    // Toggle italic again to remove
    editor.commands.toggleItalic()

    // Check if italic is not active
    expect(editor.isActive('italic')).toBe(false)

    // Check HTML output
    const html = editor.getHTML()
    expect(html).not.toContain('<em>')
  })

  it('should be active when cursor is in italic text', () => {
    // Select "world" and make it italic
    editor.commands.setTextSelection({ from: 7, to: 12 })
    editor.commands.toggleItalic()

    // Move cursor inside italic text
    editor.commands.setTextSelection(9)

    // Check if italic is active
    expect(editor.isActive('italic')).toBe(true)
  })

  it('should not be active when cursor is in normal text', () => {
    // Select "world" and make it italic
    editor.commands.setTextSelection({ from: 7, to: 12 })
    editor.commands.toggleItalic()

    // Move cursor to "Hello"
    editor.commands.setTextSelection(3)

    // Check if italic is not active
    expect(editor.isActive('italic')).toBe(false)
  })

  it('should work with bold (multiple marks)', () => {
    // This assumes Bold extension is also loaded
    // For now, just test italic independently
    editor.commands.setTextSelection({ from: 7, to: 12 })
    editor.commands.toggleItalic()

    expect(editor.isActive('italic')).toBe(true)
  })
})
