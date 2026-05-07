import logo from '../assets/RGB_CashApp_Symbol_Green.svg'
import { ASSETS } from '../data/assets.js'
import { STOCK_ICONS } from '../utils/stockIcons.js'
import PerformanceChart from './PerformanceChart.jsx'
import Button from './ui/Button.jsx'

export default function StockCarousel({ selectedStockKey, onStockChange, onScrollToCalculator }) {
  const asset = ASSETS[selectedStockKey] || ASSETS['SP500']

  const tabs = Object.entries(ASSETS).map(([key, a]) => {
    const Icon = STOCK_ICONS[key]
    const selected = selectedStockKey === key
    return (
      <button
        key={key}
        onClick={() => onStockChange(key)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold
          shrink-0 transition-colors border-2
          ${selected
            ? 'bg-black text-white border-black'
            : 'bg-white text-[#555] border-[#E5E5E5] hover:border-[#ABABAB]'
          }`}
      >
        {Icon && <Icon size={12} />}
        {a.ticker}
      </button>
    )
  })

  return (
    <section className="w-full bg-[#F5F5F5] py-20 sm:py-28">
      <div className="max-w-[1040px] mx-auto px-8 sm:px-12 text-center">

        {/* Logo — negro sólido via brightness-0 */}
        <img
          src={logo}
          alt="Cash App"
          className="w-12 h-12 brightness-0 mx-auto mb-14"
        />

        {/* Contenido dinámico — fadeSlideUp al cambiar de activo */}
        <div key={selectedStockKey} className="animate-fadeSlideUp">
          <h1 className="text-[40px] sm:text-[64px] font-extrabold text-black
            tracking-[-0.02em] leading-[1.05] mb-4">
            Invertir en {asset.name}
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#6B7280] leading-relaxed max-w-[520px] mx-auto">
            {asset.subtitle}
          </p>

          <div className="mt-10">
            <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.08em] mb-5">
              Rendimiento acumulado 2016–2025
            </p>
            <PerformanceChart
              returns={asset.returns}
              color={asset.color}
              name={asset.name}
            />
          </div>
        </div>

        {/* Selector de activos — debajo del contenido */}
        {/* Desktop + tablet: flex-wrap */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2 mt-10">
          {tabs}
        </div>
        {/* Mobile: scroll horizontal sin scrollbar visible */}
        <div
          className="sm:hidden flex overflow-x-auto gap-2 mt-10 pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="flex gap-2 px-1 mx-auto">
            {tabs}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-[300px] mx-auto mt-10">
          <Button onClick={onScrollToCalculator}>
            Calcular tu inversión y retorno
          </Button>
        </div>

      </div>
    </section>
  )
}
