import React from 'react';
import type { MentionListProps } from './types';
import styles from './List.module.less';

export const List: React.FC<MentionListProps> = function List({
  list,
  selectedIndex,
  onItemSelect,
  registerItemRef,
  emptyText,
}) {
  if (list.length === 0) {
    return <div className={styles.empty}>{emptyText ?? '暂无匹配结果'}</div>;
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
};
