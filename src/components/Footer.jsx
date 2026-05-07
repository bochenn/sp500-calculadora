import * as Tooltip from '@radix-ui/react-tooltip'
import { FiExternalLink } from 'react-icons/fi'

const APPS = [
  {
    appId: '1567954123',
    url: 'https://apps.apple.com/ar/app/dolarapp/id1567954123',
    name: 'DolarApp',
    description: 'Tu cuenta en dólares en el celular. Convertí, ahorrá y enviá USD desde Argentina.',
  },
  {
    appId: '6477979345',
    url: 'https://apps.apple.com/ar/app/berry/id6477979345?l=en-GB',
    name: 'Berry',
    description: 'Inversiones globales simples. Comprá acciones, ETFs y crypto desde el celular.',
  },
  {
    appId: '1615111890',
    url: 'https://apps.apple.com/us/app/iol/id1615111890',
    name: 'IOL',
    description: 'Bróker líder en Argentina. Acciones locales, dólares MEP, bonos y FCI.',
  },
  {
    appId: '1318206099',
    url: 'https://apps.apple.com/us/app/balanz/id1318206099',
    name: 'Balanz',
    description: 'Plataforma de inversión integral. Trading, asesoramiento y gestión de carteras.',
  },
]

export default function Footer() {
  return (
    <footer className="w-full bg-[#FAFAFA] border-t border-[#E5E5E5] py-20 sm:py-28">
      <div className="max-w-[1040px] mx-auto px-8 sm:px-12">

        {/* Headline — left-aligned */}
        <h2 className="text-[32px] sm:text-[40px] font-bold text-black">
          Empezá a invertir hoy
        </h2>
        <p className="text-[16px] sm:text-[18px] text-[#6B7280] mt-4 max-w-[620px] leading-relaxed">
          Comenzá instalando alguna de estas aplicaciones y empezá invirtiendo sumas pequeñas.
        </p>

        {/* Grid de cards */}
        <Tooltip.Provider delayDuration={400}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-14">
            {APPS.map((app) => (
              <Tooltip.Root key={app.appId}>
                <Tooltip.Trigger asChild>
                  {/* Card entera clickeable */}
                  <button
                    onClick={() => window.open(app.url, '_blank', 'noopener noreferrer')}
                    className="bg-[#F5F5F5] rounded-[22px] flex flex-col w-full
                      cursor-pointer hover:shadow-md hover:-translate-y-0.5
                      transition-all duration-200 overflow-hidden text-left"
                  >
                    {/* Área visual: icon con espacio generoso */}
                    <div className="flex items-center justify-center py-10 sm:py-12 flex-1">
                      <img
                        src={`/app-icons/${app.appId}.png`}
                        alt={`${app.name} icon`}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-[22%]"
                        style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.13))' }}
                      />
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#E5E5E5]" />

                    {/* Nombre */}
                    <div className="flex items-center justify-center gap-1.5 px-5 py-4">
                      <span className="text-[15px] sm:text-[16px] font-semibold text-black">
                        {app.name}
                      </span>
                      <FiExternalLink size={13} className="text-[#8E8E93] shrink-0" />
                    </div>
                  </button>
                </Tooltip.Trigger>

                <Tooltip.Portal>
                  <Tooltip.Content
                    sideOffset={8}
                    className="bg-black text-white text-[13px] leading-relaxed
                      rounded-xl px-3.5 py-2.5 max-w-[220px] z-50
                      animate-fadeSlideUp"
                  >
                    {app.description}
                    <Tooltip.Arrow className="fill-black" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            ))}
          </div>
        </Tooltip.Provider>

      </div>
    </footer>
  )
}
