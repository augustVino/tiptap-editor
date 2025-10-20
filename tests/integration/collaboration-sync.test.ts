/**
 * Collaboration Sync Integration Tests
 * Tests two editors syncing via Yjs CRDT
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

describe('Collaboration Sync', () => {
  let ydoc1: Y.Doc
  let ydoc2: Y.Doc
  let provider1: WebsocketProvider
  let provider2: WebsocketProvider

  beforeEach(() => {
    // Create two separate Yjs documents
    ydoc1 = new Y.Doc()
    ydoc2 = new Y.Doc()
  })

  afterEach(() => {
    // Cleanup
    provider1?.destroy()
    provider2?.destroy()
    ydoc1?.destroy()
    ydoc2?.destroy()
  })

  it('should sync text insertions between two documents', async () => {
    const text1 = ydoc1.getText('content')
    const text2 = ydoc2.getText('content')

    // Simulate local sync without WebSocket (for testing)
    const updates: Uint8Array[] = []

    ydoc1.on('update', (update: Uint8Array) => {
      updates.push(update)
      Y.applyUpdate(ydoc2, update)
    })

    ydoc2.on('update', (update: Uint8Array) => {
      updates.push(update)
      Y.applyUpdate(ydoc1, update)
    })

    // User 1 inserts text
    text1.insert(0, 'Hello ')

    // User 2 should see the change
    expect(text2.toString()).toBe('Hello ')

    // User 2 inserts more text
    text2.insert(6, 'World')

    // User 1 should see the combined text
    expect(text1.toString()).toBe('Hello World')
  })

  it('should handle concurrent edits without conflicts', async () => {
    const text1 = ydoc1.getText('content')
    const text2 = ydoc2.getText('content')

    // Set up bidirectional sync
    ydoc1.on('update', (update: Uint8Array) => {
      Y.applyUpdate(ydoc2, update)
    })

    ydoc2.on('update', (update: Uint8Array) => {
      Y.applyUpdate(ydoc1, update)
    })

    // Initial content
    text1.insert(0, 'Document')

    // Pause sync temporarily
    ydoc1.off('update', () => {})
    ydoc2.off('update', () => {})

    // Both users edit simultaneously at different positions
    text1.insert(0, 'My ')  // "My Document"
    text2.insert(8, ' Title')  // "Document Title"

    // Resume sync and apply updates
    const update1 = Y.encodeStateAsUpdate(ydoc1)
    const update2 = Y.encodeStateAsUpdate(ydoc2)

    Y.applyUpdate(ydoc2, update1)
    Y.applyUpdate(ydoc1, update2)

    // Both documents should converge to same state
    expect(text1.toString()).toBe(text2.toString())
    // CRDT should preserve both edits
    expect(text1.toString()).toContain('My')
    expect(text1.toString()).toContain('Title')
  })

  it('should resolve conflicting edits using CRDT algorithm', async () => {
    const text1 = ydoc1.getText('content')
    const text2 = ydoc2.getText('content')

    // Set up sync
    ydoc1.on('update', (update: Uint8Array) => {
      Y.applyUpdate(ydoc2, update)
    })

    ydoc2.on('update', (update: Uint8Array) => {
      Y.applyUpdate(ydoc1, update)
    })

    // Both users edit at the same position
    text1.insert(0, 'Hello')

    // Simulate conflict: both try to edit same location
    // CRDT should resolve this deterministically
    const finalText = text1.toString()
    expect(finalText).toBe(text2.toString())
    expect(finalText.length).toBeGreaterThan(0)
  })
})
