import '../lototech.css'
import { useState, useEffect } from 'react'
import { storage, config } from '@nx-mono/broker'
import { LototechPeriodicTable } from './components'
import { useNavigate } from 'react-router-dom'


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
  const navigate = useNavigate()

  const API_URL = config.apiUrl

  // const [view, setView] = useState<'widget' | 'full'>(mode)
  const [hotNumber, setHotNumber] = useState<NumberStat | null>(null)
  const [loading, setLoading] = useState(true)

  // const user = storage.getUser()

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

  if (mode === 'widget') {
    return (
      <div className='lototech-cyrilic lototech-hot' onClick={() => navigate('/play/LototechApp')}>
        <h1 className=''>
          <svg version="1.1"
            id="svg2"
            xmlns="http://www.w3.org/2000/svg"
            width="1.3rem"
            height="1.3rem"
            fill="#ff5500"
            viewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200">
            <path id="path8046" inkscape:connector-curvature="0" d="M381.64,1200C135.779,1061.434,71.049,930.278,108.057,751.148
              c27.321-132.271,116.782-239.886,125.36-371.903c38.215,69.544,54.183,119.691,58.453,192.364
              C413.413,422.695,493.731,216.546,498.487,0c0,0,316.575,186.01,337.348,466.98c27.253-57.913,40.972-149.892,13.719-209.504
              c81.757,59.615,560.293,588.838-64.818,942.524c117.527-228.838,30.32-537.611-173.739-680.218
              c13.628,61.319-10.265,290.021-100.542,390.515c25.014-167.916-23.8-238.918-23.8-238.918s-16.754,94.054-81.758,189.065
              C345.537,947.206,304.407,1039.291,381.64,1200L381.64,1200z"/>
          </svg>
          &nbsp;T0T0T0
        </h1>
        <p className="number">{hotNumber?.number}</p>
        <p className="body">теглен {hotNumber?.frequency} пъти (за 15г.)</p>
        <button onClick={() => null}>
        </button>
      </div>
    )
  }

  // Tool mode — placeholder for now
  return (
    <LototechPeriodicTable />
  )
}