// packages/lototech/src/lib/number-trend.tsx
import { useState, useEffect } from 'react'
import { config } from '@nx-mono/broker'

interface YearlyPoint {
  year: number
  frequency: number
  draws: number
}

interface NumberTrendProps {
  number: number
  type: 'hot' | 'cold'
}

function samplePoints<T>(data: T[], count: number): T[] {
  if (data.length <= count) return data
  const step = (data.length - 1) / (count - 1)
  return Array.from({ length: count }, (_, i) =>
    data[Math.round(i * step)]
  )
}

export function NumberTrend({ number, type }: NumberTrendProps) {
  const [points, setPoints] = useState<{ x: number; y: number; label: string }[]>([])

  const width = 280
  const height = 120
  const padding = { top: 20, right: 15, bottom: 25, left: 15 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom

  useEffect(() => {
    fetch(`${config.apiUrl}/toto2/stats/number/${number}/yearly`)
      .then(res => res.json())
      .then(data => {
        const sampled = samplePoints(data.yearly, 10)
        const ratios = sampled.map(p => ({
          x: p.year,
          y: p.draws > 0 ? p.frequency / p.draws : 0,
          label: p.year.toString(),
        }))
        setPoints(ratios)
      })
  }, [number])

  if (!points.length) return <div className="number-trend">Loading...</div>

  const maxY = Math.max(...points.map(p => p.y))
  const minY = Math.min(...points.map(p => p.y))
  const rangeY = maxY - minY || 1

  const coords = points.map((p, i) => ({
    cx: padding.left + (i / (points.length - 1)) * innerW,
    cy: padding.top + innerH - ((p.y - minY) / rangeY) * innerH,
    label: p.label,
    value: p.y,
  }))

  const linePath = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.cx} ${c.cy}`)
    .join(' ')

  const lineColor = type === 'hot' ? '#f7e8df' : '#1a237e'

  return (
    <div className="number-trend">
      <span className="trend-title sofia-cyrillic">История на Nr. {number}, годишна</span>
      <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
        {/* baseline */}
        <line
          x1={padding.left}
          y1={padding.top + innerH}
          x2={padding.left + innerW}
          y2={padding.top + innerH}
          stroke="#eee"
          strokeWidth=".2"
        />

        {/* trend line */}
        <path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* dots + year labels */}
        {coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.cx} cy={c.cy} r="3" fill={lineColor} />
            {i % 2 === 0 && (
              <text
                x={c.cx}
                y={padding.top + innerH + 15}
                textAnchor="middle"
                fontSize="8"
                fill="#aaa"
              >
                {c.label.slice(0)}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}