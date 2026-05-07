import { FiTrendingUp } from 'react-icons/fi'
import { FaMicrosoft, FaAmazon, FaBriefcase } from 'react-icons/fa'
import { SiApple, SiTesla, SiGoogle, SiNvidia, SiMeta, SiNetflix } from 'react-icons/si'

// Cruz médica — ícono genérico farmacéutico para Bayer
function BayerIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
      <rect x="6" y="1" width="4" height="14" rx="1" />
      <rect x="1" y="6" width="14" height="4" rx="1" />
    </svg>
  )
}

export const STOCK_ICONS = {
  SP500:  FiTrendingUp,
  AAPL:   SiApple,
  MSFT:   FaMicrosoft,
  TSLA:   SiTesla,
  GOOGL:  SiGoogle,
  NVDA:   SiNvidia,
  AMZN:   FaAmazon,
  META:   SiMeta,
  NFLX:   SiNetflix,
  BRK_B:  FaBriefcase,
  BAYN:   BayerIcon,
}
