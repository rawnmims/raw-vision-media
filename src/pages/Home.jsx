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
        {/* Basic SEO */}
        <title>
          RAW Vision Media | Official Media & Photography Club of NMIMS Shirpur
        </title>

        <meta
          name="description"
          content="Official website of RAW Vision Media, the media and photography club of NMIMS Shirpur. Explore campus events, galleries, videos, scrapbook, team, and creative student work."
        />

        <meta
          name="keywords"
          content="RAW Vision Media, NMIMS Shirpur, Photography Club, Media Club, Cinematography, Events, Campus Photography, Student Club, RAW, NMIMS"
        />

        <meta name="author" content="RAW Vision Media" />

        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href="https://rawvisionmedia.in/"
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="RAW Vision Media | Official Media & Photography Club of NMIMS Shirpur"
        />
        <meta
          property="og:description"
          content="Official Media & Photography Club of NMIMS Shirpur. Explore events, galleries, videos and creative student work."
        />
        <meta
          property="og:url"
          content="https://rawvisionmedia.in/"
        />
        <meta
          property="og:site_name"
          content="RAW Vision Media"
        />
        <meta
          property="og:image"
          content="https://rawvisionmedia.in/og-image.jpg"
        />
        <meta
          property="og:image:width"
          content="1200"
        />
        <meta
          property="og:image:height"
          content="630"
        />
        <meta
          property="og:locale"
          content="en_IN"
        />

        {/* Twitter */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content="RAW Vision Media | Official Media & Photography Club of NMIMS Shirpur"
        />
        <meta
          name="twitter:description"
          content="Official Media & Photography Club of NMIMS Shirpur."
        />
        <meta
          name="twitter:image"
          content="https://rawvisionmedia.in/og-image.jpg"
        />

        {/* Theme */}
        <meta
          name="theme-color"
          content="#000000"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "RAW Vision Media",
            "url": "https://rawvisionmedia.in",
            "logo": "https://rawvisionmedia.in/favicon.png",
            "description":
              "Official Media, Photography and Cinematography Club of NMIMS Shirpur.",
            "sameAs": [
              "https://www.instagram.com/raw_nmims/"
            ],
            "parentOrganization": {
              "@type": "CollegeOrUniversity",
              "name": "SVKM's NMIMS Shirpur"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "RAW Vision Media",
            "url": "https://rawvisionmedia.in",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://rawvisionmedia.in/events",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
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