import { useEffect, useMemo, useState } from 'react';

type Exercise = {
  id: string;
  name: string;
  category: string;
  muscle: string;
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  videoUrl: string;
};

type TemplateExercise = {
  exerciseId: string;
  sets: number;
  reps: string;
  rest: string;
};

type WorkoutTemplate = {
  id: string;
  name: string;
  focus: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  exercises: TemplateExercise[];
};

type WorkoutEntry = {
  exerciseId: string;
  sets: number;
  reps: string;
  complete: boolean;
};

const exerciseLibrary: Exercise[] = [
  {
    id: 'barbell-squat',
    name: 'Barbell Squat',
    category: 'Legs',
    muscle: 'Quads, glutes',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    videoUrl: 'https://www.youtube.com/results?search_query=barbell+squat+exercise+tutorial'
  },
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'Chest',
    muscle: 'Chest, triceps',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    videoUrl: 'https://www.youtube.com/results?search_query=bench+press+exercise+tutorial'
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'Posterior chain',
    muscle: 'Hamstrings, glutes, back',
    equipment: 'Barbell',
    difficulty: 'Advanced',
    videoUrl: 'https://www.youtube.com/results?search_query=deadlift+exercise+tutorial'
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'Shoulders',
    muscle: 'Shoulders, triceps',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    videoUrl: 'https://www.youtube.com/results?search_query=overhead+press+exercise+tutorial'
  },
  {
    id: 'pull-up',
    name: 'Pull Up',
    category: 'Back',
    muscle: 'Lats, biceps',
    equipment: 'Pull-up bar',
    difficulty: 'Intermediate',
    videoUrl: 'https://www.youtube.com/results?search_query=pull+up+exercise+tutorial'
  },
  {
    id: 'dumbbell-row',
    name: 'Dumbbell Row',
    category: 'Back',
    muscle: 'Back, biceps',
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    videoUrl: 'https://www.youtube.com/results?search_query=dumbbell+row+exercise+tutorial'
  },
  {
    id: 'lunges',
    name: 'Walking Lunges',
    category: 'Legs',
    muscle: 'Quads, glutes',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    videoUrl: 'https://www.youtube.com/results?search_query=walking+lunge+exercise+tutorial'
  },
  {
    id: 'plank',
    name: 'Plank Hold',
    category: 'Core',
    muscle: 'Core, shoulders',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    videoUrl: 'https://www.youtube.com/results?search_query=plank+hold+exercise+tutorial'
  }
];

const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'push-day',
    name: 'Push Day',
    focus: 'Upper body power',
    duration: '40 min',
    difficulty: 'Intermediate',
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: '6-8', rest: '90s' },
      { exerciseId: 'overhead-press', sets: 4, reps: '8-10', rest: '75s' },
      { exerciseId: 'dumbbell-row', sets: 3, reps: '10-12', rest: '60s' },
      { exerciseId: 'plank', sets: 3, reps: '45s', rest: '30s' }
    ]
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    focus: 'Strength & growth',
    duration: '50 min',
    difficulty: 'Advanced',
    exercises: [
      { exerciseId: 'barbell-squat', sets: 5, reps: '5-8', rest: '120s' },
      { exerciseId: 'deadlift', sets: 4, reps: '5', rest: '150s' },
      { exerciseId: 'lunges', sets: 3, reps: '10/leg', rest: '60s' },
      { exerciseId: 'plank', sets: 3, reps: '45s', rest: '30s' }
    ]
  },
  {
    id: 'hypertrophy',
    name: 'Hypertrophy Builder',
    focus: 'Muscle volume',
    duration: '45 min',
    difficulty: 'Intermediate',
    exercises: [
      { exerciseId: 'bench-press', sets: 3, reps: '8-10', rest: '75s' },
      { exerciseId: 'pull-up', sets: 4, reps: '6-10', rest: '75s' },
      { exerciseId: 'lunges', sets: 3, reps: '12/leg', rest: '60s' },
      { exerciseId: 'plank', sets: 4, reps: '30s', rest: '30s' }
    ]
  },
  {
    id: 'starter',
    name: 'Starter Lift',
    focus: 'Beginner-friendly gains',
    duration: '30 min',
    difficulty: 'Beginner',
    exercises: [
      { exerciseId: 'dumbbell-row', sets: 3, reps: '10-12', rest: '60s' },
      { exerciseId: 'lunges', sets: 2, reps: '8/leg', rest: '60s' },
      { exerciseId: 'plank', sets: 2, reps: '30s', rest: '30s' },
      { exerciseId: 'bench-press', sets: 3, reps: '8-10', rest: '75s' }
    ]
  }
];

