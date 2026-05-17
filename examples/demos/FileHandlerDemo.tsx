import React from 'react';
import { Editor } from '../../src';
import { createFileHandlerExtension } from '../../src/extensions';

/**
 * 文件处理：粘贴/拖放图片
 */
const FileHandlerDemo: React.FC = () => {
  const [rejectedFiles, setRejectedFiles] = React.useState<string[]>([]);
  const [pastedFiles, setPastedFiles] = React.useState<string[]>([]);

  const extensions = React.useMemo(
    () => [
      createFileHandlerExtension({
        allowedMimeTypes: ['image/*'],
        onRejected: (files) => {
          setRejectedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
        },
        onPaste: (editor, files, htmlContent) => {
          setPastedFiles((prev) => [...prev, ...files.map((f) => `${f.name} (${f.type})`)]);
          console.log('[FileHandler] onPaste:', files.length, 'files, html:', !!htmlContent);
        },
        onDrop: (editor, files, pos) => {
          setPastedFiles((prev) => [...prev, ...files.map((f) => `${f.name} (drop@${pos})`)]);
          console.log('[FileHandler] onDrop:', files.length, 'files at pos', pos);
        },
      }),
    ],
    [],
  );

  return (
    <section>
      <h3>3. 文件处理 — 图片粘贴/拖放</h3>
      <p style={descStyle}>
        只允许图片文件 (image/*)。非图片文件会触发 onRejected 回调。
        尝试粘贴或拖放文件到编辑器中。
      </p>
      <Editor placeholder="粘贴或拖放图片到此处..." extensions={extensions} />

      {pastedFiles.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <strong>已接收文件：</strong>
          <ul>{pastedFiles.map((f, i) => <li key={i}>{f}</li>)}</ul>
        </div>
      )}
      {rejectedFiles.length > 0 && (
        <div style={{ marginTop: 8, color: '#ff4d4f' }}>
          <strong>被拒绝文件：</strong>
          <ul>{rejectedFiles.map((f, i) => <li key={i}>{f}</li>)}</ul>
        </div>
      )}
    </section>
  );
};

const descStyle: React.CSSProperties = { color: '#666', fontSize: 14, marginBottom: 12 };

export default FileHandlerDemo;
