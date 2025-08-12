type Words = Array<string | { start: number; end: number }>;

export interface IMatchItem {
  type: 'text' | 'keyword';
  /** 匹配到的文本（keyword） */
  content: string;
}

/** 匹配数据 */
export interface IMatchData {
  [index: number]: {
    /** 长度 */
    length: number;
    /** 非keywords文本内容 */
    text: string;
    /** 起始索引 */
    start: number;
    /** 结束索引 */
    end: number;
  };
}

/**
 * 根据关键词长度从大到小排序后对文本做匹配后生成正则表达式；
 * 顺序匹配所有正则，用匹配结构 index 记录匹配到到数据；
 * 根据匹配项 index 从小达到排序；
 * 填充匹配项之间的普通文本；
 * 组成数组返回。
 * @description 关键词标红匹配函数
 * @param {string} text 显示的文本
 * @param {Words} words 关键词数组
 * @returns {array} MatchItem[]
 */
export function matchWords(text: string, words: Words): IMatchItem[] {
  function assembleMatchList(words: Words) {
    if (words.length === 0 || typeof words[0] !== 'string') return words;

    const matchData: IMatchData = {};
    const patterns = (words as string[])
      .sort((a, b) => (a.length < b.length ? 1 : -1)) // 关键词从长到短排序，目的是优先匹配较长数据，如果优先 '测试工程师' 而不是 '测试'
      .map((item) => {
        /** 特殊符号转译，返回正则，如'测*试'，返回’/测\\*试/‘ */
        return new RegExp(item.replace(/([\^\$\*\+\?\.\{\}\[\]\(\)\\])/gi, '\\$1'), 'gi');
      });
    for (const pattern of patterns) {
      let r;
      while ((r = pattern.exec(text))) {
        /** 命中关键词的索引 */
        const index = r.index;
        if (!matchData[index]) {
          /** 过滤重复关键词，如'abc'已匹配，不再单独匹配'b' */
          if (Object.values(matchData).some((item) => item.start <= index && item.end > index)) {
            continue;
          }
          matchData[index] = {
            length: r[0].length,
            text: r[0],
            start: index,
            end: index + r[0].length
          };
        }
      }
    }
    return Object.entries(matchData)
      .sort(([a], [b]) => (Number(a) > Number(b) ? 1 : -1))
      .map(([, item]) => {
        return item;
      });
  }

  const matchList = assembleMatchList(words);
  if (matchList.length === 0) {
    return [{ type: 'text', content: text }];
  }

  let lastIndex = 0; // 最后一个匹配项结束位置
  const result: IMatchItem[] = [];
  for (const item of matchList) {
    if (lastIndex < item.start) {
      // 补全匹配项之间的普通文本
      result.push({
        type: 'text',
        content: text.slice(lastIndex, item.start)
      });
    }
    result.push({
      type: 'keyword',
      content: text.slice(item.start, item.end)
    });
    lastIndex = item.end;
  }

  // 最后一个匹配项后的普通文本
  if (matchList[matchList.length - 1].end < text.length) {
    result.push({
      type: 'text',
      content: text.slice(matchList[matchList.length - 1].end)
    });
  }

  return result;
}
