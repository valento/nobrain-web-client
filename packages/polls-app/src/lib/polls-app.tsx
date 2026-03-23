// packages/polls-widget/src/lib/polls-widget.tsx
import { useState, useEffect } from 'react'
import { config, storage } from '@nx-mono/broker'
import '../polls.css'

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
  pollId: number
}

export function PollsApp({ contentId, mode='widget' }: {contentId: PollsAppProps, mode?: 'full' | 'widget'}) {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [voted, setVoted] = useState(false)
  const [ratingValue, setRatingValue] = useState(5)

  useEffect(() => {
    const token = storage.getToken()
    fetch(`${config.apiUrl}/polls/${contentId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(res => res.json() as Promise<Poll>)
      .then(data => {
        setPoll(data)
        setVoted(data.user_voted)
      })
      .finally(() => setLoading(false))
  }, [contentId])

  const handleVote = async (optionId: number) => {
    const token = storage.getToken()
    if (!token) {
      alert('Login required to vote')
      return
    }

    const res = await fetch(`${config.apiUrl}/polls/${pollId}/vote`, {
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

  if (loading) return <div className="polls-widget">Loading...</div>
  if (!poll) return <div className="polls-widget">Poll not found</div>

  if ( mode === 'widget' ) {
    return (
      <div>Poll Widget</div>
    )
  }

  return (
    <div className={`polls-widget polls-${poll.poll_type}`}>
      <h3 className="poll-question">{poll.question}</h3>
      <span className="poll-votes">{poll.total_votes} votes</span>

      {/* Results bars — always visible */}
      <div className="poll-results">
        {poll.options.map(opt => (
          <div key={opt.id} className="poll-option">
            <div className="poll-bar-row">
              <span className="poll-option-text">{opt.text}</span>
              <span className="poll-option-pct">{opt.percentage}%</span>
            </div>
            <div className="poll-bar">
              <div
                className="poll-bar-fill"
                style={{ width: `${opt.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Vote controls — shown if not voted and not closed */}
      {!voted && !poll.is_closed && (
        <div className="poll-actions">
          {poll.poll_type === 'binary' && (
            <div className="poll-binary">
              {poll.options.map(opt => (
                <button key={opt.id} onClick={() => handleVote(opt.id)}>
                  {opt.text}
                </button>
              ))}
            </div>
          )}

          {poll.poll_type === 'single' && (
            <div className="poll-single">
              {poll.options.map(opt => (
                <button key={opt.id} onClick={() => handleVote(opt.id)}>
                  {opt.text}
                </button>
              ))}
            </div>
          )}

          {poll.poll_type === 'rating' && (
            <div className="poll-rating">
              <input
                type="range"
                min={1}
                max={poll.options.length}
                value={ratingValue}
                onChange={e => setRatingValue(Number(e.target.value))}
              />
              <span>{ratingValue}</span>
              <button onClick={() => handleVote(poll.options[ratingValue - 1].id)}>
                Rate
              </button>
            </div>
          )}
        </div>
      )}

      {voted && <span className="poll-voted">✓ You voted</span>}
      {poll.is_closed && <span className="poll-closed">Poll closed</span>}
    </div>
  )
}