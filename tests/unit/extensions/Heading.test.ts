/**
 * Unit test for Heading extension
 * @module tests/unit/extensions/Heading
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Editor } from '@tiptap/core'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Heading } from '../../../src/extensions/formatting/Heading'

describe('Heading Extension', () => {
  let editor: Editor

  beforeEach(() => {
    editor = new Editor({
      extensions: [Document, Paragraph, Text, Heading],
      content: '<p>Hello world</p>'
    })
  })

  afterEach(() => {
    editor.destroy()
  })

  it('should set heading level 1', () => {
    editor.commands.setTextSelection({ from: 1, to: 12 })
    editor.commands.setHeading({ level: 1 })

    expect(editor.isActive('heading', { level: 1 })).toBe(true)

    const html = editor.getHTML()
    expect(html).toContain('<h1 class="heading">Hello world</h1>')
  })

  it('should set heading level 2', () => {
    editor.commands.setTextSelection({ from: 1, to: 12 })
    editor.commands.setHeading({ level: 2 })

    expect(editor.isActive('heading', { level: 2 })).toBe(true)

    const html = editor.getHTML()
    expect(html).toContain('<h2 class="heading">Hello world</h2>')
  })

  it('should set heading level 3', () => {
    editor.commands.setTextSelection({ from: 1, to: 12 })
    editor.commands.setHeading({ level: 3 })

    expect(editor.isActive('heading', { level: 3 })).toBe(true)

    const html = editor.getHTML()
    expect(html).toContain('<h3 class="heading">Hello world</h3>')
  })

  it('should toggle heading to paragraph', () => {
    // Set heading level 1
    editor.commands.setTextSelection({ from: 1, to: 12 })
    editor.commands.setHeading({ level: 1 })

    expect(editor.isActive('heading', { level: 1 })).toBe(true)

    // Toggle back to paragraph
    editor.commands.setParagraph()

    expect(editor.isActive('heading')).toBe(false)
    expect(editor.isActive('paragraph')).toBe(true)

    const html = editor.getHTML()
    expect(html).toContain('<p>Hello world</p>')
  })

  it('should be active for correct level only', () => {
    editor.commands.setTextSelection({ from: 1, to: 12 })
    editor.commands.setHeading({ level: 2 })

    expect(editor.isActive('heading', { level: 2 })).toBe(true)
    expect(editor.isActive('heading', { level: 1 })).toBe(false)
    expect(editor.isActive('heading', { level: 3 })).toBe(false)
  })

  it('should change between heading levels', () => {
    // Start with level 1
    editor.commands.setTextSelection({ from: 1, to: 12 })
    editor.commands.setHeading({ level: 1 })
    expect(editor.isActive('heading', { level: 1 })).toBe(true)

    // Change to level 2
    editor.commands.setHeading({ level: 2 })
    expect(editor.isActive('heading', { level: 2 })).toBe(true)
    expect(editor.isActive('heading', { level: 1 })).toBe(false)

    // Change to level 3
    editor.commands.setHeading({ level: 3 })
    expect(editor.isActive('heading', { level: 3 })).toBe(true)
    expect(editor.isActive('heading', { level: 2 })).toBe(false)
  })
})
