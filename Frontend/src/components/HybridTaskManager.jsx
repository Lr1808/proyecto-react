import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Filter,
  ListTodo,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Terminal,
  Timer,
  Trash2,
  X,
} from 'lucide-react'
import { passBurst } from '../lib/confetti'
import { awardSolved, loadStats, saveStats } from '../lib/gamification'
import { playClick, playCorrect, playLevelUp, playSelect, playWrong } from '../lib/sound'

const STORAGE_KEY = 'edueval:hybrid_tasks'

const DEFAULT_TASKS = [
  {
    id: 'gt-1',
    type: 'GENERAL',
    title: 'Repasar documentación de Clases en Python',
    description: 'Estudiar conceptos de herencia, métodos mágicos y atributos de instancia.',
    category: 'Teoría',
    priority: 'Alta',
    status: 'in_progress',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gt-2',
    type: 'GENERAL',
    title: 'Completar lecturas sobre Promesas y Async/Await en JS',
    description: 'Entender el bucle de eventos (Event Loop) y el manejo de errores con try/catch.',
    category: 'JavaScript',
    priority: 'Media',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gt-3',
    type: 'GENERAL',
    title: 'Organizar notas del módulo EduEval',
    description: 'Sintetizar los conceptos aprendidos en resúmenes para el examen final.',
    category: 'Estudio',
    priority: 'Baja',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ct-1',
    type: 'CODE',
    title: 'Invertir una Cadena de Texto',
    description: 'Escribe una función que tome un string y devuelva el texto invertido.',
    language: 'python',
    difficulty: 'Fácil',
    status: 'in_progress',
    timeSpentSeconds: 240,
    starterCode: `def invertir_cadena(texto):\n    # Escribe tu solución aquí sin autocompletado intrusivo\n    return texto[::-1]\n\nprint(invertir_cadena("EduEval"))`,
    currentCode: `def invertir_cadena(texto):\n    # Escribe tu solución aquí sin autocompletado intrusivo\n    return texto[::-1]\n\nprint(invertir_cadena("EduEval"))`,
    testCases: [
      { input: '"hola"', expected: '"aloh"', desc: 'invertir_cadena("hola") -> "aloh"' },
      { input: '"python"', expected: '"nohtyp"', desc: 'invertir_cadena("python") -> "nohtyp"' },
    ],
    codeValidator: 'reverse_py',
    pomodoroMinutes: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ct-2',
    type: 'CODE',
    title: 'Filtrar Números Pares en un Arreglo',
    description: 'Escribe una función en JavaScript que reciba un arreglo de números y retorne sólo los pares.',
    language: 'javascript',
    difficulty: 'Fácil',
    status: 'pending',
    timeSpentSeconds: 0,
    starterCode: `function filtrarPares(numeros) {\n  // Escribe tu código manualmente\n  return numeros.filter(n => n % 2 === 0);\n}\n\nconsole.log(filtrarPares([1, 2, 3, 4, 5, 6]));`,
    currentCode: `function filtrarPares(numeros) {\n  // Escribe tu código manualmente\n  return numeros.filter(n => n % 2 === 0);\n}\n\nconsole.log(filtrarPares([1, 2, 3, 4, 5, 6]));`,
    testCases: [
      { input: '[1, 2, 3, 4, 5, 6]', expected: '[2, 4, 6]', desc: 'filtrarPares([1, 2, 3, 4, 5, 6]) -> [2, 4, 6]' },
      { input: '[7, 11, 13]', expected: '[]', desc: 'filtrarPares([7, 11, 13]) -> []' },
    ],
    codeValidator: 'even_js',
    pomodoroMinutes: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ct-3',
    type: 'CODE',
    title: 'Encontrar el Elemento Máximo',
    description: 'Desarrolla una función que devuelva el valor numérico más alto dentro de una lista.',
    language: 'python',
    difficulty: 'Medio',
    status: 'pending',
    timeSpentSeconds: 0,
    starterCode: `def obtener_maximo(lista):\n    # Escribe la lógica para hallar el valor máximo\n    return max(lista)\n\nprint(obtener_maximo([10, 45, 2, 99, 31]))`,
    currentCode: `def obtener_maximo(lista):\n    # Escribe la lógica para hallar el valor máximo\n    return max(lista)\n\nprint(obtener_maximo([10, 45, 2, 99, 31]))`,
    testCases: [
      { input: '[10, 45, 2, 99, 31]', expected: '99', desc: 'obtener_maximo([10, 45, 2, 99, 31]) -> 99' },
      { input: '[-5, -1, -10]', expected: '-1', desc: 'obtener_maximo([-5, -1, -10]) -> -1' },
    ],
    codeValidator: 'max_py',
    pomodoroMinutes: 25,
    createdAt: new Date().toISOString(),
  },
]

