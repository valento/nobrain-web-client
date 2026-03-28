import { ChordDiagram, NumberTrend } from './components'
import { LototechApp } from './lototech'

export const LototechAppPage = () => {

  return (
    <>

    {/* ====================================================================== */}
    {/* ============= Your APP here... ======================================= */}
    <div className="page-grid">
      <div className="column">
        {/*  */}
        <NumberTrend number={37} type='hot' />
        <ChordDiagram />
        <NumberTrend number={24} type='hot' />
        <NumberTrend number={10} type='hot' />
        {/* <NumberTrend number={12} type='hot' />
        <NumberTrend number={32} type='hot' /> */}
      </div>
      <div className="column center">
        <LototechApp mode='full'/>
      </div>
      <div className="column">
        
      </div>
    </div>
    </>
  )
}