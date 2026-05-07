import { useState, useCallback, useRef } from 'react'
import Layout from './components/Layout.jsx'
import StockCarousel from './components/StockCarousel.jsx'
import CalculatorSection from './components/CalculatorSection.jsx'
import CalculationsTable from './components/CalculationsTable.jsx'
import Footer from './components/Footer.jsx'
import { getCalculations } from './utils/storage.js'

export default function App() {
  const [calculations, setCalculations] = useState(() => getCalculations())
  const [preload, setPreload] = useState(null)
  const [selectedStockKey, setSelectedStockKey] = useState('SP500')
  const calculatorRef = useRef(null)

  const refreshCalculations = useCallback(() => {
    setCalculations(getCalculations())
  }, [])

  function scrollToCalculator() {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleLoadInCalculator(calc) {
    setSelectedStockKey(calc.stockKey || 'SP500')
    setPreload({ ...calc, _ts: Date.now() })
    scrollToCalculator()
  }

  return (
    <Layout>
      {/* Hero full-bleed — gestiona su propio ancho */}
      <StockCarousel
        selectedStockKey={selectedStockKey}
        onStockChange={setSelectedStockKey}
        onScrollToCalculator={scrollToCalculator}
      />
      {/* Calculadora y tabla — contenedor centrado */}
      <div className="max-w-[840px] mx-auto px-6">
        <CalculatorSection
          sectionRef={calculatorRef}
          onSaved={refreshCalculations}
          preload={preload}
          selectedStockKey={selectedStockKey}
          onStockChange={setSelectedStockKey}
        />
        <CalculationsTable
          calculations={calculations}
          onDelete={refreshCalculations}
          onLoadInCalculator={handleLoadInCalculator}
        />
      </div>
      <Footer />
    </Layout>
  )
}
