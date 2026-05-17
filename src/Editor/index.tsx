import { forwardRef, useImperativeHandle } from 'react';
import { EditorContent } from '@tiptap/react';
import type { EditorRef, EditorProps, JSONContent } from './types';
import { useEditor } from './useEditor';
import styles from './index.module.less';

export type { EditorProps, EditorRef, ContentHelpers } from './types';

export const Editor = forwardRef<EditorRef, EditorProps>(function Editor(props, ref) {
  const {
    placeholder,
    className,
    editorClassName,
    extensions,
    editable,
    autoFocus,
    editorProps,
    id,
    onFocus,
    onBlur,
    onSelectionUpdate,
    onCreate,
    onDestroy,
    ...rest
  } = props;

  const value = 'value' in rest ? rest.value : undefined;
  const defaultValue = 'defaultValue' in rest ? rest.defaultValue : undefined;
  const onChange = 'onChange' in rest ? rest.onChange : undefined;

  const editor = useEditor({
    placeholder,
    extensions,
    value,
    defaultValue,
    onChange,
    onFocus,
    onBlur,
    onSelectionUpdate,
    onCreate,
    onDestroy,
    editable,
    autoFocus,
    editorProps,
  });

  useImperativeHandle(ref, () => ({
    focus: () => editor?.commands.focus(),
    blur: () => editor?.commands.blur(),
    clear: () => editor?.commands.clearContent(true),
    setContent: (content: string | JSONContent) => editor?.commands.setContent(content),
    insertContent: (content: string | JSONContent) => editor?.commands.insertContent(content),
    setEditable: (editable: boolean) => editor?.setEditable(editable),
    getHTML: () => editor?.getHTML(),
    getText: () => editor?.getText(),
    getJSON: () => editor?.getJSON(),
    isEmpty: () => editor?.isEmpty,
    getEditor: () => editor ?? null,
  }));

  if (!editor) return null;

  const rootClassName = [styles['tiptap-editor-root'], className].filter(Boolean).join(' ');

  return (
    <div id={id} className={rootClassName} data-readonly={editable === false ? 'true' : undefined}>
      <EditorContent editor={editor} className={editorClassName} />
    </div>
  );
});
