/**
 * Collaboration Caret Extension for TipTap 3.x
 * Displays other users' carets and selections
 * @module extensions/collaboration/CollaborationCursor
 */

import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import type { WebsocketProvider } from 'y-websocket'

/**
 * Collaboration caret options (TipTap 3.x)
 */
export interface CollaborationCursorOptions {
  /** WebSocket Provider instance (required by TipTap 3.x CollaborationCaret) */
  provider: WebsocketProvider
  /** Current user information */
  user: {
    name: string
    color: string
  }
}

/**
 * Create Collaboration Caret extension (TipTap 3.x)
 * Wraps TipTap's official CollaborationCaret extension with our configuration
 *
 * Note: In TipTap 3.x, the extension is called CollaborationCaret (not CollaborationCursor)
 * and it requires a WebsocketProvider (not Awareness) as the provider parameter.
 *
 * @param options - Caret options
 * @returns Configured CollaborationCaret extension
 */
export function createCollaborationCursorExtension(options: CollaborationCursorOptions) {
  return CollaborationCaret.configure({
    provider: options.provider,
    user: options.user
  })
}

// Export as CollaborationCaret for clarity
export default CollaborationCaret
