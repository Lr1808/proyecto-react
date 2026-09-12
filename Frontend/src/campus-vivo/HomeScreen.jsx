import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Check, ChevronRight, Clock, Flame, Play, Sparkles, Target, Users, Zap } from 'lucide-react'
import { Avatar, Badge, Button, Card, Chip, ProgressBar, SectionTitle } from './ui'
import { cn } from './cn'

const NIVEL = 5
const NIVEL_PCT = 71

const schedule = [
  { time: '08:00', end: '09:30', title: 'Fundamentos de UX Research', tag: 'CLASE MAGISTRAL', status: 'done', teacher: 'Prof. Ana Lozano', room: 'Aula 204' },
  { time: '10:00', end: '11:30', title: 'Diseño UI/UX con Figma & Prototipado', tag: 'EN VIVO EN 12 MIN', status: 'live', teacher: 'Prof. David Mendoza', room: 'Aula 301' },
  { time: '13:00', end: '14:00', title: 'Prototipos navegables en equipo', tag: 'TALLER PRÁCTICO', status: 'next', teacher: 'Prof. David Mendoza', room: 'Laboratorio 2' },
  { time: '16:30', end: '17:15', title: 'Café & Networking de la cohorte', tag: 'SOCIAL HUB', status: 'next', teacher: 'Comunidad', room: 'Sala Lounge' },
]

const missions = [
  { icon: '🧩', title: 'Completa 3 preguntas de repaso', reward: '+50 XP', time: '5 min', action: 'Iniciar' },
  { icon: '📐', title: 'Entrega wireframes del módulo 2', reward: '+100 XP', time: '20 min', action: 'Entregar' },
  { icon: '🎧', title: 'Escucha el recap de la clase pasada', reward: '+30 XP', time: '8 min', action: 'Iniciar' },
]

const classmates = [
  { name: 'Valentina Ruiz' },
  { name: 'Diego Mendez' },
  { name: 'Camila Rojas' },
  { name: 'Mateo Silva' },
]

