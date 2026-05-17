import React, { useRef } from 'react';
import { Editor, EditorRef, createSubmitExtension, createMentionExtension } from '../../src';
import type { MentionItem } from '../../src';
import { candidates, positions } from '../mocks';

const allItems: MentionItem[] = [
  ...candidates.map((c) => ({ ...c })),
  ...positions.map((p) => ({ ...p })),
];

function fetchAll(query: string): Promise<MentionItem[]> {
  const delay = 200 + Math.random() * 300;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        allItems
          .filter((item) => item.label.includes(query))
          .slice(0, 14),
      );
    }, delay);
  });
}

/**
 * Mention 基础：@ 候选人 + 职位
 * kind: "1" = 职位, "2" = 候选人
 */
const MentionDemo: React.FC = () => {
  const [content, setContent] = React.useState('');
  const editorRef = useRef<EditorRef>(null);

  const extensions = React.useMemo(
    () => [
      createMentionExtension({
        name: 'candidatePositionMention',
        trigger: '@',
        fetchItems: fetchAll,
        onSelect: (item) => {
          const typeLabel = item.kind === '1' ? '职位' : '候选人';
          console.log(`[Mention] 选中${typeLabel}:`, { id: item.id, kind: item.kind, label: item.label });
        },
      }),
      createSubmitExtension({
        onSubmit: () => {
          console.log('[Mention] submit, html:', editorRef.current?.getHTML());
          console.log('[Mention] submit, json:', editorRef.current?.getJSON());
        },
        shouldSubmit: (editor) => !editor.isEmpty,
      }),
    ],
    [],
  );

  return (
    <section>
      <h3>4. Mention — @ 候选人 + 职位</h3>
      <p style={descStyle}>
        输入 <code>@</code> 触发候选人（kind=2）和职位（kind=1）列表，数据通过模拟 API 异步获取。
        上下箭头选择，Enter 确认。选中后以标签形式展示，点击标签在控制台打印 id 和 kind。
      </p>

      <Editor
        ref={editorRef}
        placeholder="输入 @ 选择候选人或职位，Enter 提交..."
        extensions={extensions}
        value={content}
        onChange={(c) => setContent(c.html)}
      />

      <details style={{ marginTop: 12 }}>
        <summary><strong>编辑器 JSON 内容（含 mention 数据）</strong></summary>
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

export default MentionDemo;
