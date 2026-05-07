const KEY = 'sp500_calculations'

export function getCalculations() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveCalculation(calc) {
  const all = getCalculations()
  all.unshift(calc)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function deleteCalculation(id) {
  const all = getCalculations().filter((c) => c.id !== id)
  localStorage.setItem(KEY, JSON.stringify(all))
}
