import React from 'react';
import type { ReactNodeViewProps } from '@tiptap/react';
import { NodeViewWrapper } from '@tiptap/react';
import {
  Editor,
  createMentionExtension,
} from '../../src';
import { fetchUsers, fetchHashtags } from '../mocks';

/**
 * 自定义 mention 标签渲染 + fieldNames 映射
 */
// 自定义标签组件（带蓝色背景 + ID 显示）
const CustomTag: React.FC<ReactNodeViewProps> = ({ node }) => {
  return (
    <NodeViewWrapper as="span" style={tagStyle}>
      @{node.attrs.label}
      <span style={idStyle}>#{node.attrs.id}</span>
    </NodeViewWrapper>
  );
};

const tagStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  padding: '1px 6px',
  borderRadius: 3,
  backgroundColor: '#e6f4ff',
  color: '#1677ff',
  fontSize: 'inherit',
  lineHeight: 'inherit',
};

const idStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#999',
  marginLeft: 2,
};

const CustomTagDemo: React.FC = () => {
  const [content, setContent] = React.useState('');

  const extensions = React.useMemo(
    () => [
      createMentionExtension({
        name: 'customUser',
        trigger: '@',
        fetchItems: fetchUsers,
        tagComponent: CustomTag,
      }),
      createMentionExtension({
        name: 'hashtag',
        trigger: '#',
        fetchItems: fetchHashtags,
      }),
    ],
    [],
  );

  return (
    <section>
      <h3>6. 自定义标签渲染 + 多触发字符</h3>
      <p style={descStyle}>
        自定义 tagComponent 渲染 mention 标签（显示 ID），同时支持 <code>@</code> 和 <code>#</code> 两种触发字符。
      </p>

      <Editor
        placeholder="输入 @ 提及用户（自定义标签），# 添加标签..."
        extensions={extensions}
        value={content}
        onChange={(c) => setContent(c.html)}
      />

      <details style={{ marginTop: 12 }}>
        <summary><strong>HTML 输出（mention 不含 source 数据）</strong></summary>
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
