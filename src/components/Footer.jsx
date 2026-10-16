import { Link } from 'react-router-dom'
import { LogoWordmark } from './Logo'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const InstagramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

const YoutubeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
)

const SOCIAL_ICONS = [InstagramIcon, FacebookIcon, LinkedinIcon, YoutubeIcon]

const LINKS = {
  comprar: [
    { label: 'Apartamentos', to: '/imoveis?categoria=apartamento&tipo=venda' },
    { label: 'Casas', to: '/imoveis?categoria=casa&tipo=venda' },
    { label: 'Coberturas', to: '/imoveis?categoria=cobertura&tipo=venda' },
    { label: 'Lançamentos', to: '/imoveis?tipo=lancamento' },
    { label: 'Bairros em SP', to: '/imoveis' },
  ],
  alugar: [
    { label: 'Apartamentos', to: '/imoveis?categoria=apartamento&tipo=aluguel' },
    { label: 'Casas', to: '/imoveis?categoria=casa&tipo=aluguel' },
    { label: 'Studios', to: '/imoveis?categoria=studio&tipo=aluguel' },
    { label: 'Por bairro', to: '/imoveis?tipo=aluguel' },
  ],
  empresa: [
    { label: 'Sobre nós', to: '/sobre' },
    { label: 'Nossa equipe', to: '/sobre#equipe' },
    { label: 'Blog', to: '/blog' },
    { label: 'Trabalhe conosco', to: '/contato' },
    { label: 'Avalie-nos', to: '/contato' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <LogoWordmark size="sm" dark />
            <p className="text-white/50 text-sm leading-relaxed mt-4 max-w-xs">
              Conectamos famílias paulistanas aos melhores imóveis de médio e alto padrão, com atendimento humano e total transparência.
            </p>
            <div className="flex gap-3 mt-6">
              {SOCIAL_ICONS.map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/8 flex items-center justify-center text-white/50 hover:bg-gold-500 hover:text-white transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/8 flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs text-white/40">
                <MapPin size={12} /> Rua Oscar Freire, 820 - cj 41, Jardins, São Paulo - SP
              </span>
              <span className="flex items-center gap-2 text-xs text-white/40">
                <Phone size={12} /> (11) 3000-0000
              </span>
              <span className="flex items-center gap-2 text-xs text-white/40">
                <Mail size={12} /> contato@vivabelle.com.br
              </span>
              <span className="flex items-center gap-2 text-xs text-white/40">
                <Clock size={12} /> Seg–Sex 9h–19h &middot; Sáb 9h–14h
              </span>
            </div>
          </div>

          {/* Comprar */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-5">Comprar</h4>
            <ul className="flex flex-col gap-2">
              {LINKS.comprar.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/50 hover:text-gold-300 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Alugar */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-5">Alugar</h4>
            <ul className="flex flex-col gap-2">
              {LINKS.alugar.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/50 hover:text-gold-300 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-5">Empresa</h4>
            <ul className="flex flex-col gap-2">
              {LINKS.empresa.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/50 hover:text-gold-300 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>© 2026 Viva Belle Imobiliária Ltda. &middot; CNPJ 12.345.678/0001-90 &middot; CRECI-SP 12345-J</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white/60 transition">Política de Privacidade</a>
            <a href="#" className="hover:text-white/60 transition">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
