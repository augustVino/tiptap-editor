/**
 * @name 高亮组件
 * @description 目前高亮样式为黄色背景
 * @param text 需要高亮处理的文本
 * @param keyWords 需要高亮的关键词
 */
import React, { useMemo } from 'react';
import cs from 'classnames';
import { IMatchItem, matchWords } from './utils';
import styles from './index.module.less';

interface IProps {
  /** 需要高亮处理的文本 */
  text: string;
  /** 需要高亮的关键词 */
  keyWords?: Array<string> | Array<{ start: number; end: number }>;
}

const Highlight = ({ text = '', keyWords = [] }: IProps) => {
  return <>{keyWords?.length > 0 ? <HightLightComp text={text} keyWords={keyWords} /> : text}</>;
};

const HightLightComp = ({ text = '', keyWords = [] }: IProps) => {
  const list: IMatchItem[] = useMemo(() => {
    return matchWords(text, keyWords);
  }, [text, keyWords]);

  return (
    <>
      {list.map((item, i) => {
        if (item.type === 'text') {
          return item.content;
        }
        return (
          <span key={i} className={cs({ [`${styles.highlight}`]: item.type === 'keyword' })}>
            {item.content}
          </span>
        );
      })}
    </>
  );
};

export default Highlight;
