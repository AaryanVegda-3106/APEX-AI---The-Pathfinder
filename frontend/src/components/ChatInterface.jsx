import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, getTopPrograms, generateRoadmap, getSummary } from '../api/client';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { role: 'apex', content: "Hello! I am APEX, your AI-powered Master's Program Explorer. To get started, what domains are you interested in studying? (e.g. Computer Science, Business, History)" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substring(7));
  const messagesEndRef = useRef(null);

  // State to hold collected info
  const [domain, setDomain] = useState(null);
  const [country, setCountry] = useState(null);
  const [programsText, setProgramsText] = useState(null);
  const [roadmapText, setRoadmapText] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await sendChatMessage(sessionId, userMessage);
      setMessages(prev => [...prev, { role: 'apex', content: data.response }]);
      
      if (data.extracted_domain) setDomain(data.extracted_domain);
      if (data.extracted_country) setCountry(data.extracted_country);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'apex', content: "Sorry, I encountered an error connecting to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePrograms = async () => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'apex', content: `Generating top 5 Master's programs for ${domain} in ${country}...` }]);
    try {
      const text = await getTopPrograms(domain, country);
      setProgramsText(text);
      setMessages(prev => [...prev, { role: 'apex', content: text }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'apex', content: `Generating learning roadmap for ${domain}...` }]);
    try {
      const text = await generateRoadmap(domain);
      setRoadmapText(text);
      setMessages(prev => [...prev, { role: 'apex', content: text }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'apex', content: `Generating final summary...` }]);
    try {
      const text = await getSummary(domain, programsText, roadmapText);
      setMessages(prev => [...prev, { role: 'apex', content: text }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages glass-panel">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="markdown-body">
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message apex">
            <div className="typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="actions">
        {domain && country && !programsText && !isLoading && (
          <button className="action-btn" onClick={handleGeneratePrograms}>
            Generate Top Programs
          </button>
        )}
        {programsText && !roadmapText && !isLoading && (
          <button className="action-btn" onClick={handleGenerateRoadmap}>
            Generate Roadmap
          </button>
        )}
        {programsText && roadmapText && !isLoading && (
          <button className="action-btn" onClick={handleGenerateSummary}>
            Generate Final Summary
          </button>
        )}
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
