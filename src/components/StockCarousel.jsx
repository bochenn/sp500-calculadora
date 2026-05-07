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
        onClick={(e) => {
          onStockChange(key)
          e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold
          shrink-0 transition-colors border-2
          ${selected
            ? 'bg-black text-white border-black'
            : 'bg-white text-[#555] border-[#E5E5E5] hover:border-[#ABABAB]'
          }`}
        style={{ scrollSnapAlign: 'center' }}
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

        {/* Selector de activos — fila única con scroll horizontal */}
        <div className="relative mt-10">
          {/* Fade izquierdo */}
          <div className="absolute left-0 top-0 h-full w-12 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to right, #F5F5F5, transparent)' }} />
          {/* Fade derecho */}
          <div className="absolute right-0 top-0 h-full w-12 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to left, #F5F5F5, transparent)' }} />

          <div
            className="flex gap-2 overflow-x-auto py-1 px-1"
            style={{
              flexWrap: 'nowrap',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
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
