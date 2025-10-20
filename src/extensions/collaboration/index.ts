/**
 * Collaboration extensions export
 * @module extensions/collaboration
 */

export {
  createCollaborationExtension,
  default as Collaboration
} from './CollaborationExtension'

export {
  createCollaborationCursorExtension,
  default as CollaborationCursor
} from './CollaborationCursor'

export type { CollaborationOptions } from './CollaborationExtension'
export type { CollaborationCursorOptions } from './CollaborationCursor'
