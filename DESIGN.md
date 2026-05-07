# DESIGN.md — Sistema de diseño

**Versión:** 1.0 — generado a partir del código existente  
**Última actualización:** Mayo 2026

---

## Filosofía visual

Inspirado en Cash.app: light mode minimalista, números como héroes visuales, mucho espacio negativo. Sin gradientes decorativos, sin sombras pesadas, sin emojis en la UI. Los colores de la paleta son funcionales (verde = ganancia, rojo = error/pérdida), no decorativos. La tipografía hace el trabajo.

---

## Paleta de colores

### Primarios

| Token | Hex | Uso |
|---|---|---|
| Negro | `#000000` | Botón primary, texto principal, tab seleccionado |
| Blanco | `#FFFFFF` | Fondo de cards, inputs, contenido |
| Verde Cash | `#00D632` | Acento principal: ganancias, borders activos, barras de progreso, checkmarks |
| Verde badge bg | `#E6F9EB` | Fondo de badges de retorno positivo |

### Grises (escala funcional)

| Hex | Uso principal | Apariciones |
|---|---|---|
| `#8E8E93` | Texto secundario, labels, íconos inactivos, valores de tasa en botones | 49x — **valor canónico** |
| `#F5F5F5` | Fondo hero, fondo cards footer, fondo metric boxes en calculadora | 11x |
| `#E5E5E5` | Dividers ligeros, borders de hero tabs inactivos | 6x |
| `#D1D1D6` | Border de inputs y SelectorButton inactivos | 4x |
| `#C7C7CC` | Placeholder text, íconos de tooltip inactivos | 6x |
| `#F0F0F0` | Borders de tabla, borde de tabla container | 4x |
| `#F2F2F7` | Dividers internos de modal (más sutil que E5E5E5) | 4x |
| `#FAFAFA` | Hover de filas de tabla, fondo footer | 3x |
| `#E5E5EA` | Botón secondary, botón primary disabled | 2x |
| `#ABABAB` | Hover de border en carousel tabs | 1x |
| `#E8E8E8` | Puntos del dot-grid de fondo del chart | 1x |

> **Inconsistencia documentada:** el color `#6B7280` (Tailwind gray-500) aparece en `StockCarousel.jsx` y `Footer.jsx` para el subtítulo del hero, mientras que el resto del sistema usa `#8E8E93` (iOS System Gray) para texto secundario. Visualmente similares, pero deberían unificarse en `#8E8E93`.

### Estados

| Hex | Uso |
|---|---|
| `#FF3B30` | Error, tasa negativa (iOS red) |
| `#1a1a1a` | Active state del botón primary (negro casi puro) |

### Colores por activo

Definidos en `/src/data/assets.js`. Se usan para: color del ícono, background del badge (hex + `18` o `20` de opacidad como string), color de la línea del chart.

| Activo | Hex |
|---|---|
| S&P 500 | `#00D632` |
| Apple | `#555555` |
| Microsoft | `#0078D4` |
| Tesla | `#CC0000` |
| Alphabet | `#4285F4` |
| Nvidia | `#76B900` |
| Amazon | `#FF9900` |
| Meta | `#0081FB` |
| Netflix | `#E50914` |
| Berkshire | `#0033A0` |
| Bayer | `#10384F` |

---

## Tipografía

**Font family:** Inter (Google Fonts), aplicada globalmente en `index.css`:
```css
* { font-family: 'Inter', sans-serif; }
```

### Escala tipográfica

| Rol | Desktop | Mobile | Weight | Notas |
|---|---|---|---|---|
| Hero title | `52px` | `32px` | `extrabold (800)` | `tracking-[-0.02em]`, `leading-[1.05]` |
| Section title (h2) | `26–28px` | `26px` | `bold (700)` | |
| Modal title | `20px` | `20px` | `bold (700)` | |
| Big number (resultado) | `52–60px` | `52px` | `extrabold (800)` | `tracking-[-0.02em]`, `tabular-nums` |
| Amount input | `42px` | `42px` | `bold (700)` | `tabular-nums`, `text-center` |
| Body / subtítulo | `16–18px` | `16px` | `normal (400)` | `leading-relaxed` (1.625) |
| Label uppercase | `11–13px` | `11px` | `semibold (600)` | `uppercase`, `tracking-[0.06–0.08em]` |
| Caption / metadata | `11–13px` | `11px` | `normal / medium` | Color `#8E8E93` |
| Botón primary | `17px` | `17px` | `semibold (600)` | |
| Selector button | `14px` | `14px` | `semibold (600)` | |

