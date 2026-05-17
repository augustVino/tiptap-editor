import React, { useState } from 'react';
import BasicDemo from './demos/BasicDemo';
import ControlledDemo from './demos/ControlledDemo';
import FileHandlerDemo from './demos/FileHandlerDemo';
import MentionDemo from './demos/MentionDemo';
import ChatDemo from './demos/ChatDemo';
import CustomTagDemo from './demos/CustomTagDemo';

const demos = [
  { id: 'basic', title: '基础用法' },
  { id: 'controlled', title: '受控模式' },
  { id: 'file', title: '文件处理' },
  { id: 'mention', title: '候选人 + 职位' },
  { id: 'chat', title: '聊天场景' },
  { id: 'custom', title: '自定义标签' },
] as const;

type DemoId = typeof demos[number]['id'];

const demoMap: Record<DemoId, React.FC> = {
  basic: BasicDemo,
  controlled: ControlledDemo,
  file: FileHandlerDemo,
  mention: MentionDemo,
  chat: ChatDemo,
  custom: CustomTagDemo,
};

const App: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<DemoId>('chat');

  const ActiveComponent = demoMap[activeDemo];

  return (
    <div style={styles.root}>
      <header style={styles.header}>
        <h1 style={styles.title}>tiptap-editor Examples</h1>
        <p style={styles.subtitle}>
          基于 tiptap 的通用编辑器组件库 — 组件是壳，特性是插件
        </p>
      </header>

      <nav style={styles.nav}>
        {demos.map((d) => (
          <button
            key={d.id}
            onClick={() => setActiveDemo(d.id)}
            style={{
              ...styles.tab,
              ...(activeDemo === d.id ? styles.activeTab : {}),
            }}
          >
            {d.title}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        <ActiveComponent />
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  root: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '24px 16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    margin: 0,
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  nav: {
    display: 'flex',
    gap: 4,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  tab: {
    padding: '6px 14px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#d9d9d9',
    borderRadius: 4,
    background: 'white',
    cursor: 'pointer',
    fontSize: 14,
  },
  activeTab: {
    background: '#1677ff',
    color: 'white',
    borderColor: '#1677ff',
  },
  main: {
    background: 'white',
    padding: 24,
    borderRadius: 8,
    border: '1px solid #e8e8e8',
  },
};

export default App;
