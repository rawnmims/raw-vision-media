import { useEffect, useState } from 'react'
import { Check, Save } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { formService } from '../../services/formService'

const DEFAULT_SETTINGS = {
  hero_heading:           'RAW Vision Media',
  hero_subheading:        'Frames Speak Louder.',
  quote_text:             'Photography is the story I fail to put into words.',
  instagram:              'https://instagram.com/rawvisionmedia',
  instagram_nmims:        'https://instagram.com/nmimshirpur',
  linkedin:               '',
  website_email:          'rawvision@nmims.in',
  signup_enabled:         true,
  external_users_enabled: true,
}

export default function SettingsAdmin() {
  const { isDark } = useTheme()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

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

  const ink    = isDark ? '#f0ece4' : '#1a1a1a'
  const bg     = isDark ? '#111'    : '#faf8f4'
  const rule   = isDark ? '#2a2520' : '#d4cec6'
  const muted  = isDark ? '#6a6460' : '#9a9088'
  const cardBg = isDark ? '#0d0d0d' : '#fff'
  const accent = '#c0392b'

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: `1px solid ${rule}`,
    background: 'transparent', color: ink,
    fontFamily: "'Oswald', sans-serif", fontSize: '13px', letterSpacing: '0.06em',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
  }

  const labelStyle = {
    fontFamily: "'Oswald', sans-serif", fontSize: '9px',
    letterSpacing: '0.3em', textTransform: 'uppercase',
    color: muted, display: 'block', marginBottom: '7px',
  }

  const sectionStyle = {
    background: cardBg, border: `1px solid ${rule}`, padding: '28px 28px 32px',
  }

  const sectionTitle = {
    fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
    fontSize: '1.1rem', color: ink, margin: '0 0 4px',
  }

  const sectionTag = {
    fontFamily: "'Oswald', sans-serif", fontSize: '9px',
    letterSpacing: '0.32em', textTransform: 'uppercase',
    color: accent, margin: '0 0 20px',
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '760px' }}>

        {/* page header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: `1px solid ${rule}`, marginBottom: '20px' }}>
          <div>
            <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '9px', letterSpacing: '0.32em', textTransform: 'uppercase', color: accent, margin: '0 0 4px' }}>Configuration</p>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '2rem', color: ink, margin: 0 }}>Website Settings</h1>
          </div>
          <button
            onClick={handleSave} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', background: saved ? '#2d6a2d' : ink, color: bg, border: 'none', cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', transition: 'all 0.2s' }}
          >
            {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> {saving ? 'Saving…' : 'Save All'}</>}
          </button>
        </div>

        {/* ── Hero Section ── */}
        <div style={sectionStyle}>
          <p style={sectionTag}>Hero Section</p>
          <h3 style={{ ...sectionTitle, marginBottom: '20px' }}>Hero Text</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Hero Heading</label>
              <input name="hero_heading" value={settings.hero_heading} onChange={handleChange} style={inputStyle}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = rule} />
            </div>
            <div>
              <label style={labelStyle}>Hero Subheading / Tagline</label>
              <input name="hero_subheading" value={settings.hero_subheading} onChange={handleChange} style={inputStyle}
                onFocus={e => e.target.style.borderColor = accent}
                onBlur={e => e.target.style.borderColor = rule} />
            </div>
          </div>
        </div>

        {/* ── Quote ── */}
        <div style={sectionStyle}>
          <p style={sectionTag}>Quote Section</p>
          <h3 style={{ ...sectionTitle, marginBottom: '20px' }}>Quote Text</h3>
          <div>
            <label style={labelStyle}>Quote</label>
            <textarea name="quote_text" value={settings.quote_text} onChange={handleChange} rows={3}
              style={{ ...inputStyle, resize: 'none', fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic', fontSize: '15px' }}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e => e.target.style.borderColor = rule} />
          </div>
        </div>

        {/* ── Social & Contact ── */}
        <div style={sectionStyle}>
          <p style={sectionTag}>Social & Contact</p>
          <h3 style={{ ...sectionTitle, marginBottom: '20px' }}>Links & Contact</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {[
              { name: 'instagram',       label: 'Instagram URL — RAW Vision Media',  placeholder: 'https://instagram.com/rawvisionmedia' },
              { name: 'instagram_nmims', label: 'Instagram URL — NMIMS Shirpur',     placeholder: 'https://instagram.com/nmimshirpur'    },
              { name: 'linkedin',        label: 'LinkedIn URL',                       placeholder: 'https://linkedin.com/company/...'     },
              { name: 'website_email',   label: 'Contact Email',                      placeholder: 'rawvision@nmims.in'                  },
            ].map(f => (
              <div key={f.name}>
                <label style={labelStyle}>{f.label}</label>
                <input
                  name={f.name}
                  value={settings[f.name] || ''}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  style={{ ...inputStyle, color: settings[f.name] ? ink : muted }}
                  onFocus={e => e.target.style.borderColor = accent}
                  onBlur={e => e.target.style.borderColor = rule}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Access Control ── */}
        <div style={sectionStyle}>
          <p style={sectionTag}>Security</p>
          <h3 style={{ ...sectionTitle, marginBottom: '20px' }}>Access Control</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'signup_enabled',         label: 'Enable New Signups',   desc: 'Allow new users to create accounts.'    },
              { name: 'external_users_enabled', label: 'Allow External Users', desc: 'Allow Gmail users to register.'         },
            ].map(item => (
              <label key={item.name} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox" name={item.name}
                  checked={settings[item.name]}
                  onChange={handleChange}
                  style={{ width: '14px', height: '14px', marginTop: '3px', accentColor: accent, flexShrink: 0, cursor: 'pointer' }}
                />
                <div>
                  <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: ink, margin: '0 0 3px' }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: '14px', color: muted, margin: 0, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* save bottom */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
          <button
            onClick={handleSave} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 28px', background: saved ? '#2d6a2d' : ink, color: bg, border: 'none', cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', transition: 'all 0.2s' }}
          >
            {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> {saving ? 'Saving…' : 'Save All Settings'}</>}
          </button>
        </div>

      </div>
    </AdminLayout>
  )
}