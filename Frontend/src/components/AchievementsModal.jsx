import { Award, Code2, Flame, Lock, Map, ShieldCheck, Star, Target, Trophy, X } from 'lucide-react'
import { ACHIEVEMENTS, checkAchievements } from '../lib/gamification'
import { playClick } from '../lib/sound'

const iconFor = {
  first_submission: Trophy,
  perfect_run: Star,
  streak_3: Flame,
  exam_slayer: ShieldCheck,
  explorer: Map,
  live_coder: Code2,
  constant: Target,
}

export default function AchievementsModal({ stats, onClose }) {
  const unlocked = stats.unlocked || []
  const nextGoal = checkAchievements(stats).find((achievement) => !unlocked.includes(achievement.id))

  return <div className="modal-backdrop" role="presentation" onClick={onClose}>
    <section className="panel-modal panel-wide" role="dialog" aria-modal="true" aria-labelledby="achievements-title" onClick={(event) => event.stopPropagation()}>
      <button className="modal-close" type="button" onClick={() => { playClick(); onClose() }} aria-label="Cerrar logros"><X size={18} /></button>
      <header className="panel-head">
        <div><span className="eyebrow"><Award size={13} /> LOGROS</span><h2 id="achievements-title">Insignias de dominio</h2><p>{unlocked.length} de {ACHIEVEMENTS.length} desbloqueados{nextGoal ? ` · siguiente: ${nextGoal.title}` : ' · colección completa'}</p></div>
      </header>
      <div className="achievement-grid">
        {ACHIEVEMENTS.map((achievement) => {
          const Icon = iconFor[achievement.id]
          const isUnlocked = unlocked.includes(achievement.id)
          return <article className={`achievement-card ${isUnlocked ? '' : 'locked'}`} key={achievement.id}>
            <span className="achievement-icon" style={{ color: isUnlocked ? achievement.color : undefined, background: isUnlocked ? `${achievement.color}22` : undefined }}>{Icon ? <Icon size={19} /> : <Award size={19} />}</span>
            <b>{achievement.title}</b>
            <p>{achievement.description}</p>
            {!isUnlocked && <span className="lock-hint"><Lock size={11} /> Sigue practicando para desbloquearlo</span>}
          </article>
        })}
      </div>
      <button className="primary-button full-button" type="button" onClick={() => { playClick(); onClose() }}>Volver al tablero</button>
    </section>
  </div>
}