**Convenciones:**
- `tabular-nums` en todos los montos y porcentajes para alineación consistente.
- `whitespace-nowrap` en celdas de tabla con valores monetarios.
- `truncate` en nombres de activos en celdas donde el espacio es limitado.

---

## Espaciado

Sistema basado en múltiplos de 4px (escala Tailwind por defecto).

### Containers

| Contexto | Max-width | Padding lateral |
|---|---|---|
| Hero / Footer | `1040px` | `px-8 sm:px-12` (32px / 48px) |
| Calculadora + tabla | `840px` | `px-6` (24px) |
| Form de calculadora | `520px` | — (auto, centrado) |
| Modal | `480px` | `px-6` (24px) |
| Subtítulo hero | `520px` | — |
| Footer subheadline | `620px` | — |

### Secciones

| Sección | Padding vertical |
|---|---|
| Hero | `pt-8 sm:pt-10` / `pb-6 sm:pb-8` |
| Calculadora | `pt-14 pb-16` |
| Footer | `py-20 sm:py-28` |

### Gaps

| Contexto | Gap |
|---|---|
| Grid cards footer | `gap-4 sm:gap-5` |
| Botones de selector | `gap-2` |
| Tabs del carousel | `gap-2` |
| Metric boxes (2 col) | `gap-3` |
| Metric boxes modal (3 col) | `gap-3` |

---

## Componentes

### Botones

#### Primary (pill negro)
```
py-[18px] rounded-full font-semibold text-[17px] w-full
bg: black → active: #1a1a1a
disabled: bg-[#E5E5EA] text-[#8E8E93] cursor-not-allowed
transition: duration-150, active:scale-[0.98]
```

#### Secondary (pill gris)
```
py-[18px] rounded-full font-semibold text-[17px] w-full
bg: #E5E5EA → active: #D1D1D6
transition: active:scale-[0.98]
```

#### SelectorButton (plazo / tasa)
```
py-3 rounded-[12px] font-semibold text-[14px]
selected:  border-2 border-black bg-white text-black
inactive:  border border-[#D1D1D6] bg-white text-black
transition: duration-100, active:scale-[0.97]
```

#### Tab del carousel (stock pill)
```
px-3 py-1.5 rounded-full text-[12px] font-semibold border-2 shrink-0
selected:  bg-black text-white border-black
inactive:  bg-white text-[#555] border-[#E5E5E5] hover:border-[#ABABAB]
transition: transition-colors
```

### Inputs

#### AmountInput (monto objetivo)
```
border-2 rounded-2xl py-3.5 px-5
default:  border-[#D1D1D6]
active/filled: border-[#00D632]
transition: duration-150
Texto interno: text-[42px] font-bold tabular-nums text-center
```

#### Text/number input (años custom, tasa manual)
```
border-2 rounded-xl px-4 py-2.5
default:  border-[#00D632]
error:    border-[#FF3B30]
Texto interno: text-[16px] font-semibold
```

#### StockSelect trigger (Radix)
```
border border-[#D1D1D6] rounded-[12px] px-4 py-3 bg-white
hover: border-black
focus: border-[#00D632] outline-none
transition: transition-colors
```

#### StockSelect dropdown
```
bg-white border border-[#E5E5E5] rounded-[12px] shadow-lg py-1.5
Items: px-4 py-2.5 rounded-lg mx-1.5
  highlighted: bg-[#FAFAFA]
  checked:     bg-[#F0F0F0]
Max-height del viewport: 280px overflow-y-auto
```

### Cards

#### Card de cálculo (mobile)
```
bg-white rounded-2xl border border-[#F0F0F0] p-4
```

#### Metric box (calculadora inline)
```
bg-[#F5F5F5] rounded-2xl p-3
```

