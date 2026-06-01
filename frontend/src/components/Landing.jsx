import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const Fireflies = () => {
  const [fireflies, setFireflies] = useState([]);
  
  useEffect(() => {
    // Generate 40 random fireflies
    const flies = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      size: Math.random() * 3 + 1, // 1px to 4px
      duration: Math.random() * 15 + 10, // 10s to 25s
      delay: Math.random() * 10, // 0s to 10s
    }));
    setFireflies(flies);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {fireflies.map(fly => (
        <div
          key={fly.id}
          className="absolute bg-brand-cyan rounded-full shadow-[0_0_10px_2px_rgba(0,229,255,0.8)]"
          style={{
            left: fly.left,
            top: fly.top,
            width: `${fly.size}px`,
            height: `${fly.size}px`,
            animation: `firefly ${fly.duration}s ease-in-out ${fly.delay}s infinite alternate`
          }}
        />
      ))}
    </div>
  );
};

const WorkflowNode = ({ title, icon, description, step }) => (
  <div className="relative w-full max-w-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex items-center gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/[0.04] transition-all duration-300 hover:border-brand-cyan/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] group z-10">
    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-brand-dark border border-brand-cyan/30 flex items-center justify-center relative overflow-hidden group-hover:border-brand-cyan transition-colors">
      <div className="absolute inset-0 bg-brand-cyan/10 group-hover:bg-brand-cyan/20 transition-colors"></div>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-brand-cyan relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
      </svg>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-2">
        <span className="px-3 py-1 bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold rounded-full tracking-wider">STEP {step}</span>
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h3>
      </div>
      <p className="text-slate-400 leading-relaxed text-sm md:text-base">{description}</p>
    </div>
  </div>
);

