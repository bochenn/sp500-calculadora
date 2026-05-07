import * as Select from '@radix-ui/react-select'
import { ASSETS } from '../../data/assets.js'
import { STOCK_ICONS } from '../../utils/stockIcons.jsx'

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function StockSelect({ value, onValueChange }) {
  const asset = ASSETS[value] || ASSETS['SP500']
  const TriggerIcon = STOCK_ICONS[value] || STOCK_ICONS['SP500']

  return (
    <Select.Root value={value} onValueChange={onValueChange}>
      <Select.Trigger
        aria-label={`Activo: ${asset.name}`}
        className="w-full flex items-center gap-3 border border-[#D1D1D1] rounded-[12px]
          px-4 py-3 bg-white hover:border-black focus:border-[#00D632] focus:outline-none
          transition-colors cursor-pointer"
      >
        <span className="w-6 h-6 flex items-center justify-center shrink-0">
          <TriggerIcon size={20} style={{ color: asset.color }} />
        </span>
        <span className="flex items-center gap-2 flex-1 text-left">
          <span className="text-[15px] font-semibold text-black">{asset.name}</span>
          <span className="text-[13px] text-[#8E8E93]">{asset.ticker}</span>
        </span>
        <Select.Icon className="text-[#8E8E93] shrink-0">
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="bg-white border border-[#E5E5E5] rounded-[12px] shadow-lg py-1.5 z-50"
          style={{ width: 'var(--radix-select-trigger-width)' }}
        >
          <Select.Viewport className="max-h-[280px] overflow-y-auto">
            {Object.entries(ASSETS).map(([key, a]) => {
              const ItemIcon = STOCK_ICONS[key]
              return (
                <Select.Item
                  key={key}
                  value={key}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer outline-none
                    mx-1.5 rounded-lg
                    data-[highlighted]:bg-[#FAFAFA]
                    data-[state=checked]:bg-[#F0F0F0]"
                >
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    {ItemIcon && <ItemIcon size={16} style={{ color: a.color }} />}
                  </span>
                  <span className="flex items-center gap-1.5 flex-1 min-w-0">
                    <Select.ItemText>
                      <span className="text-[14px] font-medium text-black">{a.name}</span>
                    </Select.ItemText>
                    <span className="text-[12px] text-[#8E8E93] shrink-0">{a.ticker}</span>
                  </span>
                  <Select.ItemIndicator className="text-[#00D632] shrink-0">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              )
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
