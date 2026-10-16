import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SEOHelmet from '../../components/SEOHelmet'
import HeroSection from './HeroSection'
import FeaturedProperties from './FeaturedProperties'
import LifestyleSearch from './LifestyleSearch'
import StatsSection from './StatsSection'
import FinancingTools from './FinancingTools'
import ListingCTA from './ListingCTA'
import Testimonials from './Testimonials'
import BlogSection from './BlogSection'

export default function HomePage() {
  return (
    <>
      <SEOHelmet />
      <Header />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <LifestyleSearch />
        <StatsSection />
        <FinancingTools />
        <ListingCTA />
        <Testimonials />
        <BlogSection />
      </main>
      <Footer />
    </>
  )
}
