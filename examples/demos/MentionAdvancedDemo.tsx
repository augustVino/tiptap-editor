import React, { useRef, useState, useMemo } from 'react';
import {
  Editor,
  EditorRef,
  createMentionExtension,
  getMentionSourceFromJSON,
  getAllMentionSourcesFromJSON,
} from '../../src';
import type { MentionItem } from '../../src';
import UserList from '../components/UserList';

const colleagues = [
  { userId: 'u_001', name: '王明', kind: 'user', email: 'wangming@example.com', department: '技术部', avatar: '👨‍💻', role: '前端工程师' },
  { userId: 'u_002', name: '李华', kind: 'user', email: 'lihua@example.com', department: '产品部', avatar: '👩‍💼', role: '产品经理' },
  { userId: 'u_003', name: '赵芳', kind: 'user', email: 'zhaofang@example.com', department: '设计部', avatar: '👩‍🎨', role: 'UI 设计师' },
  { userId: 'u_004', name: '陈强', kind: 'user', email: 'chenqiang@example.com', department: '技术部', avatar: '👨‍💻', role: '后端工程师' },
  { userId: 'u_005', name: '周婷', kind: 'user', email: 'zhouting@example.com', department: '市场部', avatar: '👩‍📈', role: '市场专员' },
  { userId: 'u_006', name: '孙磊', kind: 'user', email: 'sunlei@example.com', department: '技术部', avatar: '👨‍💻', role: '架构师' },
];

function fetchColleagues(query: string): Promise<MentionItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(colleagues.filter((c) => c.name.includes(query)).slice(0, 6));
    }, 200 + Math.random() * 300);
  });
}

const MentionAdvancedDemo: React.FC = () => {
  const editorRef = useRef<EditorRef>(null);
  const [content, setContent] = useState('');

  const extensions = useMemo(
    () => [
      createMentionExtension({
        name: 'colleagueMention',
        trigger: '@',
        fetchItems: fetchColleagues,
        listComponent: UserList,
        fieldNames: { label: 'name', id: 'userId' },
        addSourceAttr: ['email', 'department'],
        onTagClick: ({ id, label, kind }) => {
          alert(`点击标签: ${label} (id=${id}, kind=${kind})`);
        },
        onSelect: (item) => {
          console.log('[Advanced] onSelect:', item);
        },
        debounceMs: 300,
        emptyText: '没有找到匹配的同事',
        tippyOptions: {
          placement: 'bottom-start',
          offset: [0, 8] as [number, number],
          maxWidth: 300,
        },
      }),
    ],
    [],
  );

  const handleExtractSources = () => {
    const json = editorRef.current?.getJSON();
    if (!json) return;
    const first = getMentionSourceFromJSON(json, 'colleagueMention');
    const all = getAllMentionSourcesFromJSON(json, 'colleagueMention');
    console.log('[Advanced] first source:', first);
    console.log('[Advanced] all sources:', all);
    alert(`第一个源数据: ${JSON.stringify(first)}\n\n全部源数据 (${all.length} 条): ${JSON.stringify(all)}`);
  };

  return (
    <section>
      <h3>9. Mention 高级配置 — 自定义列表 + 字段映射 + 源数据序列化</h3>
      <p style={descStyle}>
        输入 <code>@</code> 触发同事列表（自定义 listComponent + fieldNames 字段映射）。选中后通过 addSourceAttr 选择性序列化源数据。
        点击标签触发 onTagClick 回调。搜索使用 300ms 防抖。
      </p>

      <Editor
        ref={editorRef}
        placeholder="输入 @ 搜索同事..."
        extensions={extensions}
        value={content}
        onChange={(c) => setContent(c.html)}
      />

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button onClick={handleExtractSources}>提取 Mention 源数据</button>
      </div>

      <details style={{ marginTop: 8 }}>
        <summary><strong>HTML 输出</strong></summary>
        <pre style={preStyle}>{content}</pre>
      </details>

      <details style={{ marginTop: 8 }}>
        <summary><strong>JSON 内容（含 mentionSource）</strong></summary>
        <pre style={preStyle}>
          {JSON.stringify(editorRef.current?.getJSON(), null, 2)}
        </pre>
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
  maxHeight: 200,
  overflow: 'auto',
};

export default MentionAdvancedDemo;
