/**
 * Unit test for Bold extension
 * @module tests/unit/extensions/Bold
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Bold } from '../../../src/extensions/formatting/Bold'

describe('Bold Extension', () => {
  let editor: Editor

  beforeEach(() => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text, Bold],
      content: '<p>Hello world</p>'
    })
  })

  afterEach(() => {
    editor.destroy()
  })

  it('should toggle bold on selected text', () => {
    // Select "world"
    editor.commands.setTextSelection({ from: 7, to: 12 })

    // Toggle bold
    editor.commands.toggleBold()

    // Check if bold is active
    expect(editor.isActive('bold')).toBe(true)

    // Check HTML output
    const html = editor.getHTML()
    expect(html).toContain('<strong class="bold">world</strong>')
  })

  it('should remove bold when toggled again', () => {
    // Select "world" and make it bold
    editor.commands.setTextSelection({ from: 7, to: 12 })
    editor.commands.toggleBold()

    // Toggle bold again to remove
    editor.commands.toggleBold()

    // Check if bold is not active
    expect(editor.isActive('bold')).toBe(false)

    // Check HTML output
    const html = editor.getHTML()
    expect(html).not.toContain('<strong>')
  })

  it('should be active when cursor is in bold text', () => {
    // Select "world" and make it bold
    editor.commands.setTextSelection({ from: 7, to: 12 })
    editor.commands.toggleBold()

    // Move cursor inside bold text
    editor.commands.setTextSelection(9)

    // Check if bold is active
    expect(editor.isActive('bold')).toBe(true)
  })

  it('should not be active when cursor is in normal text', () => {
    // Select "world" and make it bold
    editor.commands.setTextSelection({ from: 7, to: 12 })
    editor.commands.toggleBold()

    // Move cursor to "Hello"
    editor.commands.setTextSelection(3)

    // Check if bold is not active
    expect(editor.isActive('bold')).toBe(false)
  })
})
