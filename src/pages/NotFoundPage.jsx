import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SEOHelmet from '../components/SEOHelmet'
import { HelpCircle, Home, Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <>
      <SEOHelmet
        title="Página não encontrada — Viva Belle Imobiliária"
        description="A página que você procura não existe ou foi removida."
        path="/404"
      />
      <Header />

      <main className="min-h-screen bg-warm-50 flex items-center justify-center px-6 py-32">
        <div className="max-w-lg w-full text-center space-y-8">
          {/* Ícone composto */}
          <div className="relative inline-flex items-center justify-center">
            <div className="w-32 h-32 rounded-3xl bg-navy-950 flex items-center justify-center shadow-2xl">
              <Home size={52} className="text-gold-400" />
            </div>
            <div className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-white border-2 border-warm-200 flex items-center justify-center shadow-lg">
              <HelpCircle size={24} className="text-warm-400" />
            </div>
          </div>

          {/* Código de erro */}
          <div>
            <p className="text-8xl font-bold text-navy-900/10 font-serif select-none leading-none">
              404
            </p>
          </div>

          {/* Mensagem criativa */}
          <div className="space-y-3 -mt-4">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 leading-tight">
              Ops! Este imóvel parece ter sido vendido antes de você chegar.
            </h1>
            <p className="text-warm-500 text-base leading-relaxed">
              A página que você procura não existe, foi movida ou o link está incorreto.
              Mas não se preocupe — temos centenas de oportunidades esperando por você!
            </p>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="btn btn-primary gap-2 py-3.5 px-7 text-sm font-semibold shadow-md"
            >
              <Home size={18} />
              Voltar ao Início
            </Link>
            <Link
              to="/imoveis"
              className="btn btn-secondary gap-2 py-3.5 px-7 text-sm font-semibold text-navy-900 border-warm-300 hover:bg-warm-100"
            >
              <Search size={18} />
              Ver Imóveis
            </Link>
          </div>

          {/* Sugestões */}
          <div className="pt-6 border-t border-warm-200">
            <p className="text-xs text-warm-400 mb-4 font-semibold uppercase tracking-wider">
              Você pode estar procurando por
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { label: 'Comprar', to: '/imoveis?tipo=venda' },
                { label: 'Alugar', to: '/imoveis?tipo=aluguel' },
                { label: 'Lançamentos', to: '/imoveis?tipo=lancamento' },
                { label: 'Seja Corretor', to: '/seja-um-corretor' },
                { label: 'Contato', to: '/contato' },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-4 py-2 rounded-xl bg-white border border-warm-200 text-sm font-medium text-navy-800 hover:bg-navy-950 hover:text-white hover:border-navy-950 transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
