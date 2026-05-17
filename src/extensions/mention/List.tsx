import React, { forwardRef, useImperativeHandle, useCallback } from 'react';
import type { MentionListProps } from './types';
import styles from './List.module.less';

export const List = forwardRef<{ onKeyDown: (props: { event: KeyboardEvent }) => boolean }, MentionListProps>(
  function List({ list, selectedIndex, onItemSelect, registerItemRef }, ref) {
    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          onItemSelect((selectedIndex - 1 + list.length) % list.length);
          return true;
        }
        if (event.key === 'ArrowDown') {
          onItemSelect((selectedIndex + 1) % list.length);
          return true;
        }
        return false;
      },
    }));

    if (list.length === 0) {
      return <div className={styles.empty}>暂无匹配结果</div>;
    }

    return (
      <div className={styles.list}>
        {list.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => registerItemRef?.(index, el!)}
            className={`${styles.item} ${index === selectedIndex ? styles.selected : ''}`}
            onClick={() => onItemSelect(index)}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  },
);
