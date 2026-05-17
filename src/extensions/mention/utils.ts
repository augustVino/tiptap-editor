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

export function serializeMentionSource(
  mentionItem: Record<string, any>,
  addSourceAttr: boolean | string[],
): Record<string, any> {
  if (!addSourceAttr) return {};
  if (addSourceAttr === true) return { mentionSource: mentionItem };
  return {
    mentionSource: Object.fromEntries(
      addSourceAttr
        .filter((k) => Object.prototype.hasOwnProperty.call(mentionItem, k))
        .map((k) => [k, mentionItem[k]])
    ),
  };
}

export function createSafeItems(
  originalItems: (query: string) => Promise<MentionItem[]>,
  debounceMs?: number,
) {
  let requestId = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingResolve: (() => void) | null = null;

  return async (props: { query: string }): Promise<MentionItem[]> => {
    const currentId = ++requestId;

    if (debounceMs && debounceMs > 0) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        pendingResolve?.();
      }

      await new Promise<void>((resolve) => {
        pendingResolve = resolve;
        debounceTimer = setTimeout(() => {
          pendingResolve = null;
          debounceTimer = null;
          resolve();
        }, debounceMs);
      });
    }

    if (currentId !== requestId) return [];

    try {
      const result = await originalItems(props.query);
      return currentId === requestId ? result : [];
    } catch (error) {
      console.error('[MentionExtension] fetchItems error:', error);
      return [];
    }
  };
}
