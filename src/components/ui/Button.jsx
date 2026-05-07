export default function Button({ variant = 'primary', children, onClick, disabled, className = '' }) {
  const base = 'w-full py-[18px] rounded-full font-semibold text-[17px] transition-all duration-150 select-none'

  const styles = {
    primary: disabled
      ? 'bg-[#E5E5EA] text-[#8E8E93] cursor-not-allowed'
      : 'bg-black text-white active:scale-[0.98] active:bg-[#1a1a1a]',
    secondary: 'bg-[#E5E5EA] text-black active:bg-[#D1D1D6] active:scale-[0.98]',
  }

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
