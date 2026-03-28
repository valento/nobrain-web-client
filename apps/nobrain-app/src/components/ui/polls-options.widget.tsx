// polls-options.widget.tsx
export interface PollOption {
  text: string
  sequence_order: number
}

export interface PollsOptionsWidgetProps {
  value: PollOption[]
  onChange: (options: PollOption[]) => void
}

export function PollsOptionsWidget({ value = [], onChange }: PollsOptionsWidgetProps) {
  const addOption = () => {
    onChange([...value, { text: '', sequence_order: value.length }])
  }

  const updateOption = (index: number, text: string) => {
    const updated = value.map((opt, i) =>
      i === index ? { ...opt, text } : opt
    )
    onChange(updated)
  }

  const removeOption = (index: number) => {
    const updated = value
      .filter((_, i) => i !== index)
      .map((opt, i) => ({ ...opt, sequence_order: i }))  // resequence
    onChange(updated)
  }

  return (
    <div className="polls-options-widget">
      {value.map((opt, i) => (
        <div key={i} className="poll-option-row">
          {/* <span className="option-order">{i + 1}</span> */}
          <input
            type="text"
            value={opt.text}
            placeholder={`Option ${i + 1}`}
            onChange={e => updateOption(i, e.target.value)}
          />
          <button type="button" onClick={() => removeOption(i)}>✕</button>
        </div>
      ))}
      <div className='add-button' onClick={addOption}>
        <span className='button-icon'>
          <svg
            fill="#333"
            width="2.6rem"
            height="2.6rem"
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M856 40H142q-42 0-72 30t-30 72v714q0 42 30 72t72 30h714q42 0 72-30t30-72V142q0-42-30-72t-72-30zM754 550H550v204H448V550H244V448h204V244h102v204h204v102z"/>
          </svg>
        </span>
        add poll option
      </div>
    </div>
  )
}