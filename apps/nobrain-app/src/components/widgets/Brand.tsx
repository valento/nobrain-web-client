import nobrain from '@/assets/brain.svg'
import UserComponent from './UserComponent'
import { Link } from 'react-router-dom'
export default function Brand ({mode=false}: {mode?:boolean}) {
  return (
    <>  
      <div className='brand'>
        <Link to={'/'}>N<img src={nobrain} alt="logo" width={64} height={64} /> Brain</Link>
        <UserComponent mode={mode} />
      </div>
    </>
  )
}