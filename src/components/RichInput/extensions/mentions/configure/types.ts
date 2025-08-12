import { MentionNodeAttrs } from '@tiptap/extension-mention';

type MakeRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

/**
 * 下拉列表条目的类型
 */
export type MentionItem = MakeRequired<MentionNodeAttrs, 'label'> & {
  [key: string]: any;
};

/**
 * 下拉列表条目字段名称映射
 */
export type FieldKey = keyof Pick<MentionItem, 'label' | 'id'>;

/**
 * 命令参数的类型
 */
export type CommandArgs = MentionItem & {
  onSelect?: (item: MentionItem) => void;
};

/**
 * 用户纯展示组件需要实现的基础Props
 */
export interface MentionListPureDisplayProps {
  list: MentionItem[];
  /** 当前选中的索引 */
  selectedIndex: number;
  /** 查询字符 */
  query?: string;
  /** 选择某个项目的回调 */
  onItemSelect: (index: number) => void;
  /** 注册mentionItem的dom，用来处理键盘事件 */
  registerItemRef?: (index: number, ref: HTMLElement) => void;
}
