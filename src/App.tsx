import { useMemo, useRef, useState } from 'react';
import EditorOfficial from './components/EditorOfficial';
import styles from './App.module.less';
import RichInput, { RichInputRef } from './components/RichInput';
import { AtList, AtMentionTag, convertAtList } from './components/AtMention';

const list = {
  flag: 1,
  data: {
    customerSuggestVos: [
      {
        customerIdEncode: '79a365e05ebd1ca5c80c1e31b8c61023',
        compShowName: '腾讯科技',
        mainBdName: '宋徽宗主',
        compName: '腾讯科技',
        customerNo: 'C7930'
      },
      {
        customerIdEncode: '651885766fd93623cc3b5c7b62e58fc9',
        compShowName: '国网埃森哲',
        compName: '北京国网信通埃森哲信息技术有限公司',
        customerNo: 'C7859'
      },
      {
        customerIdEncode: '76733cda29cf998afa44a6d31c25229a',
        compShowName: '稀奇古怪',
        compName: '稀奇古怪礼品店',
        customerNo: 'C7880'
      },
      {
        customerIdEncode: '518c3db4840898875ac4d97e1a37a8d0',
        compShowName: '从ZX出去',
        compName: '富士通(中国)有限公司石家庄分公司',
        customerNo: 'C7809'
      },
      {
        customerIdEncode: 'd49d1ee2be082eccc03323c15a3174a8',
        compShowName: 'lb',
        compName: '猎豹测试4848814',
        customerNo: 'C7807'
      }
    ],
    jobSuggestVos: [
      {
        rcnJobIdEncode: '322acf6a41d89008411de47c9910fbe5',
        rcnJobNO: 'J206246479',
        companyShowName: 'NIOM',
        brokerEmployeeName: '宋徽宗主',
        companyName: '印度国家银行上海分行',
        jobTitle: '年薪不限'
      },
      {
        rcnJobIdEncode: '61f83408a39767f98f018ed05df57215',
        rcnJobNO: 'J2062836DD',
        companyShowName: 'NIOM',
        brokerEmployeeName: '宋徽宗主',
        companyName: '印度国家银行上海分行',
        jobTitle: '来瓶可乐'
      },
      {
        rcnJobIdEncode: 'd2895496970c0d4669371c24d10b9edd',
        rcnJobNO: 'J206213765',
        companyShowName: 'NIOM',
        brokerEmployeeName: '宋徽宗主',
        companyName: '印度国家银行上海分行',
        jobTitle: '跨猎企邀请寻访，修改费用'
      },
      {
        rcnJobIdEncode: 'd58484438aefe67a45a476c846f3a483',
        rcnJobNO: 'J206283605',
        companyShowName: '极飞科技',
        brokerEmployeeName: '宋徽宗主',
        companyName: '广州极飞科技有限公司',
        jobTitle: '来瓶可乐'
      },
      {
        rcnJobIdEncode: 'fedc37d8f20c1cb63ff75fea0dcfabb0',
        rcnJobNO: 'J2062D0083',
        companyShowName: 'NIOM',
        brokerEmployeeName: '宋徽宗主',
        companyName: '印度国家银行上海分行',
        jobTitle: '面试流程洗数据'
      }
    ]
  }
};
function getAtListAjax(query: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(list);
    }, 300);
  });
}

function App() {
  const [value, setValue] = useState<string>('');
  const richInputRef = useRef<RichInputRef>(null);

  const handleChange = (text: string): void => {
    // if (text.length > 5) {
    //   console.warn('text length is too long');
    //   return;
    // }
    // setValue(text);
  };
  const handleSubmit = (text: string): void => {
    console.log('handleSubmit', text);
  };

  const atMentionOption = useMemo(() => {
    return {
      name: 'atMention',
      suggestion: {
        char: '@',
        // 允许触发建议的前缀字符。设置为 null 表示允许任何前缀字符。默认为: [' ']
        allowedPrefixes: null,
        items: async ({ query = '' }: { query: string }) => {
          try {
            const { flag, data } = (await getAtListAjax(query)) as { flag: number; data: any };
            if (flag === 1) {
              return convertAtList(data!);
            }
            return [];
          } catch (error) {
            return [];
          }
        }
      },
      listComponent: AtList,
      renderComponent: AtMentionTag,
      addSourceAttr: true
    };
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>TipTap 富文本编辑器 Demo</h1>
      </header>
      <main className={styles.main}>
        {/* <EditorOfficial value={value} onChange={(text)=>{
        if (text.length > 5) {
        console.warn('text length is too long');
        return;
      }
      setValue(text);}} limit={5} placeholder="请输入内容" /> */}
        <RichInput<'text'>
          // @ts-ignore
          ref={richInputRef}
          submitType="text"
          placeholder="请输入您的问题，输入 / 可引用提示词"
          //   value={value}
          wrapperClassName={styles.editorWrapper}
          placeholderClassName={styles.placeholder}
          editorClassName={styles.editor}
          onChange={handleChange}
          onSubmit={handleSubmit}
          mentions={[atMentionOption]}
        />
      </main>
    </div>
  );
}

export default App;
