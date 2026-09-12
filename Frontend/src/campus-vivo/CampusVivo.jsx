import { useEffect, useState } from 'react'
import { ArrowUp, BookOpen, ChevronLeft, Flame, GraduationCap, LayoutGrid, Trophy, Video } from 'lucide-react'
import './campus-vivo.css'
import { Avatar } from './ui'
import { cn } from './cn'
import HomeScreen from './HomeScreen'
import LiveScreen from './LiveScreen'
import CoursesScreen from './CoursesScreen'
import AchievementsScreen from './AchievementsScreen'

const tabs = [
  { key: 'home', label: 'Inicio', icon: LayoutGrid },
  { key: 'live', label: 'En Vivo', icon: Video, live: true },
  { key: 'courses', label: 'Mis Cursos', icon: BookOpen },
  { key: 'achievements', label: 'Logros', icon: Trophy },
]

export default function CampusVivo() {
  const [tab, setTab] = useState('home')

  useEffect(() => { window.scrollTo({ top: 0 }) }, [tab])

  function exitDemo() {
    window.location.hash = ''
  }

  return <div className="cv-root relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#F8FAFC] text-slate-800">
    <header className="sticky top-0 z-30 border-b border-slate-100/80 bg-[#F8FAFC]/85 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-white shadow-md shadow-emerald-500/30">
            <GraduationCap size={18} />
            <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#F8FAFC] bg-white text-emerald-600"><ArrowUp size={9} strokeWidth={3} /></span>
          </span>
          <span className="text-[14px] font-extrabold tracking-tight text-slate-800">CAMPUS <span className="text-emerald-600">VIVO</span></span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[12px] font-extrabold text-amber-600"><Flame size={13} className="fill-amber-400" /> 7</span>
          <Avatar name="Sofía Alarcón" size={36} online ring />
          <button type="button" onClick={exitDemo} aria-label="Salir de la demo de Campus Vivo" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"><ChevronLeft size={17} /></button>
        </div>
      </div>
    </header>

    <main className="flex-1 px-4 pb-32 pt-4">
      {tab === 'home' && <HomeScreen onGoLive={() => setTab('live')} />}
      {tab === 'live' && <LiveScreen />}
      {tab === 'courses' && <CoursesScreen />}
      {tab === 'achievements' && <AchievementsScreen />}
    </main>

    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-slate-100 bg-white/95 pb-[max(env(safe-area-inset-bottom),8px)] backdrop-blur-md">
      <div className="grid grid-cols-4 px-2 pt-2">
        {tabs.map((item) => {
          const Icon = item.icon
          const active = tab === item.key
          return <button key={item.key} type="button" onClick={() => setTab(item.key)} className={cn('group relative flex flex-col items-center gap-1 rounded-2xl py-2 transition-all duration-200 active:scale-95', active ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600')}>
            <span className={cn('relative inline-flex items-center justify-center rounded-2xl px-4 py-1 transition-colors duration-200', active && 'bg-emerald-50')}>
              <Icon size={21} strokeWidth={active ? 2.4 : 2} />
              {item.live && <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-red-500" />}
            </span>
            <span className={cn('text-[10px] transition-colors duration-200', active ? 'font-extrabold' : 'font-semibold')}>{item.label}</span>
            {active && <span className="absolute -top-0.5 h-1 w-6 rounded-full bg-emerald-500" />}
          </button>
        })}
      </div>
    </nav>
  </div>
}