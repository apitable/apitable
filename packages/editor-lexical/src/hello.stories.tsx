import React from 'react';
import App from './App';
import App1 from './rich_text/App';

export const World = () => <p>Hey</p>;
    
export const LexicalEditor = () => (
  <App />
);

// https://codesandbox.io/s/loving-river-rt2cds
export const LexicalRichEditor = () => (
  <App1 />
);
