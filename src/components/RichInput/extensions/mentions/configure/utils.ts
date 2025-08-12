import { FieldKey, MentionItem } from './types';

/**
 * fieldNames 映射转换
 */
export function mapFieldNames(list: any[], fieldNames?: Record<FieldKey, any>): MentionItem[] {
  const label: FieldKey = fieldNames?.label || 'label';
  const id: FieldKey = fieldNames?.id || 'id';
  return list.map((item) => ({
    ...item,
    label: item[label],
    id: item[id]
  }));
}
