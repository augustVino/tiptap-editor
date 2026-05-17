import type { MentionItem } from '../src/extensions/mention/types';

/**
 * kind 类型：
 *   "1" = 职位
 *   "2" = 候选人
 */

// ─── 职位数据（模拟远程 API）───

export const positions: MentionItem[] = [
  { id: 'pos_001', label: '前端开发工程师', kind: '1' },
  { id: 'pos_002', label: '后端开发工程师', kind: '1' },
  { id: 'pos_003', label: 'UI 设计师', kind: '1' },
  { id: 'pos_004', label: '产品经理', kind: '1' },
  { id: 'pos_005', label: '建筑设计师', kind: '1' },
  { id: 'pos_006', label: '安全工程师', kind: '1' },
];

export function fetchPositions(query: string): Promise<MentionItem[]> {
  return new Promise((resolve) => {
    const delay = 200 + Math.random() * 300;
    setTimeout(() => {
      resolve(positions.filter((p) => p.label.includes(query)).slice(0, 5));
    }, delay);
  });
}

// ─── 候选人数据（模拟远程 API）───

export const candidates: MentionItem[] = [
  {
    id: 'cand_001',
    label: '张三',
    kind: '2',
    source: { name: 'text', age: 18, school: 'ceshi' },
  },
  { id: 'cand_002', label: '李四', kind: '2' },
  { id: 'cand_003', label: '王五', kind: '2' },
  { id: 'cand_004', label: '赵六', kind: '2' },
  { id: 'cand_005', label: '刘备', kind: '2' },
  { id: 'cand_006', label: '关羽', kind: '2' },
  { id: 'cand_007', label: '张飞', kind: '2' },
  { id: 'cand_008', label: '诸葛亮', kind: '2' },
];

export function fetchCandidates(query: string): Promise<MentionItem[]> {
  return new Promise((resolve) => {
    const delay = 200 + Math.random() * 300;
    setTimeout(() => {
      resolve(candidates.filter((c) => c.label.includes(query)).slice(0, 6));
    }, delay);
  });
}
