import React, { useEffect, useState } from 'react';
import API from '../api';

function Interests() {
  const [interests, setInterests] = useState([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/interests')
      .then(response => setInterests(response.data))
      .catch(() => setError('Failed to load interests'));
  }, []);

  if (error) return <p>{error}</p>;
  if (!interests.length) return <p>Loading interests...</p>;

  const filtered = filter === ''
    ? interests
    : interests.filter(i =>
        i.category.toLowerCase().includes(filter.toLowerCase())
      );

  return (
    <div style={styles.container}>
      <h2>Interests</h2>

      {/* Category filter */}
      <input
        type="text"
        placeholder="Filter by category (e.g. Technology)"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={styles.input}
      />

      {/* Interest cards */}
      <div style={styles.grid}>
        {filtered.map(interest => (
          <div key={interest.id} style={styles.card}>
            <h3 style={styles.title}>{interest.title}</h3>
            <p style={styles.summary}>{interest.summary}</p>
            <span style={styles.tag}>{interest.category}</span>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p>No interests found for "{filter}"</p>
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
  input: {
    padding: '0.5rem 1rem',
    marginBottom: '1.5rem',
    width: '100%',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
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
  title: {
    margin: 0,
    fontSize: '1.1rem',
  },
  summary: {
    margin: 0,
    color: '#555',
    fontSize: '0.95rem',
    flexGrow: 1,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f0fe',
    color: '#1a73e8',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
};

export default Interests;