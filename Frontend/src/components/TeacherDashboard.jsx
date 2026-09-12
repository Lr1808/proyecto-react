import { useEffect, useMemo, useState } from 'react'
import { Activity, Bell, BookOpen, CheckCircle2, ClipboardList, Plus, Search, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import ExerciseCreatorModal from './ExerciseCreatorModal'

const distribution = [{ range: '0-50%', count: 5 }, { range: '51-70%', count: 11 }, { range: '71-85%', count: 22 }, { range: '86-100%', count: 31 }]
const deliveries = [
  ['María González', 'Estructuras de datos', '38 / 40', '95%', true],
  ['Carlos Ramírez', 'Funciones y testing', '42 / 50', '84%', true],
  ['Sofía Torres', 'Pensamiento algorítmico', '18 / 30', '60%', false],
  ['Diego Mendoza', 'Variables y tipos', '20 / 20', '100%', true],
  ['Valentina Ruiz', 'Consultas SQL', '27 / 30', '90%', true],
  ['Mateo Silva', 'React hooks', '19 / 25', '76%', true],
  ['Ana García', 'Git ramas', '16 / 20', '80%', true],
  ['Lucía Pérez', 'Terminal', '12 / 18', '67%', false],
  ['Javier León', 'Python OOP', '32 / 40', '80%', true],
  ['Paula Rojas', 'Módulos y paquetes', '24 / 30', '80%', true],
]
const topTasks = [
  { name: 'Funciones y testing', completions: 42 },
  { name: 'Consultas SQL', completions: 39 },
  { name: 'React hooks', completions: 34 },
  { name: 'Git ramas', completions: 31 },
  { name: 'Terminal', completions: 29 },
]

export default function TeacherDashboard({ apiBase, token }) {
  const [metrics, setMetrics] = useState(token === 'demo-token' ? { total_submissions: 156, average_percentage: 82.6, pass_rate: 78.4 } : null)
  const [creatorOpen, setCreatorOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [live, setLive] = useState([])

  useEffect(() => {
    if (token === 'demo-token') return undefined
    fetch(`${apiBase}/teacher/metrics/`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
      .then((response) => response.json()).then(setMetrics)
      .catch(() => setMetrics({ total_submissions: 0, average_percentage: 0, pass_rate: 0 }))
    return undefined
  }, [apiBase, token])

  useEffect(() => {
    if (token === 'demo-token') return undefined
    const websocketUrl = apiBase.replace(/^http/, 'ws').replace(/\/api$/, '')
    const socket = new WebSocket(`${websocketUrl}/ws/notifications/?token=${encodeURIComponent(token)}`)
    socket.onmessage = () => setLive((current) => [{ text: 'Nueva entrega recibida', time: 'Ahora' }, ...current].slice(0, 4))
    return () => socket.close()
  }, [apiBase, token])

  const filtered = useMemo(() => deliveries.filter((row) => row[0].toLowerCase().includes(query.toLowerCase()) || row[1].toLowerCase().includes(query.toLowerCase())), [query])
  const stats = metrics || { total_submissions: 0, average_percentage: 0, pass_rate: 0 }

  return <div className="page-content teacher-page">
    <section className="teacher-hero"><div><span className="eyebrow"><Activity size={14} /> CENTRO DE CONTROL</span><h1>Rendimiento del aula</h1><p>Observa el progreso real del grupo y revisa qué ejercicios están generando más dominio y mejor respuesta.</p></div><button className="primary-button" type="button" onClick={() => setCreatorOpen(true)}><Plus size={17} /> Subir nuevo ejercicio</button></section>
    <div className="teacher-kpis"><article><div className="kpi-icon indigo"><ClipboardList size={19} /></div><span>Total entregas</span><strong>{stats.total_submissions}</strong><small><span className="live-text">● En vivo</span> actualizado ahora</small></article><article><div className="kpi-icon teal"><TrendingUp size={19} /></div><span>Calificación promedio</span><strong>{Number(stats.average_percentage).toFixed(1)}%</strong><small>+6.8% frente al mes anterior</small></article><article><div className="kpi-icon emerald"><CheckCircle2 size={19} /></div><span>Tasa de aprobación</span><strong>{Number(stats.pass_rate).toFixed(1)}%</strong><small>45 estudiantes aprobados</small></article><article><div className="kpi-icon amber"><BookOpen size={19} /></div><span>Ejercicios activos</span><strong>12</strong><small>3 publicados esta semana</small></article></div>
    <div className="charts-grid"><article className="dark-card chart-card"><div className="card-heading"><div><span className="eyebrow">DISTRIBUCIÓN</span><h2>Calificaciones del grupo</h2></div><span className="chart-period">Últimos 30 días</span></div><ResponsiveContainer width="100%" height={250}><BarChart data={distribution}><CartesianGrid vertical={false} stroke="#d2ddd0" /><XAxis dataKey="range" stroke="#5e6e63" axisLine={false} tickLine={false} /><YAxis stroke="#5e6e63" axisLine={false} tickLine={false} allowDecimals={false} /><Tooltip cursor={{ fill: 'rgba(30, 58, 43, .06)' }} contentStyle={{ background: '#f5f3ef', border: '1px solid #1e3a2b', borderRadius: 10 }} labelStyle={{ color: '#1a2420' }} itemStyle={{ color: '#1a2420' }} /><Bar dataKey="count" fill="#1e3a2b" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></article><article className="dark-card insight-card"><div className="card-heading"><div><span className="eyebrow">INSIGHT</span><h2>Señal de aprendizaje</h2></div><TrendingUp size={18} className="teal-icon" /></div><div className="insight-score">+12.4%</div><p>El desempeño promedio en desafíos de código creció durante las últimas tres semanas, especialmente en SQL y React.</p><div className="insight-bar"><span /></div><small>Meta de dominio · 80%</small></article></div>
    <div className="teacher-tasks-grid"><div className="dark-card task-card"><div className="card-heading"><div><span className="eyebrow">TOP TAREAS</span><h2>Ejercicios más realizados</h2></div></div><ul className="task-list">{topTasks.map((task) => <li key={task.name}><span>{task.name}</span><strong>{task.completions}</strong></li>)}</ul></div><div className="dark-card task-card"><div className="card-heading"><div><span className="eyebrow">ALUMNOS</span><h2>Rendimiento destacado</h2></div></div><ul className="task-list compact-list"><li><span>María González</span><strong>95%</strong></li><li><span>Valentina Ruiz</span><strong>90%</strong></li><li><span>Diego Mendoza</span><strong>100%</strong></li><li><span>Mateo Silva</span><strong>76%</strong></li></ul></div></div>
    <section className="dark-card deliveries-card"><div className="card-heading"><div><span className="eyebrow">ACTIVIDAD EN VIVO</span><h2>Entregas recientes</h2></div><div className="table-tools"><div className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar alumno..." /></div><button className="icon-button" type="button"><Bell size={17} />{live.length > 0 && <em>{live.length}</em>}</button></div></div><div className="delivery-table"><div className="delivery-head"><span>Alumno</span><span>Ejercicio</span><span>Puntaje</span><span>Porcentaje</span><span>Estado</span><span /></div>{filtered.map((row) => <div className="delivery-row" key={row[0]}><span className="student-cell"><span className="mini-avatar">{row[0].split(' ').map((word) => word[0]).join('').slice(0, 2)}</span>{row[0]}</span><span>{row[1]}</span><span className="mono-value">{row[2]}</span><strong className="mono-value">{row[3]}</strong><span className={`status-badge ${row[4] ? 'approved' : 'rejected'}`}>{row[4] ? 'Aprobado' : 'Reprobado'}</span><button className="review-link" type="button">Revisar</button></div>)}</div></section>
    {creatorOpen && <ExerciseCreatorModal apiBase={apiBase} token={token} onClose={() => setCreatorOpen(false)} onCreated={() => setLive((current) => [{ text: 'Ejercicio publicado para el grupo', time: 'Ahora' }, ...current])} />}
  </div>
}
