import { useState, useEffect } from 'react'
import { storage, config } from "@nx-mono/broker"

interface NumberStat {
  number: number
  frequency: number
}

interface FrequencyResponse {
  year_from: number
  year_to: number
  numbers: NumberStat[]
}

export function LototechApp() {

  const API_URL = config.apiUrl

  const [mode, setMode] = useState<'widget' | 'tool'>('widget')
  const [hotNumber, setHotNumber] = useState<NumberStat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/toto2/stats/frequency`)
      .then(res => res.json() as Promise<FrequencyResponse>)
      .then((data: FrequencyResponse) => {
        setHotNumber(data.numbers[0])
      })
      .catch(err => console.error('Lototech fetch failed:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="lototech-widget">Loading...</div>

  if (mode === 'widget') {
    return (
      <div className="lototech-widget">
        {/* <span className="hot-label">🔥 Hot Number</span> */}
        <p className="hot-number">{hotNumber?.number}</p>
        <span className="hot-freq">drawn {hotNumber?.frequency} times</span>
        <button onClick={() => {
          const user = storage.getUser()
          if (user) {
            setMode('tool')
          } else {
            alert('Login required')  // replace with broker event later
          }
        }}>
          Explore →
        </button>
      </div>
    )
  }

  // Tool mode — placeholder for now
  return (
    <div className="lototech-tool">
      <h2>Lototech Toolbox</h2>
      <p>Full stats coming soon...</p>
      <button onClick={() => setMode('widget')}>← Back</button>
    </div>
  )
}