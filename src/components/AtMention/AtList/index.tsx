import React, { useCallback, useMemo, useEffect } from 'react';
import classnames from 'classnames';
import Highlight from '../Highlight';
import styles from './index.module.less';
type MentionListPureDisplayProps = any;

enum AtMsgType {
  /** 客户 */
  Customer = 2,
  /** 职位 */
  Job = 1
}

interface AtListGroupConfig<T = any> {
  groupName: string;
  filterPredicate: (item: any) => boolean;
  getTitleText: (item: T) => string;
  getDescriptionText: (item: T) => string;
}

interface AtListGroupProps {
  config: AtListGroupConfig;
  list: any[];
  selectedKey: string;
  id2IndexMap: Record<string, number>;
  keyWords: string[];
  onItemSelect: (index: number) => void;
  registerItemRef?: (index: number, el: HTMLElement) => void;
}

function getKey(item: any) {
  return `${item?.kind}-${item?.id}`;
}

const AtListGroup: React.FC<AtListGroupProps> = ({
  config,
  list,
  selectedKey,
  id2IndexMap,
  keyWords,
  onItemSelect,
  registerItemRef
}) => {
  const filteredList = useMemo(
    () => list.filter(config.filterPredicate),
    [list, config.filterPredicate]
  );

  if (!filteredList.length) {
    return null;
  }

  return (
    <>
      <div className={styles.groupName}>{config.groupName}</div>
      {filteredList.map((item) => {
        const key = getKey(item);
        const isSelected = selectedKey === key;
        const index = id2IndexMap[key];
        return (
          <div
            className={classnames(styles.item, {
              [styles.selected]: isSelected
            })}
            key={key}
            ref={(el) => {
              if (el) {
                registerItemRef?.(index, el);
              }
            }}
            onClick={() => onItemSelect(index)}
          >
            <div className={styles.title}>
              <Highlight text={config.getTitleText(item)} keyWords={keyWords} />
            </div>
            <div className={styles.description}>
              <Highlight text={config.getDescriptionText(item)} keyWords={keyWords} />
            </div>
          </div>
        );
      })}
    </>
  );
};

const AtList: React.FC<MentionListPureDisplayProps> = (props) => {
  const { query, list, selectedIndex, onItemSelect, registerItemRef } = props;
  console.log('query,list', query, list);

  // 添加调试日志监控 props 变化
  useEffect(() => {
    console.log('AtList props changed:', {
      query,
      listLength: list?.length,
      selectedIndex,
      list: list
    });
  }, [query, list, selectedIndex]);

  const id2IndexMap = useMemo(() => {
    return list.reduce((acc, item, index) => {
      const key = getKey(item);
      acc[key] = index;
      return acc;
    }, {} as Record<string, number>);
  }, [list]);

  const selectedKey = useMemo(() => getKey(list[selectedIndex]), [list, selectedIndex]);

  const getCustomerTitle = useCallback((item: any) => {
    return `${item.label}(${item.sourceData.customerNo})${
      item.sourceData.mainBdName ? ` - ${item.sourceData.mainBdName}` : ''
    }`;
  }, []);

  const getJobTitle = useCallback((item: any) => {
    return `${item.label}(${item.sourceData.rcnJobNO})${
      item.sourceData.brokerEmployeeName ? ` - ${item.sourceData.brokerEmployeeName}` : ''
    }`;
  }, []);

  const customerConfig: AtListGroupConfig = useMemo(
    () => ({
      groupName: '客户',
      filterPredicate: (item) => item.kind === AtMsgType.Customer,
      getTitleText: getCustomerTitle,
      getDescriptionText: (item) => item.sourceData.compName
    }),
    [getCustomerTitle]
  );

  const jobConfig: AtListGroupConfig = useMemo(
    () => ({
      groupName: '职位',
      filterPredicate: (item) => item.kind === AtMsgType.Job,
      getTitleText: getJobTitle,
      getDescriptionText: (item) => item.sourceData.companyName
    }),
    [getJobTitle]
  );

  const keyWords = useMemo(() => {
    return query ? [query] : [];
  }, [query]);

  return (
    <div className={styles['mention-wrap']}>
      <div className={styles['mention-list']}>
        {list.length ? (
          <>
            <AtListGroup
              config={customerConfig}
              list={list}
              selectedKey={selectedKey}
              id2IndexMap={id2IndexMap}
              keyWords={keyWords}
              onItemSelect={onItemSelect}
              registerItemRef={registerItemRef}
            />

            <AtListGroup
              config={jobConfig}
              list={list}
              selectedKey={selectedKey}
              id2IndexMap={id2IndexMap}
              keyWords={keyWords}
              onItemSelect={onItemSelect}
              registerItemRef={registerItemRef}
            />
          </>
        ) : (
          //   <Empty
          //     imageStyle={{ height: '76px', margin: '0 auto' }}
          //     className={styles['empty']}
          //     description="暂无数据"
          //   />
          <div>暂无数据</div>
        )}
      </div>
    </div>
  );
};

interface AgentMsgAtSuggestVo {
  customerSuggestVos: Array<{
    /** 客户id */
    customerIdEncode: string;
    /** 客户名称 */
    compName: string;
    /** 客户对外名称 */
    compShowName: string;
    /** 客户来源 */
    sourceKind: number;
    customerNo: string;
    /** 维护人 */
    mainBdName: string;
  }>;
  jobSuggestVos: Array<{
    /** 职位id */
    rcnJobIdEncode: string;
    /** 职位编号 */
    rcnJobNO: string;
    /** 职位名称 */
    jobTitle: string;
    /** 客户名称 */
    companyName: string;
    /** 客户名称 */
    companyShowName: string;
    /** 维护人 */
    brokerEmployeeName: string;
  }>;
}

function convertCustomer(customer: AgentMsgAtSuggestVo['customerSuggestVos'][number]) {
  return {
    id: customer.customerIdEncode,
    label: customer.compShowName || customer.compName,
    sourceData: customer,
    kind: AtMsgType.Customer
  };
}
function convertJob(job: AgentMsgAtSuggestVo['jobSuggestVos'][number]) {
  return {
    id: job.rcnJobIdEncode,
    label: job.jobTitle,
    sourceData: job,
    kind: AtMsgType.Job
  };
}

export const convertAtList = (data: AgentMsgAtSuggestVo) => {
  const { customerSuggestVos, jobSuggestVos } = data ?? {};
  return [
    ...(customerSuggestVos || []).map(convertCustomer),
    ...(jobSuggestVos || []).map(convertJob)
  ];
};

export default AtList;

export function transferJsonToText(json: any): string {
  // 递归处理节点的函数
  function processNode(node: any): string {
    if (!node || typeof node !== 'object') {
      return '';
    }

    // 处理doc根节点，多个paragraph之间用换行符连接
    if (node.type === 'doc' && node.content && Array.isArray(node.content)) {
      return node.content.map(processNode).join('\n');
    }

    // 处理paragraph节点和其他有content数组的节点
    if (node.content && Array.isArray(node.content)) {
      return node.content.map(processNode).join('');
    }

    // 处理text节点
    if (node.type === 'text' && node.text) {
      return node.text;
    }

    // 处理atMention节点
    if (node.type === 'atMention' && node.attrs) {
      const { id, label, mentionSuggestionChar, source } = node.attrs;

      // 解析source JSON字符串获取kind
      let kind = '';
      try {
        const sourceData = JSON.parse(source);
        kind = sourceData.kind || '';
      } catch (error) {}
      return `<at data-id="${id}" data-label="${label}" data-kind="${kind}">@${label}</at>`;
    }

    return '';
  }

  return processNode(json);
}
