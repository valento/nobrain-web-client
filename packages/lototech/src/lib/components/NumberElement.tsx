// packages/lototech/src/lib/number-element.tsx

interface NumberElementProps {
  number: number
  stat: number
  rank: number
  type: 'hot' | 'cold'
  weight: number
}


export function NumberElement({ number, stat, rank, type, weight }: NumberElementProps) {
  const border_color = type === 'hot'? 'red' : 'blue'
  const transparency_hot = weight*100/24
  const transparency_cold = weight*100/24
  
  function getGroupColor(number: number): string {
    if (number <= 10) return type === 'hot'? `rgb(255 0 50 / ${transparency_hot}%)` : `rgb(0 165 255 / ${transparency_cold}%)`
    if (number <= 20) return type === 'hot'? `rgb(255 0 50 / ${transparency_hot}%)` : `rgb(0 165 255 / ${transparency_cold}%)`
    if (number <= 30) return type === 'hot'? `rgb(255 0 50 / ${transparency_hot}%)` : `rgb(0 165 255 / ${transparency_cold}%)`
    if (number <= 40) return type === 'hot'? `rgb(255 0 50 / ${transparency_hot}%)` : `rgb(0 165 255 / ${transparency_cold}%)`
    return type === 'hot'? `rgb(255 0 50 / ${transparency_hot}%)` : `rgb(0 165 255 / ${transparency_cold}%)`
  }

  return (
    <div className={`number-element ${type}`} style={{ borderColor: border_color, background: getGroupColor(number) }} data-rank={rank}>
      <span className="element-rank">{weight}</span>
      <span className="element-number">{number}</span>
      <span className="element-stat">{stat}</span>
    </div>
  )
}