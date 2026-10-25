import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogoWordmark } from './Logo'
import { Menu, X, Heart, MessageCircle, User } from 'lucide-react'
import { useFavorites } from '../hooks/useFavorites'

const NAV_LINKS = [
  { label: 'Comprar', to: '/imoveis?tipo=venda' },
  { label: 'Alugar', to: '/imoveis?tipo=aluguel' },
  { label: 'Lançamentos', to: '/imoveis?tipo=lancamento' },
  { label: 'Vender', to: '/vender' },
  { label: 'Sobre', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
  { label: 'Seja Corretor', to: '/seja-um-corretor' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { favoriteCount } = useFavorites()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const transparent = isHome && !scrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-warm-200'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between" style={{ height: 72 }}>
        {/* Logo */}
        <Link to="/" aria-label="Ir para página inicial">
          <LogoWordmark size="sm" dark={transparent} />
        </Link>

        {/* Nav Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                transparent
                  ? 'text-white/85 hover:text-white hover:bg-white/10'
                  : 'text-warm-600 hover:text-navy-900 hover:bg-warm-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Favoritos */}
          <Link
            to="/imoveis"
            className={`relative p-2 rounded-lg transition-colors ${
              transparent ? 'text-white/85 hover:bg-white/10' : 'text-warm-600 hover:bg-warm-50'
            }`}
            aria-label="Favoritos"
          >
            <Heart size={20} />
            {favoriteCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* Área do Corretor */}
          <Link
            to="/admin/login"
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              transparent 
                ? 'text-white/90 hover:text-white hover:bg-white/10' 
                : 'text-navy-800 hover:bg-warm-100'
            }`}
            title="Acesso Corretor & Administrador"
          >
            <User size={18} />
            <span className="hidden md:inline">Entrar</span>
          </Link>

          {/* WhatsApp */}
          <a
            href="https://wa.me/5512999990000?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20im%C3%B3veis%20no%20Vale%20do%20Para%C3%ADba"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>

          {/* Mobile menu */}
          <button
            className={`lg:hidden p-2 rounded-lg transition ${
              transparent ? 'text-white' : 'text-navy-900'
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-warm-100 shadow-lg">
          <nav className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-3 rounded-lg text-sm font-medium text-warm-700 hover:text-navy-900 hover:bg-warm-50 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/admin/login"
              className="px-4 py-3 rounded-lg text-sm font-semibold text-navy-900 bg-warm-100 hover:bg-warm-200 flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <User size={16} /> Área do Corretor / Admin
            </Link>
            <a
              href="https://wa.me/5512999990000?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20im%C3%B3veis%20no%20Vale%20do%20Para%C3%ADba"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 btn btn-primary justify-center"
            >
              <MessageCircle size={16} /> Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
