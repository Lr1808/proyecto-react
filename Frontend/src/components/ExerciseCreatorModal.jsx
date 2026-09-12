import { useState } from 'react'
import { Code2, FileQuestion, Plus, X } from 'lucide-react'

const categories = { 'Python · Fundamentos': 'python', 'React · Hooks': 'react', 'Base de datos': 'database', Git: 'git', Terminal: 'terminal' }

export default function ExerciseCreatorModal({ onClose, onCreated, apiBase, token }) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('Python · Fundamentos')
  const [questionType, setQuestionType] = useState('MULTIPLE_CHOICE')
  const [questions, setQuestions] = useState([{ id: 1, text: '' }])
  const [saving, setSaving] = useState(false)
  const addQuestion = () => setQuestions((current) => [...current, { id: Date.now(), text: '' }])
  const updateQuestion = (id, text) => setQuestions((current) => current.map((item) => item.id === id ? { ...item, text } : item))
  const publish = async () => {
    setSaving(true)
    const payload = {
      title: title || 'Nuevo desafío', description: 'Ejercicio publicado desde EduEval.', category: categories[subject], difficulty: 'easy', programming_language: 'python', time_limit_minutes: 30, passing_score: 60,
      questions: questions.map((question) => ({ question_text: question.text || 'Pregunta nueva', question_type: questionType, options: [], correct_answer: '', points: 10, explanation: '' })),
    }
    try {
      if (token !== 'demo-token') {
        const response = await fetch(`${apiBase}/exercises/`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
        if (!response.ok) throw new Error('No se pudo publicar el ejercicio')
      }
      onCreated?.({ title: payload.title, subject })
      onClose()
    } finally { setSaving(false) }
  }
  return <div className="modal-backdrop"><section className="creator-modal" role="dialog" aria-modal="true"><header><div><span className="eyebrow">NUEVO CONTENIDO</span><h2>Subir ejercicio</h2></div><button className="icon-button" onClick={onClose} type="button"><X size={19} /></button></header><div className="creator-grid"><label>Título del ejercicio<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Recursividad aplicada" /></label><label>Materia<select value={subject} onChange={(event) => setSubject(event.target.value)}>{Object.keys(categories).map((category) => <option key={category}>{category}</option>)}</select></label><label>Tiempo límite<input type="number" defaultValue="30" /></label><label>Puntaje de aprobación<input type="number" defaultValue="60" /></label></div><div className="creator-section-head"><div><span className="section-label">Preguntas</span><p>Combina teoría y práctica en una misma entrega.</p></div><button className="ghost-button" type="button" onClick={addQuestion}><Plus size={15} /> Agregar pregunta</button></div>{questions.map((question, index) => <article className="creator-question" key={question.id}><div className="question-number">{index + 1}</div><div className="creator-question-body"><div className="question-type-row"><select value={questionType} onChange={(event) => setQuestionType(event.target.value)}><option value="MULTIPLE_CHOICE">Opción múltiple</option><option value="BOOLEAN">Verdadero / Falso</option><option value="NUMERICAL">Numérica</option><option value="CODE_CHALLENGE">Desafío de código</option></select><span>{questionType === 'CODE_CHALLENGE' ? <><Code2 size={14} /> Judge0</> : <><FileQuestion size={14} /> Teórica</>}</span></div><input value={question.text} onChange={(event) => updateQuestion(question.id, event.target.value)} placeholder="Escribe el enunciado de la pregunta..." /><div className="creator-inline"><input placeholder="Respuesta correcta" /><input type="number" defaultValue="10" placeholder="Puntos" /><input placeholder="Retroalimentación" /></div></div></article>)}<footer><button className="ghost-button" type="button" onClick={onClose}>Cancelar</button><button className="primary-button" type="button" onClick={publish} disabled={saving}>{saving ? 'Publicando...' : 'Publicar ejercicio inmediatamente'}</button></footer></section></div>
}
