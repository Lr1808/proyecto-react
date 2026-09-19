import { useMemo, useState } from 'react'

function buildPixels(pixelSize, randomness) {
  const columns = Math.max(4, Math.ceil(320 / pixelSize))
  const rows = Math.max(3, Math.ceil(180 / pixelSize))
  const count = columns * rows
  return Array.from({ length: count }, (_, index) => {
    const random = ((index * 37) % 101) / 100
    return {
      index,
      delay: `${Math.max(0, (random + randomness) * 260)}ms`,
      column: index % columns,
      row: Math.floor(index / columns),
      columns,
      rows,
    }
  })
}

export default function PixelSwap({
  firstContent,
  secondContent,
  pixelSize = 64,
  gap = 0,
  pixelRadius = 0,
  pixelSpin = 0,
  pixelScale = 0.35,
  duration = 1400,
  pixelDuration = 450,
  pattern = 'random',
  randomness = 0,
  fade = false,
  trigger = 'hover',
}) {
  const [swapped, setSwapped] = useState(false)
  const columns = Math.max(4, Math.ceil(320 / pixelSize))
  const rows = Math.max(3, Math.ceil(180 / pixelSize))
  const pixels = useMemo(() => buildPixels(pixelSize, randomness), [pixelSize, randomness])
  const isHoverTrigger = trigger === 'hover'

  const activate = () => {
    if (trigger === 'click') setSwapped((value) => !value)
    else setSwapped(true)
  }

  const deactivate = () => {
    if (isHoverTrigger) setSwapped(false)
  }

  return <div
    className={`pixel-swap${swapped ? ' is-swapped' : ''}${fade ? ' has-fade' : ''}`}
    style={{ '--pixel-gap': `${gap}px`, '--pixel-radius': `${pixelRadius}px`, '--pixel-spin': `${pixelSpin}deg`, '--pixel-scale': pixelScale, '--pixel-duration': `${pixelDuration}ms`, '--swap-duration': `${duration}ms` }}
    data-pattern={pattern}
    onMouseEnter={activate}
    onMouseLeave={deactivate}
    onFocus={activate}
    onBlur={deactivate}
    onClick={trigger === 'click' ? activate : undefined}
    role={trigger === 'click' ? 'button' : undefined}
    tabIndex={trigger === 'click' ? 0 : undefined}
    onKeyDown={(event) => { if (trigger === 'click' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); activate() } }}
  >
    <div className="pixel-swap-content pixel-swap-first">{firstContent}</div>
    <div className="pixel-swap-content pixel-swap-second">{secondContent}</div>
    <div className="pixel-swap-pixels" style={{ '--pixel-columns': columns, '--pixel-rows': rows }} aria-hidden="true">
      {pixels.map((pixel) => <span key={pixel.index} style={{ '--pixel-delay': pixel.delay, '--pixel-column': pixel.column, '--pixel-row': pixel.row, '--pixel-columns': pixel.columns, '--pixel-rows': pixel.rows }} />)}
    </div>
  </div>
}
