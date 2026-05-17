import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { ReactNodeViewProps } from '@tiptap/react';
import styles from './DefaultTag.module.less';

export const DefaultTag: React.FC<ReactNodeViewProps> = ({ node, extension }) => {
  const { id, label, kind } = node.attrs;
  const triggerChar = extension?.options?.suggestion?.char || '@';

  const handleClick = () => {
    console.log('[MentionTag] clicked:', { id, kind });
  };

  return (
    <NodeViewWrapper as="span" className={styles.tag} onClick={handleClick}>
      {triggerChar}{label || id}
    </NodeViewWrapper>
  );
};
