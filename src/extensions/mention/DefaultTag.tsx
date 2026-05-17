import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { ReactNodeViewProps } from '@tiptap/react';
import styles from './DefaultTag.module.less';

export const DefaultTag: React.FC<ReactNodeViewProps> = ({ node }) => {
  return (
    <NodeViewWrapper as="span" className={styles.tag}>
      {node.attrs.label}
    </NodeViewWrapper>
  );
};
