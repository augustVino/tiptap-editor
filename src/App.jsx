import React, { useState } from 'react';
import EditorOfficial from './components/EditorOfficial';
import './App.css';

function App() {
  const [value, setValue] = useState('');

  const handleChange = (text) => {
    if (text.length > 5) {
      console.warn('text length is too long');
      return;
    }
    setValue(text);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TipTap 富文本编辑器 Demo</h1>
      </header>
      <main className="App-main">
        <EditorOfficial value={value} onChange={handleChange} limit={5} placeholder="请输入内容" />
      </main>
    </div>
  );
}

export default App;
