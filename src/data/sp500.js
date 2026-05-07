export const SP500_RETURNS = [
  { year: 2016, return: 12.0 },
  { year: 2017, return: 21.8 },
  { year: 2018, return: -4.4 },
  { year: 2019, return: 31.5 },
  { year: 2020, return: 18.4 },
  { year: 2021, return: 28.7 },
  { year: 2022, return: -18.1 },
  { year: 2023, return: 26.3 },
  { year: 2024, return: 25.0 },
  { year: 2025, return: 17.9 },
]

// MIN no es el peor año histórico (eso daría tasa negativa y rompe la fórmula PMT).
// Es la estimación conservadora a largo plazo, alineada con el retorno real histórico
// del S&P 500 (~7% nominal promedio de décadas largas como 2000–2009 incluidas).
export const SP500_MIN_RATE = 7.0
export const SP500_AVG_RATE = 15.9  // promedio aritmético de los retornos 2016–2025
export const SP500_MAX_RATE = 31.5  // mejor año reciente (2019)
