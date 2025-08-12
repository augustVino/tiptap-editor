import React, { memo, useCallback, useMemo } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import styles from './index.module.less';

function AtMentionTag(props: any) {
  const { HTMLAttributes, node } = props;

  const mentionItem = useMemo(() => {
    const sourceStr = node.attrs.source;
    const data = JSON.parse(sourceStr || '{}');
    return data;
  }, [node.attrs.source]);

  const attrs = useMemo(
    () =>
      Object.keys(HTMLAttributes).reduce((acc: Record<string, any>, key) => {
        if (key === 'data-source' || key === 'class') return acc;
        acc[key] = HTMLAttributes[key];
        return acc;
      }, {} as Record<string, any>),
    [HTMLAttributes]
  );

  const handleClick = useCallback(async () => {
    console.log('mentionItem', mentionItem);
  }, [mentionItem]);

  return (
    <NodeViewWrapper
      as="span"
      {...attrs}
      style={{ whiteSpace: 'nowrap' }}
      data-kind={mentionItem.kind}
      className={styles.atMentionTag}
      onClick={handleClick}
    >
      @{node.attrs.label}
    </NodeViewWrapper>
  );
}

export default memo(AtMentionTag);