const defaultWorkoutPlan: WorkoutEntry[] = [
  { exerciseId: 'bench-press', sets: 4, reps: '6-8', complete: false },
  { exerciseId: 'barbell-squat', sets: 4, reps: '5-8', complete: false },
  { exerciseId: 'plank', sets: 3, reps: '45s', complete: true }
];

function App() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authState, setAuthState] = useState<{ isLoggedIn: boolean; name: string; email: string }>(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('repforge-auth') : null;

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { isLoggedIn: false, name: '', email: '' };
      }
    }

    return { isLoggedIn: false, name: '', email: '' };
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'library' | 'templates' | 'tutorials' | 'planner'>('dashboard');
  const [search, setSearch] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(workoutTemplates[0].id);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutEntry[]>(defaultWorkoutPlan);

  useEffect(() => {
    window.localStorage.setItem('repforge-auth', JSON.stringify(authState));
  }, [authState]);

  const selectedTemplate = useMemo(
    () => workoutTemplates.find((template) => template.id === selectedTemplateId) ?? workoutTemplates[0],
    [selectedTemplateId]
  );

  const filteredExercises = useMemo(() => {
    const query = search.toLowerCase();
    return exerciseLibrary.filter((exercise) =>
      exercise.name.toLowerCase().includes(query) ||
      exercise.category.toLowerCase().includes(query) ||
      exercise.muscle.toLowerCase().includes(query)
    );
  }, [search]);

  const completeCount = workoutPlan.filter((exercise) => exercise.complete).length;
  const totalMinutes = completedMinutesFromPlan(workoutPlan);

  const handleAuthSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = authMode === 'signup' ? authForm.name : authForm.email.split('@')[0];
    setAuthState({
      isLoggedIn: true,
      name: name || 'Athlete',
      email: authForm.email || 'athlete@repforge.com'
    });
    setAuthForm({ name: '', email: '', password: '' });
  };

  const handleAddExerciseToPlan = (exerciseId: string) => {
    const exercise = exerciseLibrary.find((item) => item.id === exerciseId);
    if (!exercise) return;

    setWorkoutPlan((current) => {
      const alreadyExists = current.some((item) => item.exerciseId === exerciseId);
      if (alreadyExists) return current;

      return [
        ...current,
        {
          exerciseId,
          sets: 3,
          reps: '8-12',
          complete: false
        }
      ];
    });
  };

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = workoutTemplates.find((item) => item.id === templateId);
    if (!template) return;

    setWorkoutPlan(
      template.exercises.map((entry) => ({
        exerciseId: entry.exerciseId,
        sets: entry.sets,
        reps: entry.reps,
        complete: false
      }))
    );
  };

  const toggleExerciseComplete = (exerciseId: string) => {
    setWorkoutPlan((current) =>
      current.map((entry) =>
        entry.exerciseId === exerciseId ? { ...entry, complete: !entry.complete } : entry
      )
    );
  };

  const logOut = () => {
    setAuthState({ isLoggedIn: false, name: '', email: '' });
  };

  if (!authState.isLoggedIn) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="brand-wrap">
            <div className="brand-mark">RF</div>
            <div>
              <p className="eyebrow">Workout tracking</p>
              <h1>RepForge</h1>
            </div>
          </div>

          <div className="toggle-row">
            <button
              className={authMode === 'login' ? 'toggle active' : 'toggle'}
              onClick={() => setAuthMode('login')}
            >
              Login
            </button>
            <button
              className={authMode === 'signup' ? 'toggle active' : 'toggle'}
              onClick={() => setAuthMode('signup')}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="auth-form">
            {authMode === 'signup' && (
              <label>
                Full name
                <input
                  value={authForm.name}
                  onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })}
                  placeholder="Alex Stone"
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                placeholder="••••••••"
              />
            </label>

            <button type="submit" className="primary-btn">
              {authMode === 'login' ? 'Enter dashboard' : 'Create account'}
            </button>
          </form>

          <div className="feature-pills">
            <span>Preset exercises</span>
            <span>Suggested templates</span>
            <span>Video tutorials</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="user-card">
          <div className="brand-mini">RF</div>
          <div>
            <p>Welcome back</p>
            <h3>{authState.name}</h3>
          </div>
        </div>

        <nav className="nav-list">
          {[
            ['dashboard', 'Dashboard'],
            ['library', 'Exercise library'],
            ['templates', 'Templates'],
            ['tutorials', 'Tutorials'],
            ['planner', 'Workout planner']
          ].map(([key, label]) => (
            <button
              key={key}
              className={activeTab === key ? 'nav-link active' : 'nav-link'}
              onClick={() => setActiveTab(key as typeof activeTab)}
            >
              {label}
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={logOut}>Log out</button>
      </aside>

      <main className="main-panel">
        {activeTab === 'dashboard' && (
          <>
            <header className="top-row">
              <div>
                <p className="eyebrow">Overview</p>
                <h2>Today’s progress</h2>
              </div>
              <button className="primary-btn" onClick={() => setActiveTab('planner')}>
                Open workout
              </button>
            </header>

            <section className="stats-grid">
              <div className="stat-card accent">
                <span>Workouts</span>
                <strong>4 / 5</strong>
                <small>weekly target</small>
              </div>
              <div className="stat-card">
                <span>Completed</span>
                <strong>{completeCount}</strong>
                <small>moves logged</small>
              </div>
              <div className="stat-card">
                <span>Minutes</span>
                <strong>{totalMinutes}</strong>
                <small>this session</small>
              </div>
            </section>

            <section className="panel-card">
              <div className="subhead-row">
                <h3>Recommended for you</h3>
                <span className="chip">{selectedTemplate.difficulty}</span>
              </div>
              <div className="template-spotlight">
                <div>
                  <p className="eyebrow">Featured template</p>
                  <h3>{selectedTemplate.name}</h3>
                  <p>{selectedTemplate.focus}</p>
                </div>
                <button className="secondary-btn" onClick={() => setActiveTab('templates')}>
                  View templates
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === 'library' && (
          <section className="panel-card full">
            <div className="subhead-row">
              <h3>Exercise library</h3>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search moves, muscles, or groups"
                className="search-box"
              />
            </div>

            <div className="exercise-grid">
              {filteredExercises.map((exercise) => (
                <article key={exercise.id} className="exercise-card">
                  <div className="exercise-top">
                    <div>
                      <p className="eyebrow">{exercise.category}</p>
                      <h4>{exercise.name}</h4>
                    </div>
                    <span className="chip">{exercise.difficulty}</span>
                  </div>

                  <ul>
                    <li><strong>Muscle:</strong> {exercise.muscle}</li>
                    <li><strong>Equipment:</strong> {exercise.equipment}</li>
                  </ul>

                  <button className="secondary-btn" onClick={() => handleAddExerciseToPlan(exercise.id)}>
                    Add to plan
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'templates' && (
          <section className="panel-card full">
            <div className="subhead-row">
              <h3>Suggested workout templates</h3>
            </div>

            <div className="template-grid">
              {workoutTemplates.map((template) => (
                <article key={template.id} className={selectedTemplateId === template.id ? 'template-card active' : 'template-card'}>
                  <div className="template-header">
                    <div>
                      <p className="eyebrow">{template.duration}</p>
                      <h4>{template.name}</h4>
                    </div>
                    <span className="chip">{template.difficulty}</span>
                  </div>
                  <p>{template.focus}</p>
                  <ul>
                    {template.exercises.map((entry) => {
                      const exercise = exerciseLibrary.find((item) => item.id === entry.exerciseId);
                      return (
                        <li key={`${template.id}-${entry.exerciseId}`}>
                          {exercise?.name} · {entry.sets} sets × {entry.reps}
                        </li>
                      );
                    })}
                  </ul>
                  <button className="primary-btn" onClick={() => handleUseTemplate(template.id)}>
                    Use template
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'tutorials' && (
          <section className="panel-card full">
            <div className="subhead-row">
              <h3>Exercise tutorials</h3>
            </div>

            <div className="tutorial-grid">
              {exerciseLibrary.map((exercise) => (
                <article key={exercise.id} className="tutorial-card">
                  <div className="video-placeholder">
                    <span>Video</span>
                  </div>
                  <h4>{exercise.name}</h4>
                  <p>{exercise.category} · {exercise.muscle}</p>
                  <a href={exercise.videoUrl} target="_blank" rel="noreferrer" className="secondary-btn link-btn">
                    Watch tutorial
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'planner' && (
          <section className="panel-card full">
            <div className="subhead-row">
              <h3>Workout planner</h3>
              <span className="chip">{selectedTemplate.name}</span>
            </div>

            <div className="plan-list">
              {workoutPlan.map((entry) => {
                const exercise = exerciseLibrary.find((item) => item.id === entry.exerciseId);
                if (!exercise) return null;

                return (
                  <div key={`${entry.exerciseId}-${entry.sets}`} className={entry.complete ? 'plan-item done' : 'plan-item'}>
                    <div>
                      <h4>{exercise.name}</h4>
                      <p>
                        {entry.sets} sets · {entry.reps}
                      </p>
                    </div>
                    <button className="tiny-btn" onClick={() => toggleExerciseComplete(entry.exerciseId)}>
                      {entry.complete ? 'Undo' : 'Done'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function completedMinutesFromPlan(workoutPlan: WorkoutEntry[]) {
  return workoutPlan.filter((item) => item.complete).length * 8 + 12;
}

export default App;
