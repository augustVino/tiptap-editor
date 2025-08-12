import React from 'react';
import styles from './index.module.less';
import { NodeViewWrapper } from '@tiptap/react';

export default function DefaultMentionTag(props: any) {
  const {
    node,
    extension: { options }
  } = props;
  console.log('DefaultMentionTag.props', props);
  const handleClick = () => {
    // 你的点击事件逻辑
    console.log('Mention clicked:', node.attrs.id);
  };

  return (
    <NodeViewWrapper
      as="span"
      className={styles.mentionTag}
      onClick={handleClick}
      data-id={node.attrs.id}
    >
      {options.suggestion.char}
      {node.attrs.label || node.attrs.id}
    </NodeViewWrapper>
  );
}
