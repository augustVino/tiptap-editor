import type { MentionItem } from './types';

export function mapFieldNames(
  list: MentionItem[],
  fieldNames?: { label: string; id: string },
): MentionItem[] {
  if (!fieldNames) return list;
  const { label, id } = fieldNames;
  return list.map((item) => ({
    ...item,
    label: item[label] ?? item.label,
    id: item[id] ?? item.id,
  }));
}

export function createSafeItems(
  originalItems: (query: string) => Promise<MentionItem[]>,
) {
  let requestId = 0;
  return async (props: { query: string }): Promise<MentionItem[]> => {
    const currentId = ++requestId;
    try {
      const result = await originalItems(props.query);
      return currentId === requestId ? result : [];
    } catch (error) {
      console.error('[MentionExtension] fetchItems error:', error);
      return [];
    }
  };
}
