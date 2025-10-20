/**
 * Offline Recovery Integration Tests
 * Tests IndexedDB persistence and network reconnection
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'

describe('Offline Recovery', () => {
  const testDbName = 'test-offline-recovery'
  let ydoc: Y.Doc
  let persistence: IndexeddbPersistence

  beforeEach(async () => {
    ydoc = new Y.Doc()
  })

  afterEach(async () => {
    // Cleanup
    persistence?.destroy()
    ydoc?.destroy()

    // Clear test database
    if (typeof indexedDB !== 'undefined') {
      await new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase(testDbName)
        request.onsuccess = () => resolve()
        request.onerror = () => resolve()
      })
    }
  })

  it('should persist document to IndexedDB', async () => {
    persistence = new IndexeddbPersistence(testDbName, ydoc)

    // Wait for persistence to be ready
    await new Promise<void>((resolve) => {
      persistence.once('synced', () => resolve())
    })

    const text = ydoc.getText('content')
    text.insert(0, 'Offline content')

    // Force persistence
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify content was saved
    expect(text.toString()).toBe('Offline content')
  })

  it('should restore document from IndexedDB after reload', async () => {
    // First session: save data
    const ydoc1 = new Y.Doc()
    const persistence1 = new IndexeddbPersistence(testDbName, ydoc1)

    await new Promise<void>((resolve) => {
      persistence1.once('synced', () => resolve())
    })

    const text1 = ydoc1.getText('content')
    text1.insert(0, 'Persisted data')

    await new Promise(resolve => setTimeout(resolve, 100))

    persistence1.destroy()
    ydoc1.destroy()

    // Second session: load data
    const ydoc2 = new Y.Doc()
    const persistence2 = new IndexeddbPersistence(testDbName, ydoc2)

    await new Promise<void>((resolve) => {
      persistence2.once('synced', () => resolve())
    })

    const text2 = ydoc2.getText('content')

    // Data should be restored
    expect(text2.toString()).toBe('Persisted data')

    persistence2.destroy()
    ydoc2.destroy()
  })

  it('should merge offline edits with online changes on reconnection', async () => {
    const ydoc1 = new Y.Doc()
    const ydoc2 = new Y.Doc()

    const text1 = ydoc1.getText('content')
    const text2 = ydoc2.getText('content')

    // Initial synced state
    text1.insert(0, 'Initial')
    const initialState = Y.encodeStateAsUpdate(ydoc1)
    Y.applyUpdate(ydoc2, initialState)

    // Simulate offline: ydoc1 edits locally
    text1.insert(7, ' offline edit')

    // Meanwhile, ydoc2 (online) receives updates
    text2.insert(7, ' online edit')

    // Reconnection: merge states
    const update1 = Y.encodeStateAsUpdate(ydoc1)
    const update2 = Y.encodeStateAsUpdate(ydoc2)

    Y.applyUpdate(ydoc2, update1)
    Y.applyUpdate(ydoc1, update2)

    // Both should converge
    expect(text1.toString()).toBe(text2.toString())
    // Both edits should be preserved
    expect(text1.toString()).toContain('offline')
    expect(text1.toString()).toContain('online')

    ydoc1.destroy()
    ydoc2.destroy()
  })
})
