import { motion } from 'framer-motion'
import HeroSection from '../components/home/HeroSection'
import { MottoStrip, DynamicFormsBanner, QuoteSection } from '../components/home/MottoStrip'
import { FeaturedEvents, FeaturedWorks } from '../components/home/FeaturedEvents'
import { MainLayout } from '../layouts/MainLayout'

export default function Home() {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
        <MottoStrip />
        <FeaturedEvents />
        <DynamicFormsBanner />
        <FeaturedWorks />
        <QuoteSection />
      </motion.div>
    </MainLayout>
  )
}
