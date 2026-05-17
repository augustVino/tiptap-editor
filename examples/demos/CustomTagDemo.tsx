import React from 'react';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import {
  Editor,
  createMentionExtension,
} from '../../src';
import { fetchCandidates, fetchPositions } from '../mocks';

const CandidateTag: React.FC<ReactNodeViewProps> = ({ node }) => {
  const { id, label, kind } = node.attrs;
  return (
    <NodeViewWrapper
      as="span"
      style={tagStyle}
      onClick={() => console.log('[CustomTag] 候选人:', { id, kind })}
    >
      @{label}
      <span style={kindStyle}>候选人</span>
    </NodeViewWrapper>
  );
};

const PositionTag: React.FC<ReactNodeViewProps> = ({ node }) => {
  const { id, label, kind } = node.attrs;
  return (
    <NodeViewWrapper
      as="span"
      style={tagStyle}
      onClick={() => console.log('[CustomTag] 职位:', { id, kind })}
    >
      @{label}
      <span style={kindStyle}>职位</span>
    </NodeViewWrapper>
  );
};

const tagStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '1px 6px',
  borderRadius: 4,
  backgroundColor: 'rgba(79, 158, 237, 0.1)',
  color: '#4f9eed',
  fontWeight: 500,
  fontSize: 'inherit',
  lineHeight: 'inherit',
  cursor: 'pointer',
};

const kindStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#999',
  borderLeft: '1px solid rgba(79,158,237,0.3)',
  paddingLeft: 4,
  marginLeft: 2,
};

const CustomTagDemo: React.FC = () => {
  const [content, setContent] = React.useState('');

  const extensions = React.useMemo(
    () => [
      createMentionExtension({
        name: 'customCandidate',
        trigger: '@',
        fetchItems: fetchCandidates,
        tagComponent: CandidateTag,
        onSelect: (item) => {
          console.log('[Custom] 选中候选人:', { id: item.id, kind: item.kind });
        },
      }),
      createMentionExtension({
        name: 'customPosition',
        trigger: '#',
        fetchItems: fetchPositions,
        tagComponent: PositionTag,
        onSelect: (item) => {
          console.log('[Custom] 选中职位:', { id: item.id, kind: item.kind });
        },
      }),
    ],
    [],
  );

  return (
    <section>
      <h3>6. 自定义标签渲染 + 多触发字符</h3>
      <p style={descStyle}>
        自定义 tagComponent 渲染 mention 标签（显示类型标识），同时支持 <code>@</code>（候选人）和 <code>#</code>（职位）两种触发字符。
        点击标签在控制台打印 id 和 kind。
      </p>

      <Editor
        placeholder="输入 @ 选择候选人，# 选择职位..."
        extensions={extensions}
        value={content}
        onChange={(c) => setContent(c.html)}
      />

      <details style={{ marginTop: 12 }}>
        <summary><strong>HTML 输出</strong></summary>
        <pre style={preStyle}>{content}</pre>
      </details>
    </section>
  );
};

const descStyle: React.CSSProperties = { color: '#666', fontSize: 14, marginBottom: 12 };
const preStyle: React.CSSProperties = {
  background: '#f5f5f5',
  padding: 8,
  borderRadius: 4,
  fontSize: 12,
  maxHeight: 120,
  overflow: 'auto',
};

export default CustomTagDemo;
