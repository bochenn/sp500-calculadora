import { useEffect } from 'react'
import { formatearUSD } from '../utils/finance.js'
import { ASSETS } from '../data/assets.js'
import { STOCK_ICONS } from '../utils/stockIcons.jsx'
import Button from './ui/Button.jsx'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDateLong(isoString) {
  return new Date(isoString).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getModeLabel(mode) {
  if (mode === 'MIN') return 'MIN'
  if (mode === 'AVG') return 'AVG'
  if (mode === 'MAX') return 'MAX'
  if (mode === 'EXPECTED_2026') return '2026'
  return 'Manual'
}

function formatReturnUSD(valor) {
  if (valor >= 10000) return '$' + Math.round(valor).toLocaleString('en-US')
  return formatearUSD(valor)
}

function formatReturnPct(pct) {
  if (pct >= 100) return Math.round(pct).toLocaleString('en-US') + '%'
  return pct.toFixed(1) + '%'
}

function formatShortUSD(valor) {
  return '$' + Math.round(valor).toLocaleString('en-US')
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function ReturnBadge({ pct }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#E6F9EB] text-[#00D632]
      text-[14px] font-semibold px-3 py-1 rounded-full tabular-nums">
      ↗ {formatReturnPct(pct)}
    </span>
  )
}

function DistributionBarFull({ totalContributed, compoundGain, targetAmount }) {
  const gainPct = Math.max(0, Math.min(100, (compoundGain / targetAmount) * 100))
  return (
    <div>
      <div className="relative h-2.5 rounded-full bg-[#E5E5E5] overflow-hidden">
        <div className="absolute left-0 top-0 h-full bg-[#00D632] rounded-full"
          style={{ width: `${gainPct}%` }} />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[12px] text-[#8E8E93] tabular-nums">
          Aportado {formatShortUSD(totalContributed)}
        </span>
        <span className="text-[12px] text-[#00D632] font-medium tabular-nums">
          Ganancia {formatShortUSD(compoundGain)}
        </span>
      </div>
    </div>
  )
}

// ── Modal principal ───────────────────────────────────────────────────────────

export default function CalcDetailModal({ calc, onClose, onLoadInCalculator }) {
  useEffect(() => {
    if (!calc) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [calc, onClose])

  useEffect(() => {
    document.body.style.overflow = calc ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [calc])

  if (!calc) return null

  const stockKey = calc.stockKey || 'SP500'
  const asset = ASSETS[stockKey] || ASSETS['SP500']
  const Icon = STOCK_ICONS[stockKey] || STOCK_ICONS['SP500']
  const retornoPct = (calc.compoundGain / calc.totalContributed) * 100

  function handleLoad() {
    onLoadInCalculator(calc)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Panel */}
      <div
        className="relative bg-white w-full max-w-[480px] rounded-[24px] shadow-2xl
          overflow-y-auto max-h-[90dvh] animate-modalIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-0">
          <div>
            <h2 className="text-[20px] font-bold text-black">Detalle del cálculo</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[13px] text-[#8E8E93] capitalize">
                {formatDateLong(calc.createdAt)}
              </p>
              {/* Stock badge */}
              <span
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: asset.color + '20', color: asset.color }}
              >
                <Icon size={10} />
                {asset.ticker}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8E8E93] hover:text-black transition-colors p-1 -mt-1 -mr-1"
            aria-label="Cerrar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 pt-5 space-y-5">
          {/* Objetivo y configuración */}
          <div>
            <p className="text-[36px] font-extrabold text-black tabular-nums tracking-tight leading-none">
              {formatReturnUSD(calc.targetAmount)}
            </p>
            <p className="text-[14px] text-[#8E8E93] mt-1.5">
              {calc.years} años · {getModeLabel(calc.rateMode)} {calc.annualRate}%
            </p>
          </div>

          <div className="border-t border-[#F2F2F7]" />

          {/* Aporte mensual */}
          <div className="text-center py-1">
            <p className="text-[13px] text-[#8E8E93] mb-1.5">Aportá por mes</p>
            <p className="text-[60px] font-extrabold text-black leading-none tabular-nums tracking-[-0.02em]">
              {formatearUSD(calc.monthlyContribution)}
            </p>
          </div>

          <div className="border-t border-[#F2F2F7]" />

          {/* Métricas en 3 columnas */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#F5F5F5] rounded-2xl p-3">
              <p className="text-[11px] text-[#8E8E93] mb-1.5 leading-tight">Total aportado</p>
              <p className="text-[15px] font-bold text-black tabular-nums">
                {formatReturnUSD(calc.totalContributed)}
              </p>
            </div>
            <div className="bg-[#F5F5F5] rounded-2xl p-3">
              <p className="text-[11px] text-[#8E8E93] mb-1.5 leading-tight">Retorno $</p>
              <p className="text-[15px] font-bold text-[#00D632] tabular-nums">
                {formatReturnUSD(calc.compoundGain)}
              </p>
            </div>
            <div className="bg-[#F5F5F5] rounded-2xl p-3">
              <p className="text-[11px] text-[#8E8E93] mb-1.5 leading-tight">Retorno %</p>
              <ReturnBadge pct={retornoPct} />
            </div>
          </div>

          {/* Barra de distribución */}
          <DistributionBarFull
            totalContributed={calc.totalContributed}
            compoundGain={calc.compoundGain}
            targetAmount={calc.targetAmount}
          />

          {/* Botones */}
          <div className="flex gap-3 pt-1">
            <div className="flex-1">
              <Button variant="secondary" onClick={onClose}>Cerrar</Button>
            </div>
            <div className="flex-1">
              <Button variant="primary" onClick={handleLoad}>Cargar en calculadora</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
