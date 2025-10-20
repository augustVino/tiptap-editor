/**
 * Collaboration Extension for TipTap
 * Integrates Yjs CRDT for real-time collaboration
 * @module extensions/collaboration/CollaborationExtension
 */

import Collaboration from '@tiptap/extension-collaboration'
import type * as Y from 'yjs'

/**
 * Collaboration extension options
 */
export interface CollaborationOptions {
  /** Yjs document instance */
  document: Y.Doc
  /** Field name in Yjs document (default: 'default') */
  field?: string
}

/**
 * Create Collaboration extension
 * Wraps TipTap's official Collaboration extension with our configuration
 *
 * @param options - Collaboration options
 * @returns Configured Collaboration extension
 */
export function createCollaborationExtension(options: CollaborationOptions) {
  return Collaboration.configure({
    document: options.document,
    field: options.field || 'default'
  })
}

export default Collaboration
