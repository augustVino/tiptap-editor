import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Editor, EditorRef } from '../../src';
import { createSubmitExtension } from '../../src/extensions';

const EditorAdvancedDemo: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [submitEnabled, setSubmitEnabled] = useState(true);
  const editorRef = useRef<EditorRef>(null);

  const addLog = useCallback((event: string, detail?: string) => {
    setLogs((prev) => {
      const time = new Date().toLocaleTimeString();
      const entry = `[${time}] ${event}${detail ? ': ' + detail : ''}`;
      return [...prev.slice(-19), entry];
    });
  }, []);

  const extensions = useMemo(
    () =>
      submitEnabled
        ? [
            createSubmitExtension({
              onSubmit: () => addLog('Submit', 'onSubmit triggered'),
              shouldSubmit: (editor) => !editor.isEmpty,
            }),
          ]
        : [],
    [submitEnabled, addLog],
  );

  return (
    <section>
      <h3>7. Editor 高级配置 — 生命周期与高级 Props</h3>
      <p style={descStyle}>
        非受控模式 + defaultValue 初始内容 + autoFocus=&quot;end&quot; +
        生命周期回调 + 动态扩展热更新。
      </p>

      <div style={{ marginBottom: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={() => setSubmitEnabled((v) => !v)}>
          {submitEnabled ? '禁用 Submit 扩展' : '启用 Submit 扩展'}
        </button>
        <span style={{ fontSize: 12, color: '#999' }}>
          当前: {submitEnabled ? '已启用' : '已禁用'}（Enter 提交）
        </span>
      </div>

      <Editor
        ref={editorRef}
        id="advanced-editor"
        className="advanced-editor-root"
        editorClassName="advanced-editor-content"
        defaultValue="<p>这是通过 defaultValue 设置的初始内容。</p><p>编辑器加载后自动聚焦到末尾。</p>"
        autoFocus="end"
        extensions={extensions}
        placeholder="高级配置编辑器..."
        editorProps={{ attributes: { spellcheck: 'false' } }}
        onFocus={({ event }) => addLog('onFocus')}
        onBlur={({ event }) => addLog('onBlur')}
        onCreate={({ editor }) => addLog('onCreate', `isEmpty=${editor.isEmpty}`)}
        onSelectionUpdate={({ transaction }) => addLog('onSelectionUpdate')}
      />

      <details open style={{ marginTop: 12 }}>
        <summary>
          <strong>事件日志（最近 20 条）</strong>
        </summary>
        <pre style={logStyle}>
          {logs.length > 0 ? logs.join('\n') : '等待事件...'}
        </pre>
      </details>
    </section>
  );
};

const descStyle: React.CSSProperties = {
  color: '#666',
  fontSize: 14,
  marginBottom: 12,
};

const logStyle: React.CSSProperties = {
  background: '#f5f5f5',
  padding: 8,
  borderRadius: 4,
  fontSize: 12,
  maxHeight: 200,
  overflow: 'auto',
  fontFamily: 'monospace',
};

export default EditorAdvancedDemo;
