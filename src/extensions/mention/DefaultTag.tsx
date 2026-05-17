import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { ReactNodeViewProps } from '@tiptap/react';
import styles from './DefaultTag.module.less';

interface MentionExtensionOptions {
  onTagClick?: (attrs: { id: string | null; label: string; kind: string | null }) => void;
  suggestion?: { char?: string };
}

export const DefaultTag: React.FC<ReactNodeViewProps> = ({ node, extension }) => {
  const { id, label, kind } = node.attrs;
  const triggerChar = extension?.options?.suggestion?.char || '@';
  const opts = extension?.options as MentionExtensionOptions | undefined;
  const onTagClick = opts?.onTagClick;

  const handleClick = () => {
    onTagClick?.({ id: id ?? null, label: label || '', kind: kind ?? null });
  };

  return (
    <NodeViewWrapper as="span" className={styles.tag} onClick={handleClick}>
      {triggerChar}{label || id}
    </NodeViewWrapper>
  );
};
