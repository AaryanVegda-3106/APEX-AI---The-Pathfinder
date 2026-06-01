import React from 'react';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>APEX</h1>
        <p>AI Powered Masters Program Explorer</p>
      </header>
      <main>
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;
