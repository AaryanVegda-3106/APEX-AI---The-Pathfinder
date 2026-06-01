import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Loading from './components/Loading';
import Landing from './components/Landing';

function App() {
  const [appState, setAppState] = useState('loading'); // 'loading', 'landing', 'home'

  useEffect(() => {
    // Spotlight effect logic
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Simulate loading time
    const timer = setTimeout(() => {
      setAppState('landing');
    }, 2500); // 2.5 seconds loading

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  const handleExplore = () => {
    setAppState('home');
  };

  if (appState === 'loading') {
    return (
      <>
        <div className="spotlight-bg" />
        <Loading />
      </>
    );
  }

  if (appState === 'landing') {
    return (
      <>
        <div className="spotlight-bg" />
        <Landing onExplore={handleExplore} />
      </>
    );
  }

  return (
    <>
      <div className="spotlight-bg" />
      <div className="w-full max-w-[98%] xl:max-w-[1400px] mx-auto h-screen flex flex-col pt-6 pb-6 relative z-10 animate-fade-up">
        <header className="flex items-center justify-between relative mb-6 px-4">
          <button 
            onClick={() => setAppState('landing')}
            className="flex items-center gap-2 text-slate-400 hover:text-brand-cyan transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          
          <div className="absolute left-1/2 -translate-x-1/2 text-center flex flex-col items-center">
             <h1 className="metallic-text text-3xl font-black tracking-wider leading-none">APEX</h1>
             <p className="text-brand-cyan text-xs tracking-widest uppercase font-semibold mt-1">Explorer Console</p>
          </div>
          
          <div className="w-20"></div> {/* Spacer for flex centering */}
        </header>
        <main className="w-full flex-1 overflow-hidden">
          <ChatInterface />
        </main>
      </div>
    </>
  );
}

export default App;
