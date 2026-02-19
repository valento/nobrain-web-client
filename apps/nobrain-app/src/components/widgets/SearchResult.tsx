import type { SearchResultItem } from '@/types'
import { Link } from 'react-router-dom'

export default function SearchResult (props: SearchResultItem) {
  return (
    <Link className='result' to={props.url}>
      <p><span className='result-type'>{'type'}</span>&nbsp;&nbsp;{props.title} &#x2192;</p>
      <p className='snippet'>{props.snippet}</p>
    </Link>
  )
}