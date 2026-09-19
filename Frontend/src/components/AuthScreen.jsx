import { useState } from 'react'
import { ArrowRight, GraduationCap, LockKeyhole, Mail, Sparkles, UserRound } from 'lucide-react'

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z" />
    <path fill="#FBBC05" d="M5.27 14.29a7.19 7.19 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
  </svg>
)

export default function AuthScreen({ demoMode, onLogin, onSignup, onGoogleLogin, error }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [requestedRole, setRequestedRole] = useState('student')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [localError, setLocalError] = useState('')
  const displayError = error || localError

  const submit = async (event) => {
    event.preventDefault()
    setLocalError('')
    if (isSignup) {
      if (!fullName.trim()) throw new Error('Debes indicar tu nombre completo.')
      if (!email.trim()) throw new Error('Debes escribir un correo electrónico.')
      if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.')
      if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) throw new Error('La contraseña debe incluir mayúsculas y números.')
      if (password !== confirmPassword) throw new Error('Las contraseñas no coinciden.')
      if (!acceptTerms) throw new Error('Debes aceptar los términos y condiciones para continuar.')
    }
    setLoading(true)
    try {
      if (isSignup && onSignup) {
        await onSignup({ fullName: fullName.trim(), email: email.trim(), password, role: requestedRole })
      } else {
        await onLogin({ email: email.trim(), password })
      }
    } catch (submitError) {
      setLocalError(submitError.message || 'No se pudo completar la acción.')
    } finally {
      setLoading(false)
    }
  }

  const googleSubmit = async () => {
    setGoogleLoading(true)
    try { if (onGoogleLogin) await onGoogleLogin() } finally { setGoogleLoading(false) }
  }

  return <main className="auth-page">
    <div className="auth-decoration auth-decoration-one" />
    <div className="auth-decoration auth-decoration-two" />
    <section className="auth-card">
      <div className="auth-brand"><span className="brand-mark"><GraduationCap size={23} /></span><strong>Edu<span>Eval</span></strong></div>
      <div className="auth-heading"><span className="eyebrow"><Sparkles size={13} /> AULA INTELIGENTE</span><h1>{isSignup ? 'Crea tu cuenta' : 'Vuelve a tu ruta de aprendizaje.'}</h1><p>{isSignup ? 'Completa tus datos para empezar con una cuenta segura y profesional.' : 'Continúa tus ejercicios, exámenes y desafíos de código desde cualquier lugar.'}</p></div>
      <div className="auth-toggle"><button type="button" className={!isSignup ? 'active' : ''} onClick={() => { setIsSignup(false); setLocalError('') }}>Iniciar sesión</button><button type="button" className={isSignup ? 'active' : ''} onClick={() => { setIsSignup(true); setLocalError('') }} disabled={demoMode}>Registrarse</button></div>
      <form className="auth-form" onSubmit={submit}>
        <div className="auth-fields">
          {isSignup && <label><span>Nombre completo</span><div className="auth-input"><UserRound size={16} /><input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Tu nombre completo" required /></div></label>}
          {isSignup && <div className="auth-role-field"><span>¿Cómo usarás EduEval?</span><div className="auth-role-options"><button type="button" className={requestedRole === 'student' ? 'active' : ''} onClick={() => setRequestedRole('student')}><UserRound size={15} /><b>Estudiante</b><small>Practicar y avanzar</small></button><button type="button" className={requestedRole === 'teacher' ? 'active' : ''} onClick={() => setRequestedRole('teacher')}><GraduationCap size={15} /><b>Docente</b><small>Crear y evaluar</small></button></div></div>}
          <label><span>Correo electrónico</span><div className="auth-input"><Mail size={16} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="correo@ejemplo.com" required /></div></label>
          <label><span>Contraseña</span><div className="auth-input"><LockKeyhole size={16} /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo 8 caracteres" required /></div></label>
          {isSignup && <label><span>Confirmar contraseña</span><div className="auth-input"><LockKeyhole size={16} /><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repite tu contraseña" required /></div></label>}
        </div>
        {isSignup && <div className="auth-password-rules"><ul><li>8 caracteres mínimo</li><li>una mayúscula</li><li>al menos un número</li></ul></div>}
        {isSignup && <label className="auth-terms"><input type="checkbox" checked={acceptTerms} onChange={(event) => setAcceptTerms(event.target.checked)} /><span>Acepto los términos y condiciones.</span></label>}
        {displayError && <div className="auth-error">{displayError}</div>}
        <button className="auth-submit" type="submit" disabled={loading}>{loading ? 'Procesando...' : isSignup ? 'Crear cuenta' : 'Iniciar sesión'} <ArrowRight size={16} /></button>
      </form>
      <div className="auth-divider"><span>o continúa con</span></div>
      <button className="auth-google" type="button" onClick={googleSubmit} disabled={googleLoading}><GoogleIcon /> {googleLoading ? 'Conectando...' : 'Continuar con Google'}</button>
      {demoMode && <p className="auth-footnote">Demo: student@example.com / demo1234<br />Docente: admin@example.com / Admin1234!</p>}
    </section>
  </main>
}
