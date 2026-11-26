import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEOHelmet from '../../components/SEOHelmet'
import HeroSection from './HeroSection'
import FeaturedProperties from './FeaturedProperties'
import LifestyleSearch from './LifestyleSearch'
import ListingCTA from './ListingCTA'

// Componentes removidos temporariamente (dados fictícios)
// import StatsSection from './StatsSection'
// import FinancingTools from './FinancingTools'
// import Testimonials from './Testimonials'
// import BlogSection from './BlogSection'

export default function HomePage() {
  return (
    <>
      <SEOHelmet />
      <Header />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <LifestyleSearch />
        <ListingCTA />
      </main>
      <Footer />
    </>
  )
}
