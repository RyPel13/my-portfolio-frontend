import React, { useEffect, useState } from 'react';
import API from '../api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [language, setLanguage] = useState('all');
  const [error, setError] = useState(null);

  const languages = ['all', 'Java', 'Python', 'JavaScript', 'SQL'];

  useEffect(() => {
    API.get('/projects')
      .then(response => {
        setProjects(response.data);
        setFiltered(response.data);
      })
      .catch(() => setError('Failed to load projects'));
  }, []);

  const handleFilter = (val) => {
    setLanguage(val);
    setFiltered(
      val === 'all'
        ? projects
        : projects.filter(p =>
            p.language.toLowerCase() === val.toLowerCase()
          )
    );
  };

  if (error) return <p style={{ color: '#f87171' }}>{error}</p>;
  if (!projects.length) return <p style={{ color: '#94a3b8' }}>Loading projects...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.sectionTitle}>Projects</h2>

      <div style={styles.filterRow}>
        {languages.map(lang => (
          <button
            key={lang}
            onClick={() => handleFilter(lang)}
            style={{
              ...styles.filterBtn,
              backgroundColor: language === lang ? '#22d3ee' : '#1e293b',
              color: language === lang ? '#0f172a' : '#94a3b8',
              border: language === lang ? '1px solid #22d3ee' : '1px solid #334155',
            }}
          >
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filtered.map(project => (
          <a
            key={project.id}
            href={project.githubLink}
            target="_blank"
            rel="noreferrer"
            style={styles.cardLink}
          >
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>{project.title}</h3>
              <p style={styles.description}>{project.description}</p>
              <div style={styles.tags}>
                <span style={styles.tag}>{project.language}</span>
                <span style={styles.tag}>{project.category}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>No {language} projects found.</p>
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  cardLink: {
    textDecoration: 'none',
    display: 'block',
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
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.2s',
  },
  cardTitle: { margin: 0, fontSize: '1.2rem', color: '#f87171', fontWeight: 'bold' },
  description: { margin: 0, color: '#94a3b8', fontSize: '0.9rem', flexGrow: 1 },
  tags: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' },
  tag: {
    backgroundColor: '#0f172a',
    color: '#22d3ee',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontWeight: '500',
  },
};

export default Projects;