import React, { useRef } from 'react';
import {
  Editor,
  EditorRef,
  createSubmitExtension,
  createMentionExtension,
  createFileHandlerExtension,
  getMentionSourceFromJSON,
} from '../../src';
import { fetchUsers } from '../mocks';
import UserList from '../components/UserList';
import CommandList from '../components/CommandList';
import { fetchCommands } from '../mocks';

/**
 * 完整聊天场景：mention + submit + file handler + 自定义列表 + 命令模式
 * 对应 fe-xuanji-tools 中 RichInput 的实际使用场景
 */
const ChatDemo: React.FC = () => {
  const [content, setContent] = React.useState('');
  const [messages, setMessages] = React.useState<Array<{ html: string; source?: any }>>([]);
  const [commandLog, setCommandLog] = React.useState<string[]>([]);
  const editorRef = useRef<EditorRef>(null);

  const extensions = React.useMemo(
    () => [
      // @ 用户 mention（异步 + 自定义列表）
      createMentionExtension({
        name: 'atMention',
        trigger: '@',
        fetchItems: fetchUsers,
        listComponent: UserList,
        addSourceAttr: true,
        onSelect: (item) => {
          console.log('[Chat] selected user:', item.label);
        },
      }),
      // / 命令 mention（insertToEditor: false 模式）
      createMentionExtension({
        name: 'commandMention',
        trigger: '/',
        fetchItems: fetchCommands,
        listComponent: CommandList,
        insertToEditor: false,
        onSelect: (item, { editor }) => {
          setCommandLog((prev) => [...prev, `执行命令: ${item.label}`]);
          // 模拟命令效果
          if (item.id === 'todo') {
            editor.chain().focus().setContent('<p>📋 新建待办事项：</p>').run();
          } else if (item.id === 'meeting') {
            editor.chain().focus().setContent('<p>📅 安排会议：</p>').run();
          }
        },
      }),
      // Enter 提交
      createSubmitExtension({
        onSubmit: () => {
          const html = editorRef.current?.getHTML() ?? '';
          const json = editorRef.current?.getJSON();
          const source = json ? getMentionSourceFromJSON(json, 'atMention') : null;
          setMessages((prev) => [...prev, { html, source }]);
          setContent('');
          // 清空编辑器后需要下一帧再设置内容（受控模式同步）
          requestAnimationFrame(() => {
            editorRef.current?.clear();
          });
        },
        shouldSubmit: (editor) => !editor.isEmpty,
      }),
      // 图片文件处理
      createFileHandlerExtension({
        allowedMimeTypes: ['image/*'],
        onRejected: (files) => {
          alert(`不支持的文件类型: ${files.map((f) => f.name).join(', ')}。仅支持图片文件。`);
        },
        onPaste: (editor, files) => {
          console.log('[Chat] pasted files:', files.map((f) => f.name));
        },
      }),
    ],
    [],
  );

  return (
    <section>
      <h3>5. 完整聊天场景</h3>
      <p style={descStyle}>
        模拟 IM 聊天输入框：<code>@</code> 提及用户（自定义列表）、<code>/</code> 快捷命令（不插入编辑器）、
        Enter 提交、Shift+Enter 换行、粘贴/拖放图片。
        提交后通过 getMentionSourceFromJSON 提取完整的用户数据。
      </p>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* 编辑器区域 */}
        <div style={{ flex: 1 }}>
          <Editor
            ref={editorRef}
            placeholder="输入 @ 提及用户，/ 使用命令，Enter 发送..."
            extensions={extensions}
            value={content}
            onChange={(c) => setContent(c.html)}
          />

          {/* 已发送消息 */}
          {messages.length > 0 && (
            <div style={{ marginTop: 16, maxHeight: 300, overflow: 'auto' }}>
              <strong>已发送消息：</strong>
              {messages.map((msg, i) => (
                <div key={i} style={messageStyle}>
                  <div dangerouslySetInnerHTML={{ __html: msg.html }} />
                  {msg.source && (
                    <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
                      source: {JSON.stringify(msg.source)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 日志区域 */}
        <div style={{ width: 200 }}>
          {commandLog.length > 0 && (
            <div>
              <strong>命令日志：</strong>
              <ul style={{ fontSize: 12, color: '#666' }}>
                {commandLog.map((log, i) => <li key={i}>{log}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const descStyle: React.CSSProperties = { color: '#666', fontSize: 14, marginBottom: 12 };
const messageStyle: React.CSSProperties = {
  background: '#f5f5f5',
  padding: '8px 12px',
  borderRadius: 4,
  marginBottom: 8,
  fontSize: 14,
};

export default ChatDemo;