const Landing = ({ onExplore }) => {
  const globeEl = useRef();
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [countries, setCountries] = useState({ features: [] });

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(res => res.json())
      .then(setCountries);

    const handleResize = () => setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
    window.addEventListener('resize', handleResize);
    
    // Auto-rotate setup for Globe
    const initTimer = setTimeout(() => {
      if (globeEl.current) {
        const controls = globeEl.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 1.5;
          controls.enableZoom = false; 
        }
        const camera = globeEl.current.camera();
        if (camera) {
          camera.position.z = 250;
        }
      }
    }, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(initTimer);
    };
  }, []);

  const arcsData = [...Array(30).keys()].map(() => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    color: ['#00E5FF', '#3b82f6', '#ffffff'][Math.floor(Math.random() * 3)]
  }));

  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden overflow-y-auto scroll-smooth bg-[#050810]">
      
      <Fireflies />

      {/* 3D Global Network Background - Fixed */}
      <div className="fixed inset-0 flex items-center justify-center z-0 opacity-80 pointer-events-none">
        <Globe
          ref={globeEl}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          polygonsData={countries.features}
          polygonAltitude={0.01}
          polygonCapColor={() => 'rgba(0, 0, 0, 0.4)'}
          polygonSideColor={() => 'rgba(0, 229, 255, 0.1)'}
          polygonStrokeColor={() => '#00E5FF'}
          arcsData={arcsData}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={1500}
          arcsTransitionDuration={0}
          atmosphereColor="#00E5FF"
          atmosphereAltitude={0.2}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center pointer-events-auto">
        
        {/* Hero Section */}
        <div className="w-full h-screen flex flex-col items-center justify-center p-4 md:p-8 shrink-0">
          <div className="relative w-full max-w-4xl px-6 py-16 md:py-24 rounded-[3rem] animate-fade-up bg-white/[0.02] backdrop-blur-3xl border border-white/[0.05] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col items-center pointer-events-auto">
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none rounded-[3rem]"></div>
            
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[3rem]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-cyan/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* Neural Engine Badge */}
            <div className="flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-sm font-semibold tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.15)] z-10">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-cyan"></span>
              </span>
              Neural Engine Active
            </div>

            <h1 className="metallic-text text-6xl md:text-[8rem] font-bold mb-6 tracking-tighter text-center leading-none z-10" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              APEX
            </h1>
            <p className="text-lg md:text-2xl text-slate-300/80 font-medium mb-12 max-w-2xl text-center tracking-wide z-10">
              AI Powered Masters Program Explorer
            </p>
            
            <div className="relative mt-4 z-10">
              {/* Outer pulsing glow behind button */}
              <div className="absolute inset-0 bg-brand-cyan rounded-full blur-xl opacity-40 animate-pulse pointer-events-none"></div>
              
              <button 
                onClick={onExplore}
                className="group relative px-10 py-5 rounded-full font-semibold text-brand-dark text-lg md:text-xl transition-all duration-500 flex items-center gap-4 mx-auto overflow-hidden bg-brand-cyan hover:scale-105 shadow-[0_0_40px_rgba(0,229,255,0.3)] hover:shadow-[0_0_60px_rgba(0,229,255,0.6)] border border-brand-cyan/50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Initialize <span className="font-bold">Explorer</span>
                </span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 relative z-10 group-hover:translate-x-1.5 transition-transform duration-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Scroll Down Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-pulse pointer-events-none">
            <span className="text-brand-cyan text-xs tracking-[0.3em] uppercase font-bold">System Architecture</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* LangChain Workflow Section */}
        <div className="w-full max-w-4xl mx-auto py-32 px-4 flex flex-col items-center relative shrink-0">
          <div className="text-center mb-24 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Neural Architecture</h2>
            <p className="text-brand-cyan/80 text-lg uppercase tracking-widest font-semibold">How APEX Thinks</p>
          </div>

          <div className="relative w-full flex flex-col items-center gap-12 md:gap-16">
            {/* Background line connecting nodes */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-cyan/30 to-transparent z-0 hidden md:block">
              {/* Flowing animated data packet */}
              <div className="w-1 h-32 -ml-[1.5px] bg-gradient-to-b from-transparent via-brand-cyan to-transparent opacity-80" style={{ animation: 'flowDown 4s linear infinite' }}></div>
            </div>

            <div className="md:w-1/2 md:pr-12 self-start flex justify-end">
              <WorkflowNode 
                step="01"
                title="Understand Intent" 
                icon="M13 10V3L4 14h7v7l9-11h-7z" 
                description="APEX reads your message to figure out exactly what degree and which country you are interested in."
              />
            </div>
            
            <div className="md:w-1/2 md:pl-12 self-end flex justify-start">
              <WorkflowNode 
                step="02"
                title="Find Programs" 
                icon="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                description="The AI searches for the best universities matching your profile and organizes the data."
              />
            </div>

            <div className="md:w-1/2 md:pr-12 self-start flex justify-end">
              <WorkflowNode 
                step="03"
                title="Build Roadmap" 
                icon="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" 
                description="A custom, step-by-step career and application roadmap is generated just for you."
              />
            </div>

            <div className="md:w-1/2 md:pl-12 self-end flex justify-start">
              <WorkflowNode 
                step="04"
                title="Deliver Results" 
                icon="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" 
                description="All the gathered information is bundled into a clean, easy-to-read response."
              />
            </div>
          </div>
        </div>

        {/* AI Framework Concepts Section */}
        <div className="w-full max-w-5xl mx-auto py-24 px-4 flex flex-col items-center relative shrink-0 mb-32">
          <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Powered by LangChain</h2>
            <p className="text-brand-cyan/80 text-lg font-medium max-w-2xl mx-auto">
              APEX is built on the most advanced open-source AI frameworks. Here is how the core concepts are utilized under the hood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-10">
            {/* LangChain Core Card */}
            <div className="bg-brand-card/60 backdrop-blur-md border border-brand-border/60 rounded-2xl p-8 hover:border-brand-cyan/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">LangChain Framework</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The core engine, initialized in <code className="text-xs bg-black/30 px-1 py-0.5 rounded text-blue-300">backend/services/llm_service.py</code>. It connects our FastAPI backend to the Gemini LLM (via <code className="text-xs bg-black/30 px-1 py-0.5 rounded text-blue-300">langchain-google-genai</code>), providing APEX with its reasoning capabilities and the foundation for all our structured conversational workflows.
              </p>
            </div>

            {/* Prompt Templates Card */}
            <div className="bg-brand-card/60 backdrop-blur-md border border-brand-border/60 rounded-2xl p-8 hover:border-brand-cyan/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center mb-6 group-hover:bg-brand-cyan/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">ChatPromptTemplate</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Implemented in <code className="text-xs bg-black/30 px-1 py-0.5 rounded text-brand-cyan">backend/prompts/templates.py</code>, we use strict templates (like <code className="text-xs bg-black/30 px-1 py-0.5 rounded text-brand-cyan">chat_extraction_template</code>) to inject system instructions and bind dynamic user inputs. This forces the LLM to output predictable JSON payloads and beautifully formatted Markdown.
              </p>
            </div>

            {/* Sequential Chain / LCEL Card */}
            <div className="bg-brand-card/60 backdrop-blur-md border border-brand-border/60 rounded-2xl p-8 hover:border-brand-cyan/40 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Chains & LCEL</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Found throughout <code className="text-xs bg-black/30 px-1 py-0.5 rounded text-purple-300">backend/chains/workflow.py</code>. Using LangChain Expression Language (<code className="text-xs bg-black/30 px-1 py-0.5 rounded text-purple-300">template | llm | StrOutputParser()</code>), we construct sequential pipelines. For example, our program generator pipes your budget and domain through a template, directly into the LLM, and parses the output instantly.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Landing;

