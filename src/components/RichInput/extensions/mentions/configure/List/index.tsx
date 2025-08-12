import React from 'react';
import classnames from 'classnames';
import { MentionListPureDisplayProps } from '../types';
import styles from './index.module.less';

/**
 * 纯展示List组件实现
 */
const List: React.FC<MentionListPureDisplayProps> = (props) => {
  const { list, selectedIndex, onItemSelect, registerItemRef } = props;

  return (
    <div className={styles['mention-list']}>
      {list.length ? (
        list.map((item, index) => (
          <div
            className={classnames(styles['mention-list-item'], {
              [styles.selected]: index === selectedIndex
            })}
            key={item.id}
            ref={(el) => {
              if (el) {
                registerItemRef?.(index, el);
              }
            }}
            onClick={() => onItemSelect(index)}
          >
            {item.label}
          </div>
        ))
      ) : (
        <div className={styles['mention-list-item']}>无匹配结果</div>
      )}
    </div>
  );
};

export default List;
