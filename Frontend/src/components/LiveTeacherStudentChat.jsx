import { useEffect, useRef, useState } from 'react'
import { CheckCheck, MessageSquare, Send, Users, X } from 'lucide-react'
import { playClick, playSelect } from '../lib/sound'

const DEMO_STORAGE_KEY = 'edueval:live_chat_messages'

const DEFAULT_DEMO_MESSAGES = [
  {
    id: 'msg-1',
    sender_role: 'student',
    sender_name: 'Alumna Demo',
    receiver_name: 'Prof. Luis',
    text: '¡Hola Profesor Luis! Tengo una consulta sobre el ejercicio de inversión de cadenas en Python.',
    time: '10:14',
    timestamp: Date.now() - 300000,
  },
  {
    id: 'msg-2',
    sender_role: 'teacher',
    sender_name: 'Prof. Luis',
    receiver_name: 'Alumna Demo',
    text: '¡Hola Alumna! Claro que sí, recuerda usar slicing [::-1] o la función reversed(). ¿Qué error te aparece?',
    time: '10:16',
    timestamp: Date.now() - 180000,
  },
]

export default function LiveTeacherStudentChat({ user, role, token, apiBase, demoMode = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(DEMO_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return DEFAULT_DEMO_MESSAGES
  })

  const [inputMessage, setInputMessage] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)

  const activePartner = role === 'teacher' ? 'Alumna Demo' : 'Prof. Luis'
  const messagesEndRef = useRef(null)

  // Save to localStorage in demo mode and dispatch event across tabs/components
  const persistDemoMessages = (newMessages) => {
    setMessages(newMessages)
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(newMessages))
    } catch {}
    window.dispatchEvent(new CustomEvent('edueval:live_chat_sync', { detail: newMessages }))
  }

  // Listen for sync events from role switching or cross-tab
  useEffect(() => {
    const handleSync = (event) => {
      if (event.detail && Array.isArray(event.detail)) {
        setMessages(event.detail)
      }
    }
    window.addEventListener('edueval:live_chat_sync', handleSync)
    return () => window.removeEventListener('edueval:live_chat_sync', handleSync)
  }, [])

  // Auto scroll messages to bottom when updated
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Backend REST polling fallback when logged in with auth token
  useEffect(() => {
    if (demoMode || !token) return undefined

    const fetchMessages = () => {
      fetch(`${apiBase}/chat/messages/`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map((m) => ({
              id: m.id,
              sender_role: m.sender?.role || 'student',
              sender_name: m.sender?.full_name || 'Usuario',
              text: m.message_text,
              time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestamp: new Date(m.created_at).getTime(),
            }))
            setMessages(mapped)
          }
        })
        .catch(() => {})
    }

    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [apiBase, token, demoMode])

  // Send message handler
  const handleSendMessage = (e) => {
    e.preventDefault()
    const text = inputMessage.trim()
    if (!text) return

    playClick()
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender_role: role,
      sender_name: user?.full_name || (role === 'teacher' ? 'Prof. Luis' : 'Alumna Demo'),
      receiver_name: activePartner,
      text,
      time: timeStr,
      timestamp: now.getTime(),
    }

    const updated = [...messages, newMsg]
    persistDemoMessages(updated)
    setInputMessage('')

    // Send to REST API if in non-demo mode
    if (!demoMode && token) {
      fetch(`${apiBase}/chat/messages/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message_text: text }),
      }).catch(() => {})
    }
  }

  const toggleChat = () => {
    if (!isOpen) {
      playSelect()
      setUnreadCount(0)
    } else {
      playClick()
    }
    setIsOpen((v) => !v)
  }

  const isTeacherView = role === 'teacher'
  const partnerTitle = isTeacherView ? 'Alumna Demo' : 'Prof. Luis (Docente)'

  return (
    <div className="live-chat-container">
      {/* Floating Toggle Button */}
      <button
        type="button"
        className={`live-chat-launcher ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label="Abrir Chat en Directo"
      >
        <MessageSquare size={22} />
        {unreadCount > 0 && <span className="live-chat-badge">{unreadCount}</span>}
        <span className="live-chat-pulse" />
      </button>

      {/* Floating Chat Drawer Panel */}
      {isOpen && (
        <div className="live-chat-panel">
          {/* Header */}
          <header className="live-chat-header">
            <div className="live-chat-user-info">
              <span className="live-chat-avatar">
                {isTeacherView ? 'AD' : 'PL'}
              </span>
              <div>
                <strong>{partnerTitle}</strong>
                <small className="live-chat-status">
                  <span className="online-dot" /> En línea · Chat Directo
                </small>
              </div>
            </div>

            <button
              type="button"
              className="live-chat-close-btn"
              onClick={toggleChat}
              aria-label="Cerrar chat"
            >
              <X size={18} />
            </button>
          </header>

          {/* Quick Role / Contact Notice */}
          <div className="live-chat-role-notice">
            <Users size={13} />
            <span>
              Sesión activa como: <b>{isTeacherView ? 'Docente (Prof. Luis)' : 'Estudiante (Alumna Demo)'}</b>
            </span>
          </div>

          {/* Message Stream */}
          <div className="live-chat-body">
            {messages.length === 0 ? (
              <div className="live-chat-empty">
                <MessageSquare size={32} />
                <p>No hay mensajes en esta conversación. ¡Envía una duda o saludo para comenzar!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender_role === role
                return (
                  <div
                    key={msg.id}
                    className={`live-msg-bubble ${isMine ? 'mine' : 'theirs'} ${msg.sender_role}`}
                  >
                    <div className="live-msg-header">
                      <span className="live-msg-author">{msg.sender_name}</span>
                      <span className="live-msg-role-tag">
                        {msg.sender_role === 'teacher' ? 'Docente 👨‍🏫' : 'Estudiante 🎓'}
                      </span>
                    </div>

                    <p className="live-msg-text">{msg.text}</p>

                    <div className="live-msg-footer">
                      <small className="live-msg-time">{msg.time}</small>
                      {isMine && <CheckCheck size={13} className="live-msg-check" />}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Response Chips */}
          <div className="live-chat-chips">
            {isTeacherView ? (
              <>
                <button
                  type="button"
                  onClick={() => setInputMessage('¡Reviso tu entrega enseguida y te doy retroalimentación!')}
                >
                  ¡Reviso tu entrega!
                </button>
                <button
                  type="button"
                  onClick={() => setInputMessage('Recuerda verificar las pruebas de código en la consola.')}
                >
                  Verifica las pruebas
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setInputMessage('Tengo una duda con las pruebas automáticas del desafío.')}
                >
                  Duda en el desafío
                </button>
                <button
                  type="button"
                  onClick={() => setInputMessage('¡Ya pude resolver el ejercicio! Muchas gracias.')}
                >
                  ¡Ya lo resolví!
                </button>
              </>
            )}
          </div>

          {/* Input Bar */}
          <form className="live-chat-input-bar" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder={isTeacherView ? 'Responder a estudiante...' : 'Escribe tu mensaje o duda al docente...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button type="submit" aria-label="Enviar mensaje">
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
