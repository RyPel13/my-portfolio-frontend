import React, { useEffect, useState } from 'react';
import API from '../api';

function Person() {
  const [developer, setDeveloper] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/person')
      .then(response => setDeveloper(response.data))
      .catch(() => setError('Failed to load profile'));
  }, []);

  if (error) return <p style={{ color: '#f87171', textAlign: 'center' }}>{error}</p>;
  if (!developer) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.name}>{developer.name}</h1>
      <div style={styles.links}>
        <a href={developer.gitHub} target="_blank" rel="noreferrer" style={styles.linkBtn}>GitHub</a>
        <a href={developer.linkedIn} target="_blank" rel="noreferrer" style={styles.linkBtn}>LinkedIn</a>
        <a href={developer.resumeLink} target="_blank" rel="noreferrer" style={styles.linkBtn}>Resume</a>
      </div>
      <p style={styles.introduction}>{developer.introduction}</p>
      <p style={styles.email}>{developer.email}</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '4rem 1rem',
  },
  name: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: '0 0 1.5rem 0',
  },
  links: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  linkBtn: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#22d3ee',
    color: '#0f172a',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  introduction: {
    color: '#cbd5e1',
    fontSize: '1.1rem',
    maxWidth: '600px',
    marginBottom: '0.75rem',
  },
  email: {
    color: '#64748b',
    fontSize: '0.95rem',
    margin: 0,
  },
};

export default Person;