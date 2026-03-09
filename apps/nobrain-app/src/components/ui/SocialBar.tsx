import { useEffect, type MouseEvent } from "react"

export default function SocialBar({ url, title }: { url: string; title: string }) {

  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`

  useEffect(() => {
  }, [])

  const handleClick = (_: MouseEvent) => {
  }
  
  return (

    <div className='social-bar'>
      <div><div></div></div>

        {/* <a href={shareUrl} target='_blank' rel='noopener noreferrer'>
          <button className='button-view' onClick={(e) => handleClick(e)}>
            <svg xmlns="http://www.w3.org/2000/svg"
              width="1.1rem"
              height="1.1rem"
              fill="none"
              viewBox="0 0 24 24"
            >
            <path fill-rule="evenodd" clip-rule="evenodd" d="M23 12.0672C23 5.95496 18.0751 1 12 1C5.92486 1 1 5.95496 1 12.0672C1 17.5912 5.02254 22.1697 10.2812 23V15.2663H7.48828V12.0672H10.2812V9.62898C10.2812 6.85525 11.9235 5.32313 14.4361 5.32313C15.6396 5.32313 16.8984 5.53929 16.8984 5.53929V8.26287H15.5114C14.1449 8.26287 13.7188 9.11597 13.7188 9.99119V12.0672H16.7695L16.2818 15.2663H13.7188V23C18.9775 22.1697 23 17.5912 23 12.0672Z" fill="#3F3F46"/>
            </svg>
          </button>
        </a> */}

        <button className='button-social' onClick={(e) => handleClick(e)}>
          <svg version="1.1" id="" xmlns="http://www.w3.org/2000/svg" 
            width="1.1rem"
            height="1.1rem"
            fill= "#333"
            viewBox="0 0 32 32"
          >
          <path d="M31,11c0,11-14,18-15,18S1,22,1,11c0-4.418,3.582-8,8-8c3.014,0,5.636,1.668,7,4.13
            C17.364,4.668,19.986,3,23,3C27.418,3,31,6.582,31,11z"/>
          </svg>
          <span>12.5K</span>
        </button>

      <div><div></div></div>
    </div>
  )
}