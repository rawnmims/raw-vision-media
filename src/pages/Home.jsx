import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import DynamicFormsMarquee from '../components/home/DynamicFormsMarquee'
import HeroSection from '../components/home/HeroSection'
import { MottoStrip, DynamicFormsBanner, QuoteSection } from '../components/home/MottoStrip'
import { FeaturedEvents } from '../components/home/FeaturedEvents'
import { MainLayout } from '../layouts/MainLayout'
import { FeaturedWorks } from '../components/home/FeaturedWorks'
import { supabase } from '../services/supabase'
import StudioSection from '../components/home/StudioSection'
import { Helmet } from 'react-helmet-async'

export default function Home() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .single()

    if (!error) {
      setSettings(data)
    }
  }

  return (
    <MainLayout>
      <Helmet>
        <title>RAW Vision Media | Official Media & Photography Club of NMIMS Shirpur</title>

        <meta
          name="description"
          content="Official website of RAW Vision Media, the media and photography club of NMIMS Shirpur. Explore campus events, galleries, videos, scrapbook, team, and creative student work."
        />

        <meta
          name="keywords"
          content="RAW Vision Media, NMIMS Shirpur, Media Club, Photography Club, Videography, Student Club, Campus Events"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DynamicFormsMarquee />
        <HeroSection settings={settings} />
        <MottoStrip />
        <StudioSection />
        <FeaturedEvents />
        <FeaturedWorks />
        <QuoteSection />
      </motion.div>
    </MainLayout>
  )
}