function ProgressRing({ value, size = 92, stroke = 9 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return <div className="relative" style={{ width: size, height: size }}>
    <svg width={size} height={size} className="-rotate-90">
      <defs>
        <linearGradient id="cvRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#ECFDF5" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#cvRing)" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-[stroke-dashoffset] duration-700" />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <strong className="text-[15px] font-extrabold leading-none text-slate-800">1.4k</strong>
      <span className="text-[10px] font-bold text-slate-400">/ 2.0k XP</span>
    </div>
  </div>
}

export default function HomeScreen({ onGoLive }) {
  const [dailyDone, setDailyDone] = useState(false)

  useEffect(() => { const id = setTimeout(() => setDailyDone(true), 500); return () => clearTimeout(id) }, [])

  return <div className="cv-screen-in space-y-5">
    <header>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12px] font-semibold text-slate-400">Sábado, 12 de septiembre</p>
          <h1 className="mt-0.5 text-2xl font-extrabold tracking-tight text-slate-800">¡Hola, Sofía! 👋</h1>
        </div>
        <Avatar name="Sofía Alarcón" size={44} online ring />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[12px] font-bold text-amber-700"><Flame size={14} className="fill-amber-500 text-amber-500" /> 7 días de racha</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[12px] font-bold text-emerald-700"><Zap size={14} className="fill-emerald-500 text-emerald-500" /> +180 XP hoy</span>
      </div>
    </header>

    <Card className="p-4">
      <div className="flex items-center gap-4">
        <ProgressRing value={dailyDone ? 67 : 0} />
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-600">Meta de hoy</span>
          <p className="mt-0.5 text-sm font-bold text-slate-700">2/3 clases completadas</p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Nivel {NIVEL} · Exploradora Pro</span>
            <span className="text-emerald-600">{NIVEL_PCT}%</span>
          </div>
          <ProgressBar value={NIVEL_PCT} className="mt-1.5 h-2" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-2xl bg-slate-50 p-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm"><Target size={15} /></span>
        <p className="text-[12px] font-semibold text-slate-500">Te faltan <b className="text-slate-700">1 clase</b> para completar tu meta diaria</p>
      </div>
    </Card>

    <Card className="overflow-hidden">
      <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-800 p-4 text-white">
        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 left-10 h-28 w-28 rounded-full bg-emerald-400/20" />
        <div className="relative flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> En vivo en 12 min
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] font-bold text-emerald-50"><Clock size={13} /> 10:00 AM</span>
        </div>
        <h2 className="relative mt-3 text-[17px] font-extrabold leading-snug">Diseño UI/UX con Figma &amp; Prototipado</h2>
        <div className="relative mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar name="David Mendoza" size={36} ring />
            <div>
              <p className="text-[13px] font-bold">Prof. David Mendoza</p>
              <p className="text-[11px] font-semibold text-emerald-100">Docente de producto digital</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold"><Users size={12} /> 38 en espera</span>
        </div>
      </div>
      <div className="p-3">
        <Button size="lg" className="w-full" onClick={onGoLive}><Play size={17} className="fill-white" /> Entrar a la Sala Virtual</Button>
      </div>
    </Card>

    <section>
      <SectionTitle title="Horario de hoy" action={<span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600"><CalendarDays size={13} /> 4 clases</span>} />
      <div className="relative pl-6">
        <span className="absolute left-[9px] top-2 bottom-2 w-0.5 rounded-full bg-slate-200" />
        <ul className="space-y-3">
          {schedule.map((item) => {
            const live = item.status === 'live'
            const done = item.status === 'done'
            return <li key={item.time} className="relative">
              <span className={cn('absolute -left-6 top-4 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2', live ? 'border-emerald-500 bg-emerald-500' : done ? 'border-emerald-300 bg-emerald-100' : 'border-slate-200 bg-white')}>
                {done ? <Check size={10} className="text-emerald-600" strokeWidth={4} /> : live ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
              </span>
              <Card className={cn('p-3 transition-all duration-200 hover:scale-[1.01]', live && 'border-emerald-200 shadow-[0_10px_30px_rgb(16,185,129,0.15)]', item.status === 'next' && 'opacity-70')}>
                <div className="flex items-center justify-between gap-2">
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide', live ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400')}>{item.tag}</span>
                  <span className="text-[11px] font-bold text-slate-400">{item.time} – {item.end}</span>
                </div>
                <h3 className="mt-1.5 text-[13px] font-bold leading-snug text-slate-700">{item.title}</h3>
                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{item.teacher} · {item.room}</p>
              </Card>
            </li>
          })}
        </ul>
      </div>
    </section>

    <section>
      <SectionTitle title="Misiones rápidas" action={<Badge tone="amber"><Sparkles size={11} /> +180 XP disponibles</Badge>} />
      <div className="cv-no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
        {missions.map((mission) => <Card key={mission.title} className="w-[230px] shrink-0 snap-start p-3.5 transition-all duration-200 hover:scale-[1.02]">
          <div className="flex items-start justify-between">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-lg">{mission.icon}</span>
            <Badge tone="amber"><Zap size={11} className="fill-amber-500" /> {mission.reward}</Badge>
          </div>
          <p className="mt-3 text-[13px] font-bold leading-snug text-slate-700">{mission.title}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400"><Clock size={12} /> {mission.time}</span>
            <Button size="sm" variant={mission.action === 'Entregar' ? 'dark' : 'soft'} className="px-3.5">{mission.action} <ArrowRight size={13} /></Button>
          </div>
        </Card>)}
      </div>
    </section>

    <section>
      <SectionTitle title="Compañeros conectados" action={<span className="text-[11px] font-bold text-emerald-600">12 en línea</span>} />
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-3">
            {classmates.map((mate) => <Avatar key={mate.name} name={mate.name} size={40} online className="transition-transform duration-200 hover:-translate-y-1" />)}
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[11px] font-extrabold text-slate-500">+8</span>
          </div>
          <Chip className="pointer-events-none">Estudiando ahora</Chip>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm"><Clock size={18} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-slate-700">Sala de estudio Pomodoro</p>
            <p className="text-[11px] font-semibold text-orange-500">25 min · enfoque grupal</p>
          </div>
          <Button size="sm" variant="dark" className="bg-orange-500 shadow-orange-500/25">Unirme <ChevronRight size={13} /></Button>
        </div>
      </Card>
    </section>
  </div>
}
