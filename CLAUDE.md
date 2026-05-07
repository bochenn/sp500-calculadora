# CLAUDE.md — Contexto del proyecto

## Qué es este proyecto

Calculadora de inversión multi-activo construida con React + Vite, inspirada visualmente en Cash.app. Permite calcular el aporte mensual necesario para alcanzar un objetivo de inversión usando la fórmula PMT, con 11 activos y 5 modos de tasa. Documentación visual detallada en `DESIGN.md`.

## Stack

- **React 18 + Vite** (JavaScript, sin TypeScript)
- **Tailwind CSS 3** — utility-first, sin CSS custom salvo `index.css`
- **Recharts** — AreaChart para el chart de crecimiento acumulado
- **Radix UI** — `@radix-ui/react-select` (dropdown activos), `@radix-ui/react-tooltip` (footer)
- **react-icons** — íconos de marcas (SiApple, SiMeta, FaMicrosoft, etc.)
- **localStorage** — persistencia de cálculos guardados, sin backend
- **Deploy:** Vercel con auto-deploy desde GitHub (`main`)

## Estructura de carpetas

```
src/
├── components/
│   ├── ui/                   # Primitivos reutilizables
│   │   ├── Button.jsx        # Variantes: primary / secondary
│   │   ├── SelectorButton.jsx # Botón cuadrado seleccionable (plazo/tasa)
│   │   ├── AmountInput.jsx   # Input grande con $ y formato automático
│   │   ├── StockSelect.jsx   # Dropdown Radix para seleccionar activo
│   │   └── InfoTooltip.jsx   # Tooltip de ayuda (ícono ⓘ)
│   ├── StockCarousel.jsx     # Hero completo: logo + título + chart + carousel + CTA
│   ├── PerformanceChart.jsx  # Area chart de crecimiento acumulado (Recharts)
│   ├── CalculatorSection.jsx # Formulario de calculadora inline
│   ├── CalculationsTable.jsx # Tabla desktop / cards mobile de cálculos guardados
│   ├── CalcDetailModal.jsx   # Modal de detalle de un cálculo
│   ├── Footer.jsx            # Apps de inversión recomendadas (Radix Tooltip)
│   └── Layout.jsx            # Wrapper mínimo: min-h-screen bg-white
├── data/
│   └── assets.js             # 11 activos: retornos históricos, colores, tasas
├── utils/
│   ├── finance.js            # PMT, formatearUSD, computeAvgRate, formatPercentage
│   ├── stockIcons.jsx        # Mapa { TICKER: IconComponent } para los 11 activos
│   └── storage.js            # getCalculations / saveCalculation / deleteCalculation
├── assets/
│   └── RGB_CashApp_Symbol_Green.svg  # Logo del hero
├── App.jsx                   # Estado global: selectedStockKey, calculations, preload
├── main.jsx
└── index.css                 # Font Inter global, ocultar spinners en inputs[number]
scripts/
└── fetch-icons.cjs           # Script Node para descargar íconos de apps del footer
public/
└── app-icons/                # Íconos descargados por fetch-icons.cjs
```

> **Archivos legacy** (no activos en la UI): `Dashboard.jsx`, `CalculatorModal.jsx`, `calculators/SP500CalculatorA.jsx`. Estos son versiones anteriores del proyecto; no los tocar ni usarlos como referencia de estilo.

## Comandos disponibles

```bash
npm run dev       # Dev server en http://localhost:5173
npm run build     # Build de producción (¡correr antes de hacer push!)
npm run preview   # Preview del build local

node scripts/fetch-icons.cjs  # Actualizar íconos de apps del footer desde iTunes API
```

## Convenciones de código

- Componentes en `PascalCase`, archivos `.jsx`
- Utils y data en `camelCase`, archivos `.js` (excepción: `stockIcons.jsx` porque contiene JSX)
- Imports relativos siempre
- Sin TypeScript, sin PropTypes
- Sin `console.log` en código productivo
- Sin comentarios que explican *qué* hace el código (los nombres lo dicen). Solo comentar el *por qué* si hay algo no obvio.

## Cómo iterar en este proyecto

1. **Leer DESIGN.md** antes de cualquier cambio visual — todos los tokens están ahí.
2. **No reescribir componentes desde cero** — modificar lo existente con cambios mínimos.
3. **Especificar qué cambia y qué NO** en cada iteración para evitar regresiones.
4. **Correr `npm run build` localmente** antes de hacer push (el dev server tolera errores que Rollup no).
5. **Commits con Conventional Commits:** `feat/fix/docs/style/refactor/...`

## Datos de activos

Los retornos históricos en `/src/data/assets.js` son **aproximaciones** basadas en datos públicos (Yahoo Finance). Cada activo tiene:
- `name`, `ticker`, `color` (hex del brand), `subtitle` (descripción)
- `returns`: array `[{year, return}]` de 2016 a 2025
- `minRate`: tasa conservadora para el botón MIN
- `expected2026Rate`: proyección de analistas para el año fiscal 2026

Para actualizar con datos exactos: reemplazar los valores `return` en cada entrada del array.

## Fórmula financiera

```
PMT = FV × r / ((1 + r)^n - 1)

FV = monto objetivo
r  = tasa anual / 100 / 12   (tasa mensual)
n  = años × 12               (meses totales)
```

Implementada en `finance.js:calcularAporteMensual()`. No modificar sin verificar con casos de prueba conocidos.

## Lo que NO hay que hacer

- No agregar dependencias pesadas sin justificación clara.
- No usar TypeScript (decisión consciente para v1).
- No agregar backend ni llamadas a APIs en runtime.
- No reescribir componentes desde cero en iteraciones — modificar lo existente.
- No modificar la fórmula PMT en `utils/finance.js` sin casos de prueba.
- No usar colores fuera de la paleta de `DESIGN.md`.
- No tomar como referencia de estilo los archivos legacy (`Dashboard.jsx`, `CalculatorModal.jsx`, `SP500CalculatorA.jsx`).
