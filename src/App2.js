import React from 'react';
import Navbar from './components/Navbar';
import Person from './components/Person';
import Projects from './components/Projects';
import Interests from './components/Interests';
import Goals from './components/Goals';

function App() {
  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#e2e8f0' }}>
      <Navbar />
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <section id="person"><Person /></section>
        <section id="projects" style={{ textAlign: 'center' }}><Projects /></section>
        <section id="interests" style={{ textAlign: 'center' }}><Interests /></section>
        <section id="goals" style={{ textAlign: 'center' }}><Goals /></section>
      </main>
    </div>
  );
}

export default App;