import { useEffect, useState } from 'react'
import { CheckCircle2, Clock3, History, X, XCircle } from 'lucide-react'

const formatDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AttemptHistoryModal({ exercise, apiBase, token, onClose }) {
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(token === 'demo-token' ? false : true)

  useEffect(() => {
    if (token === 'demo-token') return undefined
    fetch(`${apiBase}/exercises/${exercise.id}/submissions/`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } })
      .then((response) => response.json()).then(setAttempts).catch(() => {}).finally(() => setLoading(false))
    return undefined
  }, [apiBase, token, exercise.id])

  return <div className="modal-backdrop" role="presentation">
    <section className="attempt-modal" role="dialog" aria-modal="true" aria-labelledby="history-title">
      <header className="attempt-modal-header"><div><span className="eyebrow"><History size={13} /> HISTORIAL</span><h2 id="history-title">{exercise.title}</h2><p>{attempts.length === 0 ? 'Aún no tienes entregas guardadas para este ejercicio.' : `${attempts.length} ${attempts.length === 1 ? 'intento registrado' : 'intentos registrados'}`}</p></div><button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar"><X size={19} /></button></header>
      <div className="attempt-list">{loading && <p className="empty-note">Cargando historial...</p>}{!loading && attempts.length === 0 && <div className="attempt-empty"><History size={26} /><span>Completa el ejercicio para ver tus entregas aquí.</span></div>}
        {attempts.map((attempt, index) => <article className="attempt-card" key={attempt.id}><header><div><span className="attempt-order">#{(attempts.length - index)}</span><strong className={`status-badge ${attempt.passed ? 'approved' : 'rejected'}`}>{attempt.passed ? 'Aprobado' : 'Reprobado'}</strong></div><div className="attempt-summary"><span><Clock3 size={13} /> {formatDate(attempt.submitted_at)}</span><strong className="mono-value">{Number(attempt.percentage).toFixed(0)}%</strong></div></header>
          {attempt.answers.map((answer, answerIndex) => <div className="result-answer" key={answer.question_id || answerIndex}><div className={`answer-icon ${answer.is_correct ? 'correct' : 'wrong'}`}>{answer.is_correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}</div><div className="answer-main"><div className="answer-title"><strong>Pregunta {answerIndex + 1}</strong><span>{answer.score_awarded || 0} pts</span></div><p>{answer.question_text}</p><small><b>Tu respuesta:</b> {typeof answer.student_answer === 'object' ? JSON.stringify(answer.student_answer) : (answer.student_answer || 'Sin responder')}</small>{answer.explanation && <div className="teacher-feedback"><b>Retroalimentación</b><p>{answer.explanation}</p></div>}</div></div>)}
        </article>)}
      </div>
      <button className="primary-button full-button" type="button" onClick={onClose}>Volver al tablero</button>
    </section>
  </div>
}