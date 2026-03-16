import '../lototech.css'
import { useState, useEffect } from 'react'
import { storage, config } from '@nx-mono/broker'
import { LototechPeriodicTable } from './components'

interface NumberStat {
  number: number
  frequency: number
}

interface FrequencyResponse {
  year_from: number
  year_to: number
  numbers: NumberStat[]
}

export function LototechApp({ mode = 'widget' } : { mode?:'widget' | 'full'}) {

  const API_URL = config.apiUrl

  const [view, setView] = useState<'widget' | 'full'>(mode)
  const [hotNumber, setHotNumber] = useState<NumberStat | null>(null)
  const [loading, setLoading] = useState(true)

  const user = storage.getUser()

  useEffect(() => {
    fetch(`${API_URL}/toto2/stats/frequency?year_from=2010&year_to=2026`)
      .then(res => res.json() as Promise<FrequencyResponse>)
      .then((data: FrequencyResponse) => {
        setHotNumber(data.numbers[0])
      })
      .catch(err => console.error('Lototech fetch failed:', err))
      .finally(() => setLoading(false))
  }, [])
  
  if (loading) return <div className="lototech-widget">Loading...</div>

  if (mode === 'widget' && user) {
    return (
      <div className='lototech-cyrilic lototech-hot'>{/*animation class: lototech-hot*/}
        <h1 className=''>🔥T0T0</h1>
        {/* <span className="hot-label">🔥 Hot Number</span> */}
        <p className="number">{hotNumber?.number}</p>
        <p className="body">теглен {hotNumber?.frequency} пъти (за 15г.)</p>
        <button onClick={() => null}>
         {/* виж → */}
        </button>
      </div>
    )
  }

  // Tool mode — placeholder for now
  return (
    <LototechPeriodicTable />
  )
}