import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Clock3, Send } from 'lucide-react'
import EvaluationResultModal from './EvaluationResultModal'

type Question = {
  id: number
  question_text: string
  question_type: 'MULTIPLE_CHOICE' | 'BOOLEAN' | 'NUMERICAL' | 'CODE_CHALLENGE'
  options: string[]
  points: string | number
}

type Exercise = {
  id: number
  title: string
  description: string
  time_limit_minutes?: number | null
  questions?: Question[]
}

type ExerciseSolverProps = {
  exercise: Exercise
  apiBase: string
  token: string
}

type EvaluationResult = {
  percentage: string | number
  passed: boolean
  feedback: { question_id: number; is_correct: boolean; score_awarded: string | number; explanation: string }[]
}

export default function ExerciseSolver({ exercise, apiBase, token }: ExerciseSolverProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [secondsLeft, setSecondsLeft] = useState((exercise.time_limit_minutes || 30) * 60)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const questions = useMemo(() => exercise.questions || [], [exercise.questions])

  useEffect(() => {
    const timer = window.setInterval(() => setSecondsLeft((seconds) => Math.max(0, seconds - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`
  const urgent = secondsLeft < 180

  const setAnswer = (questionId: number, value: string) => {
    setAnswers((current) => ({ ...current, [questionId]: value }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const response = await fetch(`${apiBase}/exercises/${exercise.id}/submit/`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers: Object.entries(answers).map(([question_id, answer]) => ({ question_id: Number(question_id), answer })) }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.detail || 'No se pudo evaluar la entrega')
      setResult(payload)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="solver-shell">
      <header className="solver-header">
        <div><p className="eyebrow">Desafío activo</p><h1>{exercise.title}</h1><p>{exercise.description}</p></div>
        <div className={`solver-timer ${urgent ? 'urgent' : ''}`}><Clock3 size={19} />{formattedTime}</div>
      </header>
      <form onSubmit={submit} className="solver-form">
        {questions.map((question, index) => (
          <article className="solver-question" key={question.id}>
            <div className="question-meta"><span>Pregunta {index + 1}</span><span>{question.points} pts</span></div>
            <h2>{question.question_text}</h2>
            {question.question_type === 'MULTIPLE_CHOICE' && question.options.map((option) => (
              <label className="answer-option" key={option}><input type="radio" name={`question-${question.id}`} value={option} onChange={(event) => setAnswer(question.id, event.target.value)} />{option}</label>
            ))}
            {question.question_type === 'BOOLEAN' && ['true', 'false'].map((option) => (
              <label className="answer-option" key={option}><input type="radio" name={`question-${question.id}`} value={option} onChange={(event) => setAnswer(question.id, event.target.value)} />{option === 'true' ? 'Verdadero' : 'Falso'}</label>
            ))}
            {question.question_type === 'NUMERICAL' && <input type="number" step="any" onChange={(event) => setAnswer(question.id, event.target.value)} />}
            {question.question_type === 'CODE_CHALLENGE' && <textarea rows={12} spellCheck="false" placeholder="Escribe tu solución..." onChange={(event) => setAnswer(question.id, event.target.value)} />}
          </article>
        ))}
        <button type="submit" disabled={submitting || secondsLeft === 0}><Send size={17} />{submitting ? 'Evaluando...' : 'Entregar ejercicio'}</button>
      </form>
      <EvaluationResultModal result={result} onClose={() => setResult(null)} />
    </section>
  )
}
