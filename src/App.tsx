/**
 * App 主组件
 */

import React, { useState } from 'react'
import { EditorProvider } from './editor/EditorProvider'
import { EditorContent } from './components/Editor/EditorContent'
import { Toolbar } from './components/Toolbar/Toolbar'
import { CollaborativeEditor } from './examples/CollaborativeEditor'
import styles from './App.module.less'

type EditorMode = 'single' | 'collaborative'

function App(): React.ReactElement {
  const [mode, setMode] = useState<EditorMode>('collaborative')  // 默认为协作模式
  const [content, setContent] = useState<string>('')
  const [userName, setUserName] = useState<string>(`User-${Math.floor(Math.random() * 1000)}`)

  const handleChange = (html: string) => {
    setContent(html)
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <h1>多人协作文档编辑器</h1>
          <p>基于 TipTap 3.x + Yjs 构建的现代化富文本编辑器</p>
        </div>
        <div className={styles.modeSwitch}>
          <button
            className={mode === 'single' ? styles.active : ''}
            onClick={() => setMode('single')}
          >
            单机编辑器
          </button>
          <button
            className={mode === 'collaborative' ? styles.active : ''}
            onClick={() => setMode('collaborative')}
          >
            协作编辑器
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {mode === 'single' ? (
          <div className={styles.editorContainer}>
            <EditorProvider
              documentId="demo-doc-001"
              placeholder="开始输入..."
              onChange={handleChange}
            >
              <Toolbar />
              <EditorContent />
            </EditorProvider>
          </div>
        ) : (
          <div className={styles.collaborativeContainer}>
            <div className={styles.userInput}>
              <label>
                用户名:
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="输入你的名字"
                />
              </label>
              <p className={styles.hint}>
                💡 提示：启动 WebSocket 服务器 (<code>pnpm server</code>)，然后在多个标签页打开此页面测试协作
              </p>
            </div>
            <CollaborativeEditor
              documentId="collab-doc-001"
              wsUrl="ws://localhost:1234"
              userName={userName}
            />
          </div>
        )}

        {/* 调试信息 */}
        {process.env.NODE_ENV === 'development' && mode === 'single' && (
          <details className={styles.debug}>
            <summary>调试信息 (开发环境)</summary>
            <pre>{JSON.stringify({ contentLength: content.length }, null, 2)}</pre>
          </details>
        )}
      </main>
    </div>
  )
}

export default App
