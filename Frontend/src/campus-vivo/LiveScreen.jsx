import { useEffect, useRef, useState } from 'react'
import { ArrowUp, BookOpen, Mic, MicOff, Minimize2, Pin, Play, Send, Smile, Video, VideoOff, Volume2 } from 'lucide-react'
import { Avatar, Card } from './ui'
import { cn } from './cn'

const reactions = [
  { emoji: '👏', label: 'Bravo', count: 19 },
  { emoji: '💡', label: 'Idea', count: 34 },
  { emoji: '🔥', label: 'Genial', count: 62 },
  { emoji: '❤️', label: 'Amor', count: 28 },
  { emoji: '🚀', label: 'Impulsado', count: 41 },
]

const chatHistory = [
  { id: 1, user: 'Prof. Mendoza', role: 'DOCENTE', text: 'Hoy vamos a construir un design token real para un proyecto. Pregunten en cualquier momento.', time: '10:02' },
  { id: 2, user: 'Diego Mendez', text: '¿Qué uso preferimos: colores base o escalas?', time: '10:04' },
  { id: 3, user: 'Camila Rojas', text: '¿Podemos ver un ejemplo rápido en Figma?', time: '10:05' },
  { id: 4, user: 'Prof. Mendoza', role: 'DOCENTE', text: 'Buena pregunta, Diego. Yo prefiero escalas porque te dan consistencia automática.', time: '10:06' },
  { id: 5, user: 'Tú', self: true, text: '¿Cómo seleccionas los tokens de tipografía?', time: '10:07' },
  { id: 6, user: 'Valentina Ruiz', text: 'Yo uso la escala de tipo modular, 1.250 ratio.', time: '10:08' },
]

const materials = [
  { icon: '📄', title: 'Guía Design Tokens.pdf', size: '2.4 MB' },
  { icon: '🎨', title: 'Plantilla Figma Tokens.fig', size: '5.1 MB' },
  { icon: '📊', title: 'Ejemplos Calificaciones.pdf', size: '1.8 MB' },
]

const faqQuestions = [
  { user: 'Mateo Silva', text: '¿Los tokens de sombra también van en el theme?', votes: 6 },
  { user: 'Diego Mendez', text: '¿Cuál es la diferencia entre modo claro y oscuro en tokens?', votes: 3 },
  { user: 'Camila Rojas', text: '¿Cómo migrar tokens existentes a un sistema?', votes: 1 },
]

function ReactionButton({ emoji, label, initialCount, onReact }) {
  const [count, setCount] = useState(initialCount)
  const [popping, setPopping] = useState(false)
  const [fly, setFly] = useState(false)

  function handleClick() {
    setCount((v) => v + 1)
    setPopping(true)
    setFly(true)
    onReact?.()
    setTimeout(() => setPopping(false), 360)
    setTimeout(() => setFly(false), 900)
  }

  return <button type="button" onClick={handleClick} className="relative flex h-9 items-center gap-1.5 rounded-full border border-slate-100 bg-white px-3 text-[13px] font-bold text-slate-600 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:text-emerald-600 active:scale-95" aria-label={`Reaccionar con ${label}`}>
    <span className={popping ? 'cv-reaction-pop inline-block' : 'inline-block'}>{emoji}</span>
    <span>{count}</span>
    {fly && <span className="cv-fly-up absolute -top-2 left-1/2 -translate-x-1/2 text-sm font-extrabold text-emerald-500">+1</span>}
  </button>
}

