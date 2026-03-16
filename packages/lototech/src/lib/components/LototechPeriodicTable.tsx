// packages/lototech/src/lib/periodic-table.tsx
import { useState, useEffect } from 'react'
import { config } from '@nx-mono/broker'
import { NumberElement } from './NumberElement'

interface NumberStat {
  number: number
  frequency: number
}

interface PeriodData {
  label: string
  total_draws: number
  top: NumberStat[]
  bottom: NumberStat[]
}

export function LototechPeriodicTable() {
  const [periods, setPeriods] = useState<PeriodData[]>([])
  const [period, setPeriod] = useState()
  const current_year = new Date().getFullYear()

  function calculateWeights(periods: PeriodData[]): Record<number, number> {
      return periods.reduce((weights, period) => {
        period.top.forEach((n, i) => {
          const points = 4 - i  // rank 1=4pts, rank 2=3pts, etc.
          weights[n.number] = (weights[n.number] || 0) + points
        })
        return weights
      }, {} as Record<number, number>)
    }
  
  useEffect(() => {

    const periods = [
      { label: `${current_year}`, from: current_year, to: current_year },
      { label: '1Y', from: current_year - 1, to: current_year },
      { label: '3Y', from: current_year - 3, to: current_year },
      { label: '5Y', from: current_year - 5, to: current_year },
      { label: '10Y', from: current_year - 10, to: current_year },
      { label: '∞', from: 1990, to: current_year },
    ]

    // Mock: fetch all-time for now to fill every column
    fetch(`${config.apiUrl}/toto2/stats/frequency`)
      Promise.all( periods.map(p =>
      fetch(`${config.apiUrl}/toto2/stats/frequency?year_from=${p.from}&year_to=${p.to}`)
        .then(res => res.json())
        .then(data => ({
          label: p.label,
          total_draws: data.total_draws,
          top: data.numbers.slice(0, 4),
          bottom: data.numbers.slice(-4).reverse(),
        }))
    )
  ).then(results => setPeriods(results))
  }, [])

  const weights = calculateWeights(periods)
// { 37: 14, 34: 9, 48: 4, 10: 6, ... }

  if (!periods.length) return <div>Loading...</div>

  return (
    <div className="periodic-table">
      <h1>Lototech Alchemy</h1>
      <div className="period-grid">
        {periods.map(p => (
          <div key={p.label} className="period-column">
            <div className="top-group">
              {p.top.map((n, i) => (
                <NumberElement
                  key={n.number}
                  number={n.number}
                  stat={Number((n.frequency/p.total_draws).toPrecision(3))}
                  rank={i + 1}
                  type="hot"
                  weight = {weights[n.number] || 0}
                />
              ))}
            </div>

            <div className="midline">
              <div key={p.label} className="period-header">{p.label}</div>
            </div>

            <div className="bottom-group">
              {p.bottom.map((n, i) => (
                <NumberElement
                  key={n.number}
                  number={n.number}
                  stat={n.frequency/p.bottom.length}
                  rank={i + 1}
                  type="cold"
                  weight = {weights[n.number] || 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}