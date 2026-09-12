import { useEffect, useRef, useState } from 'react'
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { playAppear, playClick } from '../lib/sound'

const faq = [
  { match: ['nivel', 'desbloque', 'progreso', 'xp', 'puntos', 'experiencia'], answer: 'Cada entrega te da XP: el porcentaje obtenido más 25 XP por aprobar y +50 extra en exámenes aprobados. El XP acumulado te sube de nivel: Inicial → Intermedio → Avanzado → Experto. Los ejercicios se desbloquean progresivamente para que siempre tengas un siguiente reto.' },
  { match: ['examen', 'entrega', 'calificar'], answer: 'Abre un examen desde tu ruta, responde cada pregunta y pulsa “Entregar y calificar”. El servidor devuelve tu resultado y retroalimentación al instante.' },
  { match: ['codigo', 'código', 'judge', 'python'], answer: 'En los desafíos de código escribes la solución en el editor con resaltado de sintaxis. Judge0 la ejecuta contra casos públicos y ocultos sin exponer las respuestas esperadas. Usa “Probar casos” para validar antes de entregar.' },
  { match: ['racha', 'dias', 'días', 'seguidos'], answer: 'Tu racha suma un día por cada día con al menos una entrega. Si un día no prácticas, se reinicia, pero puedes usar una congelación (2 por mes) para protegerla. Mantener 7+ días enciende el modo “doble o nada”.' },
  { match: ['congel', 'freeze', 'protect'], answer: 'Desde tu perfil puedes congelar el día de hoy si aún no practicaste. Así tu racha no se reinicia. Tienes 2 congelaciones por mes y se renuevan automáticamente el día 1.' },
  { match: ['energia', 'energía', 'recarga', 'cansado'], answer: 'Cada intento cuesta 1 de energía (máximo 5). Se recarga sola: 1 punto cada 20 minutos. Si llegas a 0, espera un poco para volver a practicar.' },
  { match: ['reto', 'diario', 'diaria', 'bonus', 'mision', 'misión'], answer: 'Cada día hay un Reto automático con +30 XP de bonus. Lo ves en tu panel como “Reto del día”. Completa ese ejercicio para sumar la recompensa y mantener el ritmo.' },
  { match: ['certificado', 'diploma', 'certificacion', 'certificación', 'descargar'], answer: 'Completa todos los ejercicios de una categoría (Python, SQL, React, Git o Terminal) para desbloquear tu certificado de dominio. Entra a “Certificados” en tu panel y usa “Descargar” para exportarlo como PDF.' },
  { match: ['logro', 'logros', 'insignia', 'medalla', 'trofeo'], answer: 'Hay 7 logros ocultos, desde tu primera entrega (“Primer desafío”) hasta acumular 8 entregas (“Constancia”). Revisa el botón Logros de tu panel para ver cuáles ya desbloqueaste.' },
  { match: ['ranking', 'clasif', 'tabla', 'gold', 'clasificación'], answer: 'El ranking del campus se calcula por XP total. Aprobar exámenes y desafíos de código te da más impulso. Tu fila aparecerá resaltada en verde.' },
  { match: ['sonido', 'volumen', 'mute', 'silenciar'], answer: 'El botón de volumen junto a la campana activa o silencia los efectos de sonido del panel, del ranking y de la resolución de ejercicios.' },
  { match: ['docente', 'profesor', 'publicar'], answer: 'El docente puede publicar ejercicios desde su panel. Los alumnos conectados reciben la novedad en tiempo real.' },
  { match: ['git', 'terminal', 'react', 'sql', 'base'], answer: 'EduEval incluye rutas de Python, SQL, React, Git y Terminal. Usa los filtros del catálogo o el Mapa de ruta para encontrar el área que quieres practicar.' },
]

function answerQuestion(text) {
  const normalized = text.toLowerCase()
  const found = faq.find((item) => item.match.some((keyword) => normalized.includes(keyword)))
  return found?.answer || 'Puedo ayudarte con niveles y XP, energía, retos diarios, rachas y congelaciones, logros, certificados, ranking, exámenes, código, Judge0, sonido, Git, React, SQL y terminal. Prueba con una de esas palabras.'
}

