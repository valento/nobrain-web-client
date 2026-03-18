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

interface Weights {
  hot: Record<number, number>
  cold: Record<number, number>
}

export function LototechPeriodicTable() {
  const [periods, setPeriods] = useState<PeriodData[]>([])
  const current_year = new Date().getFullYear()

  function calculateWeights(periods: PeriodData[]): Weights {
      return periods.reduce((weights, period) => {
        period.top.forEach((n, i) => {
          const points = 4 - i  // rank 1=4pts, rank 2=3pts, etc.
          weights.hot[n.number] = (weights.hot[n.number] || 0) + points
        })
        period.bottom.forEach((n, i) => {
          const points = 4 - i
          weights.cold[n.number] = (weights.cold[n.number] || 0) + points
        })
        return weights
      }, {hot: {} as Record<number, number>, cold: {} as Record<number, number>})
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
      <h1 className='header cyrilic-russo'>
        T0T0&nbsp;
        <svg
          fill="#f7e8df"
          width="1.4rem"
          height="1.4rem"
          viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
          <path d="M128,20A108,108,0,1,0,236,128,108.12186,108.12186,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09562,84.09562,0,0,1,128,212Zm29.50391-87.38477-29.51075,39.37891H152a12,12,0,0,1,0,24H104.39648c-.13281.00488-.26464.00684-.39843.00684a12.00272,12.00272,0,0,1-9.47168-19.36914l43.56543-58.13379a12.00426,12.00426,0,1,0-21.1543-11.165A11.9998,11.9998,0,0,1,94.834,89.9834a36.00408,36.00408,0,1,1,63.01172,34.15234C157.73535,124.29883,157.62207,124.458,157.50391,124.61523Z"/>
        </svg>&nbsp;Alchemy</h1>
      <h2 className='cinzel-roman-capita'>═ &nbsp;&nbsp;periodic table&nbsp;&nbsp; ═</h2>
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
                  weight = {weights.hot[n.number] || 0}
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
                  stat={Number((n.frequency/p.total_draws).toPrecision(3))}
                  rank={i + 1}
                  type="cold"
                  weight = {weights.cold[n.number] || 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}