export default function LiveScreen() {
  const [mic, setMic] = useState(true)
  const [cam, setCam] = useState(true)
  const [hand, setHand] = useState(false)
  const [tab, setTab] = useState('chat')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(chatHistory)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, tab])

  function sendMessage() {
    if (!input.trim()) return
    setMessages((list) => [...list, { id: Date.now(), user: 'Tú', self: true, text: input.trim(), time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) }])
    setInput('')
  }

  const tabs = [
    { key: 'chat', label: 'Chat en Vivo', dot: true },
    { key: 'qa', label: 'Q&A', count: 5 },
    { key: 'materials', label: 'Materiales', icon: BookOpen },
  ]

  return <div className="cv-screen-in space-y-3">
    <div className="flex items-center justify-between rounded-2xl bg-slate-800 px-4 py-2.5">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-extrabold text-white uppercase"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> En vivo</span>
        <span className="text-[12px] font-semibold text-slate-300">48 conectados</span>
      </div>
      <div className="flex items-center gap-1.5">
        <button type="button" onClick={() => setMic((v) => !v)} className={cn('inline-flex h-8 w-8 items-center justify-center rounded-xl transition-colors', mic ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white')}>{mic ? <Mic size={15} /> : <MicOff size={15} />}</button>
        <button type="button" onClick={() => setCam((v) => !v)} className={cn('inline-flex h-8 w-8 items-center justify-center rounded-xl transition-colors', cam ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white')}>{cam ? <Video size={15} /> : <VideoOff size={15} />}</button>
        <button type="button" onClick={() => setHand((v) => !v)} className={cn('inline-flex h-8 w-8 items-center justify-center rounded-xl transition-colors', hand ? 'bg-amber-400 text-amber-900' : 'bg-white/10 text-white hover:bg-white/20')} aria-label="Levantar mano"><ArrowUp size={16} strokeWidth={2.5} /></button>
      </div>
    </div>

    <Card className="relative overflow-hidden !bg-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-slate-900 to-slate-900">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h2 className="text-[22px] font-extrabold text-white/95">Design Tokens en Figma</h2>
          <p className="mt-1 text-sm font-semibold text-slate-400">Tema: Modo claro & tokens de color</p>
        </div>
        <div className="absolute bottom-12 left-10 h-12 w-12 rounded-full border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-lg shadow-emerald-500/30" />
        <div className="absolute bottom-8 left-4 rounded-2xl bg-black/70 px-3 py-2 backdrop-blur">
          <p className="text-[11px] font-bold text-emerald-400">— La interfaz usa jerarquía tipográfica y sistema de tokens de color.</p>
        </div>
      </div>
      <div className="relative h-52 w-full sm:h-60">
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-bold text-white/90 backdrop-blur">1080p HD</span>
      </div>
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-2xl bg-black/50 px-3 py-2 backdrop-blur">
        <div className="relative">
          <Avatar name="Prof. Mendoza" size={36} />
          <span className="cv-voice absolute inset-0 rounded-full border-2 border-emerald-400" />
        </div>
        <div>
          <p className="text-[12px] font-bold text-white">Prof. Mendoza</p>
          <div className="flex items-center gap-1.5">
            <Volume2 size={12} className="text-emerald-400" />
            <span className="text-[10px] font-semibold text-emerald-300">Voz activa</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 right-3 flex gap-1.5">
        <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-black/50 text-white/80 backdrop-blur transition-colors hover:bg-black/70"><Minimize2 size={14} /></button>
      </div>
    </Card>

    <div className="cv-no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
      {reactions.map((r) => <ReactionButton key={r.emoji} emoji={r.emoji} label={r.label} initialCount={r.count} />)}
    </div>

    <div className="mt-1">
      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
        {tabs.map((t) => <button key={t.key} type="button" onClick={() => setTab(t.key)} className={cn('relative flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-bold transition-all duration-200', tab === t.key ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600')}>
          {t.label}
          {t.dot && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
          {t.count != null && <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-50 px-1.5 text-[10px] font-extrabold text-emerald-600">{t.count}</span>}
        </button>)}
      </div>
    </div>

    {tab === 'chat' && <div className="space-y-3">
      <Card className="border-l-4 !border-l-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 !shadow-amber-100/50 p-3">
        <div className="flex items-center gap-2"><Pin size={13} className="rotate-45 text-amber-500" /><span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-600">Mensaje fijado del Tutor</span></div>
        <p className="mt-1.5 text-[12px] font-semibold text-amber-900/80">Hoy cerramos el módulo de tokens: complete el brief de Figma antes de las 2 PM para obtener +50 XP extra.</p>
      </Card>
      <div className="space-y-2.5">
        {messages.map((msg) => <div key={msg.id} className={cn('flex gap-2', msg.self ? 'justify-end' : 'justify-start')}>
          <div className={cn('max-w-[80%] rounded-2xl px-3.5 py-2.5', msg.self ? 'rounded-br-md bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : msg.role === 'DOCENTE' ? 'rounded-bl-md border border-emerald-100 bg-emerald-50' : 'rounded-bl-md bg-slate-100')}>
            {!msg.self && <div className="mb-1 flex items-center gap-1.5">
              <span className="text-[12px] font-bold text-slate-700">{msg.user}</span>
              {msg.role === 'DOCENTE' && <span className="rounded bg-emerald-800 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">Docente</span>}
            </div>}
            <p className={cn('text-[13px] leading-relaxed', msg.self ? 'text-white' : 'text-slate-600')}>{msg.text}</p>
            <p className={cn('mt-1 text-[10px] font-semibold', msg.self ? 'text-emerald-100 text-right' : 'text-slate-400')}>{msg.time}</p>
          </div>
        </div>)}
        <div ref={bottomRef} />
      </div>
    </div>}

    {tab === 'qa' && <div className="space-y-2">
      {faqQuestions.map((q, i) => <Card key={i} className="flex items-start gap-3 p-3">
        <div className="flex flex-col items-center gap-0.5 pt-0.5">
          <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100"><ArrowUp size={13} strokeWidth={3} /></button>
          <span className="text-[12px] font-extrabold text-slate-700">{q.votes}</span>
        </div>
        <div>
          <p className="text-[12px] font-bold text-slate-500">{q.user}</p>
          <p className="text-[13px] font-bold text-slate-700 leading-snug">{q.text}</p>
        </div>
      </Card>)}
      <p className="text-center text-[12px] font-semibold text-slate-400">Las preguntas con más votos se responden primero por el docente.</p>
    </div>}

    {tab === 'materials' && <div className="space-y-2">
      {materials.map((m) => <Card key={m.title} className="flex items-center gap-3 p-3 transition-all duration-200 hover:scale-[1.01]">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xl">{m.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-slate-700">{m.title}</p>
          <p className="text-[11px] font-semibold text-slate-400">{m.size}</p>
        </div>
        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100"><Play size={15} /></button>
      </Card>)}
    </div>}

    {tab === 'chat' && <div className="sticky bottom-0 mt-2 flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-lg shadow-slate-200/80 ring-1 ring-slate-100">
      <button type="button" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-500"><Smile size={17} /></button>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} placeholder="Haz una pregunta o comenta..." className="min-h-[36px] flex-1 bg-transparent text-[13px] font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none" />
      <button type="button" disabled={!input.trim()} onClick={sendMessage} className={cn('inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-95', input.trim() ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600' : 'bg-slate-100 text-slate-300')}><Send size={15} /></button>
    </div>}
  </div>
}
