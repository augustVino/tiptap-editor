import { ReactNodeViewRenderer } from '@tiptap/react';
import type { ReactNodeViewProps } from '@tiptap/react';
import { DefaultTag } from './DefaultTag';

export function getMentionNodeView(
  component?: React.ComponentType<ReactNodeViewProps>,
) {
  const Comp = component ?? DefaultTag;
  return ReactNodeViewRenderer(Comp);
}
