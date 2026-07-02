import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { data: events, error } = await supabase
    .from('events')
    .select('slug')
    .eq('visibility', 'public')
    .order('event_date', { ascending: false })

  const urls = [
    '',
    '/about',
    '/events',
    '/videos',
    '/archive',
    '/scrapbook'
  ]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>`

  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  urls.forEach(url => {
    xml += `
      <url>
        <loc>https://rawvisionmedia.in${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>${url === '' ? '1.0' : '0.8'}</priority>
      </url>`
  })

  if (!error && events) {
    events.forEach(event => {
      xml += `
        <url>
          <loc>https://rawvisionmedia.in/events/${event.slug}</loc>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>`
    })
  }

  xml += `</urlset>`

  res.setHeader('Content-Type', 'application/xml')
  res.status(200).send(xml)
}