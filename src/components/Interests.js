import React, { useEffect, useState } from 'react';
import API from '../api';

function Interests() {
  const [interests, setInterests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  const categories = ['all', 'Technology', 'Other'];

  useEffect(() => {
    API.get('/interests')
      .then(response => setInterests(response.data))
      .catch(() => setError('Failed to load interests'));
  }, []);

  if (error) return <p style={{ color: '#f87171' }}>{error}</p>;
  if (!interests.length) return <p style={{ color: '#94a3b8' }}>Loading interests...</p>;

  const filtered = filter === 'all'
    ? interests
    : interests.filter(i =>
        i.category.toLowerCase() === filter.toLowerCase()
      );

  return (
    <div style={styles.container}>
      <h2 style={styles.sectionTitle}>Interests</h2>

      {/* Filter buttons */}
      <div style={styles.filterRow}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              ...styles.filterBtn,
              backgroundColor: filter === cat ? '#22d3ee' : '#1e293b',
              color: filter === cat ? '#0f172a' : '#94a3b8',
              border: filter === cat ? '1px solid #22d3ee' : '1px solid #334155',
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filtered.map(interest => (
          <div key={interest.id} style={styles.card}>
            <h3 style={styles.cardTitle}>{interest.title}</h3>
            <p style={styles.summary}>{interest.summary}</p>
            <span style={styles.tag}>{interest.category}</span>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>No {filter} interests found.</p>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem 0' },
  sectionTitle: { fontSize: '2rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '1.5rem' },
  filterRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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
  cardTitle: { margin: 0, fontSize: '1.1rem', color: '#f87171', fontWeight: 'bold' },
  summary: { margin: 0, color: '#94a3b8', fontSize: '0.9rem', flexGrow: 1 },
  tag: {
    alignSelf: 'center',
    backgroundColor: '#0f172a',
    color: '#22d3ee',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: '500',
  },
};

export default Interests;