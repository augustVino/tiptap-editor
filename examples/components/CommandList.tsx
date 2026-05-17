import React from 'react';
import type { MentionListProps } from '../../src/extensions/mention/types';

const CommandList: React.FC<MentionListProps> = ({ list, selectedIndex, onItemSelect, registerItemRef }) => {
  if (list.length === 0) {
    return <div style={styles.empty}>暂无匹配命令</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.headerText}>选择命令</span>
      </div>
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
          <span style={styles.icon}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={styles.name}>{item.label}</div>
            <div style={styles.description}>{item.description}</div>
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
    maxHeight: 260,
    overflow: 'auto',
    minWidth: 240,
  },
  header: {
    padding: '6px 12px',
    background: '#fafafa',
    borderBottom: '1px solid #f0f0f0',
  },
  headerText: { color: '#666', fontWeight: 500, fontSize: 12 },
  item: {
    padding: '10px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderLeft: '3px solid transparent',
  },
  selected: {
    backgroundColor: '#f6ffed',
    borderLeftColor: '#52c41a',
  },
  icon: { fontSize: 18 },
  name: { fontWeight: 500, fontSize: 14 },
  description: { fontSize: 12, color: '#666' },
  empty: { padding: '8px 12px', color: '#999', fontSize: 13 },
};

export default CommandList;
