import { useState } from 'react'
import { formatearUSD, formatPercentage } from '../utils/finance.js'
import { deleteCalculation } from '../utils/storage.js'
import { ASSETS } from '../data/assets.js'
import { STOCK_ICONS } from '../utils/stockIcons.js'
import CalcDetailModal from './CalcDetailModal.jsx'

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString) {
  const d = new Date(isoString)
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getFullYear()).slice(2)}`
}

function getModeLabel(mode) {
  if (mode === 'MIN') return 'MIN'
  if (mode === 'AVG') return 'AVG'
  if (mode === 'MAX') return 'MAX'
  return 'Manual'
}

function formatReturnUSD(valor) {
  if (valor >= 10000) return '$' + Math.round(valor).toLocaleString('en-US')
  return formatearUSD(valor)
}

function formatShortUSD(valor) {
  return '$' + Math.round(valor).toLocaleString('en-US')
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function ReturnBadge({ pct }) {
  return (
    <span className="inline-flex items-center gap-0.5 bg-[#E6F9EB] text-[#00D632]
      text-[12px] font-semibold px-2 py-0.5 rounded-full tabular-nums whitespace-nowrap">
      ↗ {formatPercentage(pct)}
    </span>
  )
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function CalculationsTable({ calculations, onDelete, onLoadInCalculator }) {
  const [detailCalc, setDetailCalc] = useState(null)

  if (!calculations.length) return null

  function handleDelete(id) {
    deleteCalculation(id)
    onDelete()
  }

  // Clases de headers — text-align debe coincidir con el de las celdas
  const thBase = 'text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.06em] py-3'

  return (
    <div className="mt-20 pb-16">
      <h2 className="text-[26px] font-bold text-black mb-6">Cálculos previos</h2>

      {/* ── Desktop table (≥900px) ─────────────────────────────────────────── */}
      <div className="hidden min-[900px]:block rounded-2xl border border-[#F0F0F0] overflow-hidden">
        <div className="overflow-x-auto">
          {/*
            table-fixed + colgroup con porcentajes:
            El ancho total es el 100% del contenedor. Cada columna recibe
            exactamente su porcentaje, headers y celdas alineados siempre.
          */}
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: '22%' }} />  {/* ACTIVO */}
              <col style={{ width: '14%' }} />  {/* OBJETIVO */}
              <col style={{ width: '8%' }} />   {/* PLAZO */}
              <col style={{ width: '10%' }} />  {/* TASA */}
              <col style={{ width: '12%' }} />  {/* APORTE MENSUAL */}
              <col style={{ width: '13%' }} />  {/* RETORNO $ */}
              <col style={{ width: '13%' }} />  {/* RETORNO % */}
              <col style={{ width: '8%' }} />   {/* ACCIONES */}
            </colgroup>
            <thead className="bg-white">
              <tr>
                <th className={`${thBase} text-left pl-4`}>Activo</th>
                <th className={`${thBase} text-right pr-4`}>Objetivo</th>
                <th className={`${thBase} text-left pl-4`}>Plazo</th>
                <th className={`${thBase} text-left pl-4`}>Tasa</th>
                <th className={`${thBase} text-right pr-4`}>Aporte mensual</th>
                <th className={`${thBase} text-right pr-4`}>Retorno $</th>
                <th className={`${thBase} text-right pr-4`}>Retorno %</th>
                <th className={`${thBase} text-right pr-4`}></th>
              </tr>
            </thead>
            <tbody>
              {calculations.map((c) => {
                const retornoPct = (c.compoundGain / c.totalContributed) * 100
                const stockKey = c.stockKey || 'SP500'
                const asset = ASSETS[stockKey] || ASSETS['SP500']
                const Icon = STOCK_ICONS[stockKey] || STOCK_ICONS['SP500']

                const tdBase = 'align-middle border-t border-[#F0F0F0] py-3.5'

                return (
                  <tr key={c.id} className="hover:bg-[#FAFAFA] transition-colors">

                    {/* ACTIVO */}
                    <td className={`${tdBase} pl-4`}>
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-8 h-8 flex items-center justify-center rounded-full shrink-0"
                          style={{ background: asset.color + '18', color: asset.color }}
                        >
                          <Icon size={15} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-black truncate leading-tight">
                            {asset.name}
                          </p>
                          <p className="text-[11px] text-[#8E8E93] leading-tight mt-0.5">
                            {asset.ticker}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* OBJETIVO */}
                    <td className={`${tdBase} text-right pr-4`}>
                      <p className="text-[13px] font-semibold text-black tabular-nums whitespace-nowrap">
                        {formatearUSD(c.targetAmount)}
                      </p>
                      <p className="text-[11px] text-[#8E8E93] mt-0.5 whitespace-nowrap">
                        {formatDate(c.createdAt)}
                      </p>
                    </td>

                    {/* PLAZO */}
                    <td className={`${tdBase} pl-4 text-[13px] text-[#8E8E93] whitespace-nowrap`}>
                      {c.years} años
                    </td>

                    {/* TASA */}
                    <td className={`${tdBase} pl-4`}>
                      <p className="text-[13px] font-medium text-black">{getModeLabel(c.rateMode)}</p>
                      <p className="text-[11px] text-[#8E8E93] mt-0.5">{c.annualRate}%</p>
                    </td>

                    {/* APORTE MENSUAL */}
                    <td className={`${tdBase} text-right pr-4 text-[13px] font-bold text-black tabular-nums whitespace-nowrap`}>
                      {formatearUSD(c.monthlyContribution)}
                    </td>

                    {/* RETORNO $ */}
                    <td className={`${tdBase} text-right pr-4 text-[13px] font-medium text-[#00D632] tabular-nums whitespace-nowrap`}>
                      {formatReturnUSD(c.compoundGain)}
                    </td>

                    {/* RETORNO % */}
                    <td className={`${tdBase} text-right pr-4`}>
                      <div className="flex justify-end">
                        <ReturnBadge pct={retornoPct} />
                      </div>
                    </td>

                    {/* ACCIONES */}
                    <td className={`${tdBase} text-right pr-4`}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailCalc(c)}
                          className="text-[#8E8E93] hover:text-black transition-colors p-1"
                          aria-label="Ver detalle"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-[#8E8E93] hover:text-[#FF3B30] transition-colors p-1"
                          aria-label="Eliminar"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile cards (<900px) ──────────────────────────────────────────── */}
      <div className="min-[900px]:hidden space-y-3">
        {calculations.map((c) => {
          const retornoPct = (c.compoundGain / c.totalContributed) * 100
          const stockKey = c.stockKey || 'SP500'
          const asset = ASSETS[stockKey] || ASSETS['SP500']
          const Icon = STOCK_ICONS[stockKey] || STOCK_ICONS['SP500']
          return (
            <div key={c.id} className="bg-white rounded-2xl border border-[#F0F0F0] p-4">

              {/* Activo + acciones */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 flex items-center justify-center rounded-full shrink-0"
                    style={{ background: asset.color + '18', color: asset.color }}
                  >
                    <Icon size={15} />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-black leading-tight">{asset.name}</p>
                    <p className="text-[11px] text-[#8E8E93]">{asset.ticker} · {formatDate(c.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 mt-0.5 shrink-0">
                  <button
                    onClick={() => setDetailCalc(c)}
                    className="text-[#8E8E93] hover:text-black transition-colors p-1"
                    aria-label="Ver detalle"
                  >
                    <EyeIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-[#8E8E93] hover:text-[#FF3B30] transition-colors p-1"
                    aria-label="Eliminar"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>

              {/* Aporte mensual */}
              <p className="text-[22px] font-bold tabular-nums text-black leading-tight mb-2">
                {formatearUSD(c.monthlyContribution)}
                <span className="text-[13px] text-[#8E8E93] font-normal ml-1">/mes</span>
              </p>

              {/* Detalles */}
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[12px] text-[#8E8E93] mb-3">
                <span>Obj. {formatShortUSD(c.targetAmount)}</span>
                <span>{c.years} años</span>
                <span>{getModeLabel(c.rateMode)} · {c.annualRate}%</span>
              </div>

              {/* Retorno */}
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium text-[#00D632] tabular-nums">
                  {formatReturnUSD(c.compoundGain)}
                </span>
                <ReturnBadge pct={retornoPct} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de detalle */}
      <CalcDetailModal
        calc={detailCalc}
        onClose={() => setDetailCalc(null)}
        onLoadInCalculator={onLoadInCalculator}
      />
    </div>
  )
}
