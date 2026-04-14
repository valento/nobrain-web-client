import type React from 'react'
import SearchResult from './SearchResult'
import { useRef, useState } from 'react'
import type { SearchResultItem } from '@/types'
import { searchContent } from '@/services/api'

export default function SearchWidget () {
  const [results, setResults] = useState<SearchResultItem[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const search = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.currentTarget.value

    if (timerRef.current) clearTimeout(timerRef.current)

    if (value.length < 2) {
      setResults([])
      return
    }

    timerRef.current = setTimeout(async () => {
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
      <h1 className='title'>Ask anything... we might know <span className='title-span'> ٩(◕‿◕)۶</span></h1>
      <input id='form100' name='search_form' onChange={search} className='form' type='text' />
      <div>
        {
          results.length? results.map( item => <div><SearchResult key={item.id} {...item} /></div> ) : null
        }
      </div>
      <div className='footer'>we answer only what we know about...</div>

    </div>
  )
}