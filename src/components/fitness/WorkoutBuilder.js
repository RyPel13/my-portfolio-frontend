import React, { useEffect, useState } from 'react';
import API from '../../fitnessApi';

function WorkoutBuilder() {
  const [exercises, setExercises] = useState([]);
  const [selected, setSelected] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Simple user form
  const [userForm, setUserForm] = useState({
    firstName: '', lastName: '', age: '', email: '',
    height: '', weight: '', gender: 'MALE',
  });
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState('profile'); // 'profile' | 'build' | 'result'

  useEffect(() => {
    API.get('/api/exercises').then(res => setExercises(res.data));
  }, []);

  const filteredExercises = categoryFilter === 'ALL'
    ? exercises
    : exercises.filter(e => e.category === categoryFilter);

  const toggleExercise = (ex) => {
    setSelected(prev =>
      prev.find(e => e.id === ex.id)
        ? prev.filter(e => e.id !== ex.id)
        : [...prev, ex]
    );
  };

  const createUserAndContinue = async () => {
    setLoading(true);
    try {
      const res = await API.post('/api/users', {
        ...userForm,
        age: parseInt(userForm.age),
        height: parseFloat(userForm.height),
        weight: parseFloat(userForm.weight),
      });
      setUserId(res.data.id);
      setStep('build');
    } catch (e) {
      alert('Error creating profile. Check all fields are filled correctly.');
    }
    setLoading(false);
  };

  const buildWorkout = async () => {
    if (selected.length === 0) return alert('Select at least one exercise.');
    setLoading(true);
    try {
      // Create a random rehab workout for the user
      const res = await API.post(`/api/workouts/rehab/random/${userId}?count=${selected.length}`);
      setResult(res.data);
      setStep('result');
    } catch (e) {
      alert('Error building workout.');
    }
    setLoading(false);
  };

  // ── Step 1: Profile ────────────────────────────────────────────────────────
  if (step === 'profile') {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Create Your Profile</h2>
        <p style={styles.sub}>We need your info to calculate BMI, calories, and personalized workouts.</p>

        <div style={styles.form}>
          <div style={styles.row}>
            <input style={styles.input} placeholder="First Name"
              value={userForm.firstName} onChange={e => setUserForm({...userForm, firstName: e.target.value})} />
            <input style={styles.input} placeholder="Last Name"
              value={userForm.lastName} onChange={e => setUserForm({...userForm, lastName: e.target.value})} />
          </div>
          <div style={styles.row}>
            <input style={styles.input} placeholder="Age" type="number"
              value={userForm.age} onChange={e => setUserForm({...userForm, age: e.target.value})} />
            <input style={styles.input} placeholder="Email"
              value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
          </div>
          <div style={styles.row}>
            <input style={styles.input} placeholder="Height (metres e.g. 1.83)" type="number" step="0.01"
              value={userForm.height} onChange={e => setUserForm({...userForm, height: e.target.value})} />
            <input style={styles.input} placeholder="Weight (kg)" type="number"
              value={userForm.weight} onChange={e => setUserForm({...userForm, weight: e.target.value})} />
          </div>
          <select style={styles.select} value={userForm.gender}
            onChange={e => setUserForm({...userForm, gender: e.target.value})}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>

          <button style={styles.primaryBtn} onClick={createUserAndContinue} disabled={loading}>
            {loading ? 'Creating...' : 'Continue to Workout Builder →'}
          </button>
        </div>
      </div>
    );
  }

  // ── Step 3: Result ─────────────────────────────────────────────────────────
  if (step === 'result' && result) {
    const totalMins = Math.round(result.totalDurationSeconds / 60);
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Your Workout Plan is Ready! 💪</h2>
        <div style={styles.resultCard}>
          <p style={styles.resultName}>{result.name}</p>
          <p style={styles.resultMeta}>Type: {result.workoutType} · Duration: ~{totalMins} min · Exercises: {result.exercises.length}</p>

          <div style={styles.exerciseList}>
            {result.exercises.map((ex, i) => (
              <div key={ex.id} style={styles.resultExercise}>
                <span style={styles.exNum}>{i + 1}</span>
                <div>
                  <p style={styles.exName}>{ex.name}</p>
                  <p style={styles.exDesc}>{ex.description}</p>
                  {ex.reps > 0 && <p style={styles.exStats}>{ex.reps} reps × {ex.sets} sets</p>}
                  {ex.reps === 0 && <p style={styles.exStats}>{Math.round(ex.durationSeconds / 60)} min</p>}
                </div>
              </div>
            ))}
          </div>

          <button style={styles.primaryBtn} onClick={() => { setStep('build'); setResult(null); setSelected([]); }}>
            Build Another Workout
          </button>
        </div>
      </div>
    );
  }

  // ── Step 2: Build ──────────────────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Build Your Workout</h2>
      <p style={styles.sub}>Select exercises to include in your plan. ({selected.length} selected)</p>

      {/* Category filter */}
      <div style={styles.filterRow}>
        {['ALL', 'PHYSICAL_THERAPY', 'AEROBIC', 'ANAEROBIC', 'ENDURANCE', 'FLEXIBILITY'].map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            style={{
              ...styles.filterBtn,
              backgroundColor: categoryFilter === cat ? '#22d3ee' : '#1e293b',
              color: categoryFilter === cat ? '#0f172a' : '#94a3b8',
              border: categoryFilter === cat ? '1px solid #22d3ee' : '1px solid #334155',
            }}>
            {cat === 'ALL' ? 'All' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Exercise selection grid */}
      <div style={styles.grid}>
        {filteredExercises.map(ex => {
          const isSelected = selected.find(e => e.id === ex.id);
          return (
            <div key={ex.id} onClick={() => toggleExercise(ex)}
              style={{
                ...styles.selectCard,
                border: isSelected ? '2px solid #22d3ee' : '1px solid #334155',
                backgroundColor: isSelected ? '#0f2537' : '#1e293b',
              }}>
              {isSelected && <span style={styles.checkmark}>✓</span>}
              <p style={styles.exCardName}>{ex.name}</p>
              <p style={styles.exCardCat}>{ex.category.replace('_', ' ')}</p>
              <p style={styles.exCardDiff}>{ex.difficultyLevel}</p>
            </div>
          );
        })}
      </div>

      <button style={{
        ...styles.primaryBtn,
        opacity: selected.length === 0 ? 0.5 : 1,
        marginTop: '2rem',
      }}
        onClick={buildWorkout}
        disabled={selected.length === 0 || loading}>
        {loading ? 'Building...' : `Generate Workout Plan (${selected.length} exercises)`}
      </button>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto' },
  heading: { fontSize: '1.5rem', fontWeight: '800', color: '#ffffff', marginBottom: '0.5rem' },
  sub: { color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' },
  row: { display: 'flex', gap: '1rem' },
  input: {
    flex: 1, backgroundColor: '#1e293b', border: '1px solid #334155',
    borderRadius: '8px', padding: '0.6rem 0.9rem', color: '#e2e8f0',
    fontSize: '0.9rem', outline: 'none',
  },
  select: {
    backgroundColor: '#1e293b', border: '1px solid #334155',
    borderRadius: '8px', padding: '0.6rem 0.9rem', color: '#e2e8f0',
    fontSize: '0.9rem',
  },
  primaryBtn: {
    backgroundColor: '#22d3ee', color: '#0f172a', border: 'none',
    padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: '700',
    fontSize: '0.95rem', cursor: 'pointer', transition: 'opacity 0.2s',
  },
  filterRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' },
  filterBtn: {
    padding: '0.3rem 0.9rem', borderRadius: '20px', cursor: 'pointer',
    fontSize: '0.8rem', fontWeight: '500',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '0.75rem',
  },
  selectCard: {
    borderRadius: '10px', padding: '0.9rem', cursor: 'pointer',
    position: 'relative', transition: 'all 0.15s',
  },
  checkmark: {
    position: 'absolute', top: '0.5rem', right: '0.6rem',
    color: '#22d3ee', fontWeight: '900', fontSize: '1rem',
  },
  exCardName: { margin: 0, fontWeight: '700', color: '#f1f5f9', fontSize: '0.85rem' },
  exCardCat: { margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.72rem' },
  exCardDiff: { margin: '0.15rem 0 0', color: '#94a3b8', fontSize: '0.72rem' },
  resultCard: {
    backgroundColor: '#1e293b', borderRadius: '12px',
    padding: '1.5rem', border: '1px solid #22d3ee',
  },
  resultName: { color: '#22d3ee', fontWeight: '700', fontSize: '1.1rem', margin: '0 0 0.25rem' },
  resultMeta: { color: '#64748b', fontSize: '0.85rem', marginBottom: '1.25rem' },
  exerciseList: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' },
  resultExercise: {
    display: 'flex', gap: '1rem', alignItems: 'flex-start',
    backgroundColor: '#0f172a', borderRadius: '8px', padding: '0.75rem',
  },
  exNum: {
    backgroundColor: '#22d3ee', color: '#0f172a', borderRadius: '50%',
    width: '24px', height: '24px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem', flexShrink: 0,
  },
  exName: { margin: 0, fontWeight: '700', color: '#f1f5f9', fontSize: '0.9rem' },
  exDesc: { margin: '0.2rem 0', color: '#94a3b8', fontSize: '0.82rem' },
  exStats: { margin: 0, color: '#22d3ee', fontSize: '0.8rem', fontWeight: '600' },
};

export default WorkoutBuilder;
