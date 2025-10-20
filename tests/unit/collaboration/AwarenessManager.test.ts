/**
 * AwarenessManager Unit Tests
 * Tests user join/leave, cursor updates, and state management
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as Y from 'yjs'
import * as awarenessProtocol from 'y-protocols/awareness'
import { AwarenessManager } from '../../../src/collaboration/AwarenessManager'

describe('AwarenessManager', () => {
  let ydoc: Y.Doc
  let awareness: awarenessProtocol.Awareness
  let awarenessManager: AwarenessManager

  beforeEach(() => {
    ydoc = new Y.Doc()
    awareness = new awarenessProtocol.Awareness(ydoc)
  })

  afterEach(() => {
    awarenessManager?.destroy()
    awareness?.destroy()
    ydoc?.destroy()
  })

  it('should initialize with current user', () => {
    awarenessManager = new AwarenessManager(awareness, {
      id: 'user-1',
      name: 'Test User',
      color: '#4ECDC4'
    })

    const users = awarenessManager.getOnlineUsers()
    expect(users).toHaveLength(1)
    expect(users[0]).toEqual({
      id: 'user-1',
      name: 'Test User',
      color: '#4ECDC4'
    })
  })

  it('should detect when new user joins', async () => {
    awarenessManager = new AwarenessManager(awareness, {
      id: 'user-1',
      name: 'User 1',
      color: '#4ECDC4'
    })

    const joinHandler = vi.fn()
    awarenessManager.on('userJoined', joinHandler)

    // Simulate another user joining by setting state for a different client ID
    const states = awarenessManager.awareness.getStates()
    const newClientId = 9999 // Fake client ID for test
    states.set(newClientId, {
      user: {
        id: 'user-2',
        name: 'User 2',
        color: '#FF6B6B'
      }
    })

    // Manually trigger the change event
    awarenessManager.awareness.emit('change', [
      { added: [newClientId], updated: [], removed: [] }
    ])

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(joinHandler).toHaveBeenCalled()
  })

  it('should detect when user leaves', async () => {
    awarenessManager = new AwarenessManager(awareness, {
      id: 'user-1',
      name: 'User 1',
      color: '#4ECDC4'
    })

    const leaveHandler = vi.fn()
    awarenessManager.on('userLeft', leaveHandler)

    // Add a user
    const clientId = awarenessManager.awareness.clientID
    awarenessManager.awareness.setLocalState({
      user: {
        id: 'user-2',
        name: 'User 2',
        color: '#FF6B6B'
      }
    })

    // Remove the user
    awarenessManager.awareness.setLocalState(null)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(leaveHandler).toHaveBeenCalled()
  })

  it('should update cursor position', () => {
    awarenessManager = new AwarenessManager(awareness, {
      id: 'user-1',
      name: 'User 1',
      color: '#4ECDC4'
    })

    awarenessManager.updateCursor({ anchor: 0, head: 5 })

    const state = awarenessManager.awareness.getLocalState()
    expect(state).toHaveProperty('cursor')
    expect(state?.cursor).toEqual({ anchor: 0, head: 5 })
  })

  it('should return list of online users', () => {
    awarenessManager = new AwarenessManager(awareness, {
      id: 'user-1',
      name: 'User 1',
      color: '#4ECDC4'
    })

    const users = awarenessManager.getOnlineUsers()
    expect(Array.isArray(users)).toBe(true)
    expect(users.length).toBeGreaterThanOrEqual(0)
  })

  it('should cleanup on destroy', () => {
    awarenessManager = new AwarenessManager(awareness, {
      id: 'user-1',
      name: 'User 1',
      color: '#4ECDC4'
    })

    const users = awarenessManager.getOnlineUsers()
    expect(users.length).toBeGreaterThan(0)

    awarenessManager.destroy()

    // After destroy, awareness should be cleaned up
    expect(awarenessManager.awareness.getStates().size).toBe(0)
  })
})
