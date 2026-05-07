/**
 * Calcula el aporte mensual necesario para alcanzar un monto objetivo.
 *
 * Fórmula PMT (pago periódico de anualidad ordinaria):
 *   PMT = FV × r / ((1 + r)^n - 1)
 *
 * Donde:
 *   FV = valor futuro deseado (monto objetivo)
 *   r  = tasa mensual = tasa_anual_decimal / 12
 *   n  = total de meses = años × 12
 */
export function calcularAporteMensual(montoObjetivo, anos, tasaAnualPct) {
  const r = tasaAnualPct / 100 / 12
  const n = anos * 12

  if (r === 0) return montoObjetivo / n

  return (montoObjetivo * r) / (Math.pow(1 + r, n) - 1)
}

/**
 * Formatea un número como moneda USD con separadores de miles.
 * Ejemplo: 1234567.89 → "$1,234,567.89"
 */
export function formatearUSD(valor) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor)
}

/**
 * Calcula el crecimiento acumulado de $1 invertido, aplicando cada retorno anual.
 * Devuelve array de puntos {year, valor} empezando en el año anterior con valor 1.
 */
export function calcularCrecimientoAcumulado(returns) {
  let valor = 1
  const puntos = [{ year: returns[0].year - 1, valor: 1 }]
  for (const entry of returns) {
    valor = parseFloat((valor * (1 + entry.return / 100)).toFixed(4))
    puntos.push({ year: entry.year, valor })
  }
  return puntos
}

export function computeAvgRate(returns) {
  const sum = returns.reduce((acc, r) => acc + r.return, 0)
  return parseFloat((sum / returns.length).toFixed(1))
}

export function computeMaxRate(returns) {
  return Math.max(...returns.map(r => r.return))
}

export const computeCumulativeGrowth = calcularCrecimientoAcumulado

export function formatPercentage(value) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M%'
  if (value >= 1_000) return Math.round(value).toLocaleString('en-US') + '%'
  if (value >= 100) return Math.round(value) + '%'
  return value.toFixed(1) + '%'
}

/**
 * Formatea un número como entero USD sin decimales para montos grandes.
 * Ejemplo: 1234567 → "$1,234,567"
 */
export function formatearUSDEntero(valor) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valor)
}
