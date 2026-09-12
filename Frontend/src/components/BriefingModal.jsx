import { Clock3, Code2, Map, Play, Target, X } from 'lucide-react'
import { playClick } from '../lib/sound'

const missions = {
  python: { code: 'MÓD-01', station: 'División de Ingeniería', color: '#1e3a2b', memo: 'El módulo de servicios backend reporta fallas intermitentes. Tu función estabiliza flujos de datos en producción con código limpio y validación sólida.' },
  database: { code: 'MÓD-02', station: 'Oficina de Datos', color: '#3e8e5c', memo: 'La tienda central duplica registros y sus reportes tardan. Necesitamos consultas precisas que pongan orden en la información.' },
  react: { code: 'MÓD-03', station: 'Laboratorio de Interfaces', color: '#c86d51', memo: 'Las pantallas del producto pierden estado en cada interacción. Tu misión: arquitecturas de componentes que no sorprendan al usuario.' },
  git: { code: 'MÓD-04', station: 'Centro de Control de Versiones', color: '#b4553c', memo: 'El historial del repositorio está enredado. Debes sanear ramas y mantener una narrativa de cambios legible para todo el equipo.' },
  terminal: { code: 'MÓD-05', station: 'Base de Operaciones', color: '#b4903c', memo: 'Opéra el clúster desde la consola: movimientos seguros, búsquedas certeras y pipelines que ahorran horas cada día.' },
}

const objectiveLabels = {
  MULTIPLE_CHOICE: 'Sitúa la opción correcta',
  BOOLEAN: 'Determina verdadero o falso',
  NUMERICAL: 'Introduce el valor exacto',
  CODE_CHALLENGE: 'Escribe código y haz que pase los casos',
}

export default function BriefingModal({ exercise, onStart, onCancel }) {
  const mission = missions[exercise.category] || missions.python
  const questions = exercise.questions || []
  const objectiveList = [...new Set(questions.map((question) => objectiveLabels[question.question_type]))]
  if (!objectiveList.length) objectiveList.push('Responde cada bloque con precisión')
  const totalPoints = questions.reduce((total, question) => total + Number(question.points || 10), 0) || 20
  const minutes = Number(exercise.time_limit_minutes) || 30

  return <div className="briefing-card">
    <button className="modal-close" type="button" onClick={onCancel} aria-label="Cerrar"><X size={18} /></button>
    <div className="briefing-top">
      <div className="mission-emblem" style={{ background: mission.color }}><Map size={30} /></div>
      <div>
        <span className="eyebrow">CLEMENCIA DE CAMPO · {mission.station.toUpperCase()}</span>
        <h2>{exercise.title}</h2>
        <p className="mission-code">Misión {mission.code} · {exercise.is_exam ? 'EVALUACIÓN FORMAL' : 'ENTRENAMIENTO'}</p>
      </div>
    </div>
    <p className="briefing-memo">{mission.memo}</p>
    <div className="mission-meta">
      <span><Target size={14} /> {questions.length || 4} objetivos</span>
      <span><Code2 size={14} /> {totalPoints} pts estimados</span>
      <span><Clock3 size={14} /> {minutes} min</span>
    </div>
    <div className="objective-list">
      {objectiveList.map((label) => <div className="objective" key={label}><span className="check-pill"><Target size={11} /></span>{label}</div>)}
    </div>
    <div className="briefing-actions">
      <button className="ghost-button" type="button" onClick={onCancel}>Más tarde</button>
      <button className="primary-button" type="button" onClick={() => { playClick(); onStart() }}><Play size={15} />Comenzar misión</button>
    </div>
  </div>
}