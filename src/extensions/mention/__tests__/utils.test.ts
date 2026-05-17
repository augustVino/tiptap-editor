import { describe, it, expect, vi } from 'vitest';
import { mapFieldNames, createSafeItems } from '../utils';
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
});
