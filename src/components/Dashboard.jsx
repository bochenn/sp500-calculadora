import PerformanceChart from './PerformanceChart.jsx'
import Button from './ui/Button.jsx'

export default function Dashboard({ onScrollToCalculator }) {
  return (
    <section className="text-center pt-16 sm:pt-24 pb-20">

      {/* Título principal — estilo Mercury: enorme, tight, centrado */}
      <h1 className="text-[44px] sm:text-[72px] font-extrabold text-black
        tracking-[-0.02em] leading-[1.05] mb-5">
        Invertir en S&P 500
      </h1>

      {/* Subtítulo */}
      <p className="text-[17px] sm:text-[19px] text-[#6B7280] leading-relaxed
        max-w-[540px] mx-auto">
        Alto rendimiento histórico de las 500 empresas más grandes de EE.UU.
      </p>

      {/* Gráfico de rendimiento */}
      <div className="mt-16">
        <div className="flex items-center justify-center gap-5 mb-4">
          <p className="text-[12px] font-medium text-[#8E8E93] uppercase tracking-wider">
            Rendimiento anual 2016–2025
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[#8E8E93]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#00D632] inline-block" />
              Positivo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#3A3A3C] inline-block" />
              Negativo
            </span>
          </div>
        </div>
        <PerformanceChart />
      </div>

      {/* CTA — hace scroll a la calculadora */}
      <div className="max-w-[300px] mx-auto mt-14">
        <Button onClick={onScrollToCalculator}>
          Calcular tu inversión y retorno
        </Button>
      </div>

    </section>
  )
}
