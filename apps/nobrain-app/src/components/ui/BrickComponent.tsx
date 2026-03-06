interface BrickProps {
  brickType: string
  children: React.ReactNode
}

export default function BrickComponent({ brickType, children, }: BrickProps) {
  return (
    <div className={`brick brick--${brickType}`}>
      {children}
    </div>
  )
}