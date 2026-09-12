import { useState } from 'react'
import { ArrowRight, ChevronDown, Check, Download, Lock, Search, Star, Timer } from 'lucide-react'
import { Badge, Button, Card, Chip, ProgressBar, SectionTitle } from './ui'
import { cn } from './cn'

const filters = ['En Curso', 'Completados', 'Favoritos']
const filterCounts = { 'En Curso': 3, Completados: 5, Favoritos: 0 }

const courses = [
  { title: 'UI/UX Design System', desc: 'Domina tokens, componentes y modo claro/oscuro', progress: 68, lessons: '14/21', current: 'Lección 12: Tokens avanzados', active: true },
  { title: 'Métodos de Investigación UX', desc: 'Entrevistas, journey maps y validación', progress: 100, lessons: '10/10' },
  { title: 'Fundamentos de Diseño Visual', desc: 'Color, tipografía, jerarquía y composición', progress: 100, lessons: '8/8' },
  { title: 'Prototipado en Figma', desc: 'Wireframes, componentes y auto-layout', progress: 100, lessons: '6/6' },
  { title: 'Accesibilidad Digital', desc: 'WCAG, contraste y navegación por teclado', progress: 100, lessons: '5/5' },
]

const modules = [
  { title: 'Módulo 1: Fundamentos', status: 'done', lessons: [{ name: '¿Qué es un Design System?', time: '22 min', done: true }, { name: 'Principios de consistencia', time: '18 min', done: true }, { name: 'Ejercicio práctico', time: '15 min', done: true }] },
  { title: 'Módulo 2: Tokens de Diseño', status: 'active', lessons: [{ name: 'Tipos de tokens', time: '28 min', done: true }, { name: 'Color scales y alias', time: '24 min', active: true }, { name: 'Implementación en código', time: '30 min', locked: true }, { name: 'Laboratorio Figma', time: '25 min', locked: true }] },
  { title: 'Módulo 3: Componentes', status: 'locked', lessons: [{ name: 'Button & variants', time: '20 min', locked: true }, { name: 'Card & Surface', time: '18 min', locked: true }] },
]

const resources = [
  { icon: '📄', title: 'Plantilla Tokens.pdf', size: '2.4 MB' },
  { icon: '🎨', title: 'Figma Library.fig', size: '5.1 MB' },
  { icon: '📊', title: 'Checklist Accesibilidad.pdf', size: '1.1 MB' },
]

function CourseCard({ course }) {
  return <Card className={cn('overflow-hidden transition-all duration-200 hover:scale-[1.01]', course.active && 'ring-2 ring-emerald-500/40 shadow-[0_12px_36px_rgb(16,185,129,0.14)]')}>
    <div className="relative h-28 bg-gradient-to-br from-emerald-500 to-emerald-700">
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute bottom-3 left-3.5 flex items-center gap-2">
        {course.active ? <Badge tone="dark"><Star size={10} className="fill-current" /> En progreso</Badge> : <Badge tone="emerald"><Check size={10} /> Completado</Badge>}
        <span className="text-[11px] font-bold text-white/80">{course.lessons} lecciones</span>
      </div>
      <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white backdrop-blur"><Star size={16} /></div>
    </div>
    <div className="p-3.5">
      <h3 className="text-[15px] font-extrabold text-slate-800">{course.title}</h3>
      <p className="mt-0.5 text-[12px] font-medium text-slate-400">{course.desc}</p>
      {course.progress > 0 && <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>Progreso</span>
          <span className={course.progress === 100 ? 'text-emerald-500' : 'text-emerald-600'}>{course.progress}%</span>
        </div>
        <ProgressBar value={course.progress} className="mt-1.5" />
      </div>}
      {course.current && <p className="mt-3 truncate text-[12px] font-semibold text-emerald-600">→ {course.current}</p>}
    </div>
    {course.active && <div className="px-3.5 pb-3.5"><Button size="lg" className="w-full">Continuar Lección <ArrowRight size={15} /></Button></div>}
  </Card>
}

