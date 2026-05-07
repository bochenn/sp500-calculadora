import { useState, useRef } from 'react'

export default function AmountInput({ value, onChange }) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const displayValue = value > 0 ? '$' + value.toLocaleString('en-US') : ''

  function handleChange(e) {
    const digits = e.target.value.replace(/[^0-9]/g, '')
    onChange(digits ? parseInt(digits, 10) : 0)
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={`flex items-center justify-center border-2 rounded-2xl py-3.5 px-5
        cursor-text transition-colors duration-150
        ${isFocused || value > 0 ? 'border-[#00D632]' : 'border-[#D1D1D1]'}`}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="$0"
        className="text-[42px] font-bold leading-none bg-transparent outline-none
          text-black placeholder-[#C7C7CC] tabular-nums text-center w-full min-w-0"
      />
    </div>
  )
}
