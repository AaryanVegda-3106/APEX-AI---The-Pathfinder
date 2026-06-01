import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-inner"></div>
        <div className="spinner-outer"></div>
      </div>
      <h2 className="loading-text">APEX</h2>
    </div>
  );
};

export default Loading;
