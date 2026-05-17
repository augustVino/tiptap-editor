import React, { useRef } from 'react';
import {
  Editor,
  EditorRef,
  createSubmitExtension,
  createMentionExtension,
} from '../../src';
import type { MentionItem } from '../../src';
import { candidates, positions } from '../mocks';

const allItems: MentionItem[] = [...candidates, ...positions];

function fetchAll(query: string): Promise<MentionItem[]> {
  const delay = 200 + Math.random() * 300;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        allItems.filter((item) => item.label.includes(query)).slice(0, 14)
      );
    }, delay);
  });
}

const ChatDemo: React.FC = () => {
  const [content, setContent] = React.useState('');
  const [messages, setMessages] = React.useState<string[]>([]);
  const editorRef = useRef<EditorRef>(null);

  const extensions = React.useMemo(
    () => [
      createMentionExtension({
        name: 'candidatePositionMention',
        trigger: '@',
        addSourceAttr: true,
        fetchItems: fetchAll,
        onSelect: (item) => {
          const typeLabel = item.kind === '1' ? '职位' : '候选人';
          console.log(
            `[Chat] 选中${typeLabel}:`,
            {
              id: item.id,
              kind: item.kind,
              label: item.label,
            },
            item
          );
        },
      }),
      createSubmitExtension({
        onSubmit: () => {
          const html = editorRef.current?.getHTML() ?? '';
          if (!html || editorRef.current?.isEmpty()) return;
          setMessages((prev) => [...prev, html]);
          setContent('');
          requestAnimationFrame(() => {
            editorRef.current?.clear();
          });
        },
        shouldSubmit: (editor) => !editor.isEmpty,
      }),
    ],
    []
  );

  return (
    <section>
      <h3>5. 聊天场景</h3>
      <p style={descStyle}>
        输入 <code>@</code> 触发候选人（kind=2）或职位（kind=1）列表， Enter
        提交、Shift+Enter 换行。选中后以标签形式展示，点击标签在控制台打印 id 和
        kind。
      </p>

      <Editor
        ref={editorRef}
        placeholder="输入 @ 选择候选人或职位，Enter 发送..."
        extensions={extensions}
        value={content}
        onChange={(c) => setContent(c.html)}
      />

      {messages.length > 0 && (
        <div style={{ marginTop: 16, maxHeight: 300, overflow: 'auto' }}>
          <strong>已发送消息：</strong>
          {messages.map((msg, i) => (
            <div key={i} style={messageStyle}>
              <div dangerouslySetInnerHTML={{ __html: msg }} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const descStyle: React.CSSProperties = {
  color: '#666',
  fontSize: 14,
  marginBottom: 12,
};
const messageStyle: React.CSSProperties = {
  background: '#f5f5f5',
  padding: '8px 12px',
  borderRadius: 4,
  marginBottom: 8,
  fontSize: 14,
};

export default ChatDemo;
