import React from 'react';
import './Landing.css';

const Landing = ({ onExplore }) => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">APEX</h1>
        <p className="landing-tagline">AI Powered Masters Program Explorer</p>
        <button className="explore-button" onClick={onExplore}>
          <span>Explore Now</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
      <div className="landing-background">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>
    </div>
  );
};

export default Landing;
