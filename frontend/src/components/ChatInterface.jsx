import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, getTopPrograms, generateRoadmap, getSummary } from '../api/client';
import { Bot, User, MapPin, GraduationCap, Sparkles, Map, List, Send, Target, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const messagesEndRef = useRef(null);

  // State to hold collected info
  const [domain, setDomain] = useState(null);
  const [country, setCountry] = useState(null);
  const [budget, setBudget] = useState("Any");
  const [programsText, setProgramsText] = useState(null);
  const [roadmapText, setRoadmapText] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textOverride = null) => {
    const textToSubmit = textOverride || input;
    if (!textToSubmit.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: textToSubmit.trim() }]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await sendChatMessage(sessionId, textToSubmit.trim());
      setMessages(prev => [...prev, { role: 'apex', content: data.response }]);
      
      if (data.extracted_domain) setDomain(data.extracted_domain);
      if (data.extracted_country) setCountry(data.extracted_country);
      if (data.extracted_budget) setBudget(data.extracted_budget);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'apex', content: "System Error: Neural link interrupted. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (actionType) => {
    setIsLoading(true);
    let prompt = "";
    if (actionType === 'programs') prompt = `Generating top 5 Master's programs for ${domain} in ${country}...`;
    if (actionType === 'roadmap') prompt = `Synthesizing learning roadmap for ${domain}...`;
    if (actionType === 'summary') prompt = `Compiling final intelligence summary...`;
    
    setMessages(prev => [...prev, { role: 'apex', content: prompt }]);
    
    try {
      let text = "";
      if (actionType === 'programs') {
        text = await getTopPrograms(domain, country, budget);
        setProgramsText(text);
      } else if (actionType === 'roadmap') {
        text = await generateRoadmap(domain);
        setRoadmapText(text);
      } else if (actionType === 'summary') {
        text = await getSummary(domain, programsText, roadmapText);
      }
      setMessages(prev => [...prev, { role: 'apex', content: text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'apex', content: "Action failed to complete." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Start Chips
  const quickStarts = [
    { label: "Analyze Computer Science programs", icon: <Target className="w-4 h-4 text-brand-cyan" /> },
    { label: "Explore MBA in United States", icon: <Map className="w-4 h-4 text-brand-cyan" /> },
    { label: "What are the best Data Science degrees?", icon: <Zap className="w-4 h-4 text-brand-cyan" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full w-full p-2">
      
      {/* Left Sidebar: Context & Tracking */}
      <div className="lg:w-1/4 xl:w-1/5 flex flex-col gap-4">
        <div className="glass-panel p-6 flex-1 flex flex-col relative overflow-hidden group">
          {/* Subtle metallic shine on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-cyan" /> Session Context
          </h3>
          
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Domain</span>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-dark/50 border border-brand-border">
                <GraduationCap className={`w-5 h-5 ${domain ? 'text-brand-cyan' : 'text-slate-600'}`} />
                <span className={`font-medium ${domain ? 'text-slate-200' : 'text-slate-600 italic'}`}>
                  {domain || "Unidentified"}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Location</span>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-dark/50 border border-brand-border">
                <MapPin className={`w-5 h-5 ${country ? 'text-brand-cyan' : 'text-slate-600'}`} />
                <span className={`font-medium ${country ? 'text-slate-200' : 'text-slate-600 italic'}`}>
                  {country || "Unidentified"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget</span>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-dark/50 border border-brand-border">
                <span className={`w-5 h-5 flex items-center justify-center font-bold ${budget !== 'Any' ? 'text-brand-cyan' : 'text-slate-600'}`}>$</span>
                <span className={`font-medium ${budget !== 'Any' ? 'text-slate-200' : 'text-slate-600 italic'}`}>
                  {budget}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Deck (Shows only when data is ready) */}
          <div className="mt-auto space-y-3 pt-6 border-t border-brand-border">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Action Deck</h3>
            
            <button 
              onClick={() => handleAction('programs')}
              disabled={!domain || !country || programsText || isLoading}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-all ${
                domain && country && !programsText 
                  ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan hover:bg-brand-cyan hover:text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]' 
                  : 'bg-brand-dark border border-brand-border text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>Get Programs</span>
              <List className="w-4 h-4" />
            </button>

            <button 
              onClick={() => handleAction('roadmap')}
              disabled={!programsText || roadmapText || isLoading}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-all ${
                programsText && !roadmapText 
                  ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan hover:bg-brand-cyan hover:text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]' 
                  : 'bg-brand-dark border border-brand-border text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>Get Roadmap</span>
              <Map className="w-4 h-4" />
            </button>

            <button 
              onClick={() => handleAction('summary')}
              disabled={!programsText || !roadmapText || isLoading}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold transition-all ${
                programsText && roadmapText 
                  ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan hover:bg-brand-cyan hover:text-brand-dark shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]' 
                  : 'bg-brand-dark border border-brand-border text-slate-600 cursor-not-allowed'
              }`}
            >
              <span>Final Summary</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Area: Main Chat */}
      <div className="lg:w-3/4 xl:w-4/5 flex flex-col glass-panel p-0 overflow-hidden h-full">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
          
          {/* Zero State Hero */}
          {messages.length === 0 && (
            <div className="m-auto flex flex-col items-center justify-center max-w-2xl text-center animate-fade-up">
              <div className="w-20 h-20 bg-brand-dark border border-brand-border rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,229,255,0.15)]">
                <Bot className="w-10 h-10 text-brand-cyan" />
              </div>
              <h2 className="metallic-text text-3xl font-bold mb-4">Welcome to APEX</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                I am your advanced neural explorer. Provide a domain of study and your target location, and I will synthesize the optimal Master's programs and roadmaps for you.
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full">
                {quickStarts.map((chip, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(chip.label)}
                    className="flex items-center gap-2 px-4 py-3 bg-brand-dark border border-brand-border hover:border-brand-cyan/50 text-slate-300 hover:text-brand-cyan rounded-xl transition-all text-sm font-medium hover:shadow-[0_0_15px_rgba(0,229,255,0.1)] text-left"
                  >
                    {chip.icon}
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex gap-4 max-w-[90%] xl:max-w-[80%] animate-[fadeIn_0.3s_ease-out_forwards] ${
                msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              {/* Avatars */}
              <div className="flex-shrink-0">
                {msg.role === 'user' ? (
                  <div className="w-10 h-10 bg-brand-cyan rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                    <User className="w-6 h-6 text-brand-dark" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-brand-dark border border-brand-border rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-brand-cyan" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div 
                className={`p-5 rounded-2xl text-sm md:text-base overflow-hidden ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-brand-cyan/10 to-blue-500/10 border border-brand-cyan/30 text-brand-cyan rounded-tr-sm' 
                    : 'bg-brand-dark border border-brand-border rounded-tl-sm text-slate-200 shadow-xl'
                }`}
              >
                <div className={`font-medium ${msg.role === 'apex' ? 'markdown-content' : 'whitespace-pre-wrap'}`}>
                  {msg.role === 'apex' ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 max-w-[90%] self-start animate-[fadeIn_0.3s_ease-out_forwards]">
              <div className="w-10 h-10 bg-brand-dark border border-brand-border rounded-xl flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-brand-cyan animate-pulse" />
              </div>
              <div className="p-5 rounded-2xl bg-brand-dark border border-brand-border rounded-tl-sm shadow-xl flex items-center">
                <div className="typing-indicator px-0 py-0">
                  <div className="dot !bg-brand-cyan"></div>
                  <div className="dot !bg-brand-cyan"></div>
                  <div className="dot !bg-brand-cyan"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-brand-border bg-brand-card/30">
          <form 
            className="flex items-center gap-4 bg-brand-dark border border-brand-border rounded-full p-2 pl-6 focus-within:border-brand-cyan/50 focus-within:shadow-[0_0_20px_rgba(0,229,255,0.1)] transition-all" 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <input
              type="text"
              className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-0 text-sm md:text-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Initialize query..."
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-brand-cyan text-brand-dark p-3 rounded-full hover:bg-[#00cce5] hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
