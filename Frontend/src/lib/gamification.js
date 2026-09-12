const STATS_KEY = 'edueval:gamification'
const SOLVED_KEY = 'edueval:solved'
const ENERGY_KEY = 'edueval:energy'
const DAILY_KEY = 'edueval:daily'
const ONBOARDING_KEY = 'edueval:onboarded'

export const MAX_ENERGY = 5
const ENERGY_REGEN_MS = 20 * 60 * 1000

const store = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const LEVELS = [
  { key: 'beginner', label: 'Inicial', from: 0 },
  { key: 'intermediate', label: 'Intermedio', from: 300 },
  { key: 'advanced', label: 'Avanzado', from: 800 },
  { key: 'expert', label: 'Experto', from: 1500 },
]

export const ACHIEVEMENTS = [
  { id: 'first_submission', title: 'Primer desafío', description: 'Completa tu primera entrega', icon: 'trophy', color: '#34d399' },
  { id: 'perfect_run', title: 'Ejecución impecable', description: 'Aprueba un ejercicio al 100%', icon: 'star', color: '#fbbf24' },
  { id: 'streak_3', title: 'Racha encendida', description: 'Mantén una racha de 3 días', icon: 'flame', color: '#fb7185' },
  { id: 'exam_slayer', title: 'Cazadora de exámenes', description: 'Aprueba 3 exámenes', icon: 'shield', color: '#fbbf24' },
  { id: 'explorer', title: 'Exploradora de rutas', description: 'Trabaja en 3 categorías distintas', icon: 'map', color: '#22d3ee' },
  { id: 'live_coder', title: 'Código en acción', description: 'Completa un desafío de código', icon: 'code', color: '#6366f1' },
  { id: 'constant', title: 'Constancia', description: 'Acumula 8 entregas', icon: 'target', color: '#a78bfa' },
]

const defaultStats = () => ({
  xp: 0,
  streak: 0,
  bestStreak: 0,
  lastSolve: '',
  activityDays: [],
  frozen: [],
  freezes: 2,
  freezeMonth: todayKey().slice(0, 7),
  certificates: [],
  counterSubmissions: 0,
  counterPerfect: 0,
  counterExams: 0,
  counterCode: 0,
  counterCategories: [],
  unlocked: [],
})

export function loadStats() {
  const base = defaultStats()
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw)
    const month = todayKey().slice(0, 7)
    const freshFreezes = parsed.freezeMonth !== month
    return {
      ...base,
      ...parsed,
      activityDays: Array.isArray(parsed.activityDays) ? parsed.activityDays : [],
      frozen: Array.isArray(parsed.frozen) ? parsed.frozen : [],
      certificates: Array.isArray(parsed.certificates) ? parsed.certificates : [],
      freezes: freshFreezes ? 2 : Number(parsed.freezes) || 0,
      freezeMonth: month,
      counterCategories: Array.isArray(parsed.counterCategories) ? parsed.counterCategories : [],
      unlocked: Array.isArray(parsed.unlocked) ? parsed.unlocked : [],
    }
  } catch {
    return base
  }
}

export function saveStats(stats) {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)) } catch {}
}

export function levelFor(xp) {
  return LEVELS.reduce((current, level) => (xp >= level.from ? level : current), LEVELS[0])
}

export function levelProgress(xp) {
  const current = levelFor(xp)
  const index = LEVELS.indexOf(current)
  const next = LEVELS[index + 1] || null
  if (!next) return { level: current, next: null, ratio: 1 }
  return { level: current, next, ratio: (xp - current.from) / (next.from - current.from) }
}

export function todayKey() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function previousKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() - 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function checkAchievements(stats) {
  const conditions = {
    first_submission: stats.counterSubmissions >= 1,
    perfect_run: stats.counterPerfect >= 1,
    streak_3: stats.bestStreak >= 3,
    exam_slayer: stats.counterExams >= 3,
    explorer: stats.counterCategories.length >= 3,
    live_coder: stats.counterCode >= 1,
    constant: stats.counterSubmissions >= 8,
  }
  return ACHIEVEMENTS.filter((achievement) => conditions[achievement.id])
}

