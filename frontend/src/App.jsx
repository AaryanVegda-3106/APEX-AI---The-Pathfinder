import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Loading from './components/Loading';
import Landing from './components/Landing';

function App() {
  const [appState, setAppState] = useState('loading'); // 'loading', 'landing', 'home'

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setAppState('landing');
    }, 2500); // 2.5 seconds loading

    return () => clearTimeout(timer);
  }, []);

  const handleExplore = () => {
    setAppState('home');
  };

  if (appState === 'loading') {
    return <Loading />;
  }

  if (appState === 'landing') {
    return <Landing onExplore={handleExplore} />;
  }

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
