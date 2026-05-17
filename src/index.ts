export { Editor } from './Editor';
export type { EditorProps, EditorRef, ContentHelpers } from './Editor';

export { createSubmitExtension } from './extensions';
export type { SubmitConfig } from './extensions';

export { createFileHandlerExtension, partitionFiles } from './extensions';
export type { FileHandlerConfig } from './extensions';

export { createMentionExtension, getMentionSourceFromJSON, getAllMentionSourcesFromJSON } from './extensions';
export type { MentionConfig, MentionItem, MentionListProps, MentionTippyOptions, MentionTagClickAttrs } from './extensions';
export { withMentionInteraction } from './extensions';
export { NodeViewWrapper } from '@tiptap/react';
