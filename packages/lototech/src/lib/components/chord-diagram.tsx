// packages/lototech/src/lib/chord-diagram.tsx
import { useState, useEffect } from 'react'
import { config } from '@nx-mono/broker'

interface PairData {
  number: number
  pairs: { partner: number; count: number }[]
}

const FEATURED_NUMBERS = [37, 36, 10, 18, 34]
const TOTAL_NUMBERS = 49

export function ChordDiagram() {
  const [pairData, setPairData] = useState<PairData[]>([])

  const size = 400
  const cx = size / 2
  const cy = size / 2
  const radius = 170

  useEffect(() => {
    Promise.all(
      FEATURED_NUMBERS.map(n =>
        fetch(`${config.apiUrl}/toto2/stats/number/${n}/pairs`)
          .then(res => res.json())
      )
    ).then(results => setPairData(results))
  }, [])

  const getPosition = (number: number) => {
    const angle = ((number - 1) / TOTAL_NUMBERS) * 2 * Math.PI - Math.PI / 2
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    }
  }

  const makeCurve = (from: number, to: number) => {
    const p1 = getPosition(from)
    const p2 = getPosition(to)
    const midX = (p1.x + p2.x) / 2
    const midY = (p1.y + p2.y) / 2
    const ctrlX = midX + (cx - midX) * 0.6
    const ctrlY = midY + (cy - midY) * 0.6
    return `M ${p1.x} ${p1.y} Q ${ctrlX} ${ctrlY} ${p2.x} ${p2.y}`
  }

  return (
    <div className="chord-diagram">

      <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">

      {/* Curves connecting pairs */}
        {pairData.map(data =>
          data.pairs.slice(0, 3).map(pair => {
            const maxCount = Math.max(...data.pairs.map(p => p.count))
            const opacity = 0.3 + (pair.count / maxCount) * 0.7
            return (
              <path
                key={`${data.number}-${pair.partner}`}
                d={makeCurve(data.number, pair.partner)}
                fill="none"
                stroke="#333"
                strokeWidth={.5 + (pair.count / maxCount) * 1}
                opacity={opacity}
              />
            )
          })
        )}
        {/* All 49 numbers on the circle */}
        {Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1).map(n => {
          const pos = getPosition(n)
          const isFeatured = FEATURED_NUMBERS.includes(n)
          return (
            
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isFeatured ? '12' : 6}
                fill={isFeatured ? '#333' : '#888'}
              >
                {n}
              </text>
          )
        })}
  
      </svg>
    </div>
  )
}