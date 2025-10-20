/**
 * Integration test for editor initialization
 * @module tests/integration/editor-initialization
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { EditorProvider } from '../../src/editor/EditorProvider'
import { EditorContent } from '../../src/components/Editor/EditorContent'

describe('Editor Initialization', () => {
  beforeEach(() => {
    // Clean up before each test
  })

  it('should mount editor successfully', async () => {
    render(
      <EditorProvider documentId="test-doc">
        <EditorContent />
      </EditorProvider>
    )

    // Editor should be mounted
    await waitFor(() => {
      const editorElement = document.querySelector('[contenteditable="true"]')
      expect(editorElement).toBeInTheDocument()
    })
  })

  it('should make editor editable by default', async () => {
    render(
      <EditorProvider documentId="test-doc">
        <EditorContent />
      </EditorProvider>
    )

    await waitFor(() => {
      const editorElement = document.querySelector('[contenteditable="true"]')
      expect(editorElement).toHaveAttribute('contenteditable', 'true')
    })
  })

  it('should show placeholder when empty', async () => {
    const placeholderText = 'Start typing...'

    render(
      <EditorProvider documentId="test-doc" placeholder={placeholderText}>
        <EditorContent />
      </EditorProvider>
    )

    await waitFor(() => {
      const paragraphElement = document.querySelector('p[data-placeholder]')
      expect(paragraphElement).toHaveAttribute('data-placeholder', placeholderText)
    })
  })

  it('should initialize with empty document', async () => {
    render(
      <EditorProvider documentId="test-doc">
        <EditorContent />
      </EditorProvider>
    )

    await waitFor(() => {
      const editorElement = document.querySelector('.ProseMirror')
      expect(editorElement?.textContent).toBe('')
    })
  })
})
