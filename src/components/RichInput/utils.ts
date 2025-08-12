import { ContentType, SubmitType } from './types';

/**
 * 类型守卫函数：检查是否为JSON格式的提交类型
 */
export function isJsonSubmitType(submitType: SubmitType): submitType is 'json' {
  return submitType === 'json';
}

/**
 * 类型守卫函数：检查是否为text格式的提交类型
 */
export function isTextSubmitType(submitType: SubmitType): submitType is 'text' {
  return submitType === 'text';
}

/**
 * 类型守卫函数：检查内容是否为对象类型
 */
export function isObjectContent(content: any): content is object {
  return typeof content === 'object' && content !== null && !Array.isArray(content);
}

/**
 * 类型守卫函数：检查内容是否为字符串类型
 */
export function isStringContent(content: any): content is string {
  return typeof content === 'string';
}

/**
 * 内容比较工具函数：处理不同类型内容的深度比较
 */
export function isContentEqual<T extends SubmitType>(
  submitType: T,
  content1: ContentType<T> | undefined,
  content2: ContentType<T> | undefined
): boolean {
  if (content1 === content2) return true;
  if (!content1 || !content2) return false;

  if (submitType === 'json') {
    // JSON对象的深度比较
    return JSON.stringify(content1) === JSON.stringify(content2);
  } else {
    // 字符串比较
    return content1 === content2;
  }
}
