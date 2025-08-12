import React, { forwardRef, useImperativeHandle } from 'react';
import classnames from 'classnames';
import { EditorContent } from '@tiptap/react';
import { useTiptapEditor } from './useTiptapEditor';
import { SubmitType, ContentType } from './types';
import { MentionExtensionOption } from './extensions';
import styles from './index.module.less';

interface RichInputProps<T extends SubmitType = 'html'> {
  wrapperClassName?: string;
  editorClassName?: string;
  placeholderClassName?: string;
  placeholder?: string;
  /** mention 配置 */
  mentions?: MentionExtensionOption[];
  submitType?: T;
  /** 内容 */
  value?: ContentType<T>;
  onChange?: (content: ContentType<T>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  /** 提交内容回调 */
  onSubmit?: (content: ContentType<T>) => void;
}

export type RichInputRef<T extends SubmitType = 'html'> = {
  getHTML: () => string | undefined;
  getJSON: () => object | undefined;
  getText: () => string | undefined;
  isEmpty: () => boolean;
  setContent: (content: ContentType<T>) => void;
  focus: () => void;
  clear: () => void;
  setEditable: (editable: boolean) => void;
};

function RichInputInner<T extends SubmitType = 'html'>(
  props: RichInputProps<T>,
  ref: React.Ref<RichInputRef<T>>
) {
  const {
    mentions = [],
    placeholder = 'Type something...',
    value,
    onChange,
    onBlur,
    onFocus,
    onSubmit,
    wrapperClassName = '',
    editorClassName = '',
    placeholderClassName = '',
    submitType = 'html' as T
  } = props;

  const { editor, isEmpty } = useTiptapEditor<T>(mentions, {
    value,
    onChange,
    submitType,
    onBlur,
    onFocus,
    onSubmit,
    editorClassName: `${styles['rich-input']} ${editorClassName}`
  });

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML(),
    getJSON: () => editor?.getJSON(),
    getText: () => editor?.getText(),
    isEmpty: () => editor!.isEmpty,
    setContent: (content: ContentType<T>) => {
      editor?.commands.setContent(content as ContentType<T>, true);
    },
    focus: () => editor?.commands.focus(),
    clear: () => {
      editor?.commands.clearContent(true);
    },
    setEditable: (editable: boolean) => {
      editor?.setEditable(editable);
    }
  }));

  return (
    <div className={classnames(styles['rich-input-container'], wrapperClassName)}>
      <EditorContent editor={editor} />
      {isEmpty && (
        <div className={classnames(styles['rich-input-placeholder'], placeholderClassName)}>
          {placeholder}
        </div>
      )}
    </div>
  );
}

const RichInput = forwardRef(RichInputInner) as <T extends SubmitType = 'html'>(
  props: RichInputProps<T> & { ref?: React.Ref<RichInputRef<T>> }
) => React.ReactElement;

export default RichInput;

export type {
  MentionItem,
  MentionExtensionOption,
  MentionListPureDisplayProps
} from './extensions';
export { withMentionInteraction, NodeViewWrapper } from './extensions';
