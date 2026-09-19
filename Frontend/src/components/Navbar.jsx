import { useState } from 'react'
import { Bell, GraduationCap, LogOut, Radio, Volume2, VolumeX, X } from 'lucide-react'
import { isMuted, playClick, toggleMuted } from '../lib/sound'

export default function Navbar({ user, role, demoMode = false, onRoleChange, notifications, onProfile, onLogout }) {
  const [open, setOpen] = useState(false)
  const [muted, setMuted] = useState(isMuted)
  const displayName = user?.full_name || 'Alumno Demo'
  const initials = displayName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  const studentUnavailable = !demoMode && user?.role !== 'student'
  const teacherUnavailable = !demoMode && user?.role !== 'teacher'

  return (
    <nav className="nav-shell">
      <div className="brand-lockup">
        <div className="brand-mark"><GraduationCap size={22} /></div>
        <span>Edu<span>Eval</span></span>
      </div>

      <div className="role-switcher" aria-label="Selector de rol">
        <button className={role === 'student' ? 'active student-role' : 'student-role'} onClick={() => onRoleChange('student')} type="button" disabled={studentUnavailable}><i />Estudiante</button>
        <button className={role === 'teacher' ? 'active teacher-role' : 'teacher-role'} onClick={() => onRoleChange('teacher')} type="button" disabled={teacherUnavailable}><i />Docente</button>
      </div>

      <div className="nav-actions">
        <div className="socket-status"><Radio size={14} /><span className="pulse-dot" /> <span className="socket-copy">WebSocket Conectado <b>12ms</b></span></div>
        <button className="icon-button" type="button" aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'} onClick={() => { const next = toggleMuted(); setMuted(next); if (!next) playClick() }}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
        <div className="notification-wrap">
          <button className="icon-button" type="button" aria-label="Notificaciones" onClick={() => setOpen((value) => !value)}><Bell size={19} />{notifications.length > 0 && <em>{notifications.length}</em>}</button>
          {open && <div className="notification-popover"><div className="popover-heading"><strong>Actividad en tiempo real</strong><button type="button" onClick={() => setOpen(false)}><X size={15} /></button></div>{notifications.length === 0 ? <p className="empty-note">No hay eventos nuevos.</p> : notifications.map((item, index) => <div className="notification-item" key={`${item.id || index}-${index}`}><span className="notification-icon"><Bell size={14} /></span><span>{item.text || 'Nueva actividad en EduEval'}<small>{item.time || 'Ahora'}</small></span></div>)}</div>}
        </div>
        <button type="button" className="profile-chip profile-trigger" onClick={onProfile} aria-label="Abrir perfil"><span className="avatar">{initials}</span></button>
        <button type="button" className="nav-logout" onClick={onLogout} aria-label="Cerrar sesión"><LogOut size={15} /><span>Cerrar sesión</span></button>
      </div>
    </nav>
  )
}
