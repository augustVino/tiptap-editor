import React, { useRef } from 'react';
import { Editor, EditorRef } from '../../src';

const ControlledDemo: React.FC = () => {
  const [content, setContent] = React.useState('');
  const [isReadonly, setIsReadonly] = React.useState(false);
  const editorRef = useRef<EditorRef>(null);

  return (
    <section>
      <h3>2. 受控模式 — 双向绑定 + ref 操作</h3>
      <p style={descStyle}>value + onChange 双向绑定，通过 ref 控制编辑器。</p>

      <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
        <button onClick={() => editorRef.current?.focus()}>聚焦</button>
        <button onClick={() => editorRef.current?.clear()}>清空</button>
        <button
          onClick={() =>
            editorRef.current?.setContent('<p>通过 ref 设置的内容</p>')
          }
        >
          设置内容
        </button>
        <button
          onClick={() => editorRef.current?.insertContent('<p>插入的文本</p>')}
        >
          插入内容
        </button>
        <button onClick={() => setIsReadonly((v) => !v)}>
          {isReadonly ? '恢复编辑' : '只读模式'}
        </button>
      </div>

      <Editor
        ref={editorRef}
        value={content}
        onChange={(c) => setContent(c.html)}
        placeholder="受控模式输入..."
        editable={!isReadonly}
      />

      <details style={{ marginTop: 12 }}>
        <summary>
          <strong>实时内容 (HTML)</strong>
        </summary>
        <pre style={preStyle}>{content}</pre>
      </details>

      <details style={{ marginTop: 8 }}>
        <summary>
          <strong>通过 ref 获取的内容</strong>
        </summary>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button onClick={() => alert(editorRef.current?.getHTML())}>
            getHTML()
          </button>
          <button onClick={() => alert(editorRef.current?.getText())}>
            getText()
          </button>
          <button
            onClick={() =>
              alert(JSON.stringify(editorRef.current?.getJSON(), null, 2))
            }
          >
            getJSON()
          </button>
          <button onClick={() => alert(String(editorRef.current?.isEmpty()))}>
            isEmpty()
          </button>
        </div>
      </details>
    </section>
  );
};

const descStyle: React.CSSProperties = {
  color: '#666',
  fontSize: 14,
  marginBottom: 12,
};
const preStyle: React.CSSProperties = {
  background: '#f5f5f5',
  padding: 8,
  borderRadius: 4,
  fontSize: 12,
  maxHeight: 120,
  overflow: 'auto',
};

export default ControlledDemo;
