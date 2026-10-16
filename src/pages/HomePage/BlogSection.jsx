import { BLOG_POSTS } from '../../data'
import { Clock, ArrowRight } from 'lucide-react'

export default function BlogSection() {
  return (
    <section className="bg-warm-50 py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-500 mb-3">Conteúdo</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">Dicas e informações<br className="hidden md:block" /> do mercado</h2>
            <p className="text-warm-500 mt-3 max-w-md">Conteúdo prático para ajudar você a tomar a melhor decisão imobiliária.</p>
          </div>
          <a href="/blog" className="btn btn-ghost shrink-0">Ver todos os artigos</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map(post => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer">
              <div className="overflow-hidden" style={{aspectRatio: '16/9'}}>
                <img
                  src={post.image} alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold text-gold-600 uppercase tracking-wide">{post.category}</span>
                <h3 className="font-serif text-lg font-semibold text-navy-900 mt-2 leading-snug group-hover:text-gold-600 transition-colors">{post.title}</h3>
                <p className="text-sm text-warm-500 leading-relaxed mt-2 line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-warm-100">
                  <span className="flex items-center gap-2 text-xs text-warm-400">
                    <Clock size={12} /> {post.date} &middot; {post.readTime}
                  </span>
                  <span className="text-xs font-semibold text-navy-900 group-hover:text-gold-500 transition-colors flex items-center gap-1">
                    Ler <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
