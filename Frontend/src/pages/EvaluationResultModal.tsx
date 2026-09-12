import { CheckCircle2, XCircle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

type FeedbackItem = {
  question_id: number
  is_correct: boolean
  score_awarded: string | number
  explanation: string
}

type EvaluationResult = {
  percentage: string | number
  passed: boolean
  feedback: FeedbackItem[]
}

type EvaluationResultModalProps = {
  result: EvaluationResult | null
  onClose: () => void
}

export default function EvaluationResultModal({ result, onClose }: EvaluationResultModalProps) {
  useEffect(() => {
    if (result?.passed) confetti({ particleCount: 90, spread: 70, origin: { y: 0.65 } })
  }, [result])

  if (!result) return null

  return (
    <div className="evaluation-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="evaluation-modal" role="dialog" aria-modal="true" aria-labelledby="evaluation-title" onClick={(event) => event.stopPropagation()}>
        <div className={`evaluation-score ${result.passed ? 'passed' : 'failed'}`}>
          {result.passed ? <CheckCircle2 size={30} /> : <XCircle size={30} />}
          <span>{Number(result.percentage).toFixed(0)}%</span>
        </div>
        <p className="eyebrow">Resultado de la entrega</p>
        <h2 id="evaluation-title">{result.passed ? 'Aprobado' : 'Requiere revisión'}</h2>
        <div className="evaluation-feedback-list">
          {result.feedback.map((item) => (
            <article className="evaluation-feedback-item" key={item.question_id}>
              <div className="feedback-heading">
                {item.is_correct ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <strong>{item.is_correct ? 'Respuesta correcta' : 'Respuesta incorrecta'}</strong>
                <span>{item.score_awarded} pts</span>
              </div>
              {item.explanation && <p>{item.explanation}</p>}
            </article>
          ))}
        </div>
        <button type="button" onClick={onClose}>Continuar</button>
      </section>
    </div>
  )
}
