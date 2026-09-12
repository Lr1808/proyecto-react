import { CheckCircle2, Lock, Map, Play } from 'lucide-react'

const categoryLabels = { database: 'Base de datos', python: 'Python', react: 'React', git: 'Git', terminal: 'Terminal' }
const order = ['python', 'database', 'react', 'git', 'terminal']

export default function RouteMap({ catalog, attempts, onSelect }) {
  const sections = order
    .map((key) => ({ key, label: categoryLabels[key], items: catalog.filter((item) => item.category === key) }))
    .filter((section) => section.items.length)
  const firstPendingIndex = catalog.findIndex((item) => !attempts[item.id])

  const stateFor = (item) => {
    const index = catalog.findIndex((course) => course.id === item.id)
    if (attempts[item.id]) return 'done'
    if (index === firstPendingIndex) return 'current'
    if (firstPendingIndex !== -1 && index > firstPendingIndex && index <= firstPendingIndex + 4) return 'open'
    return 'locked'
  }

  return <div className="route-map">
    <div className="route-intro"><Map size={16} /> Ruta recomendada · avanza nodo a nodo para desbloquear el siguiente reto</div>
    {sections.map((section) => <section className="route-section" key={section.key}>
      <header className="route-category"><span className={`route-cat-dot cat-${section.key}`} />{section.label}<small>{section.items.filter((item) => attempts[item.id]).length}/{section.items.length}</small></header>
      <div className="route-nodes">
        {section.items.map((item) => {
          const state = stateFor(item)
          const attempt = attempts[item.id]
          return <button className={`route-node ${state}`} key={item.id} type="button" onClick={() => state !== 'locked' && onSelect(item)} disabled={state === 'locked'}>
            <span className="route-icon">{state === 'done' ? <CheckCircle2 size={16} /> : state === 'locked' ? <Lock size={14} /> : <Play size={13} />}</span>
            <span className="route-text">
              <b>{item.title}</b>
              <small>{state === 'done' ? (attempt.passed ? `Aprobado ${attempt.best_percentage}%` : 'Intentado') : state === 'current' ? 'Siguiente parada' : state === 'open' ? 'Disponible' : 'Bloqueado'}</small>
            </span>
          </button>
        })}
      </div>
    </section>)}
  </div>
}