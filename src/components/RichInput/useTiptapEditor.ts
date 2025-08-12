import { useMemo, useCallback, useEffect } from 'react';
import { useEditor, Editor, EditorOptions } from '@tiptap/react';
import useLatest from './useLatest';
import {
  createBaseExtensions,
  createMentionExtensions,
  type MentionExtensionOption
} from './extensions';
import { SubmitType, ContentType } from './types';
import { isContentEqual, isJsonSubmitType, isTextSubmitType } from './utils';

const defaultJson = {
  type: 'doc',
  content: [{ type: 'paragraph' }]
};

/**
 * Tiptap 编辑器 hook，完全封装 EditorOptions 的组装
 * @param mentions Mention 配置数组
 * @param options 业务逻辑参数
 * @returns 编辑器实例和相关状态
 */
export function useTiptapEditor<T extends SubmitType = 'html'>(
  mentions: MentionExtensionOption[] = [],
  options: {
    value?: ContentType<T>;
    onChange?: (content: ContentType<T>) => void;
    onBlur?: () => void;
    onFocus?: () => void;
    onSubmit?: (content: ContentType<T>) => void;
    editorClassName?: string;
    submitType?: T;
  } = {}
) {
  const {
    value,
    onChange,
    onBlur,
    onFocus,
    onSubmit,
    editorClassName,
    submitType = 'html' as T
  } = options;
  const mentionsRef = useLatest(mentions);
  const onSubmitRef = useLatest(onSubmit);

  // 根据submitType处理内容获取逻辑
  const getContentByType = useCallback(
    (editor: Editor): ContentType<T> => {
      if (isJsonSubmitType(submitType)) {
        return editor.getJSON() as ContentType<T>;
      } else if (isTextSubmitType(submitType)) {
        return editor.getText() as ContentType<T>;
      } else {
        return editor.getHTML() as ContentType<T>;
      }
    },
    [submitType]
  );

  const editorOptions: Partial<EditorOptions> = {
    content: value || (isJsonSubmitType(submitType) ? defaultJson : ''),
    onUpdate: ({ editor }) => {
      const content = getContentByType(editor);
      onChange?.(content);
    },
    onBlur: () => {
      onBlur?.();
      return false;
    },
    onFocus: () => {
      onFocus?.();
      return false;
    },
    editorProps: {
      attributes: {
        class: editorClassName || ''
      },
      handleDOMEvents: {
        focus: (view) => {
          return false;
        }
      }
    }
  };

  const { extensions: baseExtensions, setEditor } = useMemo(
    () => createBaseExtensions(onSubmitRef, submitType),
    [onSubmitRef, submitType]
  );

  const extensions = useMemo(() => {
    const mentionExtensions = createMentionExtensions(mentions, mentionsRef);
    return [...baseExtensions, ...mentionExtensions];
  }, [baseExtensions, mentions, mentionsRef]);

  const editor = useEditor({
    ...editorOptions,
    extensions
  });

  // 设置编辑器实例到基础扩展中
  useEffect(() => {
    setEditor(editor);
  }, [editor]);

  // 监听 mentions 变化，更新编辑器的扩展
  const updateExtensions = useCallback(() => {
    if (editor && editor.isEditable) {
      const mentionExtensions = createMentionExtensions(mentionsRef.current, mentionsRef);
      const allExtensions = [...baseExtensions, ...mentionExtensions];
      editor.setOptions({
        extensions: allExtensions
      });
    }
  }, [baseExtensions, mentionsRef, editor]);

  // 监听 value 变化，同步到编辑器
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentContent = getContentByType(editor);
      if (!isContentEqual(submitType, currentContent, value)) {
        editor.commands.setContent(value as any, true);
      }
    }
  }, [value, editor, getContentByType, submitType]);

  useEffect(() => {
    updateExtensions();
  }, [mentions, updateExtensions]);

  return {
    editor,
    isEmpty: editor?.isEmpty ?? true,
    updateExtensions
  };
}
