import { useLocation } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppFloat() {
  const { pathname } = useLocation()

  // Não exibir dentro do painel admin
  if (pathname.startsWith('/admin') || pathname.startsWith('/cadastro-') || pathname.startsWith('/conta-')) {
    return null
  }

  return (
    <a
      href="https://wa.me/5512997778899?text=Ol%C3%A1!%20Estou%20no%20site%20da%20Viva%20Belle%20Imobili%C3%A1ria%20e%20gostaria%20de%20atendimento."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      title="Falar com um corretor pelo WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm px-4 py-3.5 rounded-full shadow-xl hover:scale-105 transition-all duration-200"
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline">Fale Conosco</span>
    </a>
  )
}
