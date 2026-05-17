import React, { useRef, useState, useMemo } from 'react';
import { Editor, EditorRef } from '../../src';
import { createMentionExtension } from '../../src/extensions';
import type { MentionItem } from '../../src';
import CommandList from '../components/CommandList';

const commands: MentionItem[] = [
  { id: 'cmd_time', label: '插入时间', kind: 'command', icon: '🕐', description: '插入当前时间' },
  { id: 'cmd_clear', label: '清空编辑器', kind: 'command', icon: '🗑️', description: '清除所有内容' },
  { id: 'cmd_template', label: '插入模板', kind: 'command', icon: '📋', description: '插入预设文本模板' },
  { id: 'cmd_fullscreen', label: '切换全屏', kind: 'command', icon: '⛶', description: '切换编辑器全屏模式' },
  { id: 'cmd_bold', label: '加粗文字', kind: 'command', icon: 'B', description: '给选中文字加粗' },
  { id: 'cmd_save', label: '保存草稿', kind: 'command', icon: '💾', description: '保存当前内容为草稿' },
];

function fetchCommands(query: string): Promise<MentionItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(commands.filter((c) => c.label.includes(query)).slice(0, 6));
    }, 150 + Math.random() * 200);
  });
}

const MentionCommandPanelDemo: React.FC = () => {
  const editorRef = useRef<EditorRef>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const extensions = useMemo(
    () => [
      createMentionExtension({
        name: 'commandPanel',
        trigger: '/',
        insertToEditor: false,
        listComponent: CommandList,
        emptyText: '没有匹配的命令',
        fetchItems: fetchCommands,
        onSelect: (item, { editor }) => {
          const time = new Date().toLocaleTimeString();
          switch (item.id) {
            case 'cmd_time':
              editor.chain().focus().insertContent(new Date().toLocaleString()).run();
              setLogs((prev) => [...prev.slice(-19), `[${time}] 执行: 插入时间`]);
              break;
            case 'cmd_clear':
              editor.commands.clearContent(true);
              setLogs((prev) => [...prev.slice(-19), `[${time}] 执行: 清空编辑器`]);
              break;
            case 'cmd_template':
              editor.chain().focus().insertContent('【模板】尊敬的候选人，您好！').run();
              setLogs((prev) => [...prev.slice(-19), `[${time}] 执行: 插入模板`]);
              break;
            case 'cmd_fullscreen':
              setLogs((prev) => [...prev.slice(-19), `[${time}] 执行: 切换全屏（仅日志）`]);
              break;
            case 'cmd_bold':
              setLogs((prev) => [...prev.slice(-19), `[${time}] 执行: 加粗文字（仅日志）`]);
              break;
            case 'cmd_save':
              setLogs((prev) => [...prev.slice(-19), `[${time}] 执行: 保存草稿 — ${editor.getText().slice(0, 20)}`]);
              break;
            default:
              setLogs((prev) => [...prev.slice(-19), `[${time}] 选中: ${item.label}`]);
          }
        },
      }),
    ],
    [],
  );

  return (
    <section>
      <h3>8. 命令面板 — Slash Command 模式</h3>
      <p style={descStyle}>
        输入 <code>/</code> 触发命令面板。选中命令后不插入 mention 标签，而是执行对应操作（如插入时间、清空编辑器等）。
        使用自定义 listComponent 展示带图标和描述的命令列表。
      </p>

      <Editor
        ref={editorRef}
        placeholder="输入 / 打开命令面板..."
        extensions={extensions}
      />

      {logs.length > 0 && (
        <details open style={{ marginTop: 12 }}>
          <summary><strong>命令执行日志</strong></summary>
          <pre style={logStyle}>{logs.join('\n')}</pre>
        </details>
      )}
    </section>
  );
};

const descStyle: React.CSSProperties = { color: '#666', fontSize: 14, marginBottom: 12 };
const logStyle: React.CSSProperties = {
  background: '#f5f5f5',
  padding: 8,
  borderRadius: 4,
  fontSize: 12,
  maxHeight: 160,
  overflow: 'auto',
  fontFamily: 'monospace',
};

export default MentionCommandPanelDemo;
