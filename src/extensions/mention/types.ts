import type { Editor, JSONContent } from '@tiptap/core';
import type { ReactNodeViewProps } from '@tiptap/react';
import type { MentionNodeAttrs } from '@tiptap/extension-mention';

type MakeRequired<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };

export type MentionItem = MakeRequired<MentionNodeAttrs, 'label'> & {
  [key: string]: any;
};

export interface MentionListProps {
  list: MentionItem[];
  selectedIndex: number;
  query?: string;
  onItemSelect: (index: number) => void;
  registerItemRef?: (index: number, ref: HTMLElement) => void;
  loading?: boolean;
  error?: string | null;
}

export interface MentionConfig {
  name: string;
  trigger: string;
  fetchItems: (query: string) => Promise<MentionItem[]>;
  listComponent?: React.ComponentType<MentionListProps>;
  tagComponent?: React.ComponentType<ReactNodeViewProps>;
  fieldNames?: { label: string; id: string };
  insertToEditor?: boolean;
  onSelect?: (item: MentionItem, context: { editor: Editor; query: string }) => void;
  addSourceAttr?: boolean;
}
