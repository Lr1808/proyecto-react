import { cn } from './cn'

const avatarPalettes = [
  'from-emerald-400 to-emerald-600',
  'from-amber-300 to-orange-500',
  'from-sky-400 to-indigo-500',
  'from-fuchsia-400 to-pink-500',
  'from-teal-400 to-emerald-600',
  'from-rose-400 to-orange-400',
]

export function Avatar({ name = 'Campus Vivo', size = 40, online = false, ring = false, className = '' }) {
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  const palette = avatarPalettes[name.length % avatarPalettes.length]
  return <span className={cn('relative inline-flex shrink-0', className)} style={{ width: size, height: size }}>
    <span className={cn('inline-flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br font-bold text-white', palette, ring && 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-white')} style={{ fontSize: size * 0.34 }}>
      {initials}
    </span>
    {online && <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />}
  </span>
}

export function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return <Tag className={cn('rounded-3xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]', className)} {...props}>{children}</Tag>
}

export function Badge({ tone = 'emerald', className = '', children }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    slate: 'bg-slate-50 text-slate-500 border-slate-100',
    dark: 'bg-emerald-900 text-white border-emerald-900',
  }
  return <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold leading-none', tones[tone], className)}>{children}</span>
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
    dark: 'bg-emerald-800 text-white shadow-lg shadow-emerald-800/20',
    soft: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    white: 'bg-white text-emerald-700 border border-emerald-100 shadow-sm',
    ghost: 'bg-slate-50 text-slate-500 hover:bg-slate-100',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-[12px] rounded-full',
    md: 'px-4 py-2.5 text-sm rounded-full',
    lg: 'px-5 py-3.5 text-[15px] rounded-2xl',
  }
  return <button
    type="button"
    className={cn('inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-50', variants[variant], sizes[size], className)}
    {...props}
  >{children}</button>
}

export function ProgressBar({ value = 0, className = '', barClassName = '' }) {
  return <div className={cn('h-2.5 w-full overflow-hidden rounded-full bg-slate-100', className)}>
    <div className={cn('h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-[width] duration-500', barClassName)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
}

export function StatItem({ icon, valor, etiqueta, tone = 'emerald' }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    orange: 'bg-orange-50 text-orange-600',
    slate: 'bg-slate-50 text-slate-500',
  }
  return <Card className="flex flex-col gap-2 p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_12px_36px_rgb(16,185,129,0.12)]">
    <span className={cn('inline-flex h-9 w-9 items-center justify-center rounded-xl', tones[tone])}>{icon}</span>
    <strong className="text-xl font-extrabold text-slate-800">{valor}</strong>
    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{etiqueta}</span>
  </Card>
}

export function SectionTitle({ title, action }) {
  return <div className="mb-3 flex items-center justify-between">
    <h2 className="text-[15px] font-extrabold text-slate-800">{title}</h2>
    {action}
  </div>
}

export function Chip({ active = false, onClick, className = '', children, ...props }) {
  return <button
    type="button"
    onClick={onClick}
    className={cn('shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-bold transition-all duration-200 active:scale-[0.97]', active ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' : 'border-slate-100 bg-white text-slate-500 hover:border-emerald-200 hover:text-emerald-600', className)}
    {...props}
  >{children}</button>
}
