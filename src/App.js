import React from 'react';
import './App.css';
import Person from './components/Person';
import Projects from './components/Projects';
import Goals from './components/Goals';
import Interests from './components/Interests';

function App() {
  return (
    <div className="App">
      <Person />
      <Projects />
      <Interests />
      <Goals />
    </div>
  );
}

export default App;