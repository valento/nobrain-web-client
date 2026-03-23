// packages/lototech/src/lib/chord-diagram.tsx
import { useState, useEffect } from 'react'
import { config } from '@nx-mono/broker'

interface PairData {
  number: number
  pairs: { partner: number; count: number }[]
}

const FEATURED_NUMBERS = [37, 24, 36, 18]
const TOTAL_NUMBERS = 49

export function ChordDiagram() {
  const [pairData, setPairData] = useState<PairData[]>([])
  const API_URL = config.apiUrl

  const size = 550
  const cx = size / 2
  const cy = size / 2
  const radius = 170

  useEffect(() => {
    Promise.all(
      FEATURED_NUMBERS.map(n =>
        fetch(`${API_URL}/toto2/stats/number/${n}/pairs`)
          .then(res => res.json())
      )
    ).then(results => setPairData(results))
  }, [])

  const getPosition = (number: number, offset=0) => {
    const angle = ((number - 1) / TOTAL_NUMBERS) * 2 * Math.PI - Math.PI / 2
    return {
      x: cx + (radius + offset) * Math.cos(angle),
      y: cy + (radius + offset) * Math.sin(angle),
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

  function arcSegment(cx=0, cy=0, outerR=0, innerR=0, startAngle=0, endAngle=0) {
    const toRad = (deg:number) => (deg - 90) * Math.PI / 180

    const outerStart = {
      x: cx + outerR * Math.cos(toRad(startAngle)),
      y: cy + outerR * Math.sin(toRad(startAngle)),
    }
    const outerEnd = {
      x: cx + outerR * Math.cos(toRad(endAngle)),
      y: cy + outerR * Math.sin(toRad(endAngle)),
    }
    const innerStart = {
      x: cx + innerR * Math.cos(toRad(endAngle)),
      y: cy + innerR * Math.sin(toRad(endAngle)),
    }
    const innerEnd = {
      x: cx + innerR * Math.cos(toRad(startAngle)),
      y: cy + innerR * Math.sin(toRad(startAngle)),
    }

    const largeArc = endAngle - startAngle > 180 ? 1 : 0

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z'
    ].join(' ')
  }

  return (
    <div className="chord-diagram">
      <div className="chord-header sofia-cyrillic">
        <p>Frequent Number-pairs</p>
        <br />
        <p><i>chord-diagram</i></p>
      </div>
      <svg viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
        <path
          d={arcSegment(cx, cy, 190, 203, 0, 67)}
          fill="#682108"
        />
        <path
          d={arcSegment(cx, cy, 190, 203, 68, 139)}
          fill="#b28473"
        />
        <path
          d={arcSegment(cx, cy, 190, 203, 140, 212)}
          fill="#8b5c4b"
        />
        <path
          d={arcSegment(cx, cy, 190, 203, 213, 286)}
          fill="#682108"
        />
        <path
          d={arcSegment(cx, cy, 190, 203, 287, 359)}
          fill="#d3b1a4"
        />

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
          const pos = getPosition(n, 10)
          const isFeatured = FEATURED_NUMBERS.includes(n)
          return (
            
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={isFeatured ? '14' : 8}
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