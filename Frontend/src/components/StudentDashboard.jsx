import { useEffect, useMemo, useState } from 'react'
import { Award, BarChart3, BookOpen, CheckCircle2, Clock3, Code2, Filter, Flame, History, ListTodo, Map, Play, Sparkles, Target, Timer, TrendingUp, Trophy, Zap } from 'lucide-react'
import ExerciseSolverModal from './ExerciseSolverModal'
import AttemptHistoryModal from './AttemptHistoryModal'
import RouteMap from './RouteMap'
import LeaderboardPanel from './LeaderboardPanel'
import AchievementsModal from './AchievementsModal'
import CertificateModal from './CertificateModal'
import HybridTaskManager from './HybridTaskManager'
import { ACHIEVEMENTS, energyInfo, getTodayChallenge, isDailyDone, levelProgress, loadSolvedMap, loadStats, unlockCertificates } from '../lib/gamification'
import { buildDemoCatalog } from '../lib/dynamicCatalog'
import { playClick } from '../lib/sound'

const categoryLabels = { database: 'Base de datos', python: 'Python', react: 'React', git: 'Git', terminal: 'Terminal' }
const statusFilters = ['Todos', 'Pendientes', 'Completados']
const demoHistory = [
  ['Pensamiento algorítmico', 'Hoy, 10:42', '26 / 30', 'Aprobado'],
  ['Variables y tipos', 'Ayer, 16:08', '18 / 20', 'Aprobado'],
  ['Introducción a Python', '04 Sep, 09:31', '12 / 20', 'Reprobado'],
]

const normalizeSolved = (solved) => Object.fromEntries(Object.entries(solved).map(([id, entry]) => [id, { exercise_id: id, best_percentage: entry.percentage, passed: entry.passed, attempts: entry.attempts }]))

const cooldownSeconds = (attempt) => {
  if (!attempt || attempt.passed || !attempt.last_submitted_at) return 0
  return Math.max(0, Math.ceil((new Date(attempt.last_submitted_at).getTime() + 3 * 60 * 60 * 1000 - Date.now()) / 1000))
}

const cooldownLabel = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.ceil((seconds % 3600) / 60)
  return hours ? `${hours} h ${minutes} min` : `${minutes} min`
}

function QuickChallengeModal({ exercise, seconds, onCancel, onStart }) {
  return <div className="quick-challenge-backdrop" role="dialog" aria-modal="true" aria-label="Misión relámpago">
    <section className="quick-challenge-modal">
      <div className="quick-challenge-orbit" aria-hidden="true"><span /><span /><span /></div>
      <span className="eyebrow"><Timer size={14} /> MISIÓN RELÁMPAGO</span>
      <h2>{seconds > 0 ? seconds : 'Ahora'}</h2>
      <p className="quick-challenge-kicker">Tu siguiente desafío ya fue elegido</p>
      <div className="quick-challenge-card">
        <span>{exercise.is_exam ? 'EXAMEN' : exercise.subject || 'DESAFÍO'} · {exercise.level}</span>
        <strong>{exercise.title}</strong>
        <small>{exercise.time || `${exercise.time_limit_minutes || 30} min`} · {exercise.points || 0} pts disponibles</small>
      </div>
      <p className="quick-challenge-reward"><Sparkles size={15} /> Completa la misión para sumar XP y mantener tu racha activa.</p>
      <div className="quick-challenge-actions">
        <button type="button" className="ghost-button" onClick={onCancel}>Elegir más tarde</button>
        <button type="button" className="primary-button" onClick={onStart}><Play size={14} /> Empezar ahora</button>
      </div>
    </section>
  </div>
}

