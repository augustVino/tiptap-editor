/**
 * App 主组件
 */

import React, { useState } from 'react'
import { CollaborativeEditor } from './examples/CollaborativeEditor'
import styles from './App.module.less'

function App(): React.ReactElement {
  const [userName, setUserName] = useState<string>(`User-${Math.floor(Math.random() * 1000)}`)

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <h1>多人协作文档编辑器</h1>
          <p>基于 TipTap 3.x + Yjs 构建的现代化富文本编辑器</p>
        </div>
      </header>

      <main className={styles.main}>
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
      </main>
    </div>
  )
}

export default App
