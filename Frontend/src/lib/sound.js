const MUTE_KEY = 'edueval:muted'

export const isMuted = () => {
  try { return localStorage.getItem(MUTE_KEY) === '1' } catch { return false }
}

export const setMuted = (muted) => {
  try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0') } catch {}
}

export const toggleMuted = () => {
  const next = !isMuted()
  setMuted(next)
  return next
}

let audioContext = null
const getContext = () => {
  const Constructor = window.AudioContext || window.webkitAudioContext
  if (!Constructor) return null
  if (!audioContext) audioContext = new Constructor()
  if (audioContext.state === 'suspended') audioContext.resume()
  return audioContext
}

const tone = ({ frequency = 440, slideTo = null, duration = 0.08, when = 0, type = 'sine', volume = 0.1 }) => {
  if (isMuted() || typeof window === 'undefined') return
  try {
    const audio = getContext()
    if (!audio) return
    const start = audio.currentTime + when
    const oscillator = audio.createOscillator()
    const gain = audio.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, start)
    if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + duration)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
    oscillator.connect(gain)
    gain.connect(audio.destination)
    oscillator.start(start)
    oscillator.stop(start + duration + 0.05)
  } catch {}
}

export const playClick = () => tone({ frequency: 680, duration: 0.05, type: 'triangle', volume: 0.05 })

export const playSelect = () => tone({ frequency: 520, duration: 0.07, type: 'triangle', volume: 0.07, slideTo: 790 })

export const playAppear = () => tone({ frequency: 320, duration: 0.05, type: 'sine', volume: 0.05, slideTo: 520 })

export const playCorrect = () => {
  tone({ frequency: 660, duration: 0.1, type: 'sine', volume: 0.09 })
  tone({ frequency: 880, duration: 0.16, when: 0.09, type: 'sine', volume: 0.09 })
}

export const playWrong = () => {
  tone({ frequency: 220, duration: 0.18, type: 'sine', volume: 0.1, slideTo: 145 })
}

export const playLevelUp = () => {
  ;[523, 659, 784, 1047].forEach((frequency, index) => tone({ frequency, duration: 0.15, when: index * 0.1, type: 'triangle', volume: 0.1 }))
}

export const playAchievement = () => {
  tone({ frequency: 659, duration: 0.12, type: 'sine', volume: 0.09 })
  tone({ frequency: 880, duration: 0.12, when: 0.08, type: 'sine', volume: 0.09 })
  tone({ frequency: 1319, duration: 0.22, when: 0.16, type: 'sine', volume: 0.09 })
}