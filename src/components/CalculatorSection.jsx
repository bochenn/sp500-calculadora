import { useState, useMemo, useEffect } from 'react'
import AmountInput from './ui/AmountInput.jsx'
import SelectorButton from './ui/SelectorButton.jsx'
import Button from './ui/Button.jsx'
import InfoTooltip from './ui/InfoTooltip.jsx'
import { calcularAporteMensual, formatearUSD, computeAvgRate, computeMaxRate } from '../utils/finance.js'
import { saveCalculation } from '../utils/storage.js'
import { ASSETS } from '../data/assets.js'
import StockSelect from './ui/StockSelect.jsx'

const YEAR_OPTIONS = [5, 10, 15, 20, 25]

const TOOLTIP_APORTADO = 'La suma de todos tus aportes mensuales a lo largo del plazo. No incluye ningún interés.'
const TOOLTIP_GANANCIA = 'La diferencia entre tu objetivo y lo que aportaste. Es lo que ganaste gracias al interés compuesto.'

export default function CalculatorSection({ sectionRef, onSaved, preload, selectedStockKey, onStockChange }) {
  const [targetAmount, setTargetAmount] = useState(0)
  const [selectedYears, setSelectedYears] = useState(null)
  const [customYearsMode, setCustomYearsMode] = useState(false)
  const [customYears, setCustomYears] = useState('')
  const [rateMode, setRateMode] = useState(null)
  const [manualRate, setManualRate] = useState('')

  const asset = ASSETS[selectedStockKey] || ASSETS['SP500']
  const minRate = asset.minRate
  const avgRate = useMemo(() => computeAvgRate(asset.returns), [asset])
  const maxRate = useMemo(() => computeMaxRate(asset.returns), [asset])
  const expected2026Rate = asset.expected2026Rate

  // Pre-popula el formulario cuando App pasa un cálculo guardado
  useEffect(() => {
    if (!preload) return
    setTargetAmount(preload.targetAmount)
    if (YEAR_OPTIONS.includes(preload.years)) {
      setSelectedYears(preload.years)
      setCustomYearsMode(false)
      setCustomYears('')
    } else {
      setCustomYearsMode(true)
      setCustomYears(String(preload.years))
      setSelectedYears(null)
    }
    const mode = preload.rateMode || 'MANUAL'
    setRateMode(mode)
    setManualRate(mode === 'MANUAL' ? String(preload.annualRate) : '')
  }, [preload])

  function resetear() {
    setTargetAmount(0)
    setSelectedYears(null)
    setCustomYearsMode(false)
    setCustomYears('')
    setRateMode(null)
    setManualRate('')
  }

  function handleSelectYears(val) {
    setCustomYearsMode(false)
    setCustomYears('')
    setSelectedYears(val)
  }

  function handleCustomYearsToggle() {
    if (customYearsMode) {
      setCustomYearsMode(false)
      setCustomYears('')
      setSelectedYears(null)
    } else {
      setCustomYearsMode(true)
      setSelectedYears(null)
    }
  }

  function handleRateMode(mode) {
    setRateMode(mode)
    if (mode !== 'MANUAL') setManualRate('')
  }

  const effectiveYears = customYearsMode ? (parseInt(customYears, 10) || null) : selectedYears
  const effectiveRate = useMemo(() => {
    if (rateMode === 'MIN') return minRate
    if (rateMode === 'AVG') return avgRate
    if (rateMode === 'MAX') return maxRate
    if (rateMode === 'EXPECTED_2026') return expected2026Rate
    if (rateMode === 'MANUAL') return parseFloat(manualRate) || null
    return null
  }, [rateMode, manualRate, minRate, avgRate, maxRate, expected2026Rate])

  const yearsNum = effectiveYears || 0
  const rateNum = effectiveRate || 0

  const yearsError = customYearsMode && customYears !== '' &&
    (isNaN(yearsNum) || yearsNum < 1 || yearsNum > 50) ? 'Entre 1 y 50 años' : null

  const rateNegativaOCero = rateMode === 'MANUAL' && manualRate !== '' && rateNum <= 0
  const ratePresetNegativa = rateMode !== 'MANUAL' && rateMode !== null && effectiveRate !== null && effectiveRate <= 0

  const resultado = useMemo(() => {
    if (targetAmount <= 0 || yearsNum < 1 || yearsNum > 50 || rateNum <= 0) return null
    const aporteMensual = calcularAporteMensual(targetAmount, yearsNum, rateNum)
    const totalAportado = aporteMensual * yearsNum * 12
    const ganancia = targetAmount - totalAportado
    return { aporteMensual, totalAportado, ganancia }
  }, [targetAmount, yearsNum, rateNum])

  function handleGuardar() {
    if (!resultado) return
    saveCalculation({
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      targetAmount,
      years: yearsNum,
      annualRate: rateNum,
      rateMode,
      stockKey: selectedStockKey,
      monthlyContribution: resultado.aporteMensual,
      totalContributed: resultado.totalAportado,
      compoundGain: resultado.ganancia,
    })
    onSaved()
    resetear()
  }

  function formatRateDisplay(rate) {
    if (rate >= 100) return Math.round(rate) + '%'
    return rate.toFixed(1) + '%'
  }

  return (
    <section ref={sectionRef} className="border-t border-[#E5E5E5] pt-14 pb-16">
      <div className="max-w-[520px] mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-[26px] sm:text-[28px] font-bold text-black tracking-[-0.02em]">
            Calcular inversión
          </h2>
          <p className="text-[14px] text-[#8E8E93] mt-2">
            Ingresá el monto que deseas obtener de retorno de inversión
          </p>
        </div>

        <div className="space-y-4">

          {/* Selector de activo */}
          <div>
            <h3 className="text-[13px] font-semibold text-black mb-2 uppercase tracking-wide">Activo</h3>
            <StockSelect value={selectedStockKey} onValueChange={onStockChange} />
          </div>

          {/* Input monto */}
          <AmountInput value={targetAmount} onChange={setTargetAmount} />

          {/* Plazo */}
          <div>
            <h3 className="text-[13px] font-semibold text-black mb-2 uppercase tracking-wide">Plazo</h3>
            <div className="grid grid-cols-3 gap-2">
              {YEAR_OPTIONS.map((y) => (
                <SelectorButton
                  key={y}
                  selected={!customYearsMode && selectedYears === y}
                  onClick={() => handleSelectYears(y)}
                >
                  {y} años
                </SelectorButton>
              ))}
              <SelectorButton selected={customYearsMode} onClick={handleCustomYearsToggle}>
                ···
              </SelectorButton>
            </div>

            {customYearsMode && (
              <div className="mt-2">
                <div className={`flex items-center border-2 rounded-xl px-4 py-2.5 transition-colors
                  ${yearsError ? 'border-[#FF3B30]' : 'border-[#00D632]'}`}>
                  <input
                    type="number"
                    value={customYears}
                    onChange={(e) => setCustomYears(e.target.value)}
                    placeholder="Ej: 30"
                    min={1} max={50}
                    autoFocus
                    className="w-full text-[16px] font-semibold bg-transparent outline-none
                      text-black placeholder-[#C7C7CC]"
                  />
                  <span className="text-[#8E8E93] text-[14px] ml-2 shrink-0">años</span>
                </div>
                {yearsError && <p className="text-[#FF3B30] text-[12px] mt-1">{yearsError}</p>}
              </div>
            )}
          </div>

          {/* Tasa anual */}
          <div>
            <h3 className="text-[13px] font-semibold text-black mb-2 uppercase tracking-wide">
              Tasa Anual Esperada
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <SelectorButton selected={rateMode === 'MIN'} onClick={() => handleRateMode('MIN')}>
                <span className="text-center leading-snug">
                  <span className="block text-[12px] font-bold">MIN</span>
                  <span className={`block text-[11px] ${minRate < 0 ? 'text-[#FF3B30]' : 'text-[#8E8E93]'}`}>{formatRateDisplay(minRate)}</span>
                </span>
              </SelectorButton>
              <SelectorButton selected={rateMode === 'AVG'} onClick={() => handleRateMode('AVG')}>
                <span className="text-center leading-snug">
                  <span className="block text-[12px] font-bold">AVG</span>
                  <span className={`block text-[11px] ${avgRate < 0 ? 'text-[#FF3B30]' : 'text-[#8E8E93]'}`}>{formatRateDisplay(avgRate)}</span>
                </span>
              </SelectorButton>
              <SelectorButton selected={rateMode === 'MAX'} onClick={() => handleRateMode('MAX')}>
                <span className="text-center leading-snug">
                  <span className="block text-[12px] font-bold">MAX</span>
                  <span className={`block text-[11px] ${maxRate < 0 ? 'text-[#FF3B30]' : 'text-[#8E8E93]'}`}>{formatRateDisplay(maxRate)}</span>
                </span>
              </SelectorButton>
              <SelectorButton selected={rateMode === 'EXPECTED_2026'} onClick={() => handleRateMode('EXPECTED_2026')}>
                <span className="text-center leading-snug">
                  <span className="block text-[12px] font-bold">2026</span>
                  <span className={`block text-[11px] ${expected2026Rate < 0 ? 'text-[#FF3B30]' : 'text-[#8E8E93]'}`}>{formatRateDisplay(expected2026Rate)}</span>
                </span>
              </SelectorButton>
              <SelectorButton selected={rateMode === 'MANUAL'} onClick={() => handleRateMode('MANUAL')}>
                Manual
              </SelectorButton>
            </div>

            <p className="text-[12px] text-[#8E8E93] mt-1.5 leading-relaxed">
              MIN: estimación conservadora · AVG: promedio últimos 10 años · MAX: mejor año histórico · 2026: proyección de analistas para el año fiscal 2026.
            </p>

            {ratePresetNegativa && (
              <p className="text-[12px] text-[#FF3B30] mt-1.5 leading-relaxed">
                Con un retorno negativo no es posible calcular un aporte mensual para alcanzar tu objetivo: la inversión perdería valor cada mes. Esto es lo que pasa con activos que tuvieron décadas malas. Probá con la proyección 2026 o un valor manual.
              </p>
            )}

            {rateMode === 'MANUAL' && (
              <div className="mt-2">
                <div className={`flex items-center border-2 rounded-xl px-4 py-2.5 transition-colors
                  ${rateNegativaOCero ? 'border-[#FF3B30]' : 'border-[#00D632]'}`}>
                  <input
                    type="number"
                    value={manualRate}
                    onChange={(e) => setManualRate(e.target.value)}
                    placeholder="Ej: 12"
                    autoFocus
                    className="w-full text-[16px] font-semibold bg-transparent outline-none
                      text-black placeholder-[#C7C7CC]"
                  />
                  <span className="text-[#8E8E93] text-[14px] ml-2 shrink-0">% anual</span>
                </div>
                {rateNegativaOCero && (
                  <p className="text-[#FF3B30] text-[12px] mt-1.5 leading-relaxed">
                    Con una tasa negativa o cero no es posible alcanzar tu objetivo. Probá con un valor positivo.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Calcular deshabilitado */}
          {!resultado && (
            <Button variant="primary" disabled>Calcular</Button>
          )}

          {/* Resultado inline */}
          {resultado && (
            <div className="animate-fadeSlideUp space-y-4">
              <div className="border-t border-[#F2F2F7]" />

              {/* Aporte mensual */}
              <div className="text-center py-2">
                <p className="text-[13px] text-[#8E8E93] mb-1.5">Aportá por mes</p>
                <p className="text-[52px] sm:text-[58px] font-extrabold text-black
                  leading-none tabular-nums tracking-[-0.02em]">
                  {formatearUSD(resultado.aporteMensual)}
                </p>
              </div>

              {/* Métricas secundarias con tooltips */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F5F5F5] rounded-2xl p-3">
                  <div className="flex items-center gap-1 mb-1.5">
                    <p className="text-[11px] text-[#8E8E93] leading-tight flex-1">
                      Total aportado en {yearsNum} años
                    </p>
                    <InfoTooltip content={TOOLTIP_APORTADO} />
                  </div>
                  <p className="text-[16px] font-bold text-black tabular-nums">
                    {formatearUSD(resultado.totalAportado)}
                  </p>
                </div>
                <div className="bg-[#F5F5F5] rounded-2xl p-3">
                  <div className="flex items-center gap-1 mb-1.5">
                    <p className="text-[11px] text-[#8E8E93] leading-tight flex-1">
                      Ganancia compuesta
                    </p>
                    <InfoTooltip content={TOOLTIP_GANANCIA} />
                  </div>
                  <p className="text-[16px] font-bold text-[#00D632] tabular-nums">
                    {formatearUSD(resultado.ganancia)}
                  </p>
                </div>
              </div>

              {/* Botones lado a lado */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Button variant="secondary" onClick={resetear}>Resetear</Button>
                </div>
                <div className="flex-1">
                  <Button variant="primary" onClick={handleGuardar}>Guardar cálculo</Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
