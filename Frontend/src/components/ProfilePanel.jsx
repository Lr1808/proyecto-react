import { useState } from 'react'
import { Award, Check, Flame, LogOut, ShieldCheck, Snowflake, Trophy, X, Zap } from 'lucide-react'
import { ACHIEVEMENTS, computeStreak, freezeStreak, levelProgress, loadStats } from '../lib/gamification'
import { playClick } from '../lib/sound'

export default function ProfilePanel({ user, progress: _progress, onClose, onLogout, onUpdateUser }) {
  const [name, setName] = useState(user?.full_name || 'Alumno Demo')
  const [stats, setStats] = useState(loadStats)
  const level = levelProgress(stats.xp)
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  const requirements = [
    { label: 'Nombre completo', valid: name.trim().length >= 2 },
    { label: 'Correo válido', valid: Boolean(user?.email && user.email.includes('@')) },
    { label: 'Contraseña segura', valid: true },
    { label: 'Mínimo 8 caracteres', valid: true },
    { label: 'Mayúscula y número', valid: true },
  ]

  const saveName = () => {
    const trimmedName = name.trim()
    if (trimmedName && trimmedName.length >= 2 && onUpdateUser) {
      playClick()
      onUpdateUser({ full_name: trimmedName })
    }
  }

  const dateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const activeDays = new Set(stats.activityDays || [])
  const frozenDays = new Set(stats.frozen || [])
  const shownStreak = computeStreak(stats)
  const calendarCells = Array.from({ length: 63 }, (_, index) => {
    const day = new Date()
    day.setDate(day.getDate() + (index - 55))
    const key = dateKey(day)
    return { key, future: index > 55, today: index === 55, active: activeDays.has(key), frozen: frozenDays.has(key) }
  })
  const practicedToday = activeDays.has(dateKey(new Date())) || stats.lastSolve === dateKey(new Date())

  const frozeToday = () => {
    playClick()
    const result = freezeStreak()
    setStats(loadStats())
    window.dispatchEvent(new CustomEvent('edueval:celebration', { detail: { type: 'energy', title: result.ok ? 'Día congelado' : 'No puedes congelar hoy', text: result.ok ? 'Tu racha está protegida hoy. Mañana sigues sin perder el ritmo.' : result.reason } }))
  }

  return <div className="profile-backdrop" role="presentation" onClick={onClose}><section className="profile-panel" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><header><div><span className="eyebrow">MI CUENTA</span><h2>Perfil de aprendizaje</h2></div><button className="icon-button" type="button" onClick={() => { playClick(); onClose() }} aria-label="Cerrar perfil"><X size={17} /></button></header><div className="profile-identity"><span className="profile-large-avatar">{initials}</span><div><h3>{name}</h3><p>{user?.email || 'alumno@demo.local'}</p><span className="profile-role"><ShieldCheck size={13} /> {user?.role === 'teacher' ? 'Docente' : 'Estudiante'}</span></div></div><div className="profile-edit"><label>Nombre de usuario</label><div className="profile-name-row"><input type="text" value={name} onChange={(event) => setName(event.target.value)} /><button type="button" onClick={saveName}><Zap size={13} /> Guardar</button></div></div><div className="profile-stats"><div><Award size={17} /><span>Nivel actual</span><strong>{level.level.label}</strong></div><div><Zap size={17} /><span>Experiencia (XP)</span><strong>{stats.xp}</strong></div><div><Flame size={17} /><span>Racha de práctica</span><strong>{stats.streak} {stats.streak === 1 ? 'día' : 'días'}</strong></div><div><Trophy size={17} /><span>Logros desbloqueados</span><strong>{stats.unlocked.length} / {ACHIEVEMENTS.length}</strong></div></div><div className="profile-progress"><div><span>Progreso hacia {level.next?.label || 'el nivel máximo'}</span><b>{level.next ? `${stats.xp} / ${level.next.from} XP` : 'Máximo alcanzado'}</b></div><div className="progress-track"><span style={{ width: `${Math.min(100, Math.max(4, Math.round(level.ratio * 100)))}%` }} /></div></div><div className="streak-calendar"><div className="streak-cal-head"><div><Flame size={15} /><h4>Calendario de racha</h4></div><strong>{shownStreak} {shownStreak === 1 ? 'día' : 'días'}</strong></div><div className="calendar-grid">{calendarCells.map((cell) => <span key={cell.key} className={cell.active ? 'cal-day active' : cell.frozen ? 'cal-day frozen' : cell.today ? 'cal-day today' : cell.future ? 'cal-day future' : 'cal-day'} title={cell.key} />)}</div><div className="streak-actions"><button type="button" className={frozenDays.size ? 'freeze-button used' : 'freeze-button'} onClick={frozeToday} disabled={practicedToday || frozenDays.has(dateKey(new Date()))}><Snowflake size={13} /> {practicedToday ? 'Ya practicaste hoy' : frozenDays.has(dateKey(new Date())) ? 'Hoy congelado' : 'Congelar hoy'}</button><small>{stats.freezes} congelaciones restantes este mes</small></div>{shownStreak >= 7 && <div className="double-chip"><Flame size={13} /> Doble o nada activo: +50 XP extra en tu próxima entrega.</div>}</div><div className="profile-requirements"><h4>Requisitos de registro</h4><ul>{requirements.map((item) => <li key={item.label} className={item.valid ? 'valid' : ''}><span className="check-pill"><Check size={12} /></span>{item.label}</li>)}</ul></div><button className="profile-logout" type="button" onClick={onLogout}><LogOut size={16} /> Cerrar sesión</button></section></div>
}