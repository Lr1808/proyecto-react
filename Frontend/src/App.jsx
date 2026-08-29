import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = '/api'

const initialRegister = {
  email: 'alumno@demo.com',
  password: '12345678',
  full_name: 'Alumno Demo',
  role: 'student',
}

const initialLogin = {
  email: 'alumno@demo.com',
  password: '12345678',
}

function App() {
  const [apiState, setApiState] = useState({ loading: true, message: 'Comprobando Django...' })
  const [registerForm, setRegisterForm] = useState(initialRegister)
  const [loginForm, setLoginForm] = useState(initialLogin)
  const [token, setToken] = useState(localStorage.getItem('codegrade_access') || '')
  const [user, setUser] = useState(null)
  const [exercises, setExercises] = useState([])
  const [selectedExerciseId, setSelectedExerciseId] = useState('')
  const [submission, setSubmission] = useState(null)
  const [feedback, setFeedback] = useState('')

  const selectedExercise = useMemo(
    () => exercises.find((exercise) => String(exercise.id) === String(selectedExerciseId)) || null,
    [exercises, selectedExerciseId],
  )

  const apiFetch = async (path, options = {}) => {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.detail || data.message || 'La API respondió con error')
    }

    return data
  }

  const loadHealth = async () => {
    try {
      const data = await apiFetch('/health/')
      setApiState({ loading: false, message: data.message || 'Django API funcionando' })
    } catch (error) {
      setApiState({ loading: false, message: 'No se pudo conectar con Django' })
    }
  }

  const loadExercises = async () => {
    try {
      const data = await apiFetch('/exercises/')
      setExercises(data)
      if (data[0]) setSelectedExerciseId(data[0].id)
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const loadMe = async (accessToken) => {
    try {
      const data = await apiFetch('/auth/me/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      setUser(data)
    } catch (error) {
      setUser(null)
      setFeedback(error.message)
    }
  }

  useEffect(() => {
    loadHealth()
    loadExercises()
  }, [])

  useEffect(() => {
    if (token) {
      loadMe(token)
    }
  }, [token])

  const handleRegister = async (event) => {
    event.preventDefault()
    setFeedback('')

    try {
      const data = await apiFetch('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(registerForm),
      })

      setToken(data.access)
      localStorage.setItem('codegrade_access', data.access)
      setUser(data.user)
      setFeedback('Usuario registrado correctamente')
      setRegisterForm(initialRegister)
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setFeedback('')

    try {
      const data = await apiFetch('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(loginForm),
      })

      setToken(data.access)
      localStorage.setItem('codegrade_access', data.access)
      setFeedback('Sesión iniciada correctamente')
      setLoginForm(initialLogin)
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const handleLogout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('codegrade_access')
    setFeedback('Sesión cerrada')
  }

  const handleSubmission = async (event) => {
    event.preventDefault()
    setFeedback('')

    if (!token || !selectedExerciseId) {
      setFeedback('Necesitas iniciar sesión y elegir un ejercicio')
      return
    }

    try {
      const payload = {
        exercise_id: Number(selectedExerciseId),
        code: 'def suma(a, b):\n    return a + b\n\nprint(suma(2, 3))\n',
      }

      const data = await apiFetch('/submissions/submit/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      setSubmission(data)
      setFeedback('Ejecución realizada con éxito')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">CODEGRADE</p>
          <h1>Panel de funciones del proyecto</h1>
        </div>
        <div className={`api-pill ${apiState.loading ? 'loading' : ''}`}>
          <span className="status-dot" />
          <span>{apiState.message}</span>
        </div>
      </header>

      <section className="hero-grid">
        <article className="panel info-panel">
          <h2>Estado de la API</h2>
          <p>
            El frontend está conectado a Django y se puede validar la salud del servicio directamente desde la
            vista principal.
          </p>
          <ul>
            <li>React + Vite</li>
            <li>Django REST Framework</li>
            <li>Supabase + PostgreSQL</li>
          </ul>
        </article>

        <article className="panel user-panel">
          <h2>Usuario</h2>
          {user ? (
            <>
              <p className="user-name">{user.full_name}</p>
              <p>{user.email}</p>
              <p className="user-role">{user.role}</p>
              <button type="button" className="secondary" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <p>Sin sesión activa. Registra o inicia sesión para probar la API.</p>
          )}
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <h2>Registrar usuario</h2>
          <form onSubmit={handleRegister} className="stack-form">
            <input
              value={registerForm.email}
              onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
              placeholder="Correo electrónico"
            />
            <input
              type="text"
              value={registerForm.full_name}
              onChange={(event) => setRegisterForm({ ...registerForm, full_name: event.target.value })}
              placeholder="Nombre completo"
            />
            <input
              type="password"
              value={registerForm.password}
              onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
              placeholder="Contraseña"
            />
            <select
              value={registerForm.role}
              onChange={(event) => setRegisterForm({ ...registerForm, role: event.target.value })}
            >
              <option value="student">Estudiante</option>
              <option value="teacher">Profesor</option>
            </select>
            <button type="submit">Registrar</button>
          </form>
        </article>

        <article className="panel">
          <h2>Iniciar sesión</h2>
          <form onSubmit={handleLogin} className="stack-form">
            <input
              value={loginForm.email}
              onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
              placeholder="Correo electrónico"
            />
            <input
              type="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
              placeholder="Contraseña"
            />
            <button type="submit">Entrar</button>
          </form>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <h2>Ejercicios</h2>
          {exercises.length > 0 ? (
            <>
              <select value={selectedExerciseId} onChange={(event) => setSelectedExerciseId(event.target.value)}>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.title} · {exercise.programming_language}
                  </option>
                ))}
              </select>

              {selectedExercise && (
                <div className="exercise-card">
                  <h3>{selectedExercise.title}</h3>
                  <p>{selectedExercise.description}</p>
                  <div className="meta-row">
                    <span>{selectedExercise.difficulty}</span>
                    <span>{selectedExercise.programming_language}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>Cargando ejercicios...</p>
          )}
        </article>

        <article className="panel">
          <h2>Enviar solución</h2>
          <form onSubmit={handleSubmission} className="stack-form">
            <textarea
              rows="6"
              readOnly
              value={'def suma(a, b):\n    return a + b\n\nprint(suma(2, 3))\n'}
            />
            <button type="submit" disabled={!token}>
              Ejecutar prueba
            </button>
          </form>

          {submission && (
            <div className="submission-box">
              <p>
                <strong>Resultado:</strong> {submission.verdict}
              </p>
              <p>
                <strong>Puntuación:</strong> {submission.score}%
              </p>
            </div>
          )}
        </article>
      </section>

      {feedback && <div className="feedback">{feedback}</div>}
    </main>
  )
}

export default App
