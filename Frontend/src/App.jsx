import { useEffect, useRef, useState } from 'react'
import './App.css'
import { supabase } from './lib/supabase'
import Navbar from './components/Navbar'
import StudentDashboard from './components/StudentDashboard'
import TeacherDashboard from './components/TeacherDashboard'
import EduEvalChatbot from './components/EduEvalChatbot'
import ProfilePanel from './components/ProfilePanel'
import AuthScreen from './components/AuthScreen'
import OnboardingModal from './components/OnboardingModal'
import CampusVivo from './campus-vivo/CampusVivo'
import { hasOnboarded } from './lib/gamification'

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true'
const demoAccounts = {
  'student@example.com': { password: 'demo1234', full_name: 'Alumna Demo', role: 'student' },
  'admin@example.com': { password: 'Admin1234!', full_name: 'Admin Principal', role: 'teacher' },
}

export default function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [checking, setChecking] = useState(!SKIP_AUTH)
  const [apiOnline, setApiOnline] = useState(false)
  const [role, setRole] = useState('student')
  const [notifications, setNotifications] = useState([{ text: 'Tu ruta de aprendizaje está al día', time: 'Hoy' }])
  const [authError, setAuthError] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [showDemo, setShowDemo] = useState(() => window.location.hash === '#campus-vivo')
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [progress, setProgress] = useState(null)
  const hasSyncedRole = useRef(false)

  useEffect(() => {
    fetch(`${API_BASE}/health/`).then((response) => setApiOnline(response.ok)).catch(() => setApiOnline(false))
    if (SKIP_AUTH) return undefined
    let mounted = true
    supabase.auth.getSession().then(({ data: { session } }) => { if (mounted) setToken(session?.access_token || '') }).finally(() => { if (mounted) setChecking(false) })
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => { if (mounted) setToken(session?.access_token || '') })
    return () => { mounted = false; subscription.subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (SKIP_AUTH || !token) return undefined
    fetch(`${API_BASE}/auth/me/`, { headers: { Authorization: `Bearer ${token}` } }).then((response) => response.json()).then(setUser).catch(() => setAuthError('No se pudo cargar tu perfil.'))
    return undefined
  }, [token])

  useEffect(() => {
    if (!user || hasSyncedRole.current) return
    setRole(user.role === 'teacher' ? 'teacher' : 'student')
    hasSyncedRole.current = true
  }, [user])

  useEffect(() => {
    if (SKIP_AUTH || !token || role !== 'student') return undefined
    fetch(`${API_BASE}/student/progress/`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).then((response) => response.ok ? response.json() : Promise.reject(new Error('progress'))).then(setProgress).catch(() => {})
    return undefined
  }, [role, token])

  useEffect(() => {
    if (SKIP_AUTH || !token) return undefined
    const websocketUrl = API_BASE.replace(/^http/, 'ws').replace(/\/api$/, '')
    const socket = new WebSocket(`${websocketUrl}/ws/notifications/?token=${encodeURIComponent(token)}`)
    socket.onmessage = (event) => {
      const eventData = JSON.parse(event.data)
      window.dispatchEvent(new CustomEvent('edueval:notification', { detail: eventData }))
      setNotifications((current) => [{ text: eventData.type === 'submission_completed' ? 'Nueva entrega recibida' : 'Nuevo ejercicio publicado', time: 'Ahora' }, ...current].slice(0, 8))
    }
    return () => socket.close()
  }, [token])

  const handleLogout = async () => { if (!SKIP_AUTH) await supabase.auth.signOut(); setUser(null); setToken(''); setRole('student'); hasSyncedRole.current = false }
  const handleLogin = async ({ email, password }) => {
    setAuthError('')
    if (SKIP_AUTH) {
      const account = demoAccounts[email.trim().toLowerCase()]
      if (!account || account.password !== password) {
        throw new Error('Credenciales de demostración no válidas. Usa student@example.com / demo1234 o admin@example.com / Admin1234!')
      }
      setUser({ id: 'demo-user', email: email.trim().toLowerCase(), full_name: account.full_name, role: account.role })
      setRole(account.role)
      setToken('demo-token')
      if (account.role === 'student' && !hasOnboarded()) setShowOnboarding(true)
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    setToken(data.session?.access_token || '')
  }
  const handleSignup = async ({ fullName, email, password }) => {
    setAuthError('')
    if (SKIP_AUTH) {
      throw new Error('El registro en modo demo está deshabilitado. Activa VITE_SKIP_AUTH=false para usar Supabase Auth.')
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) throw new Error(error.message)
    if (data?.user && !data.session) {
      return 'check-email'
    }
    if (data?.session?.access_token) {
      setToken(data.session.access_token)
    }
    return 'ok'
  }
  const handleGoogleLogin = async () => {
    setAuthError('')
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
    if (error) throw new Error(error.message)
  }
  const handleRoleChange = (nextRole) => {
    if (!user || nextRole !== user.role) return
    setRole(nextRole)
  }

  const handleProfileUpdate = (updates) => {
    setUser((current) => ({ ...current, ...updates }))
  }

  useEffect(() => {
    const syncDemo = () => setShowDemo(window.location.hash === '#campus-vivo')
    window.addEventListener('hashchange', syncDemo)
    return () => window.removeEventListener('hashchange', syncDemo)
  }, [])

  if (showDemo) return <CampusVivo />

  if (checking) return <div className="loading-screen"><div className="brand-mark">✦</div><span>Preparando tu espacio de aprendizaje...</span></div>
  if (!user) return <AuthScreen demoMode={SKIP_AUTH} onLogin={async (credentials) => { try { await handleLogin(credentials) } catch (error) { setAuthError(error.message) } }} onSignup={async (credentials) => { try { const result = await handleSignup(credentials); if (result === 'check-email') { setAuthError('Revisa tu correo para confirmar la cuenta antes de continuar.') } } catch (error) { setAuthError(error.message) } }} onGoogleLogin={handleGoogleLogin} error={authError} />

  return <div className="app-frame"><Navbar user={user} role={role} onRoleChange={handleRoleChange} notifications={notifications} onLogout={handleLogout} onProfile={() => setProfileOpen(true)} /><div className="connection-strip"><span className={apiOnline ? 'online-dot' : 'offline-dot'} /> {apiOnline ? 'Django + Supabase conectados' : 'API desconectada'} <span>·</span> Modo {SKIP_AUTH ? 'demo' : 'producción'}</div>{role === 'teacher' ? <TeacherDashboard apiBase={API_BASE} token={token} /> : <StudentDashboard user={user} token={token} apiBase={API_BASE} />}{profileOpen && <ProfilePanel user={user} progress={progress} onClose={() => setProfileOpen(false)} onLogout={handleLogout} onUpdateUser={handleProfileUpdate} />}
    {showOnboarding && <OnboardingModal onFinish={() => setShowOnboarding(false)} />}
    <EduEvalChatbot /></div>
}
