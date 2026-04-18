// packages/polls-widget/src/lib/polls-widget.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { config, storage } from '@nx-mono/broker'
import '../polls.css'
import DonutChart from './components/donnut-chart'
import PieChart from './components/pie-chart'

interface PollOption {
  id: number
  text: string
  sequence_order: number
  vote_count: number
  percentage: number
}

interface Poll {
  id: number
  content_id: number | null
  question: string
  poll_type: 'binary' | 'single' | 'rating'
  status: string
  closes_at: string | null
  options: PollOption[]
  total_votes: number
  user_voted: boolean
  user_option_id: number | null
  is_closed: boolean
}

interface PollsAppProps {
  item?: ContentItem
  mode?: 'widget' | 'full'
  instance_slug?: string
}

interface ContentItem {
  id: number
  title: string
  deck: string | null
  body: string
  author_id: number | null
  author_username: string | null
  parent_id: number | null
  created_at: string
  updated_at: string
  slug: string | null
  content_type: string
  component_name: string | null
  route_path: string | null
  app_config: Record<string, any>
  category: string
  category_id: number | null   // added
  category_slug: string | null // was string, nullable for safety
  priority: number
  widget_size: string
  widget_vertical: boolean
  view_count: number
  social_score: number
  price: number
  metadata: Record<string, any>
  tags: string[]
  sequence_order: number | null
}

export function PollsApp({ item, instance_slug, mode='widget' }: PollsAppProps) {

  const navigate = useNavigate()

  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState(false)
  const [ratingValue, setRatingValue] = useState(5)

  useEffect(() => {
    if (item?.slug || instance_slug) {
      const token = storage.getToken()
      fetch(`${config.apiUrl}/polls/by-content/${item?.slug || instance_slug}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then(res => res.json() as Promise<Poll>)
        .then(data => {
          setPoll(data)
          setLoading(false)
        })
    }
  }, [item?.slug])

  const handleVote = async (optionId: number) => {
    const token = storage.getToken()
    if (!token) {
      alert('Login required to vote')
      return
    }

    const res = await fetch(`${config.apiUrl}/polls/${poll?.id}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },  
      body: JSON.stringify({ option_id: optionId }),
    })

    if (res.ok) {
      const updated = await res.json()
      setPoll(updated)
      setVoted(true)
    }
  }

  if ( mode === 'widget' ) {
    
    return (
      <div className="polls-widget" onClick={() => navigate(`/play/PollsApp/${item?.slug}`)}>
        <div className='title'>
          <span>{item?.category_slug}</span>
          <div>{item?.title}</div>
        </div>
        {poll?.options.length && ['single'].includes(poll.poll_type) && <DonutChart closing_at={poll?.closes_at} category={item?.category_slug} options={poll?.options} />}
        {poll?.options.length && ['binary'].includes(poll.poll_type) && <PieChart closing_at={poll?.closes_at} category={item?.category_slug} options={poll?.options} />}
        
      </div>
    )
  }
  if (loading) return <div className="polls-widget">Loading...</div>
  if (!poll) return <div className="polls-widget">Poll not found</div>

  return (
    <div className={`polls-app polls-${poll.poll_type} roboto-1`}>
      <h3 className="poll-question cyrilic-title">{poll.question}</h3>
      <span className="poll-votes roboto-1">{poll.total_votes} votes</span>

      {/* Results bars — always visible */}
      <div className="poll-results">
        {poll.options.map(opt => (
          <div key={opt.id} className="poll-option-row">
            <div className="poll-option-left">
              <div className="poll-option-header">
                <span className="poll-option-text">{opt.text}</span>
                <span className="poll-option-pct roboto-1">{opt.percentage}%</span>
              </div>
              <div className="poll-bar">
                <div
                  className="poll-bar-fill"
                  style={{ width: `${opt.percentage}%` }}
                />
              </div>
            </div>
            <div className="poll-option-right roboto-1">
              {!voted && !poll.is_closed && (
                <button onClick={() => handleVote(opt.id)}>Vote</button>
              )}
              {voted && opt.id === poll.user_option_id && (
                <span className="poll-voted-mark">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {voted && <span className="poll-voted">✓ You voted</span>}
      {poll.is_closed && <span className="poll-closed">Poll closed</span>}
    </div>
  )
}