import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [apiState, setApiState] = useState({ loading: true, message: '' })

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

    fetch(`${apiUrl}/health/`)
      .then((response) => {
        if (!response.ok) throw new Error('La API no respondió correctamente')
        return response.json()
      })
      .then((data) => setApiState({ loading: false, message: data.message }))
      .catch(() => setApiState({ loading: false, message: 'No se pudo conectar con Django' }))
  }, [])

  return (
    <main>
      <span className="eyebrow">REACT + DJANGO</span>
      <h1>Tu frontend ya habla con la API.</h1>
      <p className="intro">Una base limpia para construir tu próxima página web.</p>
      <section className={`status ${apiState.loading ? 'loading' : ''}`}>
        <span className="status-dot" />
        <span>{apiState.loading ? 'Comprobando Django...' : apiState.message}</span>
      </section>
      <div className="stack">
        <span>Frontend</span>
        <strong>React + Vite</strong>
        <span className="arrow">-&gt;</span>
        <span>Backend</span>
        <strong>Django REST</strong>
      </div>
    </main>
  )
}

export default App
