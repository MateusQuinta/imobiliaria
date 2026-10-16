export default function Testimonials() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Testimonials - Removido temporariamente até ter depoimentos reais */}
        {/* <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-500 mb-3">Depoimentos</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-navy-900">O que nossos clientes dizem</h2>
          <p className="text-warm-500 mt-3 max-w-xl mx-auto">Relacionamentos que vão além do contrato.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="bg-warm-50 rounded-2xl p-8 flex flex-col">
              <Stars n={t.rating} />
              <p className="font-serif text-6xl text-gold-200 leading-none mt-2 select-none">"</p>
              <p className="text-warm-700 leading-relaxed italic text-base -mt-4">{t.text}</p>
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-warm-200">
                <img src={t.photo} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-gold-200" loading="lazy" />
                <div>
                  <p className="font-semibold text-navy-900 text-sm">{t.name}</p>
                  <p className="text-xs text-warm-400 mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  )
}
