import React, { useEffect, useState } from 'react';
import API from '../api';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/goals')
      .then(response => setGoals(response.data))
      .catch(() => setError('Failed to load goals'));
  }, []);

  if (error) return <p style={{ color: '#f87171' }}>{error}</p>;
  if (!goals.length) return <p style={{ color: '#94a3b8' }}>Loading goals...</p>;

  const filtered = filter === 'all'
    ? goals
    : filter === 'achieved'
      ? goals.filter(g => g.achieved)
      : goals.filter(g => !g.achieved);

  return (
    <div style={styles.container}>
      <h2 style={styles.sectionTitle}>Goals</h2>

      {/* Filter buttons - centered */}
      <div style={styles.filterRow}>
        {['all', 'achieved', 'pending'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterBtn,
              backgroundColor: filter === f ? '#22d3ee' : '#1e293b',
              color: filter === f ? '#0f172a' : '#94a3b8',
              border: filter === f ? '1px solid #22d3ee' : '1px solid #334155',
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Goal cards */}
      <div style={styles.grid}>
        {filtered.map(goal => (
          <div key={goal.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{goal.title}</h3>
            <p style={styles.summary}>{goal.summary}</p>
            <p style={styles.timeline}>Timeline: {goal.timeline}</p>
            {/* Badge centered at bottom */}
            <div style={styles.badgeContainer}>
              <span style={{
                ...styles.badge,
                backgroundColor: goal.achieved ? '#14532d' : '#713f12',
                color: goal.achieved ? '#4ade80' : '#fbbf24',
              }}>
                {goal.achieved ? 'Achieved' : 'Pending'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>No {filter} goals found.</p>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem 0' },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '1.5rem',
  },
  filterRow: {
    display: 'flex',
    justifyContent: 'center',  
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  filterBtn: {
    padding: '0.4rem 1.2rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#f87171',
    fontWeight: 'bold',
  },
  summary: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '0.9rem',
  },
  timeline: {
    margin: 0,
    color: '#64748b',
    fontSize: '0.85rem',
    fontStyle: 'italic',
  },
  badgeContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: '0.5rem',
  },
  badge: {
    padding: '0.3rem 1rem',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: '500',
  },
};

export default Goals;