interface PollOption {
  id: number
  text: string
  sequence_order: number
  vote_count: number
  percentage: number
}

interface OptionsProp {
  options: PollOption[],
  category?: string | null,
  closing_at?: string | null
}

export default function PieChart ({ options, category='politics', closing_at='' }: OptionsProp) {
  const targetDate = new Date(closing_at || '')
  const now = new Date()
  const diffInMs = targetDate.getTime() - now.getTime()
  const daysLeft = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  const R = 40,
        CX = 50,
        CY = 50,
        main_color = category&&['politics'].includes(category)? '80 170 255' : '51 51 51'
  let cumulativePercent = 0; // Keeps track of the starting point for each slice
  const winner = options.reduce((prev, current) => 
    (prev.percentage > current.percentage) ? prev : current
  );
  const winningIndex = options.findIndex(r => r.percentage === Math.max(...options.map(o => o.percentage)));

  return (
    <div className='pie'>
      <svg width="150" height="150" viewBox="0 0 100 100">
        {
          options.map(( op, _ ) => {
            const rads = op.percentage? op.percentage * 2*Math.PI/100 : 0, //percentage-to-radians
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
                strokeWidth=".3"
              />
        )})}
        <g style={{transform: 'rotate(0deg)', transformOrigin: 'center'}}>
          <text
            x={`${50 + Math.cos(Math.PI*winningIndex)*20}`}
            y='53'
            textAnchor='middle'
            fill='rgba(var(--main-color) / 1)'
            style={{ fontFamily: 'Roboto, sans-serif', fontSize: '.7rem' }}
          >
            {winner.percentage}%
          </text>
          {closing_at && daysLeft > 0?
            <svg
              x="0"
              y="4" 
              width="1.0rem"
              height="1.0rem"
              viewBox="0 0 24 24"
              fill="#333"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" clip-rule="evenodd" d="M0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5ZM7 7.49991V3H8V7.29289L10.8536 10.1464L10.1464 10.8536L7.14645 7.85355C7.04882 7.75592 7 7.62787 7 7.49991Z" fill="#000000"/>
            </svg> : 
            <svg
              x="0"
              y="2"
              width=".8rem"
              height=".8rem"
              fill='#555'
              viewBox="0 0 419.649 419.648"
            >
              <path d="M346.087,154.619h-7.225V129.04C338.863,57.887,280.977,0,209.825,0C138.673,0,80.786,57.887,80.786,129.04v25.579
                h-7.224c-4.941,0-8.985,4.044-8.985,8.986v247.057c0,4.941,4.044,8.986,8.985,8.986h272.525c4.941,0,8.985-4.045,8.985-8.986
                V163.605C355.073,158.663,351.029,154.619,346.087,154.619z M115.665,129.04c0-51.921,42.24-94.161,94.16-94.161
                s94.159,42.24,94.159,94.161v25.579H115.665V129.04z M232.641,299.93c0,5.674,0.022,37.701,0.022,37.701
                c0,12.614-10.227,22.842-22.841,22.842c-12.615,0-22.841-10.228-22.841-22.842c0,0,0.023-32.027,0.023-37.701
                c0-12.115-23.275-11.385-23.275-40.043c0-25.457,20.637-46.094,46.093-46.094s46.093,20.637,46.093,46.094
                C255.917,288.545,232.641,287.812,232.641,299.93z"/>
            </svg>
          }
          {closing_at &&
            <text
              x="10"
              y="10"
              textAnchor="start"
              fill='#666'
              style={{ fontSize: '.55rem', fontWeight: '', fontFamily: '"Roboto", sans-serif' }}
            >
              {`${daysLeft > 0? daysLeft+' дни' : 'затв'}`}
            </text>
          }
        </g>
      </svg>
    </div>
        
  )
}