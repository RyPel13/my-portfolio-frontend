import React, { useEffect, useState } from 'react';
import API from '../api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [language, setLanguage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/projects')
      .then(response => {
        setProjects(response.data);
        setFiltered(response.data);
      })
      .catch(() => setError('Failed to load projects'));
  }, []);

  const handleFilter = (e) => {
    const val = e.target.value;
    setLanguage(val);
    setFiltered(
      val === ''
        ? projects
        : projects.filter(p =>
            p.language.toLowerCase().includes(val.toLowerCase())
          )
    );
  };

  if (error) return <p>{error}</p>;
  if (!projects.length) return <p>Loading projects...</p>;

  return (
    <div style={styles.container}>
      <h2>Projects</h2>

      <input
        type="text"
        placeholder="Filter by language (e.g. Java)"
        value={language}
        onChange={handleFilter}
        style={styles.input}
      />

      <div style={styles.grid}>
        {filtered.map(project => (
          <div key={project.id} style={styles.card}>
            <h3 style={styles.title}>{project.title}</h3>
            <p style={styles.description}>{project.description}</p>
            <div style={styles.tags}>
              <span style={styles.tag}>{project.language}</span>
              <span style={styles.tag}>{project.category}</span>
            </div>
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              style={styles.link}
            >
              View on GitHub &rarr;
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p>No projects found for "{language}"</p>
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
  title: {
    margin: 0,
    fontSize: '1.2rem',
  },
  description: {
    margin: 0,
    color: '#555',
    fontSize: '0.95rem',
    flexGrow: 1,
  },
  tags: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e8f0fe',
    color: '#1a73e8',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '500',
    },
  link: {
    color: '#1a73e8',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
};

export default Projects;