#### Card del footer (app)
```
bg-[#F5F5F5] rounded-[22px] border: none
hover: shadow-md, -translate-y-0.5
transition: duration-200
Estructura: icono (py-10 sm:py-12) + divider (h-px bg-[#E5E5E5]) + nombre
```

#### Badge de retorno
```
bg-[#E6F9EB] text-[#00D632] rounded-full
text-[12px] font-semibold px-2 py-0.5 tabular-nums
Símbolo: ↗ prefijo
```

#### Badge de activo (en modal)
```
rounded-full text-[11px] font-bold px-2 py-0.5
bg: asset.color + '20' (opacidad inline)
color: asset.color
Contiene: icono de marca (10px) + ticker
```

### Modal

```
max-w-[480px] rounded-[24px] shadow-2xl bg-white
max-h-[90dvh] overflow-y-auto
Animación: animate-modalIn (0.2s ease-out, scale+translateY)
Overlay: bg-black/40
Cierre: Escape key + click overlay
```

### Tabla de cálculos

**Desktop** (`min-[900px]`): `table-fixed` con `colgroup` por porcentajes:

| Columna | Ancho |
|---|---|
| ACTIVO | 22% |
| OBJETIVO | 14% |
| PLAZO | 8% |
| TASA | 10% |
| APORTE MENSUAL | 12% |
| RETORNO $ | 13% |
| RETORNO % | 13% |
| ACCIONES | 8% |

- Headers: `text-[11px] semibold #8E8E93 uppercase tracking-[0.06em]`
- Valores numéricos: alineados a la derecha (`text-right pr-4`)
- Texto/labels: alineados a la izquierda (`text-left pl-4`)
- Hover row: `bg-[#FAFAFA]`
- Dividers: `border-t border-[#F0F0F0]`

**Mobile** (`< 900px`): cards apiladas (`space-y-3`), cada una `bg-white rounded-2xl border border-[#F0F0F0] p-4`.

---

## Charts

Implementado en `PerformanceChart.jsx` con Recharts `AreaChart`.

- **Tipo:** `AreaChart` con interpolación `type="monotone"`
- **Altura:** `100%` (fills parent; parent tiene `minHeight: 200px`, `maxHeight: 360px`)
- **Stroke:** color del activo, `strokeWidth: 2.5`
- **Area fill:** gradient vertical del color del activo en `stopOpacity: 0.1` a `0`
- **Background:** dot-grid `radial-gradient(circle, #E8E8E8 1px, transparent 1px) 20px 20px`
- **Ejes:** `YAxis` oculto. `XAxis` sin líneas ni ticks, solo texto (`fontSize: 11, fill: #8E8E93`). Ticks: `[2016, 2018, 2020, 2022, 2024, 2025]`.
- **Markers:** `ReferenceDot` en año inicial (valor $1.00) y año final (valor final), `r=4` en color del activo, `stroke: white strokeWidth: 2`.
- **Tooltip custom:** negro, texto blanco, `rounded-lg`, solo visible en años intermedios.
- **Animación al cambiar activo:** el div padre tiene `key={selectedStockKey}` que fuerza remount + `animate-fadeSlideUp`.

---

## Animaciones y microinteracciones

Definidas en `tailwind.config.js`:

| Nombre | Duración | Easing | Uso |
|---|---|---|---|
| `fadeSlideUp` | `0.2s` | `ease-out` | Contenido del hero al cambiar activo, tooltips |
| `modalIn` | `0.2s` | `ease-out` | Entrada del modal (scale 0.96→1 + translateY 8px→0) |
| `slideUp` | `0.25s` | `cubic-bezier(0.32, 0.72, 0, 1)` | Definido pero no en uso activo |

**Hover / active states:**
- Botones primary/secondary: `active:scale-[0.98]`, `duration-150`
- SelectorButton: `active:scale-[0.97]`, `duration-100`
- Tabs del carousel: `transition-colors`
- Cards footer: `hover:shadow-md hover:-translate-y-0.5 duration-200`
- Filas de tabla: `hover:bg-[#FAFAFA] transition-colors`
- Todos los inputs: `transition-colors duration-150` en el border

**Regla:** ninguna animación supera los 250ms.

---

## Responsive

**Breakpoints usados:**

