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
  /**
   * @deprecated Forward-declared for future implementation. Do not depend on this yet.
   */
  loading?: boolean;
  /**
   * @deprecated Forward-declared for future implementation. Do not depend on this yet.
   */
  error?: string | null;
  emptyText?: string;
}

export interface MentionTippyOptions {
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end';
  theme?: string;
  offset?: [number, number];
  maxWidth?: number | string;
  zIndex?: number;
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
  addSourceAttr?: boolean | string[];
  onTagClick?: (attrs: { id: string | null; label: string; kind: string | null }) => void;
  tippyOptions?: MentionTippyOptions;
  debounceMs?: number;
  emptyText?: string;
  deleteTriggerWithBackspace?: boolean;
}
