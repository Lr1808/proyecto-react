import confetti from 'canvas-confetti'

const COLORS = ['#34d399', '#2dd4bf', '#818cf8', '#fbbf24', '#22d3ee']

const fire = (options = {}) => {
  confetti({ origin: { y: 0.55 }, zIndex: 60, colors: COLORS, ...options })
}

export function passBurst() {
  fire({ particleCount: 130, spread: 78 })
}

export function examBurst() {
  fire({ particleCount: 120, spread: 90, origin: { x: 0.2, y: 0.52 } })
  fire({ particleCount: 120, spread: 90, origin: { x: 0.8, y: 0.52 } })
  confetti({ particleCount: 48, spread: 130, startVelocity: 48, scalar: 1.5, shapes: ['star', 'circle'], origin: { x: 0.5, y: 0.4 }, ticks: 260, zIndex: 60, colors: COLORS })
  window.setTimeout(() => fire({ particleCount: 70, spread: 100, origin: { x: 0.32, y: 0.34 }, startVelocity: 36 }), 380)
  window.setTimeout(() => fire({ particleCount: 70, spread: 100, origin: { x: 0.68, y: 0.34 }, startVelocity: 36 }), 560)
}

export function xpBubble() {
  fire({ particleCount: 26, spread: 60, origin: { y: 0.82 }, startVelocity: 22, scalar: 0.9 })
}