export function awardSolved({ stats, percentage = 0, passed = false, isExam = false, hasCode = false, category = '' }) {
  const current = stats || defaultStats()
  const pct = Math.max(0, Math.min(100, Number(percentage) || 0))
  const xpGain = Math.round(pct) + (passed ? 25 : 0) + (isExam && passed ? 50 : 0)
  const prevLevelIndex = LEVELS.findIndex((level) => level.from <= current.xp)

  const today = todayKey()
  let streak = current.streak || 0
  if (current.lastSolve === today) {
    streak = streak || 1
  } else if (current.lastSolve === previousKey(today)) {
    streak += 1
  } else {
    streak = 1
  }

  const next = {
    ...current,
    xp: current.xp + xpGain,
    streak,
    bestStreak: Math.max(current.bestStreak || 0, streak),
    lastSolve: today,
    activityDays: current.activityDays?.includes(today) ? current.activityDays : [...(current.activityDays || []), today],
    counterSubmissions: (current.counterSubmissions || 0) + 1,
    counterPerfect: passed && pct >= 100 ? (current.counterPerfect || 0) + 1 : current.counterPerfect || 0,
    counterExams: isExam && passed ? (current.counterExams || 0) + 1 : current.counterExams || 0,
    counterCode: hasCode ? (current.counterCode || 0) + 1 : current.counterCode || 0,
    counterCategories: category && !current.counterCategories.includes(category)
      ? [...current.counterCategories, category]
      : current.counterCategories,
  }

  const newly = checkAchievements(next).filter((achievement) => !current.unlocked.includes(achievement.id))
  if (newly.length) next.unlocked = [...current.unlocked, ...newly.map((achievement) => achievement.id)]

  const levelUp = LEVELS.findIndex((level) => level.from <= next.xp) > prevLevelIndex
  const events = []
  if (levelUp) events.push('level_up')
  if (newly.length) events.push('achievement')

  return { stats: next, events, achievements: newly, xpGain, streak }
}

