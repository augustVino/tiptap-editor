import React from 'react';
import { Editor } from '../../src';
import { createSubmitExtension, createFileHandlerExtension } from '../../src/extensions';

/**
 * 最简场景：纯文本输入 + Enter 提交
 */
const BasicDemo: React.FC = () => {
  const [messages, setMessages] = React.useState<string[]>([]);

  const extensions = React.useMemo(
    () => [
      createSubmitExtension({
        onSubmit: () => {
          // 实际使用中通过 onChange 持有最新内容，这里用 ref 获取
          setMessages((prev) => [...prev, `消息 ${prev.length + 1}: ${new Date().toLocaleTimeString()}`]);
        },
        shouldSubmit: (editor) => !editor.isEmpty,
      }),
    ],
    [],
  );

  return (
    <section>
      <h3>1. 基础用法 — 纯文本 + Enter 提交</h3>
      <p style={descStyle}>非受控模式，按 Enter 提交，Shift+Enter 换行。空内容不触发提交。</p>
      <Editor
        placeholder="输入内容后按 Enter 提交..."
        extensions={extensions}
        onChange={({ html }) => console.log('[Basic] onChange:', html)}
      />
      {messages.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>已提交：</strong>
          <ul>{messages.map((m, i) => <li key={i}>{m}</li>)}</ul>
        </div>
      )}
    </section>
  );
};

const descStyle: React.CSSProperties = { color: '#666', fontSize: 14, marginBottom: 12 };

export default BasicDemo;
