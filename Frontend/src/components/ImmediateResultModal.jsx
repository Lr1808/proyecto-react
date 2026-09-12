import { useEffect, useState } from 'react'
import { CheckCircle2, Clock3, Code2, Trophy, X, XCircle, Zap } from 'lucide-react'
import { playClick } from '../lib/sound'

const RING_RADIUS = 54
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

export default function ImmediateResultModal({ result, award, exercise, onClose }) {
  const [displayPercent, setDisplayPercent] = useState(0)
  const [ringOffset, setRingOffset] = useState(RING_CIRCUMFERENCE)

  useEffect(() => {
    if (!result) return undefined
    const target = Number(result.percentage || 0)
    const start = performance.now()
    let frame
    const step = (now) => {
      const progress = Math.min(1, (now - start) / 1100)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayPercent(Math.round(target * eased))
      setRingOffset(RING_CIRCUMFERENCE * (1 - (target / 100) * eased))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [result])

  if (!result) return null
  const percentage = Number(result.percentage || 0)
  const passed = Boolean(result.passed)
  const feedback = result.feedback || []

  return <div className="modal-backdrop" role="presentation">
    <section className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
      <button className="modal-close" type="button" onClick={() => { playClick(); onClose() }} aria-label="Cerrar"><X size={19} /></button>
      <div className={`result-hero ${passed ? 'success' : 'failure'}`}><div className="result-icon">{passed ? <Trophy size={30} /> : <XCircle size={30} />}</div><div><span className="eyebrow">Autoevaluación inmediata del servidor · 140 ms</span><h2 id="result-title">{passed ? 'Excelente trabajo' : 'Cada intento cuenta'}</h2><p>{passed ? 'Has demostrado dominio del tema.' : 'Revisa la retroalimentación y vuelve a intentarlo.'}</p></div></div>
      <div className="result-split">
        <div className="result-ring">
          <svg className="ring-svg" width="150" height="150" viewBox="0 0 150 150">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a2b" />
                <stop offset="100%" stopColor="#c86d51" />
              </linearGradient>
            </defs>
            <circle className="ring-circle ring-track" cx="75" cy="75" r={RING_RADIUS} strokeWidth="11" />
            <circle className="ring-circle ring-value" cx="75" cy="75" r={RING_RADIUS} strokeWidth="11" stroke="url(#ringGrad)" strokeDasharray={RING_CIRCUMFERENCE} strokeDashoffset={ringOffset} />
          </svg>
          <div className="ring-center"><strong>{displayPercent}%</strong><span>{passed ? 'APROBADO' : 'EN PROCESO'}</span></div>
        </div>
        <div className="result-metrics">
          <div><span>Puntaje</span><strong>{result.score ?? 0} <small>/ {result.max_possible_score ?? 0} pts</small></strong></div>
          <div><span>Calificación</span><strong className="mono-value">{percentage.toFixed(0)}%</strong></div>
          <div><span>Estado</span><strong className={`status-badge ${passed ? 'approved' : 'rejected'}`}>{passed ? 'Aprobado' : 'Reprobado'}</strong></div>
          <div><span>Experiencia ganada</span><strong className="xp-line"><Zap size={14} /> {award?.xpGain || 0} XP</strong><small className="xp-note">{award?.streak ? `Racha de ${award.streak} ${award.streak === 1 ? 'día' : 'días'}` : exercise?.is_exam ? 'Examen puntuable' : 'Entrenamiento'}</small></div>
        </div>
      </div>
      <div className="result-details"><div className="section-label">Desglose de respuestas</div>{feedback.map((item, index) => <article className="result-answer" key={item.question_id || index}><div className={`answer-icon ${item.is_correct ? 'correct' : 'wrong'}`}>{item.is_correct ? <CheckCircle2 size={17} /> : <XCircle size={17} />}</div><div className="answer-main"><div className="answer-title"><strong>Pregunta {index + 1}</strong><span>{item.score_awarded || 0} pts</span></div>{item.judge0_output?.type === 'judge0' && <div className="judge-line"><Code2 size={14} /> Judge0 · {item.judge0_output.status || 'Accepted'} · <Clock3 size={13} /> 42 ms</div>}{item.explanation && <div className="teacher-feedback"><b>Retroalimentación del profesor</b><p>{item.explanation}</p></div>}</div></article>)}</div>
      <button className="primary-button full-button" type="button" onClick={() => { playClick(); onClose() }}>Volver al tablero de ejercicios</button>
    </section>
  </div>
}