function hintFor(detail) {
  const title = `Ayuda con “${detail.exerciseTitle || 'tu ejercicio'}”: ${detail.question || ''}`
  if (detail.type === 'CODE_CHALLENGE') {
    const passed = detail.consoleOutput && detail.consoleOutput.toLowerCase().includes('pasaron')
    const lines = passed
      ? ['Buen trabajo: tu código ya pasa los casos públicos. Ahora piensa en los casos límite: ¿qué pasa con entradas vacías, negativas o muy grandes?', 'Prueba valores extremos a mano antes de entregar. Si todo cuadra, entrega con confianza.']
      : ['Te doy pistas, no la solución: igual que haría un buen profe.', 'Primero identifica qué entrada recibe tu función y qué debe devolver. Haz un ejemplo pequeño a mano.', 'Después revisa paso a paso tu lógica con ese ejemplo: ¿qué valor toma cada variable?', 'Si te atascas, usa “Probar casos” para ver si tu código responde como espera el terminal.']
    if (detail.snippet) lines.push(`Tu código actual empieza así: ${detail.snippet.replace(/\n/g, ' → ')}… Revisa esa primera parte: ¿es la estrategia correcta para el enunciado?`)
    return [title, ...lines, 'Si quieres, cuéntame exactamente qué error ves y te oriento con el siguiente paso.'].join('\n')
  }
  if (detail.type === 'NUMERICAL') {
    return [title, 'Para una pregunta numérica, asegúrate de respetar el orden de operaciones y de responder solo el valor final.', 'Relee el enunciado: confirma qué dato te piden y en qué unidad o formato. Es común equivocarse por un detalle de redondeo.'].join('\n')
  }
  return [title, 'Lee cada opción al pie de la letra y descarta las que contradicen el enunciado.', 'Fíjate en términos absolutos como “siempre”, “nunca” o “obligatorio”: suelen estar en las falsas. Con las dos restantes, elige la que sea verdadera en todos los casos.'].join('\n')
}

export default function EduEvalChatbot() {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hola. Soy el asistente de EduEval. ¿Sobre qué quieres que te oriente hoy?' }])
  const quickQuestions = ['¿Cómo sumo XP y subo de nivel?', '¿Cómo funciona Judge0?', '¿Qué logros existen?']
  const typingTimer = useRef(null)

  const send = (text = draft) => {
    const clean = text.trim()
    if (!clean || typing) return
    window.clearTimeout(typingTimer.current)
    setMessages((current) => [...current, { from: 'user', text: clean }])
    setDraft('')
    setTyping(true)
    playClick()
    typingTimer.current = window.setTimeout(() => {
      setMessages((current) => [...current, { from: 'bot', text: answerQuestion(clean) }])
      setTyping(false)
      playAppear()
    }, 750)
  }

  const sendToBit = (detail) => {
    window.clearTimeout(typingTimer.current)
    setDraft('')
    setMessages((current) => [...current, { from: 'user', text: `Necesito una pista sobre: ${detail.question || 'mi ejercicio'}` }])
    setTyping(true)
    playClick()
    typingTimer.current = window.setTimeout(() => {
      setMessages((current) => [...current, { from: 'bot', text: hintFor(detail) }])
      setTyping(false)
      playAppear()
    }, 800)
  }

  useEffect(() => {
    const onAsk = (event) => {
      const detail = event.detail || {}
      if (!detail.question && !detail.snippet) return
      setOpen(true)
      sendToBit(detail)
    }
    window.addEventListener('edueval:ask-ai', onAsk)
    return () => window.removeEventListener('edueval:ask-ai', onAsk)
  }, [])

  const toggle = () => {
    playClick()
    setOpen((value) => !value)
  }

  return <>
    <button className="chat-launcher" type="button" onClick={toggle} aria-label="Abrir asistente"><MessageCircle size={22} />{!open && <span className="chat-ping" />}</button>
    {open && <section className="chatbot-panel" aria-label="Asistente EduEval"><header><div className="chat-title"><span className="bot-avatar"><Bot size={18} /></span><div><strong>Asistente EduEval</strong><small><span /> Responde al instante</small></div></div><button className="icon-button" type="button" onClick={() => { playClick(); setOpen(false) }} aria-label="Cerrar asistente"><X size={17} /></button></header><div className="chat-messages">{messages.map((message, index) => <div className={`chat-message ${message.from}`} key={`${message.from}-${index}`}>{message.from === 'bot' && <Sparkles size={13} />}{message.text}</div>)}{typing && <div className="chat-message bot typing"><span /><span /><span /></div>}</div><div className="chat-quick-actions">{quickQuestions.map((question) => <button type="button" key={question} onClick={() => send(question)}>{question}</button>)}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); send() }}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escribe tu duda..." aria-label="Pregunta al asistente" /><button type="submit" aria-label="Enviar pregunta"><Send size={16} /></button></form></section>}
  </>
}