export default function SelectorButton({ children, selected, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center py-3 rounded-[12px] font-semibold text-[14px]
        transition-all duration-100 select-none active:scale-[0.97]
        ${selected
          ? 'border-2 border-black bg-white text-black'
          : 'border border-[#D1D1D6] bg-white text-black'
        } ${className}`}
    >
      {children}
    </button>
  )
}