export default function StudentDashboard({ user, token, apiBase }) {
  const [filter, setFilter] = useState('Todos')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [activeExercise, setActiveExercise] = useState(null)
  const [historyExercise, setHistoryExercise] = useState(null)
  const [catalog, setCatalog] = useState(buildDemoCatalog)
  const [attempts, setAttempts] = useState(() => (token === 'demo-token' ? normalizeSolved(loadSolvedMap()) : {}))
  const [progress, setProgress] = useState({ level: 'beginner', next_level: 'intermediate', exams_passed: 0, average_percentage: 0 })
  const [stats, setStats] = useState(loadStats)
  const [activeTab, setActiveTab] = useState('modules')
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [showCertificates, setShowCertificates] = useState(false)
  const [energy, setEnergy] = useState(() => energyInfo())
  const [dailyDone, setDailyDone] = useState(() => isDailyDone())
  const [toasts, setToasts] = useState([])
  const [quickChallenge, setQuickChallenge] = useState(null)
  const [quickSeconds, setQuickSeconds] = useState(5)
  const [, setCooldownTick] = useState(0)

  const pushToast = (type, title, text) => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, type, title, text }])
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 5200)
  }

  useEffect(() => {
    const onCelebration = (event) => {
      const detail = event.detail
      if (detail && detail.title && detail.text) pushToast(detail.type || 'xp', detail.title, detail.text)
    }
    window.addEventListener('edueval:celebration', onCelebration)
    return () => window.removeEventListener('edueval:celebration', onCelebration)
  }, [])

  useEffect(() => {
    if (token === 'demo-token') return undefined
    fetch(`${apiBase}/exercises/`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((data) => setCatalog(data.map((item) => ({ ...item, subject: categoryLabels[item.category] || item.category, time: `${item.time_limit_minutes || 30} min`, points: item.questions?.reduce((total, question) => total + Number(question.points || 0), 0) || 0, progress: null })))).catch(() => {})
    fetch(`${apiBase}/student/progress/`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).then((response) => response.json()).then(setProgress).catch(() => {})
    fetch(`${apiBase}/student/attempts/`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((data) => setAttempts(Object.fromEntries((data || []).map((entry) => [entry.exercise_id, entry])))).catch(() => {})
    return undefined
  }, [apiBase, token])
  useEffect(() => {
    const timer = window.setInterval(() => setCooldownTick((value) => value + 1), 60000)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const refresh = () => setEnergy(energyInfo())
    const timer = window.setInterval(refresh, 15000)
    window.addEventListener('focus', refresh)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh) }
  }, [])

  const daily = getTodayChallenge(catalog)

  useEffect(() => {
    const refreshCatalog = () => {
      if (token === 'demo-token') {
        setAttempts(normalizeSolved(loadSolvedMap()))
        setStats(loadStats())
        setDailyDone(isDailyDone())
        setEnergy(energyInfo())
        return
      }
      fetch(`${apiBase}/exercises/`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((data) => setCatalog(data.map((item) => ({ ...item, subject: categoryLabels[item.category] || item.category, time: `${item.time_limit_minutes || 30} min`, points: item.questions?.reduce((total, question) => total + Number(question.points || 0), 0) || 0, progress: null })))).catch(() => {})
      fetch(`${apiBase}/student/attempts/`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((data) => setAttempts(Object.fromEntries((data || []).map((entry) => [entry.exercise_id, entry])))).catch(() => {})
    }
    window.addEventListener('edueval:notification', refreshCatalog)
    return () => window.removeEventListener('edueval:notification', refreshCatalog)
  }, [apiBase, token])

  const displayCategory = (item) => categoryLabels[item.category] || item.subject || 'General'
  const categoryOptions = useMemo(() => ['Todas', ...Array.from(new Set(catalog.map(displayCategory)))], [catalog])
  const visible = useMemo(() => catalog.filter((item) => (categoryFilter === 'Todas' || displayCategory(item) === categoryFilter) && (filter === 'Todos' || (filter === 'Pendientes' ? item.progress === null : item.progress !== null))), [catalog, filter, categoryFilter])
  const pendingCount = catalog.filter((item) => !attempts[item.id]).length
  const level = levelProgress(stats.xp)

  const startQuickChallenge = () => {
    const pending = catalog.filter((item) => !attempts[item.id])
    const pool = pending.length ? pending : catalog
    if (!pool.length) return
    const selected = pool[Math.floor(Math.random() * pool.length)]
    setQuickChallenge(selected)
    setQuickSeconds(5)
  }

  useEffect(() => {
    if (!quickChallenge || quickSeconds <= 0) return undefined
    const timer = window.setTimeout(() => setQuickSeconds((value) => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [quickChallenge, quickSeconds])

  const historyRows = useMemo(() => {
    const fromAttempts = catalog.filter((item) => attempts[item.id]).map((item) => {
      const attempt = attempts[item.id]
      return { title: item.title, date: 'Última entrega', score: `${attempt.best_percentage}%`, status: attempt.passed ? 'Aprobado' : 'Reprobado' }
    })
    if (fromAttempts.length) return fromAttempts
    return demoHistory.map((row) => ({ title: row[0], date: row[1], score: row[2], status: row[3] }))
  }, [catalog, attempts])

  return <div className="page-content">
    <div className="gamification-strip">
      <div className="gami-pill gami-xp"><Zap size={16} /><span>XP</span><strong>{stats.xp}</strong></div>
      <div className="gami-pill gami-level"><span>Nivel · {level.level.label}</span><div className="gami-bar"><span style={{ width: `${Math.round(level.ratio * 100)}%` }} /></div></div>
      <div className="gami-pill gami-streak"><Flame size={16} /><span>Racha</span><strong>{stats.streak} <small>{stats.streak === 1 ? 'día' : 'días'}</small></strong></div>
      <div className={`gami-pill gami-energy${energy.current === 0 ? ' low' : ''}`} title={energy.current < energy.max ? 'Se recarga con el tiempo' : 'Energía al máximo'}><Zap size={16} /><span>Energía</span><strong>{energy.current}<small> / {energy.max}</small></strong></div>
      <div className="gami-actions">
        <button className="gami-button quick-challenge-button" type="button" onClick={() => { playClick(); startQuickChallenge() }}><Timer size={14} /> Misión relámpago</button>
        <button className="gami-button" type="button" onClick={() => { playClick(); setShowAchievements(true) }}><Trophy size={14} /> Logros {stats.unlocked.length}/{ACHIEVEMENTS.length}</button>
        <button className="gami-button" type="button" onClick={() => { playClick(); setShowCertificates(true) }}><Award size={14} /> Certificados {unlockCertificates(catalog, attempts).filter((domain) => domain.total > 0 && domain.passed === domain.total).length}</button>
        <button className="gami-button" type="button" onClick={() => { playClick(); setShowLeaderboard(true) }}><BarChart3 size={14} /> Ranking</button>
      </div>
    </div>
    <section className="welcome-banner"><div className="welcome-copy"><span className="eyebrow"><Sparkles size={14} /> ESPACIO DE APRENDIZAJE</span><h1>Bienvenida de nuevo, <span>{user?.full_name?.split(' ')[0] || 'Alumna'}</span></h1><p>Tu siguiente avance está a un desafío de distancia. Sigue construyendo tu dominio.</p><div className="streak-chip"><Flame size={15} /> Ruta personalizada <b>·</b> Próximo nivel: {level.next?.label || level.level.label}</div></div><div className="welcome-stats"><div><span>Promedio general</span><strong>{Number(progress.average_percentage || 86.4).toFixed(1)}%</strong><small><TrendingUp size={13} /> progreso en vivo</small></div><div><span>Exámenes aprobados</span><strong>{progress.exams_passed} <small>completados</small></strong><small><Target size={13} /> desbloqueos activos</small></div></div></section>
    <div className="kpi-row"><article><span className="kpi-icon indigo"><BookOpen size={19} /></span><div><small>Ejercicios disponibles</small><strong>{catalog.length}</strong></div><b>Por nivel</b></article><article><span className="kpi-icon amber"><Clock3 size={19} /></span><div><small>Por realizar</small><strong>{pendingCount}</strong></div><b className="amber-text">Esta semana</b></article><article><span className="kpi-icon emerald"><CheckCircle2 size={19} /></span><div><small>Entregas realizadas</small><strong>{progress.submissions || Object.keys(attempts).length}</strong></div><b className="emerald-text">En vivo</b></article></div>
    <div className="daily-card">{dailyDone ? <><div className="daily-left"><span className="daily-icon done"><CheckCircle2 size={18} /></span><div><span className="eyebrow">COMPLETADO HOY</span><h3>¡Reto superado! Vuelve mañana por +30 XP.</h3><p>Mantiene tu racha activa y suma XP bonus a tu progreso.</p></div></div><span className="daily-done"><CheckCircle2 size={15} /> +30 XP</span></> : <><div className="daily-left"><span className="daily-icon"><Target size={18} /></span><div><span className="eyebrow">RETO DEL DÍA</span><h3>{daily ? daily.title : 'Sin retos por hoy'}</h3><p>{daily ? daily.description : 'Publica un ejercicio para tener retos diarios.'}</p></div></div><button className="primary-button" type="button" onClick={() => { if (daily) setActiveExercise(daily) }}><Play size={14} /> Resolver reto</button></>}</div>
    <div className="section-header"><div><span className="eyebrow">TU RUTA</span><h2>Ejercicios y exámenes</h2></div><div className="route-toggle"><button className={activeTab === 'modules' ? 'active' : ''} type="button" onClick={() => { playClick(); setActiveTab('modules') }}>Módulos</button><button className={activeTab === 'route' ? 'active' : ''} type="button" onClick={() => { playClick(); setActiveTab('route') }}><Map size={13} /> Mapa de ruta</button><button className={activeTab === 'hybrid' ? 'active' : ''} type="button" onClick={() => { playClick(); setActiveTab('hybrid') }}><ListTodo size={13} /> Gestor Híbrido</button></div></div>
    {activeTab === 'hybrid' ? <HybridTaskManager /> : activeTab === 'route' ? <RouteMap catalog={catalog} attempts={attempts} onSelect={(item) => { if (!cooldownSeconds(attempts[item.id])) setActiveExercise(item) }} /> : <><div className="catalog-filters"><div className="filter-bar"><Filter size={15} />{statusFilters.map((value) => <button className={filter === value ? 'active' : ''} onClick={() => setFilter(value)} type="button" key={value}>{value}</button>)}</div><div className="filter-bar category-bar">{categoryOptions.map((value) => <button className={categoryFilter === value ? 'active' : ''} onClick={() => setCategoryFilter(value)} type="button" key={value}>{value}</button>)}</div></div><div className="exercise-grid">{visible.map((item) => { const attempt = attempts[item.id]; const done = Boolean(attempt); const retryWait = cooldownSeconds(attempt); const statusLabel = done ? (attempt.passed ? `Aprobado ${attempt.best_percentage}%` : `Reprobado ${attempt.best_percentage}%`) : 'Pendiente'; const ctaLabel = retryWait ? `Disponible en ${cooldownLabel(retryWait)}` : item.is_exam ? (done ? 'Reintentar examen' : 'Iniciar examen') : (done ? 'Volver a practicar' : 'Comenzar ahora'); return <article className="exercise-tile" key={item.id}><div className="tile-top"><span className="subject-pill">{item.is_exam ? 'EXAMEN · ' : ''}{item.subject}</span><span className={done ? 'done-status' : 'pending-status'}>{statusLabel}</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="tile-meta"><span><Clock3 size={14} /> {item.time}</span><span><Target size={14} /> {item.points} pts</span><span className="level-tag">{item.level}</span>{attempt?.attempts > 1 && <span className="level-tag">{attempt.attempts} intentos</span>}</div><div className="tile-bottom">{item.programming_language === 'python' && <span className="judge-badge"><Code2 size={13} /> Escribe código</span>}<button type="button" className="tile-button" disabled={Boolean(retryWait)} onClick={() => setActiveExercise(item)}><Play size={14} /> {ctaLabel}</button>{done && <button type="button" className="history-button" onClick={() => setHistoryExercise(item)}><History size={13} /> Ver intentos</button>}</div></article> })}</div></>}
    <section className="history-section"><div className="section-header compact"><div><span className="eyebrow">ACTIVIDAD</span><h2>Historial reciente</h2></div></div><div className="history-table"><div className="history-head"><span>Ejercicio</span><span>Fecha</span><span>Puntaje</span><span>Estado</span></div>{historyRows.map((row) => <div className="history-row" key={row.title + row.date}><span><span className="history-dot" />{row.title}</span><small>{row.date}</small><b>{row.score}</b><em className={row.status === 'Aprobado' ? 'approved' : 'rejected'}>{row.status}</em></div>)}</div></section>
    {activeExercise && <ExerciseSolverModal exercise={activeExercise} apiBase={apiBase} token={token} onClose={() => setActiveExercise(null)} />}
    {historyExercise && <AttemptHistoryModal exercise={historyExercise} apiBase={apiBase} token={token} onClose={() => setHistoryExercise(null)} />}
    {showLeaderboard && <LeaderboardPanel stats={stats} userName={user?.full_name?.split(' ')[0] || 'Tú'} onClose={() => setShowLeaderboard(false)} />}
    {showAchievements && <AchievementsModal stats={stats} onClose={() => setShowAchievements(false)} />}
    {showCertificates && <CertificateModal catalog={catalog} solvedMap={loadSolvedMap()} userName={user?.full_name?.split(' ')[0] || 'Alumna'} onClose={() => setShowCertificates(false)} />}
    {quickChallenge && <QuickChallengeModal exercise={quickChallenge} seconds={quickSeconds} onCancel={() => setQuickChallenge(null)} onStart={() => { setQuickChallenge(null); setActiveExercise(quickChallenge) }} />}
    {toasts.length > 0 && <div className="toast-stack">{toasts.map((toast) => <div className={`celebration-toast ${toast.type}`} key={toast.id}><span className="toast-icon">{toast.type === 'level_up' ? <Sparkles size={16} /> : toast.type === 'achievement' ? <Trophy size={16} /> : <Zap size={16} />}</span><div><b>{toast.title}</b><p>{toast.text}</p></div></div>)}</div>}
  </div>
}