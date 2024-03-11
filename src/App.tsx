// src/App.tsx

import React from 'react';
import './App.css';
import Chat from './components/Chat'; // Import the Trip interface

const App: React.FC = () => {
  return (
    <div className="App">
      <Chat/>
    </div>
  );
};

export default App;