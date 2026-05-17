import React from 'react';
import type { MentionListProps } from '../../src/extensions/mention/types';

const UserList: React.FC<MentionListProps> = ({ list, selectedIndex, onItemSelect, registerItemRef }) => {
  if (list.length === 0) {
    return <div style={styles.empty}>暂无匹配用户</div>;
  }

  return (
    <div style={styles.container}>
      {list.map((item, index) => (
        <div
          key={item.id}
          ref={(el) => registerItemRef?.(index, el!)}
          onClick={() => onItemSelect(index)}
          style={{
            ...styles.item,
            ...(index === selectedIndex ? styles.selected : {}),
          }}
        >
          <span style={styles.avatar}>{item.avatar}</span>
          <div>
            <div style={styles.name}>{item.label}</div>
            <div style={styles.meta}>
              {item.department} · {item.role}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'white',
    border: '1px solid #e8e8e8',
    borderRadius: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    maxHeight: 240,
    overflow: 'auto',
    minWidth: 220,
  },
  item: {
    padding: '8px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderLeft: '3px solid transparent',
  },
  selected: {
    backgroundColor: '#f0f9ff',
    borderLeftColor: '#1890ff',
  },
  avatar: { fontSize: 18 },
  name: { fontWeight: 500, fontSize: 14 },
  meta: { fontSize: 12, color: '#666' },
  empty: { padding: '8px 12px', color: '#999', fontSize: 13 },
};

export default UserList;
