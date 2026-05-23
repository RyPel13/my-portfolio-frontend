import React, { useEffect, useState } from 'react';
import API from '../../fitnessApi';

const CATEGORIES = ['ALL', 'PHYSICAL_THERAPY', 'AEROBIC', 'ANAEROBIC', 'ENDURANCE', 'FLEXIBILITY'];
const DIFFICULTIES = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

const CATEGORY_COLORS = {
  PHYSICAL_THERAPY: { bg: '#1e3a5f', text: '#60a5fa' },
  AEROBIC:          { bg: '#1a3a2a', text: '#4ade80' },
  ANAEROBIC:        { bg: '#3b1f1f', text: '#f87171' },
  ENDURANCE:        { bg: '#2d2416', text: '#fbbf24' },
  FLEXIBILITY:      { bg: '#2a1a3a', text: '#c084fc' },
};

const DIFFICULTY_COLORS = {
  BEGINNER:     '#4ade80',
  INTERMEDIATE: '#fbbf24',
  ADVANCED:     '#f87171',
};

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('ALL');
  const [difficulty, setDifficulty] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/exercises')
      .then(res => {
        setExercises(res.data);
        setFiltered(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = exercises;
    if (category !== 'ALL') result = result.filter(e => e.category === category);
    if (difficulty !== 'ALL') result = result.filter(e => e.difficultyLevel === difficulty);
    setFiltered(result);
  }, [category, difficulty, exercises]);

  if (loading) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Loading exercises...</p>;

  return (
    <div>
      <div style={styles.filterRow}>
        {/* Category filters */}
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Category</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                ...styles.filterBtn,
                backgroundColor: category === cat ? '#22d3ee' : '#1e293b',
                color: category === cat ? '#0f172a' : '#94a3b8',
                border: category === cat ? '1px solid #22d3ee' : '1px solid #334155',
              }}
            >
              {cat === 'ALL' ? 'All' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Difficulty filters */}
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Difficulty</span>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              style={{
                ...styles.filterBtn,
                backgroundColor: difficulty === d ? '#22d3ee' : '#1e293b',
                color: difficulty === d ? '#0f172a' : '#94a3b8',
                border: difficulty === d ? '1px solid #22d3ee' : '1px solid #334155',
              }}
            >
              {d === 'ALL' ? 'All' : d}
            </button>
          ))}
        </div>
      </div>

      <p style={styles.count}>{filtered.length} exercises</p>

      <div style={styles.grid}>
        {filtered.map(ex => (
          <div
            key={ex.id}
            onClick={() => setSelected(selected?.id === ex.id ? null : ex)}
            style={{
              ...styles.card,
              border: selected?.id === ex.id ? '1px solid #22d3ee' : '1px solid #334155',
            }}
          >
            {/* Category badge */}
            <div style={{
              ...styles.categoryBadge,
              backgroundColor: CATEGORY_COLORS[ex.category]?.bg || '#1e293b',
              color: CATEGORY_COLORS[ex.category]?.text || '#94a3b8',
            }}>
              {ex.category.replace('_', ' ')}
            </div>

            <h3 style={styles.exerciseName}>{ex.name}</h3>
            <p style={styles.exerciseDesc}>{ex.description}</p>

            {/* Muscle groups */}
            <div style={styles.muscles}>
              {ex.muscleGroups.map(m => (
                <span key={m} style={styles.muscleTag}>{m.replace('_', ' ')}</span>
              ))}
            </div>

            {/* Stats row */}
            <div style={styles.statsRow}>
              <span style={{ color: DIFFICULTY_COLORS[ex.difficultyLevel] }}>
                ● {ex.difficultyLevel}
              </span>
              {ex.reps > 0 && <span style={styles.stat}>{ex.reps} reps × {ex.sets} sets</span>}
              {ex.reps === 0 && <span style={styles.stat}>{Math.round(ex.durationSeconds / 60)} min</span>}
              {ex.equipmentRequired && <span style={styles.equipTag}>Equipment</span>}
            </div>

            {/* Expanded detail */}
            {selected?.id === ex.id && (
              <div style={styles.expandedDetail}>
                <div style={styles.metRow}>
                  <div style={styles.metBox}>
                    <span style={styles.metLabel}>LOW intensity</span>
                    <span style={styles.metValue}>{ex.metLow} MET</span>
                  </div>
                  <div style={styles.metBox}>
                    <span style={styles.metLabel}>MEDIUM intensity</span>
                    <span style={styles.metValue}>{ex.metMedium} MET</span>
                  </div>
                  <div style={styles.metBox}>
                    <span style={styles.metLabel}>HIGH intensity</span>
                    <span style={styles.metValue}>{ex.metHigh} MET</span>
                  </div>
                </div>
                {ex.videoUrl && (
                  <a href={ex.videoUrl} target="_blank" rel="noreferrer" style={styles.videoLink}>
                    ▶ Watch Demo Video
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '2rem' }}>
          No exercises found for this filter.
        </p>
      )}
    </div>
  );
}

const styles = {
  filterRow: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  filterLabel: { color: '#64748b', fontSize: '0.8rem', fontWeight: '600', minWidth: '70px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  filterBtn: {
    padding: '0.3rem 0.9rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  count: { color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '1.25rem',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    transition: 'border-color 0.2s, transform 0.15s',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    fontSize: '0.7rem',
    fontWeight: '700',
    padding: '0.2rem 0.6rem',
    borderRadius: '20px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  exerciseName: { margin: 0, fontSize: '1rem', fontWeight: '700', color: '#f1f5f9' },
  exerciseDesc: { margin: 0, fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.4' },
  muscles: { display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  muscleTag: {
    backgroundColor: '#0f172a',
    color: '#64748b',
    fontSize: '0.72rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '20px',
  },
  statsRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.82rem' },
  stat: { color: '#94a3b8' },
  equipTag: {
    backgroundColor: '#1e3a5f',
    color: '#60a5fa',
    fontSize: '0.72rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '20px',
  },
  expandedDetail: {
    borderTop: '1px solid #334155',
    paddingTop: '0.75rem',
    marginTop: '0.25rem',
  },
  metRow: { display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' },
  metBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: '8px',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
  },
  metLabel: { color: '#64748b', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  metValue: { color: '#22d3ee', fontWeight: '700', fontSize: '0.9rem' },
  videoLink: {
    color: '#22d3ee',
    fontSize: '0.85rem',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default ExerciseLibrary;
