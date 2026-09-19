import { useEffect, useRef, useState } from 'react'

export default function ClickSpark({
  sparkColor = '#c86d51',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1,
  children,
}) {
  const [sparks, setSparks] = useState([])
  const timerRef = useRef(null)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const handleClick = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    const next = Array.from({ length: sparkCount }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      x,
      y,
      angle: (360 / sparkCount) * index,
    }))

    setSparks(next)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setSparks([]), duration)
  }

  return <div className="click-spark-layer" onClick={handleClick}>
    {children}
    <span className="click-spark-overlay" aria-hidden="true">
      {sparks.map((spark) => <i key={spark.id} style={{ left: spark.x, top: spark.y, '--spark-angle': `${spark.angle}deg`, '--spark-size': `${sparkSize}px`, '--spark-radius': `${sparkRadius * extraScale}px`, '--spark-duration': `${duration}ms`, '--spark-easing': easing, backgroundColor: sparkColor }} />)}
    </span>
  </div>
}
