import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceDot, Label,
} from 'recharts'
import { calcularCrecimientoAcumulado } from '../utils/finance.js'

function CustomTooltip({ active, payload, label, startYear }) {
  if (!active || !payload?.length || label === startYear) return null
  return (
    <div className="bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
      ${payload[0].value.toFixed(2)} en {label}
    </div>
  )
}

export default function PerformanceChart({ returns, color = '#00D632', name = 'S&P 500' }) {
  const data = useMemo(() => calcularCrecimientoAcumulado(returns), [returns])
  const finalValue = data[data.length - 1].valor
  const startYear = data[0].year
  const investYear = returns[0].year

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-center mb-4">
        <p className="text-[16px] font-semibold text-black">
          $1 invertido en {investYear} valdría ${finalValue.toFixed(2)} hoy
        </p>
        <p className="text-[13px] text-[#8E8E93] mt-1">
          Crecimiento de {name} últimos 10 años
        </p>
      </div>

      <div
        className="flex-1 w-full rounded-2xl overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle, #E8E8E8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 28, right: 12, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.1} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="year"
              ticks={[2016, 2018, 2020, 2022, 2024, 2025]}
              tick={{ fontSize: 11, fill: '#8E8E93', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip startYear={startYear} />} />

            <Area
              type="monotone"
              dataKey="valor"
              stroke={color}
              strokeWidth={2.5}
              fill="url(#areaGradient)"
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: 'white', strokeWidth: 2 }}
            />

            <ReferenceDot x={startYear} y={1} r={4} fill={color} stroke="white" strokeWidth={2}>
              <Label value="$1.00" position="top" fontSize={11} fontWeight={600} fill="#111" />
            </ReferenceDot>

            <ReferenceDot x={data[data.length - 1].year} y={finalValue} r={4} fill={color} stroke="white" strokeWidth={2}>
              <Label value={`$${finalValue.toFixed(2)}`} position="top" fontSize={11} fontWeight={600} fill="#111" />
            </ReferenceDot>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
