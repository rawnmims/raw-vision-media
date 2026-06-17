import { Link } from 'react-router-dom'
import { Instagram, Youtube, Linkedin, Mail, Phone, Camera } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function Footer() {
  const { isDark } = useTheme()

  return (
    <footer className={`border-t ${isDark ? 'bg-raw-black border-gray-800 text-gray-300' : 'bg-raw-ink text-gray-300 border-gray-800'}`}>
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="font-condensed text-5xl text-white" style={{ background: '#000', padding: '2px 6px' }}>R</span>
              <span className="font-condensed text-5xl text-white">AW</span>
            </div>
            <p className="font-serif text-gray-400 text-sm leading-relaxed italic mb-4">
              Frames Speak Louder.
            </p>
            <p className="font-oswald text-xs tracking-widest text-gray-500 uppercase">
              NMIMS Shirpur · Est. 2016
            </p>
            <p className="font-oswald text-xs tracking-widest text-gray-500 uppercase mt-1">
              Official Media Club
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-oswald text-xs tracking-widest text-gray-500 uppercase mb-4 border-b border-gray-700 pb-2">Navigate</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Events', to: '/events' },
                { label: 'Archive', to: '/archive' },
                { label: 'Scrapbook', to: '/scrapbook' },
                { label: 'Videos', to: '/videos' },
                { label: 'About', to: '/about' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="font-oswald text-xs tracking-wider text-gray-400 hover:text-white uppercase transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div>
            <h4 className="font-oswald text-xs tracking-widest text-gray-500 uppercase mb-4 border-b border-gray-700 pb-2">Get Involved</h4>
            <ul className="space-y-2">
              {[
                { label: 'Join RAW', action: true },
                { label: 'Request Coverage', action: true },
                { label: 'Sign In', to: '/login' },
                { label: 'Create Account', to: '/signup' },
              ].map((link, i) => (
                <li key={i}>
                  <span className="font-oswald text-xs tracking-wider text-gray-400 hover:text-white uppercase transition-colors cursor-pointer">
                    {link.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-oswald text-xs tracking-widest text-gray-500 uppercase mb-4 border-b border-gray-700 pb-2">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail size={13} />
                <span className="font-oswald text-xs tracking-wider">rawvision@nmims.in</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone size={13} />
                <span className="font-oswald text-xs tracking-wider">+91 XXXXX XXXXX</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="font-oswald text-xs tracking-widest text-gray-500 uppercase mb-3">Follow Us</h4>
              <div className="flex items-center gap-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={16} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer"
                  className="text-gray-400 hover:text-white transition-colors">
                  <Youtube size={16} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                  className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-oswald text-xs tracking-wider text-gray-600 uppercase">
            © {new Date().getFullYear()} RAW Vision Media · NMIMS Shirpur
          </p>
          <p className="font-oswald text-xs tracking-wider text-gray-600 uppercase flex items-center gap-1">
            <Camera size={11} /> Frames Speak Louder
          </p>
        </div>
      </div>
    </footer>
  )
}
