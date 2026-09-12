import { useState } from 'react'
import { Bot, Flame, Map, Rocket, Sparkles, X, Zap } from 'lucide-react'
import { completeOnboarding } from '../lib/gamification'
import { playAppear, playClick } from '../lib/sound'

const dispatchCelebration = (type, title, text) => window.dispatchEvent(new CustomEvent('edueval:celebration', { detail: { type, title, text } }))

const slides = [
  {
    icon: <Rocket size={26} />,
    kicker: 'BIENVENIDA A EDUEVAL',
    title: 'Hola, soy Bit. Te acompaño en tu ruta.',
    body: 'Soy tu guía de este campus de práctica. Aquí aprendes Python, SQL, React, Git y Terminal resolviendo desafíos y exámenes reales, a tu ritmo.',
  },
  {
    icon: <Zap size={26} />,
    kicker: 'GANAS EXPERIENCIA',
    title: 'Cada entrega suma XP',
    body: 'Aprueba ejercicios para subir de nivel (Inicial → Intermedio → Avanzado → Experto), mantén tu racha diaria y desbloquea 7 logros. Cuanto mejor, más rápido avanzas.',
  },
  {
    icon: <Flame size={26} />,
    kicker: 'MANTÉN EL RITMO',
    title: 'Rachas, energía y retos',
    body: 'Cada día tienes un Reto con XP bonus y 5 de energía (se recargan con el tiempo). Practica a diario para encender tu racha y ganar certificados por cada dominio completo.',
  },
]

export default function OnboardingModal({ onFinish }) {
  const [index, setIndex] = useState(0)
  const slide = slides[index]
  const last = index === slides.length - 1

  const next = () => {
    playClick()
    if (!last) {
      setIndex((value) => value + 1)
      playAppear()
      return
    }
    const gain = completeOnboarding()
    if (gain > 0) {
      dispatchCelebration('xp', `+${gain} XP`, 'Bienvenida por completar tu primer recorrido. ¡Haz una entrega para encender tu racha!')
    }
    window.dispatchEvent(new Event('edueval:notification'))
    onFinish()
  }

  return <div className="modal-backdrop"><section className="onboarding-card" role="dialog" aria-modal="true"><header><button className="icon-button" type="button" onClick={() => { playClick(); onFinish() }} aria-label="Saltar introducción"><X size={18} /></button></header><div className="onboarding-mascot"><span className="onboarding-bot"><Bot size={30} /></span><span className="onboarding-bubble">{slide.icon} {slide.kicker}</span></div><h2>{slide.title}</h2><p>{slide.body}</p><div className="onboarding-dots">{slides.map((item, dotIndex) => <button key={item.kicker} type="button" className={dotIndex === index ? 'active' : ''} onClick={() => { playClick(); setIndex(dotIndex) }} aria-label={`Paso ${dotIndex + 1}`} />)}</div><div className="onboarding-footer"><span className="onboarding-skip" onClick={onFinish}>Saltar</span><button className="primary-button" type="button" onClick={next}>{last ? 'Empezar ahora' : 'Sigamos'} <Sparkles size={15} /></button></div><Map size={13} className="onboarding-map-hint" /></section></div>
}