export function loadSolvedMap() {
  try {
    const raw = localStorage.getItem(SOLVED_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function saveSolvedEntry(exerciseId, { percentage = 0, passed = false }) {
  const map = loadSolvedMap()
  const previous = map[exerciseId] || { attempts: 0, percentage: 0, passed: false }
  const entry = {
    attempts: previous.attempts + 1,
    percentage: Math.max(previous.percentage, Number(percentage) || 0),
    passed: previous.passed || passed,
  }
  map[exerciseId] = entry
  try { localStorage.setItem(SOLVED_KEY, JSON.stringify(map)) } catch {}
  return map
}

export function demoLeaderboard(stats, userName = 'Tú') {
  const classmates = [
    { name: 'Valeria Roa', xp: 1240 },
    { name: 'Matías Ferrer', xp: 980 },
    { name: 'Camila Duarte', xp: 760 },
    { name: 'Andrés Molina', xp: 540 },
    { name: 'Sofía Lagos', xp: 320 },
    { name: 'Iván Paredes', xp: 190 },
  ].map((classmate) => ({
    ...classmate,
    streak: 1 + (classmate.xp % 9),
    level: levelFor(classmate.xp).label,
    me: false,
  }))
  const me = { name: userName, xp: stats.xp, streak: stats.streak || 0, level: levelFor(stats.xp).label, me: true }
  const rows = [...classmates, me].sort((a, b) => b.xp - a.xp)
  return rows.map((row, index) => ({ ...row, rank: index + 1 }))
}

export function loadEnergy() {
  const saved = read(ENERGY_KEY, null)
  const now = Date.now()
  if (!saved || typeof saved.current !== 'number') {
    const fresh = { current: MAX_ENERGY, at: now }
    store(ENERGY_KEY, fresh)
    return MAX_ENERGY
  }
  const elapsed = now - saved.at
  const regenerated = Math.min(MAX_ENERGY, saved.current + Math.floor(elapsed / ENERGY_REGEN_MS))
  if (regenerated !== saved.current) {
    store(ENERGY_KEY, { current: regenerated, at: saved.current < regenerated ? now - (elapsed % ENERGY_REGEN_MS) : saved.at })
  }
  return regenerated
}

export function energyInfo() {
  const current = loadEnergy()
  const now = Date.now()
  const saved = read(ENERGY_KEY, { current: MAX_ENERGY, at: now })
  const nextAt = current >= MAX_ENERGY ? 0 : saved.at + ENERGY_REGEN_MS * (Math.floor((now - saved.at) / ENERGY_REGEN_MS) + 1)
  return { current, max: MAX_ENERGY, nextAt, recharged: current >= MAX_ENERGY }
}

export function spendEnergy(amount = 1) {
  const current = loadEnergy()
  if (current < amount) return false
  store(ENERGY_KEY, { current: current - amount, at: Date.now() })
  return true
}

export function computeStreak(stats) {
  const days = new Set(stats.activityDays || [])
  const frozen = new Set(stats.frozen || [])
  let cursor = todayKey()
  if (!days.has(cursor)) cursor = previousKey(cursor)
  let count = 0
  while (true) {
    if (days.has(cursor)) {
      count += 1
      cursor = previousKey(cursor)
      continue
    }
    if (frozen.has(cursor)) {
      cursor = previousKey(cursor)
      continue
    }
    break
  }
  return count
}

export function freezeStreak() {
  const stats = loadStats()
  const today = todayKey()
  if ((stats.activityDays || []).includes(today) || stats.lastSolve === today) {
    return { ok: false, reason: 'Ya practicaste hoy: no hace falta congelar.' }
  }
  if ((stats.freezes || 0) <= 0) return { ok: false, reason: 'Se te acabaron las congelaciones del mes. Vuelven el día 1.' }
  if ((stats.frozen || []).includes(today)) return { ok: false, reason: 'Hoy ya está protegido.' }
  const next = { ...stats, freezes: stats.freezes - 1, frozen: [...(stats.frozen || []), today] }
  saveStats(next)
  return { ok: true, freezes: next.freezes }
}

export function getTodayChallenge(catalog) {
  const items = Array.isArray(catalog) ? catalog : []
  if (!items.length) return null
  const stored = read(DAILY_KEY, null)
  const today = todayKey()
  const exists = stored && stored.date === today && items.some((item) => item.id === stored.exerciseId)
  if (exists) return items.find((item) => item.id === stored.exerciseId)
  const digits = today.replace(/-/g, '')
  const seed = Array.from(digits).reduce((sum, char) => sum + Number(char), 0)
  const exercise = items[seed % items.length]
  store(DAILY_KEY, { date: today, exerciseId: exercise.id, done: false })
  return exercise
}

export function isDailyDone() {
  const stored = read(DAILY_KEY, null)
  return Boolean(stored && stored.date === todayKey() && stored.done)
}

export function getStoredDaily() {
  return read(DAILY_KEY, null)
}

export function completeDailyChallenge() {
  const stored = read(DAILY_KEY, null)
  if (!stored || stored.date !== todayKey() || stored.done) return 0
  const stats = loadStats()
  const next = { ...stats, xp: stats.xp + 30 }
  saveStats(next)
  store(DAILY_KEY, { ...stored, done: true })
  return 30
}

export function unlockCertificates(catalog, solvedMap) {
  const categories = Array.from(new Set((catalog || []).map((item) => item.category).filter(Boolean)))
  return categories.map((category) => {
    const items = (catalog || []).filter((item) => item.category === category)
    const passed = items.filter((item) => Boolean(solvedMap[item.id]?.passed)).length
    return { category, total: items.length, passed }
  })
}

export function hasOnboarded() {
  return localStorage.getItem(ONBOARDING_KEY) === '1'
}

export function completeOnboarding() {
  try { localStorage.setItem(ONBOARDING_KEY, '1') } catch {}
  const stats = loadStats()
  if (stats.xp >= 50) return 0
  const next = { ...stats, xp: stats.xp + 50 }
  saveStats(next)
  return 50
}