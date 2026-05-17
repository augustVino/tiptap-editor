import { describe, it, expect, vi } from 'vitest';
import { mapFieldNames, createSafeItems, serializeMentionSource } from '../utils';
import type { MentionItem } from '../types';

describe('mapFieldNames', () => {
  it('should return original list when fieldNames not provided', () => {
    const list = [{ label: 'A', id: '1' }];
    expect(mapFieldNames(list)).toBe(list);
  });

  it('should map specified fields to label and id', () => {
    const list = [{ name: 'Alice', uid: 'a1', extra: 'x' }] as unknown as MentionItem[];
    const result = mapFieldNames(list, { label: 'name', id: 'uid' });
    expect(result[0].label).toBe('Alice');
    expect(result[0].id).toBe('a1');
    expect(result[0].extra).toBe('x');
  });
});

describe('serializeMentionSource', () => {
  it('should return empty object when addSourceAttr is false', () => {
    const item = { label: 'A', id: '1' };
    expect(serializeMentionSource(item, false)).toEqual({});
  });

  it('should return full item when addSourceAttr is true', () => {
    const item = { label: 'A', id: '1', kind: 'user' };
    const result = serializeMentionSource(item, true);
    expect(result).toEqual({ mentionSource: item });
  });

  it('should serialize only specified fields when addSourceAttr is string[]', () => {
    const item = { label: 'A', id: '1', kind: 'user', extra: 'x' };
    const result = serializeMentionSource(item, ['id', 'label']);
    expect(result).toEqual({ mentionSource: { id: '1', label: 'A' } });
  });

  it('should ignore keys not present in item', () => {
    const item = { label: 'A', id: '1' };
    const result = serializeMentionSource(item, ['id', 'nonexistent']);
    expect(result).toEqual({ mentionSource: { id: '1' } });
  });

  it('should return empty mentionSource when no keys match', () => {
    const item = { label: 'A', id: '1' };
    const result = serializeMentionSource(item, ['nonexistent1', 'nonexistent2']);
    expect(result).toEqual({ mentionSource: {} });
  });
});

describe('createSafeItems', () => {
  it('should return results from original function', async () => {
    const items = [{ label: 'A', id: '1' }];
    const fetchItems = vi.fn().mockResolvedValue(items);
    const safeItems = createSafeItems(fetchItems);
    const result = await safeItems({ query: 'a' });
    expect(result).toEqual(items);
  });

  it('should discard stale results', async () => {
    let resolveFirst: (v: any) => void;
    const first = new Promise((r) => { resolveFirst = r; });
    const second = Promise.resolve([{ label: 'B', id: '2' }]);

    let callCount = 0;
    const fetchItems = vi.fn().mockImplementation(() => {
      callCount++;
      return callCount === 1 ? first : second;
    });

    const safeItems = createSafeItems(fetchItems);

    const firstResult = safeItems({ query: 'a' });
    const secondResult = safeItems({ query: 'ab' });

    resolveFirst!([{ label: 'A', id: '1' }]);

    const r1 = await firstResult;
    const r2 = await secondResult;

    expect(r1).toEqual([]);
    expect(r2).toEqual([{ label: 'B', id: '2' }]);
  });

  it('should return empty array on error', async () => {
    const fetchItems = vi.fn().mockRejectedValue(new Error('network'));
    const safeItems = createSafeItems(fetchItems);
    const result = await safeItems({ query: 'a' });
    expect(result).toEqual([]);
  });

  describe('with debounce', () => {
    it('should debounce fetchItems calls', async () => {
      vi.useFakeTimers();
      const items = [{ label: 'A', id: '1' }];
      const fetchItems = vi.fn().mockResolvedValue(items);
      const safeItems = createSafeItems(fetchItems, 100);

      const promise1 = safeItems({ query: 'a' });
      vi.advanceTimersByTime(50);
      const promise2 = safeItems({ query: 'ab' });
      vi.advanceTimersByTime(150);

      const [r1, r2] = await Promise.all([promise1, promise2]);
      expect(r1).toEqual([]);
      expect(r2).toEqual(items);
      expect(fetchItems).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('should not debounce when debounceMs is 0', async () => {
      const items = [{ label: 'A', id: '1' }];
      const fetchItems = vi.fn().mockResolvedValue(items);
      const safeItems = createSafeItems(fetchItems, 0);

      const result = await safeItems({ query: 'a' });
      expect(result).toEqual(items);
      expect(fetchItems).toHaveBeenCalledTimes(1);
    });

    it('should not debounce when debounceMs is undefined', async () => {
      const items = [{ label: 'A', id: '1' }];
      const fetchItems = vi.fn().mockResolvedValue(items);
      const safeItems = createSafeItems(fetchItems);

      const result = await safeItems({ query: 'a' });
      expect(result).toEqual(items);
      expect(fetchItems).toHaveBeenCalledTimes(1);
    });
  });
});
