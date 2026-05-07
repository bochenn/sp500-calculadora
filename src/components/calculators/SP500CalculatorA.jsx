import { useState, useMemo } from 'react'
import { calcularAporteMensual, formatearUSD } from '../../utils/finance.js'

const DEFAULTS = {
  montoObjetivo: '',
  anos: '',
  tasaAnual: '10',
}

export default function SP500CalculatorA() {
  const [valores, setValores] = useState(DEFAULTS)
  const [errores, setErrores] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setValores((prev) => ({ ...prev, [name]: value }))
    validarCampo(name, value)
  }

  function validarCampo(nombre, valor) {
    const num = Number(valor)
    let error = ''

    if (nombre === 'montoObjetivo') {
      if (valor === '') error = 'Ingresá un monto objetivo.'
      else if (isNaN(num) || num <= 0) error = 'Debe ser un número mayor a 0.'
    }
    if (nombre === 'anos') {
      if (valor === '') error = 'Ingresá un plazo en años.'
      else if (!Number.isInteger(num) || num < 1 || num > 50)
        error = 'Debe ser un entero entre 1 y 50.'
    }
    if (nombre === 'tasaAnual') {
      if (valor === '') error = 'Ingresá una tasa anual.'
      else if (isNaN(num) || num < 1 || num > 30)
        error = 'Debe estar entre 1% y 30%.'
    }

    setErrores((prev) => ({ ...prev, [nombre]: error }))
    return error === ''
  }

  function resetear() {
    setValores(DEFAULTS)
    setErrores({})
  }

  const resultado = useMemo(() => {
    const monto = Number(valores.montoObjetivo)
    const anos = Number(valores.anos)
    const tasa = Number(valores.tasaAnual)

    const completo =
      valores.montoObjetivo !== '' && valores.anos !== '' && valores.tasaAnual !== ''
    const valido = !errores.montoObjetivo && !errores.anos && !errores.tasaAnual

    if (!completo || !valido || monto <= 0 || anos < 1 || tasa < 1) return null

    const aporteMensual = calcularAporteMensual(monto, anos, tasa)
    const totalAportado = aporteMensual * anos * 12
    const ganancia = monto - totalAportado

    return { aporteMensual, totalAportado, ganancia, anos }
  }, [valores, errores])

  return (
    <div className="space-y-3">

      {/* Resultado principal — arriba, prominente */}
      <div className="bg-[#111111] rounded-3xl p-6 text-center min-h-[148px] flex flex-col items-center justify-center">
        {resultado ? (
          <>
            <p className="text-[#888] text-sm mb-2 tracking-wide">aportá por mes</p>
            <p className="text-5xl font-bold text-white tracking-tight leading-none">
              {formatearUSD(resultado.aporteMensual)}
            </p>
          </>
        ) : (
          <p className="text-[#444] text-sm">
            Completá los datos para ver el resultado
          </p>
        )}
      </div>

      {/* Métricas secundarias */}
      {resultado && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111111] rounded-2xl p-4">
            <p className="text-[#666] text-xs mb-1.5">
              Total aportado en {resultado.anos} años
            </p>
            <p className="text-white text-lg font-semibold">
              {formatearUSD(resultado.totalAportado)}
            </p>
          </div>
          <div className="bg-[#111111] rounded-2xl p-4">
            <p className="text-[#666] text-xs mb-1.5">Ganancia compuesta</p>
            <p className="text-[#00C244] text-lg font-semibold">
              {formatearUSD(resultado.ganancia)}
            </p>
          </div>
        </div>
      )}

      {/* Inputs */}
      <div className="space-y-2 pt-2">
        <Campo
          label="Monto objetivo"
          name="montoObjetivo"
          value={valores.montoObjetivo}
          onChange={handleChange}
          placeholder="$100,000"
          prefijo="$"
          error={errores.montoObjetivo}
        />
        <Campo
          label="Plazo"
          name="anos"
          value={valores.anos}
          onChange={handleChange}
          placeholder="20"
          sufijo="años"
          error={errores.anos}
        />
        <Campo
          label="Tasa anual esperada"
          name="tasaAnual"
          value={valores.tasaAnual}
          onChange={handleChange}
          placeholder="10"
          sufijo="%"
          error={errores.tasaAnual}
        />
      </div>

      {/* Botón resetear */}
      <button
        onClick={resetear}
        className="w-full py-4 rounded-2xl bg-[#1a1a1a] text-[#666] text-sm font-medium
          active:bg-[#222] transition-colors mt-1"
      >
        Resetear
      </button>
    </div>
  )
}

function Campo({ label, name, value, onChange, placeholder, prefijo, sufijo, error }) {
  return (
    <div>
      <div
        className={`bg-[#111111] rounded-2xl px-4 py-3 flex items-center gap-3 transition-colors
          ${error ? 'ring-1 ring-red-500/60' : 'focus-within:ring-1 focus-within:ring-[#00C244]/40'}`}
      >
        <span className="text-[#555] text-sm w-32 shrink-0">{label}</span>

        <div className="flex items-center gap-1 flex-1 justify-end">
          {prefijo && <span className="text-[#666] text-base">{prefijo}</span>}
          <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={0}
            className="bg-transparent text-white text-base text-right outline-none w-full
              placeholder-[#333]"
          />
          {sufijo && <span className="text-[#666] text-base shrink-0">{sufijo}</span>}
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs mt-1 px-1">{error}</p>
      )}
    </div>
  )
}