function ModuleAccordion({ module: mod }) {
  const [open, setOpen] = useState(mod.status === 'active')
  const done = mod.status === 'done'
  const active = mod.status === 'active'
  const locked = mod.status === 'locked'

  return <Card className={cn('overflow-hidden transition-all', active && 'ring-1 ring-emerald-200')}>
    <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-3 p-3.5 text-left transition-colors hover:bg-slate-50/50">
      <span className={cn('inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold', done ? 'bg-emerald-500 text-white' : active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400')}>
        {done ? <Check size={14} strokeWidth={3} /> : mod.lessons.length}
      </span>
      <span className="min-w-0 flex-1">
        <p className={cn('text-[13px] font-bold', locked ? 'text-slate-400' : 'text-slate-700')}>{mod.title}</p>
        <p className="text-[11px] font-semibold text-slate-400">{mod.lessons.length} lecciones</p>
      </span>
      {!locked && <ChevronDown size={16} className={cn('text-slate-400 transition-transform duration-200', open && 'rotate-180')} />}
    </button>
    <div className="cv-accordion" style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr' }}>
      <div className="min-h-0 overflow-hidden">
        <ul className="border-t border-slate-100 bg-slate-50/50 px-3.5 py-2">
          {mod.lessons.map((lesson) => <li key={lesson.name} className="flex items-center gap-3 py-2.5">
            <span className={cn('inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold', lesson.done ? 'border-emerald-400 bg-emerald-500 text-white' : lesson.active ? 'border-emerald-400 bg-white text-emerald-600' : 'border-slate-200 bg-white text-slate-300')}>
              {lesson.done ? <Check size={10} strokeWidth={3} /> : lesson.locked ? <Lock size={9} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className={cn('truncate text-[12px] font-bold', lesson.locked ? 'text-slate-400' : lesson.active ? 'text-emerald-700' : 'text-slate-600')}>{lesson.name}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400"><Timer size={11} /> {lesson.time}</span>
          </li>)}
        </ul>
      </div>
    </div>
  </Card>
}

export default function CoursesScreen() {
  const [filter, setFilter] = useState('En Curso')
  const [query, setQuery] = useState('')

  const filtered = courses.filter((c) => {
    if (filter === 'En Curso' && !c.active) return false
    if (filter === 'Completados' && c.progress !== 100) return false
    if (filter === 'Favoritos') return false
    if (query && !c.title.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return <div className="cv-screen-in space-y-4">
    <div className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar cursos..." className="h-11 w-full rounded-2xl border border-slate-100 bg-white pl-10 pr-4 text-[13px] font-medium text-slate-700 shadow-sm placeholder:text-slate-300 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 focus:outline-none" />
    </div>

    <div className="cv-no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-1">
      {filters.map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
        {f}{filterCounts[f] != null && ` (${filterCounts[f]})`}
      </Chip>)}
    </div>

    {filtered.length > 0 ? filtered.map((course) => <CourseCard key={course.title} course={course} />) : <Card className="p-8 text-center"><p className="text-[13px] font-semibold text-slate-400">No hay cursos que coincidan</p></Card>}

    {filter === 'En Curso' && <>
      <SectionTitle title="Estructura del curso" />
      <div className="space-y-2">
        {modules.map((mod) => <ModuleAccordion key={mod.title} module={mod} />)}
      </div>
    </>}

    <section>
      <SectionTitle title="Recursos descargables" />
      <div className="space-y-2">
        {resources.map((res) => <Card key={res.title} className="flex items-center gap-3 p-3 transition-all duration-200 hover:scale-[1.01]">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-xl">{res.icon}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-slate-700">{res.title}</p>
            <p className="text-[11px] font-semibold text-slate-400">{res.size}</p>
          </div>
          <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100"><Download size={15} /></button>
        </Card>)}
      </div>
    </section>
  </div>
}
