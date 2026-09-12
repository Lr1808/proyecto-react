import { useEffect, useState } from 'react'
import { Bell, CheckCircle2, ClipboardList, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Metrics = {
  total_submissions: number
  average_percentage: number
  pass_rate: number
  distribution: { range: string; count: number }[]
  critical_questions: { question_id: number; question_text: string; error_rate: number }[]
}

type TeacherDashboardProps = {
  apiBase: string
  token: string
}

export default function TeacherDashboard({ apiBase, token }: TeacherDashboardProps) {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    fetch(`${apiBase}/teacher/metrics/`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
      .then((response) => response.json())
      .then(setMetrics)
  }, [apiBase, token])

  useEffect(() => {
    const websocketUrl = apiBase.replace(/^http/, 'ws').replace(/\/api$/, '')
    const socket = new WebSocket(`${websocketUrl}/ws/notifications/?token=${encodeURIComponent(token)}`)
    socket.onmessage = (event) => setNotifications((current) => [JSON.parse(event.data), ...current].slice(0, 12))
    return () => socket.close()
  }, [apiBase, token])

  if (!metrics) return <section className="dashboard-loading">Cargando métricas...</section>

  return (
    <section className="teacher-dashboard">
      <header className="dashboard-heading"><div><p className="eyebrow">Panel docente</p><h1>Rendimiento del aula</h1></div><span className="notification-bell"><Bell size={20} />{notifications.length}</span></header>
      <div className="kpi-grid">
        <article className="kpi-card"><ClipboardList size={20} /><span>Entregas recibidas</span><strong>{metrics.total_submissions}</strong></article>
        <article className="kpi-card"><TrendingUp size={20} /><span>Promedio general</span><strong>{metrics.average_percentage.toFixed(1)}%</strong></article>
        <article className="kpi-card"><CheckCircle2 size={20} /><span>Tasa de aprobación</span><strong>{metrics.pass_rate.toFixed(1)}%</strong></article>
      </div>
      <div className="dashboard-panels">
        <article className="panel chart-panel"><div className="panel-heading"><h2>Distribución de notas</h2><span>Últimas entregas</span></div><ResponsiveContainer width="100%" height={260}><BarChart data={metrics.distribution}><CartesianGrid strokeDasharray="3 3" stroke="#d8e0dc" /><XAxis dataKey="range" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#176b5b" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></article>
        <article className="panel critical-panel"><div className="panel-heading"><h2>Preguntas críticas</h2><span>Mayor índice de error</span></div>{metrics.critical_questions.length === 0 ? <p>Aún no hay suficientes entregas.</p> : metrics.critical_questions.map((question) => <div className="critical-row" key={question.question_id}><p>{question.question_text}</p><strong>{question.error_rate.toFixed(0)}%</strong></div>)}</article>
      </div>
      <div className="live-notifications">{notifications.map((notification, index) => <div key={`${notification.submission_id || notification.exercise_id}-${index}`}><Bell size={15} />{notification.type === 'submission_completed' ? 'Nueva entrega recibida' : 'Nuevo ejercicio publicado'}</div>)}</div>
    </section>
  )
}
