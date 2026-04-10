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

export default function DonutChart({ options, category='politics' }: OptionsProp) {
  
  let  R = 40, CX = 50, CY = 50
  const circumference = 2 * Math.PI * R; // ~251.32
  const gapSize = .5; // Fixed gap in "units" (around 3px visually)
  const main_color = category && ['politics'].includes(category)? '80 170 255' : '51 51 51'
  
  // Calculate the total gap "cost" in terms of circumference
  // If you have 4 segments, you have 4 gaps.
  const totalGapValue = options.length * gapSize;
  const availableCircumference = circumference - totalGapValue;

  let cumulativeOffset = 0;

  if(!options.length) return <>No data</>

  // Find highest percentage for the center text
  const winner = options.reduce((prev, current) => 
    (prev.percentage > current.percentage) ? prev : current
  );

  if (winner.percentage > 99) return (
    <div style={{ width: '150px', height: '150px' }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          key={2347623}
          cx={CX}
          cy={CY}
          r={R}
          fill="transparent"
          stroke='rgba(250 250 250 / .5)'
          strokeWidth="10"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <g style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fill='rgb(250 250 250)'
            style={{ fontSize: '17px', fontFamily: 'sans-serif' }}
          >
            0
          </text>
        </g>
      </svg>
    </div>
  )

  // 1. Find the midpoint percentage of the winning segment
  const winningIndex = options.findIndex(r => r.percentage === Math.max(...options.map(o => o.percentage)));
  const percentageBefore = options.slice(0, winningIndex).reduce((sum, r) => sum + r.percentage, 0);
  const midPointPercent = percentageBefore + (options[winningIndex].percentage / 2);

  // 2. Convert 0-100 percentage to 0-360 degrees
  const rotationAngle = (midPointPercent / 100) * 360;

  return (
    <div style={{ width: '150px', height: '150px' }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        style={{ transform: 'rotate(-90deg)' }}
      >
        
        {options.map((op: PollOption, index: number) => {
          // const largeArcFlag = options[0].percentage && options[0].percentage > 50 ? 1 : 0
          // const rad = option.percentage? option.percentage * 2*Math.PI/100 : 0
          const strokeLength = (op.percentage / 100) * availableCircumference;
          const currentOffset = cumulativeOffset;
          const perc = op.percentage/100
          cumulativeOffset += (strokeLength + gapSize);

          return (
            <>
            {
              winner.percentage === op.percentage &&
            // {/* The Pointer Line (The "Clock Hand") */}
              <line 
                x1="70" 
                y1="50" 
                x2="90" // Length is 20 units (50 to 70)
                y2="50" 
                stroke="#333" 
                strokeWidth=".5" 
                strokeLinecap="round"
                style={{ 
                  transform: `rotate(${rotationAngle}deg)`, 
                  transformOrigin: '50px 50px', // Crucial: rotate around center
                  transition: 'transform 0.5s ease-in-out' 
                }}
              />
            }
            <circle
              key={index}
              cx={CX}
              cy={CY}
              r={R}
              fill="transparent"
              stroke={`rgb(${main_color} / ${perc>0.5? (perc+1)/2 : (perc-0.5)/16 + perc})`}
              strokeWidth="12"
              strokeDasharray={`${strokeLength} ${circumference}`}
              strokeDashoffset={-currentOffset}
              // strokeLinecap="round" // Optional: makes the gap ends rounded/softer
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
            </>
          );
        })}

        {/* Center Text - Rotated back to 0deg */}
        <g style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>
          <text
            x="50"
            y="53"
            textAnchor="middle"
            style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: 'sans-serif' }}
          >
            {winner.percentage}
          </text>
          <text 
            x="50"
            y="58"
            textAnchor="middle"
            style={{ fontSize: '5px', fill: '#666', fontFamily: 'sans-serif', letterSpacing: '1px' }}
          >
            {winner.text.split(' ').slice(0,1)}
          </text>
        </g>
      </svg>
    </div>
  )
}
