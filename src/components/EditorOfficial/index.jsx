import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Mention from '@tiptap/extension-mention';
import './index.css';

const EditorOfficial = ({ value, onChange, placeholder, limit }) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Mention.configure({
        HTMLAttributes: {
          class: 'mention'
        }
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      if (limit && text.length > limit) {
        editor.commands.setContent(text.slice(0, limit), false);
        return;
      }
      onChange(text);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        placeholder: placeholder
      }
    }
  });
  // 当外部 value 改变时，更新编辑器内容
  useEffect(() => {
    if (editor && value !== editor.getText()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  return <EditorContent editor={editor} />;
};

export default EditorOfficial;
