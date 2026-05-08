import logo from '../assets/RGB_CashApp_Symbol_Green.svg'
import { ASSETS } from '../data/assets.js'
import { STOCK_ICONS } from '../utils/stockIcons.jsx'
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
    <section
      className="w-full bg-[#F5F5F5] flex flex-col min-h-screen sm:max-h-screen pt-8 sm:pt-10 pb-6 sm:pb-8"
    >
      <div className="max-w-[1040px] w-full mx-auto px-8 sm:px-12 text-center flex flex-col flex-1 justify-between">

        {/* Zona superior: logo + título + subtítulo */}
        <div>
          <img
            src={logo}
            alt="Cash App"
            className="w-12 h-12 brightness-0 mx-auto mb-6"
          />
          <div key={selectedStockKey} className="animate-fadeSlideUp">
            <h1 className="text-[32px] sm:text-[52px] font-extrabold text-black
              tracking-[-0.02em] leading-[1.05] mb-3">
              Invertir en {asset.name}
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#6B7280] leading-relaxed max-w-[520px] mx-auto">
              {asset.subtitle}
            </p>
          </div>
        </div>

        {/* Zona central: chart — ocupa el espacio disponible */}
        <div
          className="w-full"
          style={{ height: '280px' }}
        >
          <PerformanceChart
            returns={asset.returns}
            color={asset.color}
            name={asset.name}
          />
        </div>

        {/* Zona inferior: carousel + CTA */}
        <div>
          <div className="relative">
            {/* Fades laterales */}
            <div className="absolute left-0 top-0 h-full w-12 pointer-events-none z-10"
              style={{ background: 'linear-gradient(to right, #F5F5F5, transparent)' }} />
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

          <div className="max-w-[300px] mx-auto mt-4">
            <Button onClick={onScrollToCalculator}>
              Calcular tu inversión y retorno
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}
