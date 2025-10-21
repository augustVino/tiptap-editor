/**
 * App 主组件
 */

import React, { useState } from 'react';
import { CollaborativeEditor } from './examples/CollaborativeEditor';
import { ErrorBoundary } from './components/common';
import { ThemeProvider } from './theme/ThemeProvider';
import { AntdThemeBridge } from './theme/AntdThemeBridge';
import styles from './App.module.less';
import './theme/themes.less';

function App(): React.ReactElement {
  const [userName] = useState<string>(`User-${Math.floor(Math.random() * 1000)}`);

  return (
    <ThemeProvider>
      <AntdThemeBridge>
        <div className={styles.app}>
          <main className={styles.main}>
            <ErrorBoundary>
              <div className={styles.collaborativeContainer}>
                <CollaborativeEditor
                  documentId="collab-doc-001"
                  wsUrl="ws://localhost:1234"
                  userName={userName}
                />
              </div>
            </ErrorBoundary>
          </main>
        </div>
      </AntdThemeBridge>
    </ThemeProvider>
  );
}

export default App;
