import { useEffect, useState, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { MainLayout } from '../layouts/MainLayout'
import { supabase } from '../services/supabase'

// Above-the-fold (load immediately)
import DynamicFormsMarquee from '../components/home/DynamicFormsMarquee'
import HeroSection from '../components/home/HeroSection'
import { MottoStrip } from '../components/home/MottoStrip'

// Below-the-fold (lazy loaded)
const StudioSection = lazy(() => import('../components/home/StudioSection'))
const FeaturedEvents = lazy(() =>
  import('../components/home/FeaturedEvents').then(module => ({
    default: module.FeaturedEvents,
  }))
)
const FeaturedWorks = lazy(() =>
  import('../components/home/FeaturedWorks').then(module => ({
    default: module.FeaturedWorks,
  }))
)
const QuoteSection = lazy(() =>
  import('../components/home/MottoStrip').then(module => ({
    default: module.QuoteSection,
  }))
)

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
        <title>
          RAW Vision Media | Official Media & Photography Club of NMIMS Shirpur
        </title>

        <meta
          name="description"
          content="Official website of RAW Vision Media, the media, photography and cinematography club of NMIMS Shirpur. Explore campus events, galleries, videos, scrapbook and creative student work."
        />

        <meta
          name="keywords"
          content="RAW Vision Media, NMIMS Shirpur, Photography Club, Media Club, Cinematography, Student Club, Events"
        />

        <meta name="author" content="RAW Vision Media" />
        <meta name="robots" content="index, follow" />

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
          content="Official website of RAW Vision Media."
        />
        <meta property="og:url" content="https://rawvisionmedia.in/" />
        <meta property="og:site_name" content="RAW Vision Media" />
        <meta
          property="og:image"
          content="https://rawvisionmedia.in/og-image.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RAW Vision Media" />
        <meta
          name="twitter:description"
          content="Official Media Club of NMIMS Shirpur."
        />
        <meta
          name="twitter:image"
          content="https://rawvisionmedia.in/og-image.jpg"
        />

        {/* Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "RAW Vision Media",
            url: "https://rawvisionmedia.in",
            logo: "https://rawvisionmedia.in/favicon.png",
            description:
              "Official Media, Photography and Cinematography Club of NMIMS Shirpur.",
            sameAs: [
              "https://www.instagram.com/rawvisionmedia/"
            ],
            parentOrganization: {
              "@type": "CollegeOrUniversity",
              name: "SVKM's NMIMS Shirpur"
            }
          })}
        </script>

        {/* Website Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "RAW Vision Media",
            url: "https://rawvisionmedia.in"
          })}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Immediately visible */}
        <DynamicFormsMarquee />
        <HeroSection settings={settings} />
        <MottoStrip />

        {/* Load only after initial render */}
        <Suspense fallback={null}>
          <StudioSection />
          <FeaturedEvents />
          <FeaturedWorks />
          <QuoteSection />
        </Suspense>
      </motion.div>
    </MainLayout>
  )
}