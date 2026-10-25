import { Helmet } from 'react-helmet-async'

const DEFAULT_META = {
  title: 'Viva Belle Imobiliária — Seu novo capítulo começa aqui | Vale do Paraíba',
  description: 'A Viva Belle Imobiliária conecta você aos melhores imóveis de médio e alto padrão no Vale do Paraíba: São José dos Campos, Taubaté, Jacareí. Compra, venda e locação com atendimento humano, transparente e exclusivo.',
  keywords: 'imobiliária, Vale do Paraíba, São José dos Campos, Taubaté, Jacareí, Jardim Aquarius, Urbanova, Vila Ema, Colinas, imóveis alto padrão, comprar imóvel, alugar imóvel, lançamentos',
  ogImage: '/og-image.jpg',
}

export default function SEOHelmet({ title, description, path = '', noIndex = false }) {
  const fullTitle = title ? `${title} | Viva Belle Imobiliária` : DEFAULT_META.title
  const fullDescription = description || DEFAULT_META.description
  const url = `${import.meta.env.VITE_SITE_URL || 'https://vivabelle.com.br'}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={DEFAULT_META.keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={DEFAULT_META.ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={DEFAULT_META.ogImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* No index if needed */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}
