interface PollOption {
  id: number
  text: string
  sequence_order: number
  vote_count: number
  percentage: number
}

interface OptionsProp {
  options: PollOption[],
  category?: string | null
}

export default function PieChart ({ options, category='politics' }: OptionsProp) {
  const R = 40,
        CX = 50,
        CY = 50,
        main_color = category&&['politics'].includes(category)? '80 170 255' : '51 51 51'
  let cumulativePercent = 0; // Keep track of the starting point for each slice

  return (
    <div className='pie'>
      <svg width="150" height="150" viewBox="0 0 100 100">
        {
          options.map(( op, _ ) => {
            const rads = op.percentage? op.percentage * 2*Math.PI/100 : 0,
                  largeArcFlag = op.percentage && op.percentage > 50 ? 1 : 0,
                  perc = op.percentage/100
            const startAngle = (cumulativePercent * 2 * Math.PI) / 100 - Math.PI / 2;
            const endAngle = ((cumulativePercent + op.percentage) * 2 * Math.PI) / 100 - Math.PI / 2;
            // Start point coordinates
            const startX = CX + R * Math.cos(startAngle);
            const startY = CY + R * Math.sin(startAngle);
            // End point coordinates
            const endX = CX + R * Math.cos(endAngle);
            const endY = CY + R * Math.sin(endAngle);
            // Update offset for the next slice
            cumulativePercent += op.percentage;

            return (
              <path
                d={`M ${CX} ${CY} L ${startX} ${startY} A ${R} ${R} 0 ${largeArcFlag} 1  ${endX} ${endY} Z`} 
                fill={`rgb(${main_color} / ${perc>0.5? (perc+1)/2 : (perc-0.5)/2 + perc})`}
                stroke="rgba(var(--main-color) / 1)" 
                stroke-width=".3"
              />
        )})}
      </svg>
    </div>
        
  )
}