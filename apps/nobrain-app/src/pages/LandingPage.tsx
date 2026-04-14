import { storage } from '@nx-mono/broker'
import '../App.css'

import { UserWidget } from '@nx-mono/user-widget'
import Brand from '../components/widgets/Brand'
import SearchWidget from '../components/widgets/SearchWidget'
import ColumnComponent from '@/components/ui/ColumnComponent'
import { useEffect, useState } from 'react'
import type { BrickFeedResponse } from '@/types'

export default function Landing() {

  const API_URL = import.meta.env.VITE_API_NET || 'http://localhost:8000'
  const token = storage.getToken()
  const user = storage.getUser()

  const [bricks, setBricks] = useState<BrickFeedResponse | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/content/feed`)
      .then(r => r.json() as Promise<BrickFeedResponse>)
      .then((data: BrickFeedResponse) => setBricks(data))
  }, [])

  if (!bricks) return <p>Loading...</p>

  return (
      <div className="page-grid">

{/* ======== Left ================================================================================ */}
        <div>
          <ColumnComponent bricks={bricks?.left} />
        </div>
{/* ======== Center ================================================================================ */}

        <div className="column center">
          <div className="brick"><Brand mode={false} /></div>
          <div><UserWidget /></div>
          <div className="brick">
            <div className='widget'><SearchWidget /></div>
          </div>
          {/* Ordered Readings */}
          <ColumnComponent bricks={bricks?.center} />
        </div>

{/* ======== Right ================================================================================ */}
        <div className="column">
          <div className="brick">
            <div className="widget number">
              <div className='timestamp'>services | Oct 01, 2025</div>
            </div>
            <div className="widget number">
              <div className='timestamp'>services | Oct 01, 2025</div>
            </div>
          </div>
          <div className="brick">
            <div className="widget theme-inter">
              <div className='timestamp dark'>services | Oct 01, 2025</div>
              <div className='header'>
                <h1>This is a very long story title</h1>
                <p>by Julian Langestraat, Global Brand Ambassador</p>
              </div>
              
              <div className='body'>There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by injected humour, or...
              </div>
            </div>
          </div>
          <div className="brick">
            <div className="widget number">
              <div className='timestamp dark'>services | Oct 01, 2025</div>
              <div className="header">
                Lorem Ipsum
                <div className="subheader">by Julian Langestraat, Global Brand Ambassador</div>
              </div>
              
              <div className='body'>There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by injected humour, or...
              </div>
            </div>
          </div>
          <div className="brick">
            <div className="widget number">
              <div className='timestamp'>services | Oct 01, 2025</div>
              <div className="header">
                Lorem Ipsum
                <div className="subheader">by Julian Langestraat, Global Brand Ambassador</div>
              </div>
              
              <div className='body'>There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by injected humour, or...
              </div>
            </div>
          </div>
          {/* Try Stack */}
          <div className="brick">
            
            <div className="widget">
              <div className='timestamp'>services | Oct 01, 2025</div>
              <div className="header">Title</div>
              <div className='body'>Lorem Ipsum is simply dummy text of the printing and
                typesetting industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley of type and scrambled
              </div>
            </div>
            {/* Stacked Widgets */}
            <div className="stack">
              <div className='widget'>
                <div className='timestamp dark'>services | Oct 01, 2025</div>
                <div className="header">
                  Lorem Ipsum
                  <div className="subheader">by Albert A., Global Brand</div>
                </div>
              </div>

              <div className="widget">    
                <div className='timestamp dark'>services | Oct 01, 2025</div>
                <div className="header">
                  Ipsum Dolorem
                  <div className="subheader">by Albert A., Global Brand</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
  )
}


/**
      <div className="brick">
        <div className='widget number'>
          <div className='timestamp dark'>services | Oct 01, 2025</div>
          <div className="header">
            Lorem Ipsum
            <div className="subheader">by Julian Langestraat, Global Brand Ambassador</div>
          </div>
          
          <div className='body short'>There are many variations of passages of Lorem Ipsum available,
            but the majority have suffered alteration in some form, by injected humour, or...
          </div>
        </div>
        <div className='widget number'>
          <div className='timestamp'>services | Oct 01, 2025</div>
        </div>
      </div>
 */