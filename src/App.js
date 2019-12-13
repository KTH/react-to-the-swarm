import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [ containers, setContainers ] = useState();

  useEffect(() => {
    const c = async () => {
        var result = await fetch('http://localhost:3001/containers');
        var resultJson = await result.json();
        setContainers(resultJson);
    }
    c();
  });
  
  return (
    <div className="App">
      <header className="App-header">
        {containers}
      </header>
    </div>
  );
}

export default App;
