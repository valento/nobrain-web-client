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
  const nowMM = new Date().getMonth
  const nowYYYY = new Date().getFullYear()
  const hot_number_YYYY = nowYYYY

  // const [view, setView] = useState<'widget' | 'full'>(mode)
  const [hotNumber, setHotNumber] = useState<NumberStat | null>(null)
  const [loading, setLoading] = useState(true)

  // const user = storage.getUser()

  useEffect(() => {
    fetch(`${API_URL}/toto2/stats/frequency?year_from=${hot_number_YYYY.toString()}&year_to=${nowYYYY.toString()}`)
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
      <div className='lototech-cyrilic lototech-hot' onClick={() => navigate('/play/LototechApp/22')}>
        <div className='loto-logo'>
          <svg
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 1.5rem 1.5rem" xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx=".75rem" cy=".75rem" r=".64rem" stroke="#ff5500" stroke-width=".2rem" fill="none" />
            <svg
              width="1.35rem"
              height="1.35rem"
              fill="#ff5500"
              viewBox="-14 -9 35 35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M250.766275,121 L257.307151,112.675249 C257.597723,112.30543 257.45796,112 256.989522,112
                L252.837704,112 L257.385168,104.724056 C257.635505,104.323518 257.453413,104 256.979366,104 L251.265048,104
                C251.024937,104 250.778118,104.178755 250.704616,104.399261 L247.106366,115.194013
                C246.957416,115.640864 247.217499,116 247.686001,116 L250.837704,116 L248.837704,121 L246.310817,121
                C246.033476,121 245.921271,121.192928 246.058538,121.42807 L247.89381,124.57193
                C248.031821,124.808347 248.345798,124.884602 248.581906,124.749782
                L254.275822,121.498515 C254.757992,121.223193 254.698369,121 254.1493,121 L250.766275,121 Z"
                transform="translate(-246 -104)"/>
            </svg>
          </svg>
          <p>
            &nbsp;T0T0T0
          </p>
        </div>
        <p className="number">{hotNumber?.number}</p>
        <p className="body">{hotNumber?.frequency} тиража</p>
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