| Breakpoint | Valor | Uso |
|---|---|---|
| `sm:` | 640px | Mayoría de ajustes tipográficos y de espaciado |
| `lg:` | 1024px | Footer grid: `grid-cols-2` → `grid-cols-4` |
| `min-[900px]:` | 900px | Tabla desktop vs cards mobile (custom breakpoint) |

**Estrategia:** mobile-first. Los valores base son mobile; `sm:` sobreescribe para desktop.

**Comportamiento de elementos clave:**

- **Hero:** `min-h-screen sm:max-h-screen`. Flex column con 3 zonas (`justify-between`). En mobile se permite overflow vertical si es necesario.
- **Tabla:** `hidden min-[900px]:block` para la tabla; `min-[900px]:hidden` para las cards. Sin scroll horizontal en la tabla: usa `table-fixed` con porcentajes.
- **Carousel de stocks:** fila única `overflow-x-auto` con `scroll-snap-type: x mandatory`. Scrollbar oculta. Fades laterales con gradiente `#F5F5F5 → transparent`. `scrollIntoView` al clickear un tab.
- **Calculadora form:** `max-w-[520px] mx-auto`, siempre centrado.
- **Modal:** ocupa `100%` del viewport en mobile (con padding `p-4`), `max-w-[480px]` en desktop.

---

## Convenciones del producto

- **Montos:** `$1,234,567.89` — `Intl.NumberFormat('en-US', currency: USD)`. Siempre 2 decimales salvo formatShortUSD (sin decimales para números grandes).
- **Porcentajes grandes:** sufijos M%/K% via `formatPercentage()` en `finance.js`. Ej.: `893M%`, `1,234%`, `123%`, `12.5%`.
- **Verde (`#00D632`)** = ganancia, retorno positivo, interés compuesto.
- **Gris (`#8E8E93` / `#F5F5F5`)** = capital aportado, estados neutros.
- **Rojo (`#FF3B30`)** = error, tasa negativa, retorno histórico negativo.
- **Íconos de marcas:** en color del activo (`asset.color`) cuando están dentro del carousel/tabla. En blanco o negro cuando están sobre fondo oscuro.
- **Logo Cash App:** siempre en negro via `filter: brightness(0)` (`brightness-0`).
- Sin emojis decorativos en la UI.

## Layering (z-index)

| Layer | z-index | Componentes |
|---|---|---|
| Base | 0 | Contenido normal |
| Sticky | 10 | Elementos sticky (futuro) |
| Dropdown | 50 | StockSelect open |
| Tooltip | 60 | InfoTooltip, footer tooltips |
| Modal overlay | 100 | Modal background |
| Modal content | 110 | Modal foreground |

---

## Focus visible

Actualmente no hay estilos de `focus-visible` personalizados. Tailwind aplica su outline por defecto en algunos navegadores, pero no está unificado. Los botones `<button>` y los `<input>` usan el outline nativo del navegador al navegar por teclado.

> **Nota pendiente:** para una versión accesible completa, definir un estilo `focus-visible:outline-2 focus-visible:outline-[#00D632]` consistente en todos los elementos interactivos y suprimir el outline en clicks (`focus:outline-none` + `focus-visible:outline`).

---

## Empty states

La tabla de cálculos previos (`CalculationsTable.jsx`) se oculta completamente cuando no hay cálculos guardados — `if (!calculations.length) return null`. No hay mensaje de estado vacío ni ilustración placeholder.

La calculadora principal siempre está visible, por lo que el estado vacío de la tabla no interrumpe el flujo.

---

## Lo que NO hacemos

- Sin gradientes en la UI (solo en el chart fill, que es funcional).
- Sin sombras pesadas en cards — máximo `shadow-md` en hover. `shadow-2xl` solo en modal.
- Sin emojis en la UI (solo en documentación/README).
- Sin colores fuera de la paleta documentada.
- Sin `border-radius` mayores a `rounded-[24px]` (solo el modal usa ese máximo).
- Sin animaciones mayores a 250ms.
- Sin backend ni llamadas a APIs en runtime (datos hardcodeados o localStorage).
- Sin TypeScript (decisión consciente para v1).
- Sin gradientes de color en texto.
- No usar `#6B7280` para texto — usar `#8E8E93` (ver inconsistencia documentada arriba).
