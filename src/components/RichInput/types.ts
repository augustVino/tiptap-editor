/**
 * 提交类型枚举
 */
export type SubmitType = 'html' | 'json' | 'text';

/**
 * 根据submitType推断内容类型的条件类型
 */
export type ContentType<T extends SubmitType> = T extends 'json'
  ? object
  : T extends 'html'
    ? string
    : T extends 'text'
      ? string
      : string;