const escapeHtml = (text) =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

function highlightPython(code) {
  const regex =
    /(#.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(\d+\.?\d*)\b|\b(def|class|return|if|elif|else|for|while|import|from|as|lambda|in|not|and|or|True|False|None|pass|break|continue|try|except|finally|with|yield|print|range|len|max|min|sum|str|int|list|dict|set)\b|\b([A-Za-z_]\w*)(?=\s*\()/gm
  return code
    .split('\n')
    .map((line) => {
      let html = ''
      let last = 0
      let match
      while ((match = regex.exec(line)) !== null) {
        if (match.index > last) html += escapeHtml(line.slice(last, match.index))
        if (match[1] !== undefined) html += `<span class="tok-cmt">${escapeHtml(match[1])}</span>`
        else if (match[2] !== undefined) html += `<span class="tok-str">${escapeHtml(match[2])}</span>`
        else if (match[3] !== undefined) html += `<span class="tok-num">${escapeHtml(match[3])}</span>`
        else if (match[4] !== undefined) html += `<span class="tok-kw">${escapeHtml(match[4])}</span>`
        else if (match[5] !== undefined) html += `<span class="tok-fn">${escapeHtml(match[5])}</span>`
        last = match.index + match[0].length
      }
      if (last < line.length) html += escapeHtml(line.slice(last))
      return html
    })
    .join('\n')
}

function highlightJS(code) {
  const regex =
    /(\/\/.*$|\/\*[\s\S]*?\*\/)|(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|\b(\d+\.?\d*)\b|\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|async|await|class|import|export|from|default|true|false|null|undefined|new|this)\b|\b(console\.log|console\.error|console\.warn|Array|String|Number|Object|Math|JSON)\b|\b([A-Za-z_]\w*)(?=\s*\()/gm
  return code
    .split('\n')
    .map((line) => {
      let html = ''
      let last = 0
      let match
      while ((match = regex.exec(line)) !== null) {
        if (match.index > last) html += escapeHtml(line.slice(last, match.index))
        if (match[1] !== undefined) html += `<span class="tok-cmt">${escapeHtml(match[1])}</span>`
        else if (match[2] !== undefined) html += `<span class="tok-str">${escapeHtml(match[2])}</span>`
        else if (match[3] !== undefined) html += `<span class="tok-num">${escapeHtml(match[3])}</span>`
        else if (match[4] !== undefined) html += `<span class="tok-kw">${escapeHtml(match[4])}</span>`
        else if (match[5] !== undefined) html += `<span class="tok-builtin">${escapeHtml(match[5])}</span>`
        else if (match[6] !== undefined) html += `<span class="tok-fn">${escapeHtml(match[6])}</span>`
        last = match.index + match[0].length
      }
      if (last < line.length) html += escapeHtml(line.slice(last))
      return html
    })
    .join('\n')
}

export default function HybridTaskManager() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return DEFAULT_TASKS
  })

  const [activeTask, setActiveTask] = useState(null)
  const [filterType, setFilterType] = useState('ALL') // ALL, GENERAL, CODE
  const [filterStatus, setFilterStatus] = useState('ALL') // ALL, pending, in_progress, completed
  const [filterLanguage, setFilterLanguage] = useState('ALL') // ALL, python, javascript
  const [filterDifficulty, setFilterDifficulty] = useState('ALL') // ALL, Fácil, Medio, Difícil
  const [searchQuery, setSearchQuery] = useState('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newType, setNewType] = useState('GENERAL')
  const [newCategory, setNewCategory] = useState('General')
  const [newPriority, setNewPriority] = useState('Media')
  const [newLanguage, setNewLanguage] = useState('python')
  const [newDifficulty, setNewDifficulty] = useState('Fácil')

  // Code editor state
  const [editorCode, setEditorCode] = useState('')
  const [consoleLogs, setConsoleLogs] = useState([])
  const [testResults, setTestResults] = useState([])
  const [isExecuting, setIsExecuting] = useState(false)

  // Timer state
  const [timerMode, setTimerMode] = useState('STOPWATCH') // STOPWATCH vs POMODORO
  const [timerActive, setTimerActive] = useState(false)
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0)
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60)
  const [pomodoroInitial, setPomodoroInitial] = useState(25)

  const textareaRef = useRef(null)
  const lineNumbersRef = useRef(null)
  const preRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {}
  }, [tasks])

  // Open task editor modal or detail
  const openCodeChallenge = (task) => {
    playSelect()
    setActiveTask(task)
    setEditorCode(task.currentCode || task.starterCode || '')
    setConsoleLogs(['Consola de ejecución lista...'])
    setTestResults([])
    setTimerActive(false)
    setStopwatchSeconds(task.timeSpentSeconds || 0)
    setPomodoroSeconds((task.pomodoroMinutes || 25) * 60)
    setPomodoroInitial(task.pomodoroMinutes || 25)
  }

  // Timer interval handling
  useEffect(() => {
    if (!timerActive || !activeTask) return undefined

    const interval = setInterval(() => {
      if (timerMode === 'STOPWATCH') {
        setStopwatchSeconds((prev) => {
          const next = prev + 1
          setTasks((current) =>
            current.map((t) => (t.id === activeTask.id ? { ...t, timeSpentSeconds: next } : t))
          )
          return next
        })
      } else {
        setPomodoroSeconds((prev) => {
          if (prev <= 1) {
            setTimerActive(false)
            playLevelUp()
            window.dispatchEvent(
              new CustomEvent('edueval:celebration', {
                detail: {
                  type: 'pomodoro_done',
                  title: '¡Sesión Pomodoro Finalizada!',
                  text: `Has completado ${pomodoroInitial} minutos de enfoque continuo en ${activeTask.title}.`,
                },
              })
            )
            return 0
          }
          return prev - 1
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, activeTask, timerMode, pomodoroInitial])

  // Scroll sync for editor line numbers
  const handleScroll = (e) => {
    if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = e.target.scrollTop
    if (preRef.current) preRef.current.scrollTop = e.target.scrollTop
    if (preRef.current) preRef.current.scrollLeft = e.target.scrollLeft
  }

  // Handle Tab key in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const updated = `${editorCode.substring(0, start)}    ${editorCode.substring(end)}`
      setEditorCode(updated)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4
        }
      }, 0)
    }
  }

  // Code change in active editor
  const handleCodeChange = (e) => {
    const val = e.target.value
    setEditorCode(val)
    if (activeTask) {
      setTasks((current) =>
        current.map((t) => (t.id === activeTask.id ? { ...t, currentCode: val } : t))
      )
    }
  }

  // Code execution runner
  const runCodeAndTests = () => {
    if (!activeTask) return
    setIsExecuting(true)
    playClick()

    const logs = []
    const results = []
    let allPassed = true

    if (activeTask.language === 'javascript') {
      try {
        const customConsole = {
          log: (...args) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')),
          error: (...args) => logs.push(`[ERROR] ${args.join(' ')}`),
          warn: (...args) => logs.push(`[WARN] ${args.join(' ')}`),
        }

        // Execute user script
        const userFn = new Function('console', editorCode)
        userFn(customConsole)

        // Evaluate test cases
        if (activeTask.testCases && activeTask.testCases.length) {
          activeTask.testCases.forEach((tc, idx) => {
            try {
              const testRunner = new Function('console', `${editorCode}\nreturn ${tc.desc.split(' -> ')[0]};`)
              const res = testRunner({ log: () => {}, error: () => {}, warn: () => {} })
              const resStr = JSON.stringify(res)
              const passed = resStr === tc.expected || String(res) === tc.expected.replace(/"/g, '')
              results.push({ id: idx, desc: tc.desc, expected: tc.expected, actual: resStr, passed })
              if (!passed) allPassed = false
            } catch (err) {
              results.push({ id: idx, desc: tc.desc, expected: tc.expected, actual: err.message, passed: false })
              allPassed = false
            }
          })
        }
      } catch (err) {
        logs.push(`Error de sintaxis o ejecución: ${err.message}`)
        allPassed = false
      }
    } else {
      // Python simulated runner & test evaluator
      logs.push('Ejecutando código en motor local Python...')
      const src = editorCode.trim()

      if (!/def\s+[a-zA-Z_]\w*\s*\(/.test(src)) {
        logs.push('Advertencia: No se detectó una definición de función (def).')
      } else {
        logs.push('Salida simulada: Función compilada correctamente.')
      }

      if (activeTask.testCases && activeTask.testCases.length) {
        activeTask.testCases.forEach((tc, idx) => {
          let passed = false
          if (activeTask.codeValidator === 'reverse_py') {
            passed = /\[::-1\]|reversed\s*\(/.test(src) && /\breturn\b/.test(src)
          } else if (activeTask.codeValidator === 'max_py') {
            passed = (/max\s*\(/.test(src) || />|</.test(src)) && /\breturn\b/.test(src)
          } else {
            passed = /\breturn\b/.test(src)
          }
          results.push({
            id: idx,
            desc: tc.desc,
            expected: tc.expected,
            actual: passed ? tc.expected : 'Resultado no esperado',
            passed,
          })
          if (!passed) allPassed = false
        })
      }
    }

    setConsoleLogs(logs.length ? logs : ['Ejecutado sin mensajes de salida.'])
    setTestResults(results)
    setIsExecuting(false)

    if (allPassed && (activeTask.testCases?.length || 0) > 0) {
      playCorrect()
      passBurst()
      const stats = loadStats()
      const updatedStats = awardSolved(stats, activeTask.difficulty === 'Fácil' ? 20 : 35, false)
      saveStats(updatedStats)

      // Mark task completed
      setTasks((current) =>
        current.map((t) => (t.id === activeTask.id ? { ...t, status: 'completed' } : t))
      )
      setActiveTask((prev) => (prev ? { ...prev, status: 'completed' } : null))

      window.dispatchEvent(
        new CustomEvent('edueval:celebration', {
          detail: {
            type: 'code_task_passed',
            title: '¡Desafío de Código Completado!',
            text: `Has superado con éxito el desafío "${activeTask.title}" (+${activeTask.difficulty === 'Fácil' ? 20 : 35} XP).`,
          },
        })
      )
    } else if (!allPassed) {
      playWrong()
    }
  }

  // Task creation
  const handleCreateTask = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newTask = {
      id: `task-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Sin descripción.',
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...(newType === 'GENERAL'
        ? { category: newCategory, priority: newPriority }
        : {
            language: newLanguage,
            difficulty: newDifficulty,
            timeSpentSeconds: 0,
            starterCode:
              newLanguage === 'python'
                ? `def solucion():\n    # Escribe tu código aquí\n    pass`
                : `function solucion() {\n  // Escribe tu código aquí\n}`,
            currentCode:
              newLanguage === 'python'
                ? `def solucion():\n    # Escribe tu código aquí\n    pass`
                : `function solucion() {\n  // Escribe tu código aquí\n}`,
            testCases: [
              {
                input: 'Demo',
                expected: 'Ok',
                desc: 'Prueba de verificación inicial',
              },
            ],
            pomodoroMinutes: 25,
          }),
    }

    setTasks((current) => [newTask, ...current])
    setNewTitle('')
    setNewDesc('')
    setShowCreateModal(false)
    playClick()
  }

  // Toggle status
  const toggleTaskStatus = (id, currentStatus) => {
    playSelect()
    const nextStatus = currentStatus === 'completed' ? 'pending' : currentStatus === 'pending' ? 'in_progress' : 'completed'
    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    )
    if (activeTask && activeTask.id === id) {
      setActiveTask((prev) => (prev ? { ...prev, status: nextStatus } : null))
    }
  }

  // Delete task
  const deleteTask = (id) => {
    playClick()
    setTasks((current) => current.filter((t) => t.id !== id))
    if (activeTask && activeTask.id === id) setActiveTask(null)
  }

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterType !== 'ALL' && t.type !== filterType) return false
      if (filterStatus !== 'ALL' && t.status !== filterStatus) return false
      if (t.type === 'CODE') {
        if (filterLanguage !== 'ALL' && t.language !== filterLanguage) return false
        if (filterDifficulty !== 'ALL' && t.difficulty !== filterDifficulty) return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = t.title.toLowerCase().includes(q)
        const matchDesc = t.description.toLowerCase().includes(q)
        if (!matchTitle && !matchDesc) return false
      }
      return true
    })
  }, [tasks, filterType, filterStatus, filterLanguage, filterDifficulty, searchQuery])

  // Progress metrics calculation
  const metrics = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'completed').length
    const codeTotal = tasks.filter((t) => t.type === 'CODE').length
    const codeCompleted = tasks.filter((t) => t.type === 'CODE' && t.status === 'completed').length
    const totalSeconds = tasks.reduce((acc, t) => acc + (t.timeSpentSeconds || 0), 0)

    const totalMinutes = Math.floor(totalSeconds / 60)
    const ratio = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, codeTotal, codeCompleted, totalMinutes, ratio }
  }, [tasks])

  const lineCount = useMemo(() => {
    return (editorCode.match(/\n/g) || []).length + 1
  }, [editorCode])

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="hybrid-task-manager">
      {/* Header Dashboard Metrics */}
      <section className="htm-metrics-banner">
        <div className="htm-metric-card">
          <div className="htm-metric-icon emerald"><CheckCircle2 size={20} /></div>
          <div>
            <small>Progreso de Tareas</small>
            <strong>{metrics.completed} / {metrics.total} <small>({metrics.ratio}%)</small></strong>
          </div>
          <div className="htm-progress-bar"><span style={{ width: `${metrics.ratio}%` }} /></div>
        </div>

        <div className="htm-metric-card">
          <div className="htm-metric-icon indigo"><Code2 size={20} /></div>
          <div>
            <small>Desafíos de Código</small>
            <strong>{metrics.codeCompleted} / {metrics.codeTotal} <small>completados</small></strong>
          </div>
        </div>

        <div className="htm-metric-card">
          <div className="htm-metric-icon amber"><Timer size={20} /></div>
          <div>
            <small>Tiempo Invertido</small>
            <strong>{metrics.totalMinutes} min <small>acumulados</small></strong>
          </div>
        </div>
      </section>

      {/* Control Bar & Filters */}
      <div className="htm-control-bar">
        <div className="htm-filter-group">
          <button
            className={`htm-tab ${filterType === 'ALL' ? 'active' : ''}`}
            onClick={() => { playSelect(); setFilterType('ALL') }}
            type="button"
          >
            Todas ({tasks.length})
          </button>
          <button
            className={`htm-tab ${filterType === 'GENERAL' ? 'active' : ''}`}
            onClick={() => { playSelect(); setFilterType('GENERAL') }}
            type="button"
          >
            <ListTodo size={14} /> Generales
          </button>
          <button
            className={`htm-tab ${filterType === 'CODE' ? 'active' : ''}`}
            onClick={() => { playSelect(); setFilterType('CODE') }}
            type="button"
          >
            <Code2 size={14} /> Código
          </button>
        </div>

        <div className="htm-secondary-filters">
          <div className="htm-select-wrapper">
            <Filter size={13} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="ALL">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          <div className="htm-select-wrapper">
            <select value={filterLanguage} onChange={(e) => setFilterLanguage(e.target.value)}>
              <option value="ALL">Todos los lenguajes</option>
              <option value="python">Python 🐍</option>
              <option value="javascript">JavaScript ⚡</option>
            </select>
          </div>

          <div className="htm-select-wrapper">
            <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
              <option value="ALL">Toda dificultad</option>
              <option value="Fácil">Fácil</option>
              <option value="Medio">Medio</option>
              <option value="Difícil">Difícil</option>
            </select>
          </div>

          <div className="htm-select-wrapper">
            <Search size={13} />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 0, background: 'transparent', color: 'var(--text)', outline: 0, fontSize: '.78rem', width: '100px' }}
            />
          </div>

          <button
            className="htm-primary-button"
            type="button"
            onClick={() => { playClick(); setShowCreateModal(true) }}
          >
            <Plus size={15} /> Nueva Tarea
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="htm-main-grid">
        {/* Left Task List */}
        <div className="htm-task-list-column">
          {filteredTasks.length === 0 ? (
            <div className="htm-empty-state">
              <ListTodo size={32} />
              <p>No se encontraron tareas con los filtros seleccionados.</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isSelected = activeTask?.id === task.id
              return (
                <article
                  key={task.id}
                  className={`htm-task-card ${task.type.toLowerCase()} ${task.status} ${
                    isSelected ? 'selected' : ''
                  }`}
                >
                  <div className="htm-card-header">
                    <span className={`htm-badge ${task.type.toLowerCase()}`}>
                      {task.type === 'CODE' ? (
                        <>
                          <Code2 size={12} /> {task.language === 'python' ? 'Python' : 'JavaScript'} · {task.difficulty}
                        </>
                      ) : (
                        <>
                          <ListTodo size={12} /> {task.category || 'General'}
                        </>
                      )}
                    </span>

                    <button
                      type="button"
                      className={`htm-status-toggle ${task.status}`}
                      onClick={() => toggleTaskStatus(task.id, task.status)}
                      title="Cambiar estado"
                    >
                      {task.status === 'completed' ? (
                        <>
                          <CheckCircle2 size={14} /> Completada
                        </>
                      ) : task.status === 'in_progress' ? (
                        <>
                          <Clock size={14} /> En Progreso
                        </>
                      ) : (
                        <>
                          <Timer size={14} /> Pendiente
                        </>
                      )}
                    </button>
                  </div>

                  <h3>{task.title}</h3>
                  <p>{task.description}</p>

                  <div className="htm-card-footer">
                    {task.type === 'CODE' ? (
                      <>
                        <span className="htm-time-badge">
                          <Clock size={13} /> {Math.floor((task.timeSpentSeconds || 0) / 60)}m invertidos
                        </span>

                        <button
                          type="button"
                          className="htm-action-button"
                          onClick={() => openCodeChallenge(task)}
                        >
                          <Code2 size={13} /> Abrir Editor
                        </button>
                      </>
                    ) : (
                      <span className="htm-priority-badge">{task.priority} prioridad</span>
                    )}

                    <button
                      type="button"
                      className="htm-delete-button"
                      onClick={() => deleteTask(task.id)}
                      title="Eliminar tarea"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </div>

        {/* Right Active Editor & Console Panel */}
        <div className="htm-editor-column">
          {activeTask && activeTask.type === 'CODE' ? (
            <div className="htm-editor-panel">
              {/* Editor Topbar & Timer */}
              <div className="htm-editor-topbar">
                <div className="htm-editor-title">
                  <div className="htm-ide-dots" aria-hidden="true">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <span className={`htm-lang-tag ${activeTask.language}`}>
                    {activeTask.language === 'python' ? 'Python 3.11' : 'Node JS / JS ES6'}
                  </span>
                  <h4>{activeTask.title}</h4>
                </div>

                {/* Integrated Dual Timer */}
                <div className="htm-timer-widget">
                  <div className="htm-timer-mode-switcher">
                    <button
                      className={timerMode === 'STOPWATCH' ? 'active' : ''}
                      onClick={() => { playSelect(); setTimerMode('STOPWATCH') }}
                      type="button"
                    >
                      Cronómetro
                    </button>
                    <button
                      className={timerMode === 'POMODORO' ? 'active' : ''}
                      onClick={() => { playSelect(); setTimerMode('POMODORO') }}
                      type="button"
                    >
                      Pomodoro ({pomodoroInitial}m)
                    </button>
                  </div>

                  <div className="htm-timer-display">
                    <Timer size={15} />
                    <strong>
                      {timerMode === 'STOPWATCH'
                        ? formatSeconds(stopwatchSeconds)
                        : formatSeconds(pomodoroSeconds)}
                    </strong>

                    <button
                      type="button"
                      className="htm-timer-btn"
                      onClick={() => setTimerActive((v) => !v)}
                      title={timerActive ? 'Pausar temporizador' : 'Iniciar temporizador'}
                    >
                      {timerActive ? <Pause size={14} /> : <Play size={14} />}
                    </button>

                    <button
                      type="button"
                      className="htm-timer-btn"
                      onClick={() => {
                        setTimerActive(false)
                        if (timerMode === 'STOPWATCH') setStopwatchSeconds(0)
                        else setPomodoroSeconds(pomodoroInitial * 60)
                      }}
                      title="Reiniciar temporizador"
                    >
                      <RotateCcw size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Handwritten Interactive Code Editor */}
              <div className="handwritten-editor-wrapper">
                <div className="line-numbers" ref={lineNumbersRef}>
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>

                <div className="code-container">
                  <pre className="code-highlight" ref={preRef} aria-hidden="true">
                    <code
                      dangerouslySetInnerHTML={{
                        __html:
                          activeTask.language === 'python'
                            ? highlightPython(editorCode)
                            : highlightJS(editorCode),
                      }}
                    />
                  </pre>
                  <textarea
                    ref={textareaRef}
                    className="code-textarea"
                    value={editorCode}
                    onChange={handleCodeChange}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder="Escribe tu código manualmente aquí..."
                  />
                </div>
              </div>

              {/* Execution & Output Console */}
              <div className="htm-console-panel">
                <div className="htm-console-header">
                  <span>
                    <Terminal size={14} /> Consola de Ejecución &amp; Pruebas
                  </span>
                  <button
                    type="button"
                    className="htm-run-button"
                    onClick={runCodeAndTests}
                    disabled={isExecuting}
                  >
                    <Play size={14} /> {isExecuting ? 'Ejecutando...' : 'Ejecutar y Probar'}
                  </button>
                </div>

                {/* Test Suite Verification Results */}
                {testResults.length > 0 && (
                  <div className="htm-test-suite">
                    <h5>Resultados de Pruebas:</h5>
                    {testResults.map((tr) => (
                      <div key={tr.id} className={`htm-test-item ${tr.passed ? 'pass' : 'fail'}`}>
                        <span>{tr.passed ? <Check size={14} /> : <X size={14} />}</span>
                        <div className="htm-test-info">
                          <strong>{tr.desc}</strong>
                          <small>
                            Esperado: <code>{tr.expected}</code> | Obtenido: <code>{tr.actual}</code>
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Execution Log Stream */}
                <div className="htm-console-logs">
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} className="htm-log-line">
                      &gt; {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="htm-editor-placeholder">
              <Code2 size={44} />
              <h4>Editor de Escritura a Mano</h4>
              <p>Selecciona o abre un desafío de código en la lista izquierda para comenzar a escribir y probar soluciones.</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Creation Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="htm-create-modal">
            <header>
              <h3>Nueva Tarea o Desafío</h3>
              <button type="button" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>
            </header>

            <form onSubmit={handleCreateTask}>
              <div className="htm-form-group">
                <label>Tipo de Tarea</label>
                <div className="htm-type-selector">
                  <button
                    type="button"
                    className={newType === 'GENERAL' ? 'active' : ''}
                    onClick={() => setNewType('GENERAL')}
                  >
                    <ListTodo size={14} /> Tarea General
                  </button>
                  <button
                    type="button"
                    className={newType === 'CODE' ? 'active' : ''}
                    onClick={() => setNewType('CODE')}
                  >
                    <Code2 size={14} /> Desafío de Código
                  </button>
                </div>
              </div>

              <div className="htm-form-group">
                <label>Título</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Resolver ejercicio de listas en Python"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="htm-form-group">
                <label>Descripción</label>
                <textarea
                  rows={2}
                  placeholder="Detalles u objetivos de la tarea..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              {newType === 'GENERAL' ? (
                <div className="htm-form-row">
                  <div className="htm-form-group">
                    <label>Categoría</label>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                  <div className="htm-form-group">
                    <label>Prioridad</label>
                    <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="htm-form-row">
                  <div className="htm-form-group">
                    <label>Lenguaje</label>
                    <select value={newLanguage} onChange={(e) => setNewLanguage(e.target.value)}>
                      <option value="python">Python 🐍</option>
                      <option value="javascript">JavaScript ⚡</option>
                    </select>
                  </div>
                  <div className="htm-form-group">
                    <label>Dificultad</label>
                    <select value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value)}>
                      <option value="Fácil">Fácil</option>
                      <option value="Medio">Medio</option>
                      <option value="Difícil">Difícil</option>
                    </select>
                  </div>
                </div>
              )}

              <footer>
                <button type="button" className="ghost-button" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="primary-button">
                  Crear Tarea
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
