import { useState } from 'react'

function InfoIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

export default function InfoTooltip({ content }) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className="relative inline-flex items-center shrink-0"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
    >
      <span className={`cursor-default transition-colors duration-100 outline-none
        ${visible ? 'text-black' : 'text-[#C7C7CC]'}`}>
        <InfoIcon />
      </span>

      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-30 pointer-events-none
          animate-fadeSlideUp">
          <div className="bg-black text-white text-[12px] leading-relaxed rounded-lg
            px-3 py-2.5 w-[220px] shadow-lg">
            {content}
          </div>
          {/* Flecha */}
          <div className="flex justify-center mt-0">
            <div className="w-0 h-0
              border-l-[5px] border-l-transparent
              border-r-[5px] border-r-transparent
              border-t-[6px] border-t-black" />
          </div>
        </div>
      )}
    </div>
  )
}
