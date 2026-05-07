import { useState, useMemo, useEffect } from 'react'
import AmountInput from './ui/AmountInput.jsx'
import SelectorButton from './ui/SelectorButton.jsx'
import Button from './ui/Button.jsx'
import { calcularAporteMensual, formatearUSD } from '../utils/finance.js'
import { saveCalculation } from '../utils/storage.js'
import { SP500_MIN_RATE, SP500_MAX_RATE } from '../data/sp500.js'

const YEAR_OPTIONS = [5, 10, 15, 20, 25]

export default function CalculatorModal({ isOpen, onClose, onSaved }) {
  const [targetAmount, setTargetAmount] = useState('')
  const [selectedYears, setSelectedYears] = useState(null)
  const [customYearsMode, setCustomYearsMode] = useState(false)
  const [customYears, setCustomYears] = useState('')
  const [rateMode, setRateMode] = useState(null)
  const [manualRate, setManualRate] = useState('')

  // Bloquea el scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function resetear() {
    setTargetAmount('')
    setSelectedYears(null)
    setCustomYearsMode(false)
    setCustomYears('')
    setRateMode(null)
    setManualRate('')
  }

  function handleClose() {
    resetear()
    onClose()
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

  // Años efectivos (preset o custom)
  const effectiveYears = customYearsMode
    ? (parseInt(customYears, 10) || null)
    : selectedYears

  // Tasa efectiva según modo
  const effectiveRate = useMemo(() => {
    if (rateMode === 'MIN') return SP500_MIN_RATE
    if (rateMode === 'MAX') return SP500_MAX_RATE
    if (rateMode === 'MANUAL') return parseFloat(manualRate) || null
    return null
  }, [rateMode, manualRate])

  // Validaciones
  const amountNum = parseFloat(targetAmount) || 0
  const yearsNum = effectiveYears || 0
  const rateNum = effectiveRate || 0

  const yearsError = customYearsMode && customYears !== '' &&
    (isNaN(yearsNum) || yearsNum < 1 || yearsNum > 50)
      ? 'Entre 1 y 50 años'
      : null

  const rateNegativaOCero = rateMode === 'MANUAL' && manualRate !== '' && rateNum <= 0

  // El resultado se muestra solo cuando todos los campos son válidos
  const resultado = useMemo(() => {
    if (amountNum <= 0 || yearsNum < 1 || yearsNum > 50 || rateNum <= 0) return null
    const aporteMensual = calcularAporteMensual(amountNum, yearsNum, rateNum)
    const totalAportado = aporteMensual * yearsNum * 12
    const ganancia = amountNum - totalAportado
    return { aporteMensual, totalAportado, ganancia }
  }, [amountNum, yearsNum, rateNum])

  function handleGuardar() {
    if (!resultado) return
    saveCalculation({
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      targetAmount: amountNum,
      years: yearsNum,
      annualRate: rateNum,
      rateMode,
      monthlyContribution: resultado.aporteMensual,
      totalContributed: resultado.totalAportado,
      compoundGain: resultado.ganancia,
    })
    onSaved()
    handleClose()
  }

  if (!isOpen) return null

  return (
    // Overlay — click fuera cierra
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Panel del modal */}
      <div
        className="relative bg-white w-full max-w-[480px] rounded-t-[28px] sm:rounded-[28px]
          max-h-[92dvh] overflow-y-auto animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-2">
          <div>
            <h2 className="text-[28px] font-bold text-black leading-tight">Calcular inversión</h2>
            <p className="text-[15px] text-[#8E8E93] mt-1">
              Ingresá el monto que deseas obtener de retorno de inversión
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-black text-[22px] font-medium leading-none ml-4 mt-1 p-1"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-8 space-y-6 pt-4">
          {/* Input monto objetivo */}
          <AmountInput
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />

          {/* Plazo */}
          <div>
            <h3 className="text-[17px] font-semibold text-black mb-3">Plazo</h3>
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
              <SelectorButton
                selected={customYearsMode}
                onClick={handleCustomYearsToggle}
              >
                ···
              </SelectorButton>
            </div>

            {/* Input custom años */}
            {customYearsMode && (
              <div className="mt-3">
                <div className={`flex items-center border-2 rounded-2xl px-4 py-3 transition-colors
                  ${yearsError ? 'border-[#FF3B30]' : 'border-[#00D632]'}`}>
                  <input
                    type="number"
                    value={customYears}
                    onChange={(e) => setCustomYears(e.target.value)}
                    placeholder="Ej: 30"
                    min={1}
                    max={50}
                    autoFocus
                    className="w-full text-[17px] font-semibold bg-transparent outline-none
                      text-black placeholder-[#C7C7CC]"
                  />
                  <span className="text-[#8E8E93] text-[15px] ml-2 shrink-0">años</span>
                </div>
                {yearsError && (
                  <p className="text-[#FF3B30] text-[13px] mt-1">{yearsError}</p>
                )}
              </div>
            )}
          </div>

          {/* Tasa anual */}
          <div>
            <h3 className="text-[17px] font-semibold text-black mb-3">Tasa Anual Esperada</h3>
            <div className="grid grid-cols-3 gap-2">
              <SelectorButton selected={rateMode === 'MIN'} onClick={() => handleRateMode('MIN')}>
                <span className="text-center leading-tight">
                  <span className="block text-[13px] font-bold">MIN</span>
                  <span className="block text-[12px] text-[#8E8E93] font-medium">{SP500_MIN_RATE}%</span>
                </span>
              </SelectorButton>
              <SelectorButton selected={rateMode === 'MAX'} onClick={() => handleRateMode('MAX')}>
                <span className="text-center leading-tight">
                  <span className="block text-[13px] font-bold">MAX</span>
                  <span className="block text-[12px] text-[#8E8E93] font-medium">{SP500_MAX_RATE}%</span>
                </span>
              </SelectorButton>
              <SelectorButton selected={rateMode === 'MANUAL'} onClick={() => handleRateMode('MANUAL')}>
                Manual
              </SelectorButton>
            </div>

            {/* Tooltip explicativo */}
            <p className="text-[12px] text-[#8E8E93] mt-2 leading-relaxed">
              MIN: estimación conservadora a largo plazo. MAX: mejor año reciente del S&P 500 (2019).
            </p>

            {/* Input tasa manual */}
            {rateMode === 'MANUAL' && (
              <div className="mt-3">
                <div className={`flex items-center border-2 rounded-2xl px-4 py-3 transition-colors
                  ${rateNegativaOCero ? 'border-[#FF3B30]' : 'border-[#00D632]'}`}>
                  <input
                    type="number"
                    value={manualRate}
                    onChange={(e) => setManualRate(e.target.value)}
                    placeholder="Ej: 12"
                    autoFocus
                    className="w-full text-[17px] font-semibold bg-transparent outline-none
                      text-black placeholder-[#C7C7CC]"
                  />
                  <span className="text-[#8E8E93] text-[15px] ml-2 shrink-0">% anual</span>
                </div>
                {rateNegativaOCero && (
                  <p className="text-[#FF3B30] text-[13px] mt-2 leading-relaxed">
                    Con una tasa negativa o cero no es posible alcanzar tu objetivo aportando mensualmente. Probá con un valor positivo.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Resultado — aparece con animación cuando hay datos válidos */}
          {resultado && (
            <div className="animate-fadeSlideUp">
              {/* Separador */}
              <div className="border-t border-[#F2F2F7] mb-6" />

              {/* Aporte mensual — resultado principal */}
              <div className="text-center mb-6">
                <p className="text-[15px] text-[#8E8E93] mb-1">Aportá por mes</p>
                <p className="text-[64px] font-extrabold text-black leading-none tabular-nums tracking-tight">
                  {formatearUSD(resultado.aporteMensual)}
                </p>
              </div>

              {/* Métricas secundarias */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[#F5F5F5] rounded-2xl p-4">
                  <p className="text-[12px] text-[#8E8E93] mb-1.5 leading-tight">
                    Total aportado en {yearsNum} años
                  </p>
                  <p className="text-[17px] font-bold text-black tabular-nums">
                    {formatearUSD(resultado.totalAportado)}
                  </p>
                </div>
                <div className="bg-[#F5F5F5] rounded-2xl p-4">
                  <p className="text-[12px] text-[#8E8E93] mb-1.5 leading-tight">
                    Ganancia compuesta
                  </p>
                  <p className="text-[17px] font-bold text-[#00D632] tabular-nums">
                    {formatearUSD(resultado.ganancia)}
                  </p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <Button variant="secondary" onClick={resetear}>Resetear</Button>
                <Button variant="primary" onClick={handleGuardar}>Guardar cálculo</Button>
              </div>
            </div>
          )}

          {/* Si no hay resultado, mostrar solo botón de resetear */}
          {!resultado && (
            <Button variant="primary" disabled>
              Calcular
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
