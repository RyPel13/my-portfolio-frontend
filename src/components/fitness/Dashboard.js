import React, { useEffect, useState } from 'react';
import API from '../../api';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch exercise counts by category for a simple stats display
    Promise.all([
      API.get('/api/exercises'),
      API.get('/api/users'),
    ]).then(([exRes, userRes]) => {
      const exercises = exRes.data;
      const users = userRes.data;

      const byCategory = exercises.reduce((acc, ex) => {
        acc[ex.category] = (acc[ex.category] || 0) + 1;
        return acc;
      }, {});

      setStats({ exercises, byCategory, userCount: users.length });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#94a3b8' }}>Loading dashboard...</p>;
  if (!stats) return <p style={{ color: '#f87171' }}>Failed to load stats.</p>;

  const categoryColors = {
    PHYSICAL_THERAPY: '#60a5fa',
    AEROBIC: '#4ade80',
    ANAEROBIC: '#f87171',
    ENDURANCE: '#fbbf24',
    FLEXIBILITY: '#c084fc',
  };

  return (
    <div>
      <h2 style={styles.heading}>System Dashboard</h2>
      <p style={styles.sub}>Overview of your Fitness & PT System</p>

      {/* Summary cards */}
      <div style={styles.statGrid}>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{stats.exercises.length}</p>
          <p style={styles.statLabel}>Total Exercises</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{stats.userCount}</p>
          <p style={styles.statLabel}>Users Created</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{Object.keys(stats.byCategory).length}</p>
          <p style={styles.statLabel}>Exercise Categories</p>
        </div>
      </div>

      {/* Category breakdown */}
      <h3 style={styles.subheading}>Exercises by Category</h3>
      <div style={styles.categoryGrid}>
        {Object.entries(stats.byCategory).map(([cat, count]) => (
          <div key={cat} style={styles.categoryCard}>
            <div style={{
              ...styles.categoryBar,
              backgroundColor: categoryColors[cat] || '#64748b',
              width: `${(count / stats.exercises.length) * 100}%`,
            }} />
            <div style={styles.categoryInfo}>
              <span style={{ color: categoryColors[cat] || '#64748b', fontWeight: '700', fontSize: '0.85rem' }}>
                {cat.replace('_', ' ')}
              </span>
              <span style={styles.categoryCount}>{count} exercises</span>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon section */}
      <div style={styles.comingSoon}>
        <h3 style={styles.subheading}>Coming Soon</h3>
        <div style={styles.featureGrid}>
          {[
            { icon: '📈', title: 'Progress Tracking', desc: 'Log workouts and track improvement over time' },
            { icon: '🎥', title: 'Exercise Videos', desc: 'Watch demo videos for every exercise' },
            { icon: '🤖', title: 'AI Workout Plans', desc: 'Personalized plans based on your goals' },
            { icon: '📊', title: 'Stats & Charts', desc: 'Visualize your fitness journey' },
          ].map(f => (
            <div key={f.title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <p style={styles.featureTitle}>{f.title}</p>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  heading: { fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' },
  sub: { color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' },
  subheading: { fontSize: '1.1rem', fontWeight: '700', color: '#cbd5e1', margin: '1.5rem 0 1rem' },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  statCard: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '1.25rem',
    textAlign: 'center',
  },
  statNumber: { margin: 0, fontSize: '2.5rem', fontWeight: '900', color: '#22d3ee' },
  statLabel: { margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.85rem' },
  categoryGrid: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  categoryCard: {
    backgroundColor: '#1e293b',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    position: 'relative',
    overflow: 'hidden',
  },
  categoryBar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    opacity: 0.08,
    transition: 'width 0.5s ease',
  },
  categoryInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  categoryCount: { color: '#64748b', fontSize: '0.82rem' },
  comingSoon: { marginTop: '2rem' },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  featureCard: {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '1.25rem',
    opacity: 0.7,
  },
  featureIcon: { fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' },
  featureTitle: { margin: '0 0 0.25rem', fontWeight: '700', color: '#cbd5e1', fontSize: '0.9rem' },
  featureDesc: { margin: 0, color: '#64748b', fontSize: '0.82rem', lineHeight: '1.4' },
};

export default Dashboard;
