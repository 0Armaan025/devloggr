import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  // Custom window controls
  const handleMinimize = () => {
    window.electron.minimize();
  };

  const handleMaximize = () => {
    window.electron.maximize();
  };

  const handleClose = () => {
    window.electron.close();
  };

  return (
    <>
      <div className="custom-filebar">
        <div className="app-info">
          <span className="app-title" style={{ fontFamily: "Poppins, sans-serif" }}>DevLoggr</span>
        </div>
        <div className="filebar-controls">
          <button onClick={handleMinimize} className="minimize-button">—</button>
          <button onClick={handleMaximize} className="maximize-button">□</button>
          <button onClick={handleClose} className="close-button">×</button>
        </div>
      </div>
    </>
  );
}

export default App;
