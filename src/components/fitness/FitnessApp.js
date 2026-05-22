import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

// ── Tab Components ─────────────────────────────────────────────────────────────
import ExerciseLibrary from './ExerciseLibrary';
import WorkoutBuilder from './WorkoutBuilder';
import Dashboard from './Dashboard';

const TABS = [
  { id: 'exercises', label: '🏋️ Exercises' },
  { id: 'workout',   label: '📋 Workout Builder' },
  { id: 'dashboard', label: '📊 Dashboard' },
];

function FitnessApp() {
  const [activeTab, setActiveTab] = useState('exercises');
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>
          ← Back to Portfolio
        </button>
        <div style={styles.headerCenter}>
          <h1 style={styles.title}>Fitness & Physical Therapy System</h1>
          <p style={styles.subtitle}>Personal Fitness + Rehabilitation — All in One</p>
        </div>
        <div style={{ width: '140px' }} /> {/* spacer to center title */}
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabBar}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === tab.id ? '#22d3ee' : 'transparent',
              color: activeTab === tab.id ? '#0f172a' : '#94a3b8',
              fontWeight: activeTab === tab.id ? '700' : '500',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.content}>
        {activeTab === 'exercises'  && <ExerciseLibrary />}
        {activeTab === 'workout'    && <WorkoutBuilder />}
        {activeTab === 'dashboard'  && <Dashboard />}
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    color: '#e2e8f0',
    fontFamily: 'sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #1e293b',
    backgroundColor: '#0f172a',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  backBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #334155',
    color: '#94a3b8',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    width: '140px',
    transition: 'all 0.2s',
  },
  headerCenter: {
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: '0.25rem 0 0 0',
    color: '#22d3ee',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  tabBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    borderBottom: '1px solid #1e293b',
  },
  tab: {
    padding: '0.5rem 1.5rem',
    border: '1px solid #334155',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
};

export default FitnessApp;
