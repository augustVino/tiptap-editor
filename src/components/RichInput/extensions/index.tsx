import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { Editor } from '@tiptap/react';
import { SubmitOnEnter } from './SubmitOnEnter';
import { SubmitType, ContentType } from '../types';
import { isJsonSubmitType, isTextSubmitType } from '../utils';

export {
  NodeViewWrapper,
  createMentionExtensions,
  withMentionInteraction,
  type MentionExtensionOption,
  type MentionItem,
  type MentionListPureDisplayProps
} from './mentions';

/**
 * 创建基础扩展
 * @param onSubmit 提交回调函数
 * @param submitType 提交类型
 * @returns 基础扩展数组
 */
export const createBaseExtensions = <T extends SubmitType>(
  onSubmitRef: { current?: (content: ContentType<T>) => void },
  submitType: T = 'html' as T
) => {
  // FIXME:这里使用闭包来捕获 editor，避免循环依赖
  let editorInstance: Editor | null = null;

  const extensions = [
    Document,
    Paragraph,
    Text,
    SubmitOnEnter.configure({
      onSubmit: () => {
        if (editorInstance && onSubmitRef.current) {
          // 根据submitType返回对应格式的内容
          const content = isJsonSubmitType(submitType)
            ? editorInstance.getJSON()
            : isTextSubmitType(submitType)
              ? editorInstance.getText()
              : editorInstance.getHTML();
          onSubmitRef.current(content as ContentType<T>);
        }
      }
    })
  ];

  // 设置 editor 实例的方法
  const setEditor = (editor: Editor | null) => {
    editorInstance = editor;
  };

  return { extensions, setEditor };
};
