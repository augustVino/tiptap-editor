/**
 * AwarenessManager - Manages user presence and cursor positions
 * @module collaboration/AwarenessManager
 */

import * as awarenessProtocol from 'y-protocols/awareness'
import type { AwarenessUser } from './types'

type EventHandler = (...args: unknown[]) => void

/**
 * User information for awareness
 */
export interface UserInfo {
  id: string
  name: string
  color: string
}

/**
 * Cursor position
 */
export interface CursorPosition {
  anchor: number
  head: number
}

/**
 * AwarenessManager class
 * Tracks online users, cursor positions, and emits events
 */
export class AwarenessManager {
  public awareness: awarenessProtocol.Awareness
  private eventHandlers: Map<string, Set<EventHandler>>

  constructor(awareness: awarenessProtocol.Awareness, user: UserInfo) {
    this.awareness = awareness
    this.eventHandlers = new Map()

    // Set local user state
    this.awareness.setLocalState({
      user: {
        id: user.id,
        name: user.name,
        color: user.color
      }
    })

    // Listen to awareness changes
    this.awareness.on('change', this.handleAwarenessChange.bind(this))
  }

  /**
   * Handle awareness changes (users join/leave)
   */
  private handleAwarenessChange({ added, updated, removed }: { added: number[], updated: number[], removed: number[] }) {
    // Handle users joining
    added.forEach(clientId => {
      const state = this.awareness.getStates().get(clientId)
      if (state?.user) {
        this.emit('userJoined', state.user)
      }
    })

    // Handle users leaving
    removed.forEach(clientId => {
      this.emit('userLeft', { clientId })
    })

    // Handle cursor updates
    updated.forEach(clientId => {
      const state = this.awareness.getStates().get(clientId)
      if (state?.cursor) {
        this.emit('cursorUpdated', {
          clientId,
          cursor: state.cursor,
          user: state.user
        })
      }
    })
  }

  /**
   * Update current user's cursor position
   */
  public updateCursor(cursor: CursorPosition | null) {
    this.awareness.setLocalStateField('cursor', cursor)
  }

  /**
   * Get list of online users
   */
  public getOnlineUsers(): AwarenessUser[] {
    const users: AwarenessUser[] = []

    this.awareness.getStates().forEach((state, clientId) => {
      if (state?.user) {
        users.push({
          id: clientId.toString(),
          name: state.user.name,
          color: state.user.color,
          cursor: state.cursor
        })
      }
    })

    return users
  }

  /**
   * Register event handler
   */
  public on(event: string, handler: EventHandler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)
  }

  /**
   * Unregister event handler
   */
  public off(event: string, handler: EventHandler) {
    this.eventHandlers.get(event)?.delete(handler)
  }

  /**
   * Emit event
   */
  private emit(event: string, ...args: unknown[]) {
    this.eventHandlers.get(event)?.forEach(handler => {
      handler(...args)
    })
  }

  /**
   * Cleanup and destroy
   */
  public destroy() {
    // Clear local state
    this.awareness.setLocalState(null)

    // Remove all event handlers
    this.eventHandlers.clear()

    // Destroy awareness
    this.awareness.destroy()
  }
}
