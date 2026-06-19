import { useEffect, useState } from 'react'
import { Check, Save } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { formService } from '../../services/formService'

const DEFAULT_SETTINGS = {
  hero_heading: 'RAW Vision Media',
  hero_subheading: 'Frames Speak Louder.',
  quote_text: 'Photography is the story I fail to put into words.',
  instagram: 'https://instagram.com/rawvisionmedia',
  youtube: 'https://youtube.com/@rawvisionmedia',
  linkedin: '',
  website_email: 'rawvision@nmims.in',
  contact_number: '',
  signup_enabled: true,
  external_users_enabled: true,
}

export default function SettingsAdmin() {
  const { isDark } = useTheme()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    formService.getSettings()
      .then(d => { if (d) setSettings({ ...DEFAULT_SETTINGS, ...d }) })
      .catch(() => {})
  }, [])

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setSettings(p => ({ ...p, [e.target.name]: val }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await formService.updateSettings(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) { alert(e.message) } finally { setSaving(false) }
  }

  const inputCls = `w-full py-2.5 px-3 border text-sm bg-transparent outline-none transition-colors ${isDark ? 'border-gray-700 text-white placeholder-gray-600 focus:border-raw-accent' : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-ink'}`
  const labelCls = `font-oswald text-xs tracking-widest uppercase block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`
  const sectionCls = `p-6 border ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'} space-y-5`

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="section-eyebrow mb-1">Configuration</p>
            <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Website Settings</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className={`btn-primary ${saved ? 'bg-green-700 border-green-700' : ''}`}>
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> {saving ? 'Saving...' : 'Save All'}</>}
          </button>
        </div>

        {/* Hero Text */}
        <div className={sectionCls}>
          <p className={`font-condensed text-lg tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-raw-ink'}`}>Hero Section</p>
          <div>
            <label className={labelCls}>Hero Heading</label>
            <input name="hero_heading" value={settings.hero_heading} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Hero Subheading / Tagline</label>
            <input name="hero_subheading" value={settings.hero_subheading} onChange={handleChange} className={inputCls} />
          </div>
        </div>

        {/* Quote */}
        <div className={sectionCls}>
          <p className={`font-condensed text-lg tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-raw-ink'}`}>Quote Section</p>
          <div>
            <label className={labelCls}>Quote Text</label>
            <textarea name="quote_text" value={settings.quote_text} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} />
          </div>
        </div>

        {/* Social */}
        <div className={sectionCls}>
          <p className={`font-condensed text-lg tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-raw-ink'}`}>Social Links</p>
          {[
            { name: 'instagram',      label: 'Instagram URL' },
            { name: 'youtube',        label: 'YouTube URL' },
            { name: 'linkedin',       label: 'LinkedIn URL' },
            { name: 'website_email',  label: 'Contact Email' },
            { name: 'contact_number', label: 'Contact Number' },
          ].map(f => (
            <div key={f.name}>
              <label className={labelCls}>{f.label}</label>
              <input name={f.name} value={settings[f.name] || ''} onChange={handleChange} className={inputCls} />
            </div>
          ))}
        </div>

        {/* Security */}
        <div className={sectionCls}>
          <p className={`font-condensed text-lg tracking-widest uppercase mb-1 ${isDark ? 'text-white' : 'text-raw-ink'}`}>Access Control</p>
          <div className="space-y-4">
            {[
              { name: 'signup_enabled',          label: 'Enable New Signups',    desc: 'Allow new users to create accounts.' },
              { name: 'external_users_enabled',  label: 'Allow External Users',  desc: 'Allow Gmail users to register.' },
            ].map(item => (
              <label key={item.name} className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  name={item.name}
                  checked={settings[item.name]}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 accent-raw-accent flex-shrink-0"
                />
                <div>
                  <p className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-white' : 'text-raw-ink'}`}>{item.label}</p>
                  <p className={`font-sans text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className={`btn-primary ${saved ? 'bg-green-700 border-green-700' : ''}`}>
            {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> {saving ? 'Saving...' : 'Save All Settings'}</>}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}