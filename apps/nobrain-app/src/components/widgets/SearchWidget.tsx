import type React from 'react'
import SearchResult from './SearchResult'
import { useRef, useState } from 'react'
import type { SearchResultItem } from '@/types'
import { searchContent } from '@/services/api'

export default function SearchWidget () {
  const [results, setResults] = useState<SearchResultItem[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const dummy_data = {
    id: 98709,
    title: 'Lorem Dolores Ipsum',
    metadata: {'content_type': 'service'},
    snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor, quis nostrum exercitationem ullam corporis suscipit laboriosam',
    semantic_simliraty: 2135,
    url: '/read/blog/89743',
    semantic_similarity: 34,
    priority: 343,
    final_score: 34,
  }

  /** 
   * id: number
   *title: string
   *snippet: string
   *metadata: Record<string, unknown>
   *semantic_similarity: number
   *priority: number
   *final_score: number
   *url: string
  */

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.currentTarget.value

    if (timerRef.current) clearTimeout(timerRef.current)

    if (value.length < 2) {
      setResults([])
      return
    }

    timerRef.current = setTimeout(async () => {
      console.log('Query these...', value)
      try {
        const data = await searchContent(value)
        setResults(data)
        
      } catch (err) {
        console.log(err)
      }
    }, 300)
  }

  return (
    <div className='search'>
      <h1 className='title'>Ask anything... we might know <span style={{marginLeft: '28px', fontSize: '14px'}}>٩(◕‿◕)۶</span></h1>
      <input id='form100' name='search_form' onChange={search} className='form' type='text' />
      <div style={{borderTop: '8px solid rgba(var(--main-color) / .1)'}}>
        {
          results.length? results.map( item => <div><SearchResult key={item.id} {...item} /></div> ) : <div><SearchResult key={'(*Dh98)'} {...dummy_data} /></div>
        }
      </div>
      <div className='footer'>we answer only what we know about...</div>

    </div>
  )
}