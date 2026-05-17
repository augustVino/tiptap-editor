import React, { useRef } from 'react';
import { Editor, EditorRef, createSubmitExtension, createMentionExtension } from '../../src';
import { fetchUsers } from '../mocks';

/**
 * Mention 基础：@ 提及用户（异步数据源）
 */
const MentionDemo: React.FC = () => {
  const [content, setContent] = React.useState('');
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const editorRef = useRef<EditorRef>(null);

  const extensions = React.useMemo(
    () => [
      createMentionExtension({
        name: 'atMention',
        trigger: '@',
        fetchItems: fetchUsers,
        onSelect: (item) => {
          setSelectedUsers((prev) => [...prev, item.label]);
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
      <h3>4. Mention — @ 提及用户（异步数据源）</h3>
      <p style={descStyle}>
        输入 <code>@</code> 触发用户列表，数据通过模拟 API 异步获取（200-500ms 延迟）。
        上下箭头选择，Enter 确认。输入文字可过滤。提交后可通过 getJSON() 获取完整 mention 数据。
      </p>

      <Editor
        ref={editorRef}
        placeholder="输入 @ 提及用户，Enter 提交..."
        extensions={extensions}
        value={content}
        onChange={(c) => setContent(c.html)}
      />

      {selectedUsers.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>已选择用户：</strong> {selectedUsers.join(', ')}
        </div>
      )}

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
