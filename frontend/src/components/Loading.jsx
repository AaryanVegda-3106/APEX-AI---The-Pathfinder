import React, { useState, useEffect } from 'react';

const Loading = () => {
  const [bootText, setBootText] = useState('INITIALIZING NEURAL LINK...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sequences = [
      { text: 'INITIALIZING NEURAL LINK...', time: 0 },
      { text: 'ESTABLISHING SECURE CONNECTION...', time: 600 },
      { text: 'LOADING GLOBAL PROGRAM DATABASE...', time: 1200 },
      { text: 'CALIBRATING EXPLORER CONSOLE...', time: 1800 },
      { text: 'SYSTEMS ONLINE.', time: 2400 },
    ];

    sequences.forEach(seq => {
      setTimeout(() => setBootText(seq.text), seq.time);
    });

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 15, 100));
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-brand-dark overflow-hidden relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6">
        {/* Animated Cyber Core */}
        <div className="relative w-40 h-40 mb-12">
          {/* Outer Pulsing Ring */}
          <div className="absolute inset-0 border-2 border-brand-cyan/20 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
          {/* Middle Rotating Hexagon / Ring */}
          <div className="absolute inset-2 border-[3px] border-transparent border-t-brand-cyan border-b-blue-500 rounded-full animate-[spin_2s_linear_infinite]"></div>
          {/* Inner Fast Ring */}
          <div className="absolute inset-6 border-[2px] border-brand-cyan/50 border-dashed rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
          
          {/* Core Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-brand-cyan rounded-full shadow-[0_0_40px_rgba(0,229,255,1)] animate-pulse"></div>
        </div>

        {/* APEX Branding */}
        <h2 className="text-4xl font-black tracking-[0.4em] metallic-text mb-8">
          APEX
        </h2>

        {/* Boot Sequence Terminal */}
        <div className="w-full bg-brand-card border border-brand-border/50 rounded-lg p-4 shadow-2xl relative overflow-hidden">
          {/* Progress Bar Background */}
          <div className="absolute top-0 left-0 h-1 bg-brand-cyan/20 w-full"></div>
          {/* Active Progress Bar */}
          <div 
            className="absolute top-0 left-0 h-1 bg-brand-cyan shadow-[0_0_10px_#00E5FF] transition-all duration-200" 
            style={{ width: `${progress}%` }}
          ></div>
          
          <div className="flex items-center gap-3 font-mono text-sm mt-2">
            <span className="text-blue-500 font-bold">{'>'}</span>
            <span className="text-brand-cyan font-semibold tracking-widest">{bootText}</span>
            <span className="w-2 h-4 bg-brand-cyan animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
