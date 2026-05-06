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

  if (error) return <p>{error}</p>;
  if (!goals.length) return <p>Loading goals...</p>;

  const filtered = filter === 'all'
    ? goals
    : filter === 'achieved'
      ? goals.filter(g => g.achieved)
      : goals.filter(g => !g.achieved);

  return (
    <div style={styles.container}>
      <h2>Goals</h2>

      {/* Filter buttons */}
      <div style={styles.filterRow}>
        {['all', 'achieved', 'pending'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterBtn,
              backgroundColor: filter === f ? '#1a73e8' : '#e8f0fe',
              color: filter === f ? '#fff' : '#1a73e8',
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
            <div style={styles.cardHeader}>
              <h3 style={styles.title}>{goal.title}</h3>
              <span style={{
                ...styles.badge,
                backgroundColor: goal.achieved ? '#e6f4ea' : '#fef7e0',
                color: goal.achieved ? '#1e8e3e' : '#f9ab00',
              }}>
                {goal.achieved ? 'Achieved' : 'Pending'}
              </span>
            </div>
            <p style={styles.summary}>{goal.summary}</p>
            <p style={styles.timeline}>Timeline: {goal.timeline}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p>No {filter} goals found.</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  filterRow: {
    display: 'flex',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  filterBtn: {
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '1.1rem',
  },
  badge: {
    padding: '0.2rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  summary: {
    margin: 0,
    color: '#555',
    fontSize: '0.95rem',
  },
  timeline: {
    margin: 0,
    color: '#888',
    fontSize: '0.85rem',
    fontStyle: 'italic',
  },
};

export default Goals;