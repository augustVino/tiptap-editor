import type { Editor, Extensions, EditorOptions } from '@tiptap/core';
import type { JSONContent } from '@tiptap/core';
export type { JSONContent };
import type { Transaction } from '@tiptap/pm/state';

// ─── ContentHelpers ───

export interface ContentHelpers {
  html: string;
  text: string;
  json: JSONContent;
  isEmpty: boolean;
}

export function createContentHelpers(editor: Editor): ContentHelpers {
  let cachedJson: JSONContent | undefined;
  return {
    html: editor.getHTML(),
    text: editor.getText(),
    get json() {
      if (cachedJson === undefined) {
        cachedJson = structuredClone(editor.getJSON());
      }
      return cachedJson;
    },
    isEmpty: editor.isEmpty,
  };
}

// ─── EditorRef ───

export interface EditorRef {
  focus(): void;
  blur(): void;
  clear(): void;
  setContent(content: string | JSONContent): void;
  insertContent(content: string | JSONContent): void;
  setEditable(editable: boolean): void;
  getHTML(): string | undefined;
  getText(): string | undefined;
  getJSON(): JSONContent | undefined;
  isEmpty(): boolean | undefined;
  getEditor(): Editor | null;
}

// ─── EditorProps ───

type BaseProps = {
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  extensions?: Extensions;
  editable?: boolean;
  autoFocus?: boolean | 'start' | 'end' | 'all' | number | null;
  editorProps?: Partial<EditorOptions['editorProps']>;
  id?: string;
  onFocus?: (props: { editor: Editor; event: FocusEvent }) => void;
  onBlur?: (props: { editor: Editor; event: FocusEvent }) => void;
  onSelectionUpdate?: (props: { editor: Editor; transaction: Transaction }) => void;
  onCreate?: (props: { editor: Editor }) => void;
  onDestroy?: () => void;
};

type ControlledProps = BaseProps & {
  value: string | JSONContent;
  onChange?: (content: ContentHelpers) => void;
  defaultValue?: never;
};

type UncontrolledProps = BaseProps & {
  value?: never;
  defaultValue?: string | JSONContent;
  onChange?: (content: ContentHelpers) => void;
};

export type EditorProps = ControlledProps | UncontrolledProps;

// ─── useEditor options ───

export interface UseEditorOptions {
  placeholder?: string;
  extensions?: Extensions;
  value?: string | JSONContent;
  defaultValue?: string | JSONContent;
  onChange?: (content: ContentHelpers) => void;
  onFocus?: (props: { editor: Editor; event: FocusEvent }) => void;
  onBlur?: (props: { editor: Editor; event: FocusEvent }) => void;
  onSelectionUpdate?: (props: { editor: Editor; transaction: Transaction }) => void;
  onCreate?: (props: { editor: Editor }) => void;
  onDestroy?: () => void;
  editable?: boolean;
  autoFocus?: boolean | 'start' | 'end' | 'all' | number | null;
  editorProps?: Partial<EditorOptions['editorProps']>;
}
