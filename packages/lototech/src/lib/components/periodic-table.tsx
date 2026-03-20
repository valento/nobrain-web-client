// packages/lototech/src/lib/periodic-table.tsx
import { useState, useEffect } from 'react'
import { config } from '@nx-mono/broker'
import { NumberElement } from './number-element'

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
          width="1.3rem"
          height="1.3rem"
          viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
          <path d="M128,20A108,108,0,1,0,236,128,108.12186,108.12186,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09562,84.09562,0,0,1,128,212Zm29.50391-87.38477-29.51075,39.37891H152a12,12,0,0,1,0,24H104.39648c-.13281.00488-.26464.00684-.39843.00684a12.00272,12.00272,0,0,1-9.47168-19.36914l43.56543-58.13379a12.00426,12.00426,0,1,0-21.1543-11.165A11.9998,11.9998,0,0,1,94.834,89.9834a36.00408,36.00408,0,1,1,63.01172,34.15234C157.73535,124.29883,157.62207,124.458,157.50391,124.61523Z"/>
        </svg>&nbsp;Alchemy</h1>
        <h2 className='cinzel-roman-capita'>
          ═ &nbsp;&nbsp;periodic&nbsp;
          <svg
            width="2rem"
            height="2rem"
            transform="rotate(30)"
            viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path d="M20,12.93V4h2V2H10V4h2v8.93a9,9,0,1,0,8,0Zm.66,13.29A6.88,6.88,0,0,1,15.18,28a7,7,0,0,1-5-3.17A4.15,4.15,0,0,1,14,22a4.49,4.49,0,0,1,3.27,1.58,8.31,8.31,0,0,0,3.83,2.21A4.47,4.47,0,0,1,20.66,26.22ZM22.33,24a5.87,5.87,0,0,1-3.73-1.88A6.37,6.37,0,0,0,14,20a5.86,5.86,0,0,0-4.83,2.44,4.36,4.36,0,0,1-.11-.52,7,7,0,0,1,4.32-7.41l.62-.93V4h4V6H16V8h2V9H16v2h2v1H16v2h2.28l.34.51A7,7,0,0,1,22.33,24Z"/>
              <path d="M21.1,25.79a4.47,4.47,0,0,1-.44.43A6.88,6.88,0,0,1,15.18,28a7,7,0,0,1-5-3.17A4.15,4.15,0,0,1,14,22a4.49,4.49,0,0,1,3.27,1.58A8.31,8.31,0,0,0,21.1,25.79Z"/>
            </g>
          </svg>
          &nbsp;table&nbsp;&nbsp; ═
        </h2>
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