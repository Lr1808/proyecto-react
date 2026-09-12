import { Crown, Flame, Medal, Timer, Trophy, Zap, Award } from 'lucide-react'
import { Avatar, Badge, Card, ProgressBar, StatItem } from './ui'
import { cn } from './cn'

const week = [
  { day: 'L', done: true, fire: false },
  { day: 'M', done: true, fire: true },
  { day: 'X', done: true, fire: false },
  { day: 'J', done: true, fire: true },
  { day: 'V', done: true, fire: false },
  { day: 'S', done: true, fire: true, today: true },
  { day: 'D', done: false, fire: false },
]

const badges = [
  { emoji: '🎨', name: 'Primer Wireframe', state: 'done', xp: '+50 XP' },
  { emoji: '🔥', name: 'Racha de 7 días', state: 'done', xp: '+100 XP' },
  { emoji: '🧠', name: 'Mente Estratega', state: 'done', xp: '+80 XP' },
  { emoji: '🤝', name: 'Colaboradora Top', state: 'done', xp: '+60 XP' },
  { emoji: '🚀', name: 'Lanzamientos', state: 'progress', progress: 8, total: 10, xp: '+120 XP' },
  { emoji: '🏆', name: 'Podio Maestro', state: 'progress', progress: 2, total: 3, xp: '+200 XP' },
  { emoji: '⚡', name: 'Videoclase Veloz', state: 'locked', xp: '+90 XP' },
]

const podium = [
  { name: 'Diego Mendez', xp: 2240, place: 2, height: 'h-16' },
  { name: 'Sofía Alarcón', xp: 1420, place: 1, height: 'h-24', me: true },
  { name: 'Camila Rojas', xp: 1180, place: 3, height: 'h-12' },
]

export default function AchievementsScreen() {
  return <div className="cv-screen-in space-y-4">
    <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-700 to-emerald-900 !border-emerald-900 p-5 text-white">
      <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-14 left-1/3 h-32 w-32 rounded-full bg-emerald-400/15" />
      <div className="relative flex items-center gap-4">
        <div className="relative">
          <Avatar name="Sofía Alarcón" size={68} className="ring-4 ring-white/20" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-extrabold text-amber-900 shadow">⭐ Nivel 5</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="flex items-center gap-1.5 text-lg font-extrabold leading-tight">Sofía Alarcón <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-emerald-400 text-emerald-900"><Medal size={11} className="fill-emerald-900" /></span></h1>
          <p className="mt-0.5 text-[12px] font-semibold text-emerald-200">Rango: Exploradora Pro</p>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold"><Zap size={12} className="fill-amber-300 text-amber-300" /> 1,420 XP</span>
        </div>
      </div>
      <div className="relative mt-4">
        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-100">
          <span>Nivel 6 · Experta Creativa</span>
          <span>580 XP restantes</span>
        </div>
        <ProgressBar value={71} className="mt-1.5 !bg-white/15" barClassName="!bg-gradient-to-r from-amber-300 to-amber-400" />
      </div>
    </Card>

    <div className="grid grid-cols-2 gap-3">
      <StatItem icon={<Flame size={17} className="fill-amber-500" />} valor="7 días" etiqueta="Racha activa" tone="amber" />
      <StatItem icon={<Zap size={17} className="fill-emerald-500" />} valor="1,420" etiqueta="XP totales" />
      <StatItem icon={<Award size={17} />} valor="12 / 18" etiqueta="Insignias" tone="orange" />
      <StatItem icon={<Timer size={17} />} valor="34h" etiqueta="Horas en vivo" tone="slate" />
    </div>

    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-extrabold text-slate-800">Racha semanal perfecta</h2>
        <Badge tone="amber"><FireShield /> 6/7 días</Badge>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {week.map((d) => <div key={d.day} className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">{d.day}</span>
          <span className={cn('flex h-9 w-9 items-center justify-center rounded-full text-[12px] transition-transform', d.done ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25' : 'bg-slate-100 text-slate-300', d.today && 'ring-2 ring-amber-300 ring-offset-1 animate-pulse')}>
            {d.done ? (d.fire ? '🔥' : '✓') : '—'}
          </span>
        </div>)}
      </div>
      <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-700">Completa el Domingo para ganar la insignia "Semana impecable" 👑</p>
    </Card>

    <section>
      <h2 className="mb-3 text-[15px] font-extrabold text-slate-800">Muro de insignias</h2>
      <div className="space-y-2">
        {badges.map((badge) => <Card key={badge.name} className={cn('flex items-center gap-3 p-3 transition-all duration-200 hover:scale-[1.01]', badge.state === 'locked' && 'opacity-55')}>
          <span className={cn('inline-flex h-11 w-11 items-center justify-center rounded-2xl text-xl', badge.state === 'done' ? 'bg-amber-50' : badge.state === 'progress' ? 'bg-emerald-50' : 'bg-slate-50 grayscale')}>{badge.emoji}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-bold text-slate-700">{badge.name}</p>
              {badge.state === 'done' && <Badge tone="emerald"><Trophy size={10} /> Desbloqueada</Badge>}
              {badge.state === 'progress' && <Badge tone="amber">En curso {badge.progress}/{badge.total}</Badge>}
              {badge.state === 'locked' && <Badge tone="slate">Bloqueada</Badge>}
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-400">Recompensa al completar</p>
            <div className="mt-1.5 flex items-center gap-2">
              {badge.state === 'progress' && <ProgressBar value={(badge.progress / badge.total) * 100} className="h-1.5 flex-1" />}
              <span className="inline-flex items-center gap-0.5 text-[11px] font-extrabold text-amber-600"><Zap size={11} className="fill-amber-400" /> {badge.xp}</span>
            </div>
          </div>
        </Card>)}
      </div>
    </section>

    <section>
      <h2 className="mb-3 flex items-center gap-2 text-[15px] font-extrabold text-slate-800"><Trophy size={16} className="text-amber-500" /> Top de la cohorte</h2>
      <Card className="p-4">
        <div className="flex items-end justify-center gap-2">
          {podium.map((p) => <div key={p.name} className={cn('flex flex-1 flex-col items-center gap-2', p.place === 1 && 'order-first flex-[1.15]', p.place === 2 && '-mt-0')}>
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar name={p.name} size={p.me ? 56 : 44} online={p.place === 1} ring={p.me} />
                <span className={cn('absolute -top-2.5 left-1/2 -translate-x-1/2', p.me && 'animate-bounce')}><Crown size={p.me ? 18 : 14} className={p.place === 1 ? 'text-amber-400 fill-amber-400' : 'fill-slate-300 text-slate-300'} /></span>
              </div>
              <p className={cn('mt-1.5 max-w-full truncate text-[11px] font-extrabold', p.me ? 'text-emerald-700' : 'text-slate-600')}>{p.name}</p>
              <span className="text-[10px] font-bold text-slate-400">{p.xp.toLocaleString('es')} XP</span>
            </div>
            <div className={cn('w-full rounded-t-2xl flex items-start justify-center pt-2 font-extrabold', p.height, p.place === 1 ? 'bg-gradient-to-b from-amber-200 to-amber-100 text-amber-700' : p.place === 2 ? 'bg-gradient-to-b from-slate-200 to-slate-100 text-slate-500' : 'bg-gradient-to-b from-orange-200 to-orange-100 text-orange-600')}><Crown size={12} /></div>
          </div>)}
        </div>
      </Card>
    </section>
  </div>
}

function FireShield() {
  return <span role="img" aria-label="fuego protección">🛡️🔥</span>
}