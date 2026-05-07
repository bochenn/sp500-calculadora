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
      <div className="max-w-[1040px] mx-auto px-8 sm:px-12 text-center">

        <h2 className="text-[32px] sm:text-[40px] font-bold text-black">
          Empezá a invertir hoy
        </h2>
        <p className="text-[16px] sm:text-[18px] text-[#6B7280] mt-4 max-w-[600px] mx-auto leading-relaxed">
          Comenzá instalando alguna de estas aplicaciones y empezá invirtiendo sumas pequeñas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {APPS.map((app) => (
            <div
              key={app.appId}
              className="bg-white border border-[#E5E5E5] rounded-[20px] p-6
                flex flex-col items-center text-center
                hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <img
                src={`/app-icons/${app.appId}.png`}
                alt={`${app.name} icon`}
                className="w-[72px] h-[72px] rounded-[22%] mb-4"
              />
              <h3 className="text-[18px] font-bold text-black mb-2">{app.name}</h3>
              <p className="text-[14px] text-[#6B7280] leading-relaxed flex-1 mb-5">
                {app.description}
              </p>
              <button
                onClick={() => window.open(app.url, '_blank', 'noopener noreferrer')}
                className="flex items-center justify-center gap-1.5 w-full
                  bg-[#F0F0F0] hover:bg-[#E5E5E5] text-black font-semibold
                  text-[14px] px-5 py-2.5 rounded-full transition-colors"
              >
                Descargar
                <FiExternalLink size={13} />
              </button>
            </div>
          ))}
        </div>

      </div>
    </footer>
  )
}
