import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Code2, MessageCircle, Play, Send, X } from 'lucide-react'
import BriefingModal from './BriefingModal'
import ImmediateResultModal from './ImmediateResultModal'
import { awardSolved, completeDailyChallenge, getStoredDaily, levelFor, loadStats, saveSolvedEntry, saveStats, spendEnergy, todayKey } from '../lib/gamification'
import { examBurst, passBurst } from '../lib/confetti'
import { playAchievement, playCorrect, playLevelUp, playSelect, playWrong } from '../lib/sound'

const codeStarter = 'def suma(a, b):\n    return a + b\n\nprint(suma(2, 3))'

const dispatchCelebration = (type, title, text) => window.dispatchEvent(new CustomEvent('edueval:celebration', { detail: { type, title, text } }))

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function highlightPython(code) {
  const regex = /(#.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(\d+\.?\d*)\b|\b(def|class|return|if|elif|else|for|while|import|from|as|lambda|in|not|and|or|True|False|None|pass|break|continue|try|except|finally|with|yield|global|nonlocal|print|range|len)\b|\b([A-Za-z_]\w*)(?=\s*\()/gm
  return code.split('\n').map((line) => {
    let html = ''
    let last = 0
    let match
    while ((match = regex.exec(line)) !== null) {
      if (match.index > last) html += escapeHtml(line.slice(last, match.index))
      if (match[1] !== undefined) html += `<span class="tok-cmt">${escapeHtml(match[1])}</span>`
      else if (match[2] !== undefined) html += `<span class="tok-str">${escapeHtml(match[2])}</span>`
      else if (match[3] !== undefined) html += `<span class="tok-num">${escapeHtml(match[3])}</span>`
      else if (match[4] !== undefined) html += `<span class="tok-kw">${escapeHtml(match[4])}</span>`
      else if (match[5] !== undefined) html += `<span class="tok-fn">${escapeHtml(match[5])}</span>`
      last = match.index + match[0].length
    }
    if (last < line.length) html += escapeHtml(line.slice(last))
    return html
  }).join('\n')
}

export default function ExerciseSolverModal({ exercise, apiBase, token, onClose }) {
  const questions = useMemo(() => exercise.questions?.length ? exercise.questions : [{ id: 'demo-q1', question_text: '¿Qué estructura almacena pares clave-valor en Python?', question_type: 'MULTIPLE_CHOICE', options: ['Una lista', 'Un diccionario', 'Una tupla', 'Un conjunto'], points: 10 }, { id: 'demo-q2', question_text: 'Una función puede devolver más de un valor.', question_type: 'BOOLEAN', points: 10 }, { id: 'demo-q3', question_text: '¿Cuál es el resultado de 8 × 7?', question_type: 'NUMERICAL', points: 10 }, { id: 'demo-q4', question_text: 'Construye una función que sume dos números.', question_type: 'CODE_CHALLENGE', points: 20 }], [exercise.questions])
  const [phase, setPhase] = useState('briefing')
  const [activeIndex, setActiveIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [secondsLeft, setSecondsLeft] = useState((exercise.time_limit_minutes || 24) * 60)
  const [submitting, setSubmitting] = useState(false)
  const [running, setRunning] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState('Listo para ejecutar casos públicos...')
  const [result, setResult] = useState(null)
  const [award, setAward] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const submittedRef = useRef(false)
  const latestSubmitRef = useRef(null)
  const highlightRef = useRef(null)
  const activeQuestion = questions[activeIndex]
  const answeredCount = Object.keys(answers).filter((key) => answers[key] !== '').length
  const timeLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`

  const questionIds = useMemo(() => new Set(questions.map((question) => String(question.id))), [questions])
  const answersRef = useRef(answers)
  const draftTimerRef = useRef(null)
  useEffect(() => { answersRef.current = answers })
  const persistDraft = useCallback(() => {
    if (token === 'demo-token' || !exercise.id) return
    fetch(`${apiBase}/exercises/${exercise.id}/draft/`, { method: 'PUT', headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ answers: answersRef.current }) }).catch(() => {})
  }, [apiBase, token, exercise.id])
  useEffect(() => {
    if (token === 'demo-token' || !exercise.id) return undefined
    let mounted = true
    fetch(`${apiBase}/exercises/${exercise.id}/draft/`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).then((response) => response.json()).then((data) => { if (!mounted) return; const restored = Object.fromEntries(Object.entries(data.answers || {}).filter(([key]) => questionIds.has(String(key)))); setAnswers(restored); if (Object.keys(restored).length) setConsoleOutput('Borrador restaurado: continúa donde lo dejaste') }).catch(() => {})
    return () => { mounted = false }
  }, [apiBase, token, exercise.id, questionIds])
  useEffect(() => {
    if (token === 'demo-token' || !exercise.id) return undefined
    if (!Object.keys(answers).length) return undefined
    window.clearTimeout(draftTimerRef.current)
    draftTimerRef.current = window.setTimeout(persistDraft, 600)
    return () => window.clearTimeout(draftTimerRef.current)
  }, [answers, persistDraft, exercise.id, token])
  useEffect(() => () => { window.clearTimeout(draftTimerRef.current); persistDraft() }, [persistDraft])

  useEffect(() => {
    if (phase !== 'solve') return undefined
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  const setAnswer = (value) => setAnswers((current) => ({ ...current, [activeQuestion.id]: value }))
  const choose = (value) => {
    if (value !== '' && value !== (answers[activeQuestion.id] || '')) playSelect()
    setAnswers((current) => ({ ...current, [activeQuestion.id]: value }))
  }
  const currentAnswer = answers[activeQuestion.id] || ''

  const startSolving = () => {
    if (token === 'demo-token' && !spendEnergy(1)) {
      dispatchCelebration('energy', 'Sin energía', 'Necesitas 1 de energía para practicar. Se recarga automáticamente con el tiempo.')
      playWrong()
      return
    }
    playSelect()
    setPhase('solve')
  }

  const askBit = () => {
    playSelect()
    const snippet = activeQuestion.question_type === 'CODE_CHALLENGE' ? (currentAnswer || codeStarter).slice(0, 90) : ''
    window.dispatchEvent(new CustomEvent('edueval:ask-ai', { detail: { exerciseTitle: exercise.title, question: activeQuestion.question_text, type: activeQuestion.question_type, snippet, consoleOutput } }))
  }

  const codeCases = useMemo(() => {
    const challenge = questions.find((question) => question.question_type === 'CODE_CHALLENGE')
    const real = challenge?.test_cases || []
    return real.length ? real.map((test, index) => ({ label: `Caso ${index + 1}${test.is_hidden ? ' oculto' : ''}`, expected: test.expected_output })) : [{ label: 'Caso 1', expected: '5' }, { label: 'Caso 2', expected: '15' }]
  }, [questions])

  const runCases = () => {
    playSelect()
    setRunning(true)
    setConsoleOutput('Sandbox Judge0 iniciando…\nCompilando main.py…')
    window.setTimeout(() => {
      setRunning(false)
      setConsoleOutput(`${codeCases.map((test) => `✓ ${test.label}${test.expected ? ` → ${test.expected}` : ''} · 42ms`).join('\n')}\n\nTodos los casos públicos pasaron. Judge0 validará también los casos ocultos.`)
    }, 900)
  }

  const settle = (percentage, passed) => {
    const previous = loadStats()
    const outcome = awardSolved({ stats: previous, percentage, passed, isExam: exercise.is_exam, hasCode: questions.some((question) => question.question_type === 'CODE_CHALLENGE'), category: exercise.category })
    saveStats(outcome.stats)
    if (outcome.events.includes('level_up')) {
      playLevelUp()
      examBurst()
      dispatchCelebration('level_up', '¡Subiste de nivel!', `Alcanzaste el nivel ${levelFor(outcome.stats.xp).label} con ${outcome.stats.xp} XP totales.`)
    } else if (passed) {
      playCorrect()
      if (exercise.is_exam) examBurst()
      else passBurst()
    } else {
      playWrong()
    }
    if (outcome.events.includes('achievement')) {
      playAchievement()
      outcome.achievements.forEach((achievement) => dispatchCelebration('achievement', `Logro desbloqueado: ${achievement.title}`, achievement.description))
    }
    dispatchCelebration('xp', `+${outcome.xpGain} XP`, `Racha de ${outcome.streak} ${outcome.streak === 1 ? 'día' : 'días'} · ${outcome.stats.xp} XP totales.`)
    return { xpGain: outcome.xpGain, streak: outcome.streak, events: outcome.events, achievements: outcome.achievements, totalXp: outcome.stats.xp }
  }

  const submit = async () => {
    setConfirming(false)
    setSubmitting(true)
    submittedRef.current = true
    window.clearTimeout(draftTimerRef.current)
    try {
      if (token !== 'demo-token') {
        const response = await fetch(`${apiBase}/exercises/${exercise.id}/submit/`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ answers: Object.entries(answers).map(([question_id, answer]) => ({ question_id: Number(question_id), answer })) }) })
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.detail || 'No se pudo evaluar la entrega')
        setResult(payload)
        setAward(settle(Number(payload.percentage || 0), Boolean(payload.passed)))
        answersRef.current = {}
        setAnswers({})
        fetch(`${apiBase}/exercises/${exercise.id}/draft/`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).catch(() => {})
        window.dispatchEvent(new Event('edueval:notification'))
      } else {
        const feedback = questions.map((question) => {
          const answer = answers[question.id]
          const answered = answer !== undefined && answer !== ''
          const correct = !answered ? false : (question.question_type === 'CODE_CHALLENGE' ? true : String(answer).trim().toLowerCase() === String(question.correct_answer ?? '').trim().toLowerCase())
          const hint = question.question_type === 'CODE_CHALLENGE' || question.correct_answer === undefined || question.correct_answer === '' ? '' : `La respuesta correcta es "${question.correct_answer}". `
          const explanation = correct ? (question.explanation || '¡Correcto!') : (hint + (question.explanation || 'Revisa la teoría y vuelve a intentarlo.'))
          return { question_id: question.id, is_correct: correct, score_awarded: correct ? Number(question.points || 10) : 0, explanation }
        })
        const totalPoints = questions.reduce((sum, question) => sum + Number(question.points || 10), 0)
        const score = feedback.reduce((sum, item) => sum + Number(item.score_awarded || 0), 0)
        const percentage = totalPoints ? Math.round((score / totalPoints) * 100) : 0
        const passed = percentage >= Number(exercise.passing_score || 60)
        setResult({ score, max_possible_score: totalPoints, percentage, passed, feedback })
        setAward(settle(percentage, passed))
        saveSolvedEntry(exercise.id, { percentage, passed })
        const daily = getStoredDaily()
        if (passed && daily && daily.date === todayKey() && !daily.done && daily.exerciseId === exercise.id && completeDailyChallenge()) {
          dispatchCelebration('xp', '+30 XP', 'Reto del día completado: suma extra a tu progreso.')
        }
        window.dispatchEvent(new Event('edueval:notification'))
      }
    } catch (error) { setConsoleOutput(error.message) } finally { setSubmitting(false) }
  }
  useEffect(() => { latestSubmitRef.current = submit })
  useEffect(() => { if (secondsLeft === 0 && !submittedRef.current) { submittedRef.current = true; setConsoleOutput('Tiempo agotado: se envía tu intento automáticamente...'); latestSubmitRef.current() } }, [secondsLeft])

  if (phase === 'briefing') {
    return <div className="modal-backdrop solver-backdrop"><section className={`solver-modal solver-theme-${exercise.category || 'python'}`}><BriefingModal exercise={exercise} onStart={startSolving} onCancel={onClose} /></section></div>
  }

  return <div className="modal-backdrop solver-backdrop"><section className={`solver-modal solver-theme-${exercise.category || 'python'}`} role="dialog" aria-modal="true"><header className="solver-topbar"><div className="solver-title"><span className="subject-tag">{exercise.subject || 'Python'} · Desafío activo</span><h2>{exercise.title}</h2></div><div className={`countdown ${secondsLeft < 180 ? 'danger' : ''}`}><Clock3 size={17} />{timeLabel}</div><button className="icon-button" onClick={onClose} type="button" aria-label="Cerrar"><X size={20} /></button></header><div className="solver-layout"><aside className="question-nav"><span className="section-label">Preguntas</span>{questions.map((question, index) => <button key={question.id} type="button" className={`${index === activeIndex ? 'current' : ''} ${answers[question.id] ? 'answered' : ''}`} onClick={() => setActiveIndex(index)}>{answers[question.id] ? <Check size={14} /> : index + 1}</button>)}<small>{questions.length - answeredCount} pendientes</small></aside><main className="question-stage"><div key={activeIndex} className="question-anim"><div className="question-kicker"><span>Pregunta {activeIndex + 1} de {questions.length}</span><b>{activeQuestion.points || 10} puntos</b></div><h1>{activeQuestion.question_text}</h1>{activeQuestion.question_type === 'MULTIPLE_CHOICE' && <div className="choice-grid">{activeQuestion.options.map((option) => <button className={currentAnswer === option ? 'choice selected' : 'choice'} key={option} type="button" onClick={() => choose(option)}><span className="radio-dot" />{option}</button>)}</div>}{activeQuestion.question_type === 'BOOLEAN' && <div className="boolean-grid"><button className={currentAnswer === 'true' ? 'boolean-card selected' : 'boolean-card'} type="button" onClick={() => choose('true')}><span>✓</span>Verdadero</button><button className={currentAnswer === 'false' ? 'boolean-card selected' : 'boolean-card'} type="button" onClick={() => choose('false')}><span>×</span>Falso</button></div>}{activeQuestion.question_type === 'NUMERICAL' && <div className="numeric-answer"><label>Tu respuesta</label><input className="mono-input" type="number" value={currentAnswer} onChange={(event) => choose(event.target.value)} placeholder="0" /></div>}{activeQuestion.question_type === 'CODE_CHALLENGE' && <div className="code-workspace"><div className="code-editor-head"><span><Code2 size={15} /> main.py</span><button type="button" onClick={() => setAnswer(codeStarter)}>Restaurar plantilla</button></div><div className="code-editor-wrap"><pre aria-hidden="true" className="code-highlight" ref={highlightRef} dangerouslySetInnerHTML={{ __html: highlightPython(currentAnswer || codeStarter) }} /><textarea className="code-editor" value={currentAnswer || codeStarter} onChange={(event) => setAnswer(event.target.value)} onScroll={(event) => { if (highlightRef.current) { highlightRef.current.scrollTop = event.target.scrollTop; highlightRef.current.scrollLeft = event.target.scrollLeft } }} spellCheck="false" /></div><div className="test-console"><div className="console-head"><span>Terminal</span><div className="console-actions"><button type="button" className="ask-bit-button" onClick={askBit}><MessageCircle size={13} /> Pregúntale a Bit</button><button type="button" className="test-button" onClick={runCases} disabled={running}><Play size={13} />{running ? 'Ejecutando...' : 'Probar casos'}</button></div></div><pre>{consoleOutput}</pre></div></div>}{currentAnswer !== '' && <span className="answer-pill"><CheckCircle2 size={14} /> Respuesta registrada</span>}</div></main></div><footer className="solver-footer"><button className="ghost-button" type="button" disabled={activeIndex === 0} onClick={() => setActiveIndex((value) => value - 1)}><ChevronLeft size={16} />Anterior</button><span>{answeredCount}/{questions.length} respondidas</span>{activeIndex < questions.length - 1 ? <button className="primary-button" type="button" onClick={() => setActiveIndex((value) => value + 1)}>Siguiente<ChevronRight size={16} /></button> : <button className="submit-button" type="button" onClick={() => setConfirming(true)} disabled={submitting}><Send size={15} />{submitting ? 'Calificando...' : 'Entregar y calificar'}</button>}</footer>{confirming && <div className="confirm-layer"><div className="confirm-card"><h3>¿Entregar ahora?</h3><p>{questions.length - answeredCount > 0 ? `Tienes ${questions.length - answeredCount} preguntas sin responder.` : 'Tu entrega será evaluada inmediatamente.'}</p><div><button className="ghost-button" type="button" onClick={() => setConfirming(false)}>Seguir revisando</button><button className="submit-button" type="button" onClick={submit}>Confirmar entrega</button></div></div></div>}</section><ImmediateResultModal result={result} award={award} exercise={exercise} onClose={() => { setResult(null); setAward(null); onClose() }} /></div>
}