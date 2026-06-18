import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, X, Check, Edit2, Eye, EyeOff,
  ToggleLeft, ToggleRight, GripVertical, ChevronDown, ChevronUp, Download
} from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout'
import { useTheme } from '../../context/ThemeContext'
import { formService } from '../../services/formService'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// ── Field types available in the builder ──────────────────────
const FIELD_TYPES = [
  { value: 'text',     label: 'Short Text' },
  { value: 'textarea', label: 'Long Text / Paragraph' },
  { value: 'email',    label: 'Email' },
  { value: 'tel',      label: 'Phone Number' },
  { value: 'number',   label: 'Number' },
  { value: 'date',     label: 'Date' },
  { value: 'select',   label: 'Dropdown (Select)' },
  { value: 'radio',    label: 'Multiple Choice (Radio)' },
  { value: 'checkbox', label: 'Checkboxes (Multi-select)' },
  { value: 'url',      label: 'URL / Link' },
  { value: 'file_url', label: 'Google Drive / File URL' },
]

const EMPTY_FIELD = {
  id: '',
  type: 'text',
  label: '',
  placeholder: '',
  required: false,
  options: '', // comma-separated for select/radio/checkbox
}

const EMPTY_FORM = {
  title: '',
  description: '',
  slug: '',
  is_open: true,
  show_on_homepage: false,
  fields: [],
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function newFieldId() {
  return 'field_' + Math.random().toString(36).slice(2, 8)
}

// ── Responses viewer ──────────────────────────────────────────
function ResponsesModal({ form, onClose, isDark }) {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    formService.getFormResponses(form.id)
      .then(setResponses)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [form.id])

  const filteredResponses = responses.filter(r =>
  JSON.stringify(r.response)
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
)

  const exportExcel = () => {
  if (!responses.length) return

  const excelData = responses.map(r => {
    const row = {}

    form.fields.forEach(field => {
      row[field.label] =
        r.response?.[field.id] ||
        r.response?.[field.label] ||
        ''
    })

    row['Submitted At'] = new Date(
      r.created_at
    ).toLocaleString('en-IN')

    return row
  })

  const worksheet =
    XLSX.utils.json_to_sheet(excelData)

  const workbook =
    XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Responses'
  )

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })

  const blob = new Blob(
    [excelBuffer],
    {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  )

  saveAs(
    blob,
    `${form.slug}-responses.xlsx`
  )
}

  const bg = isDark ? 'bg-[#111] text-white border-gray-800' : 'bg-white text-raw-ink border-gray-200'

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className={`${bg} w-full max-w-3xl max-h-[90vh] overflow-y-auto border`}>

        <div className={`sticky top-0 px-7 pt-6 pb-4 border-b flex justify-between items-center ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'}`}>
          <div>
            <h2 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
              {form.title} — Responses
            </h2>
            <p className={`font-oswald text-xs tracking-widest uppercase mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {responses.length} response{responses.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {responses.length > 0 && (
              <button onClick={exportExcel} className={`flex items-center gap-2 font-oswald text-xs tracking-widest uppercase px-3 py-2 border transition-all
                ${isDark ? 'border-gray-700 text-gray-300 hover:border-white' : 'border-gray-300 text-gray-600 hover:border-raw-ink'}`}>
                <Download size={13} /> Export Excel
              </button>
            )}
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
        </div>

        <div className="px-7 py-6">
          <div className="mb-4">
  <input
    type="text"
    placeholder="Search responses..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className={`
      w-full px-4 py-3 border rounded-md
      ${isDark
        ? 'bg-black border-gray-700 text-white'
        : 'bg-white border-gray-300 text-black'}
    `}
  />
</div>
          {loading ? (
            <p className={`font-condensed text-xl animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Loading...</p>
          ) : responses.length === 0 ? (
            <p className={`font-display text-lg italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No responses yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={isDark ? 'border-gray-800' : 'border-gray-200'}>
                    {form.fields.map(field => (
                      <th
                        key={field.id}
                        className="
              text-left
              px-4
              py-3
              font-oswald
              text-xs
              tracking-widest
              uppercase
              border-b
            "
                      >
                        {field.label}
                      </th>
                    ))}

                    <th
                      className="
            text-left
            px-4
            py-3
            font-oswald
            text-xs
            tracking-widest
            uppercase
            border-b
          "
                    >
                      Submitted
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredResponses.map(response => (
                    <tr
                      key={response.id}
                      className={`
            border-b
            ${isDark ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-100 hover:bg-gray-50'}
          `}
                    >
                      {form.fields.map(field => (
                        <td
                          key={field.id}
                          className="px-4 py-3 text-sm"
                        >
                          {response.response?.[field.id] ||
                            response.response?.[field.label] ||
                            '—'}
                        </td>
                      ))}

                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {new Date(response.created_at).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Form Builder Modal ────────────────────────────────────────
function FormBuilderModal({ initial, onClose, onSave, isDark }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [activeFieldIdx, setActiveFieldIdx] = useState(null)

  const setMeta = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const handleTitleChange = e => {
    setMeta('title', e.target.value)
    if (!initial) setMeta('slug', slugify(e.target.value))
  }

  // Field operations
  const addField = () => {
    const f = { ...EMPTY_FIELD, id: newFieldId() }
    setForm(p => ({ ...p, fields: [...p.fields, f] }))
    setActiveFieldIdx(form.fields.length)
  }
  const updateField = (idx, key, val) => {
    setForm(p => {
      const fields = [...p.fields]
      fields[idx] = { ...fields[idx], [key]: val }
      return { ...p, fields }
    })
  }
  const removeField = (idx) => {
    setForm(p => ({ ...p, fields: p.fields.filter((_, i) => i !== idx) }))
    setActiveFieldIdx(null)
  }
  const moveField = (idx, dir) => {
    setForm(p => {
      const fields = [...p.fields]
      const target = idx + dir
      if (target < 0 || target >= fields.length) return p
      ;[fields[idx], fields[target]] = [fields[target], fields[idx]]
      return { ...p, fields }
    })
    setActiveFieldIdx(idx + dir)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) return
    setSaving(true)
    try { await onSave(form) } catch (e) { alert(e.message) } finally { setSaving(false) }
  }

  const inputCls = `w-full py-2.5 px-3 border text-sm bg-transparent outline-none transition-colors
    ${isDark ? 'border-gray-700 text-white placeholder-gray-600 focus:border-raw-accent'
             : 'border-gray-300 text-raw-ink placeholder-gray-400 focus:border-raw-ink'}`
  const labelCls = `font-oswald text-xs tracking-widest uppercase block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`
  const bg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'

  const needsOptions = (type) => ['select', 'radio', 'checkbox'].includes(type)

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className={`${isDark ? 'bg-[#111] text-white' : 'bg-white text-raw-ink'} w-full max-w-2xl max-h-[92vh] overflow-y-auto border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>

        {/* Header */}
        <div className={`sticky top-0 z-10 px-7 pt-6 pb-4 border-b flex justify-between items-center ${isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'}`}>
          <h2 className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
            {initial ? 'Edit Form' : 'New Form'}
          </h2>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="px-7 py-6 space-y-6">
          {/* Meta */}
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Form Title *</label>
              <input value={form.title} onChange={handleTitleChange} placeholder="e.g. Volunteer Registration" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Slug (URL key) *</label>
              <input value={form.slug} onChange={e => setMeta('slug', slugify(e.target.value))} placeholder="volunteer-registration" className={inputCls} />
              <p className={`font-sans text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Auto-generated from title. Must be unique.</p>
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={e => setMeta('description', e.target.value)} rows={2}
                placeholder="Short description shown above the form..." className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_open} onChange={e => setMeta('is_open', e.target.checked)} className="w-4 h-4 accent-raw-accent" />
                <div>
                  <p className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-white' : 'text-raw-ink'}`}>Form is Open</p>
                  <p className={`font-sans text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Accepting responses</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.show_on_homepage} onChange={e => setMeta('show_on_homepage', e.target.checked)} className="w-4 h-4 accent-raw-accent" />
                <div>
                  <p className={`font-oswald text-xs tracking-widest uppercase ${isDark ? 'text-white' : 'text-raw-ink'}`}>Show on Homepage</p>
                  <p className={`font-sans text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Appears in forms banner</p>
                </div>
              </label>
            </div>
          </div>

          {/* Fields */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className={`font-condensed text-base tracking-widest uppercase ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                Form Fields ({form.fields.length})
              </p>
              <button onClick={addField} className={`flex items-center gap-2 font-oswald text-xs tracking-widest uppercase px-3 py-2 border transition-all
                ${isDark ? 'border-gray-700 text-gray-300 hover:border-raw-accent hover:text-white' : 'border-gray-300 text-gray-600 hover:border-raw-ink'}`}>
                <Plus size={13} /> Add Field
              </button>
            </div>

            {form.fields.length === 0 ? (
              <div className={`py-8 text-center border border-dashed ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <p className={`font-serif text-sm italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No fields yet. Click "Add Field" to start.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {form.fields.map((field, idx) => (
                  <motion.div key={field.id} layout className={`border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                    {/* Field header */}
                    <div
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${isDark ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'}`}
                      onClick={() => setActiveFieldIdx(activeFieldIdx === idx ? null : idx)}
                    >
                      <GripVertical size={14} className="text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className={`font-oswald text-xs tracking-widest uppercase truncate ${isDark ? 'text-gray-200' : 'text-raw-ink'}`}>
                          {field.label || '(untitled field)'}
                        </p>
                        <p className={`font-sans text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {FIELD_TYPES.find(t => t.value === field.type)?.label}
                          {field.required && ' · Required'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={e => { e.stopPropagation(); moveField(idx, -1) }} disabled={idx === 0} className="p-1 text-gray-400 hover:text-white disabled:opacity-20"><ChevronUp size={12} /></button>
                        <button onClick={e => { e.stopPropagation(); moveField(idx, 1) }} disabled={idx === form.fields.length - 1} className="p-1 text-gray-400 hover:text-white disabled:opacity-20"><ChevronDown size={12} /></button>
                        <button onClick={e => { e.stopPropagation(); removeField(idx) }} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
                      </div>
                    </div>

                    {/* Field editor */}
                    <AnimatePresence>
                      {activeFieldIdx === idx && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          className={`overflow-hidden border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                          <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelCls}>Label *</label>
                              <input value={field.label} onChange={e => updateField(idx, 'label', e.target.value)} placeholder="e.g. Full Name" className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Field Type</label>
                              <select value={field.type} onChange={e => updateField(idx, 'type', e.target.value)} className={inputCls}>
                                {FIELD_TYPES.map(t => <option key={t.value} value={t.value} className="text-raw-ink">{t.label}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className={labelCls}>Placeholder</label>
                              <input value={field.placeholder} onChange={e => updateField(idx, 'placeholder', e.target.value)} placeholder="e.g. Enter your full name" className={inputCls} />
                            </div>
                            <div className="flex items-center gap-3 pt-4">
                              <input type="checkbox" id={`req-${field.id}`} checked={field.required} onChange={e => updateField(idx, 'required', e.target.checked)} className="w-4 h-4 accent-raw-accent" />
                              <label htmlFor={`req-${field.id}`} className={`${labelCls} cursor-pointer mb-0`}>Required field</label>
                            </div>
                            {needsOptions(field.type) && (
                              <div className="sm:col-span-2">
                                <label className={labelCls}>Options (comma-separated) *</label>
                                <input value={field.options} onChange={e => updateField(idx, 'options', e.target.value)}
                                  placeholder="Option 1, Option 2, Option 3" className={inputCls} />
                                <p className={`font-sans text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                  Separate each option with a comma
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`px-7 pb-7 flex gap-3 border-t pt-5 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
          <button onClick={onClose} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.title.trim()} className="btn-primary flex-1 justify-center">
            {saving ? 'Saving...' : <><Check size={14} /> {initial ? 'Save Changes' : 'Create Form'}</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function FormsAdmin() {
  const { isDark } = useTheme()
  const [forms, setForms]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [builderForm, setBuilderForm] = useState(null) // null = closed, {} = new, {...} = edit
  const [viewResponses, setViewResponses] = useState(null)
  const [deleteId, setDeleteId]   = useState(null)
  const [responseCounts, setResponseCounts] = useState({})

  const load = () => {
  setLoading(true)

  formService.getForms()
    .then(data => {
      setForms(data)
      loadResponseCounts(data)
    })
    .catch(() => {})
    .finally(() => setLoading(false))
}
  async function loadResponseCounts(formsData) {
  const counts = {}

  for (const form of formsData) {
    const responses =
      await formService.getFormResponses(form.id)

    counts[form.id] = responses.length
  }

  setResponseCounts(counts)
}
  useEffect(() => { load() }, [])

  const handleSave = async (formData) => {
    if (formData.id) await formService.updateForm(formData.id, formData)
    else             await formService.createForm(formData)
    load()
    setBuilderForm(null)
  }

  const handleToggleOpen = async (form) => {
    await formService.updateForm(form.id, { is_open: !form.is_open })
    load()
  }

  const handleToggleHomepage = async (form) => {
    await formService.updateForm(form.id, { show_on_homepage: !form.show_on_homepage })
    load()
  }

  const handleDelete = async (id) => {
    await formService.deleteForm(id)
    load()
    setDeleteId(null)
  }

  const cardBg  = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'
  const modalBg = isDark ? 'bg-[#111] text-white'      : 'bg-white text-raw-ink'

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="section-eyebrow mb-1">Form Builder</p>
            <h1 className={`font-display text-3xl font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>Forms</h1>
            <p className={`font-serif text-sm italic mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Build forms, open/close them, show them on homepage
            </p>
          </div>
          <button onClick={() => setBuilderForm({})} className="btn-primary">
            <Plus size={14} /> New Form
          </button>
        </div>

        {/* Built-in forms status */}
        <BuiltInFormsStatus isDark={isDark} />

        {/* Custom forms */}
        <div>
          <p className={`font-oswald text-xs tracking-widest uppercase mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Custom Forms
          </p>

          {loading ? (
            <div className={`py-12 text-center border ${cardBg}`}>
              <div className={`font-condensed text-xl animate-pulse ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Loading...</div>
            </div>
          ) : forms.length === 0 ? (
            <div className={`py-12 text-center border border-dashed ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <p className={`font-display text-lg italic mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No custom forms yet.</p>
              <button onClick={() => setBuilderForm({})} className="btn-primary">
                  <Plus size={14} /> Create Your First Form
                </button>
              </div>
            ) : (
              <div className={`border ${cardBg}`}>
                {/* Column headers */}
                <div className={`grid grid-cols-12 gap-3 px-5 py-3 border-b font-oswald text-[10px] tracking-widest uppercase
                ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                  <span className="col-span-4">Form</span>
                  <span className="col-span-2 hidden sm:block">Fields</span>
                  <span className="col-span-2 hidden md:block">Status</span>
                  <span className="col-span-2 hidden md:block">Homepage</span>
                  <span className="col-span-2 text-right">Actions</span>
                </div>

                {forms.map((form, i) => (
                  <motion.div key={form.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className={`grid grid-cols-12 gap-3 items-center px-5 py-4 border-b last:border-0
                    ${isDark ? 'border-gray-800/50 hover:bg-gray-900/40' : 'border-gray-100 hover:bg-gray-50'}`}>

                    <div className="col-span-4">
                      <p className={`font-display text-sm font-bold ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                        {form.title}
                      </p>

                      <p className={`font-oswald text-[10px] tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                        /{form.slug}
                      </p>

                      <p className="font-oswald text-[10px] tracking-widest uppercase text-emerald-500 mt-1">
                        {responseCounts[form.id] || 0} Responses
                      </p>
                    </div>

                    <span className={`col-span-2 hidden sm:block font-condensed text-lg ${isDark ? 'text-white' : 'text-raw-ink'}`}>
                    {(form.fields || []).length}
                  </span>

                  {/* Open/Close toggle */}
                  <div className="col-span-2 hidden md:flex items-center gap-2">
                    <button onClick={() => handleToggleOpen(form)} className="flex items-center gap-1.5 group">
                      {form.is_open
                        ? <ToggleRight size={20} className="text-green-500" />
                        : <ToggleLeft  size={20} className={isDark ? 'text-gray-600' : 'text-gray-300'} />}
                      <span className={`font-oswald text-[10px] tracking-widest uppercase ${form.is_open ? 'text-green-500' : isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                        {form.is_open ? 'Open' : 'Closed'}
                      </span>
                    </button>
                  </div>

                  {/* Homepage toggle */}
                  <div className="col-span-2 hidden md:flex items-center gap-2">
                    <button onClick={() => handleToggleHomepage(form)} className="flex items-center gap-1.5">
                      {form.show_on_homepage
                        ? <ToggleRight size={20} className="text-raw-accent" />
                        : <ToggleLeft  size={20} className={isDark ? 'text-gray-600' : 'text-gray-300'} />}
                      <span className={`font-oswald text-[10px] tracking-widest uppercase ${form.show_on_homepage ? 'text-raw-accent' : isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                        {form.show_on_homepage ? 'Shown' : 'Hidden'}
                      </span>
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-1.5">
                    <button onClick={() => setViewResponses(form)}
                      className={`p-1.5 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}
                      title="View Responses">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => setBuilderForm(form)}
                      className={`p-1.5 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-raw-ink'}`}
                      title="Edit Form">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => setDeleteId(form.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Form">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Builder Modal */}
      <AnimatePresence>
        {builderForm !== null && (
          <FormBuilderModal
            initial={builderForm.id ? builderForm : null}
            onClose={() => setBuilderForm(null)}
            onSave={handleSave}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* Responses Modal */}
      <AnimatePresence>
        {viewResponses && (
          <ResponsesModal form={viewResponses} onClose={() => setViewResponses(null)} isDark={isDark} />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className={`${modalBg} p-8 max-w-sm w-full border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className={`font-display text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-raw-ink'}`}>Delete Form?</h3>
              <p className={`font-serif text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>All responses will also be deleted. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
                <button onClick={() => handleDelete(deleteId)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-oswald text-xs tracking-widest uppercase hover:bg-red-700">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

// ── Built-in forms status (Join RAW + Coverage Request) ───────
function BuiltInFormsStatus({ isDark }) {
  const [settings, setSettings] = useState(null)
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    formService.getSettings().then(setSettings).catch(() => {})
  }, [])

  const toggle = async (key) => {
    if (!settings) return
    setSaving(key)
    const updated = { ...settings, [key]: !settings[key] }
    try {
      await formService.updateSettings({ [key]: !settings[key] })
      setSettings(updated)
    } catch (e) { alert(e.message) }
    finally { setSaving(null) }
  }

  const cardBg = isDark ? 'bg-[#111] border-gray-800' : 'bg-white border-gray-200'

  return (
    <div>
      <p className={`font-oswald text-xs tracking-widest uppercase mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        Built-In Forms
      </p>
      <div className={`border ${cardBg}`}>
        {[
          { key: 'join_raw_open', label: 'Join RAW Application', desc: 'Opens the Join RAW modal from the homepage and hero section' },
          { key: 'coverage_open', label: 'Coverage Request Form', desc: 'Opens the Request Coverage modal from the homepage' },
        ].map(({ key, label, desc }, i) => {
          const isOpen = settings?.[key] !== false
          return (
            <div key={key} className={`flex items-center justify-between px-5 py-4 ${i === 0 ? `border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}` : ''}`}>
              <div>
                <p className={`font-oswald text-sm tracking-widest uppercase ${isDark ? 'text-white' : 'text-raw-ink'}`}>{label}</p>
                <p className={`font-sans text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{desc}</p>
              </div>
              <button
                onClick={() => toggle(key)}
                disabled={saving === key || !settings}
                className="flex items-center gap-2 ml-4 flex-shrink-0"
              >
                {isOpen
                  ? <ToggleRight size={28} className="text-green-500" />
                  : <ToggleLeft  size={28} className={isDark ? 'text-gray-600' : 'text-gray-300'} />}
                <span className={`font-oswald text-xs tracking-widest uppercase w-12 text-left ${isOpen ? 'text-green-500' : isDark ? 'text-gray-600' : 'text-gray-300'}`}>
                  {saving === key ? '...' : isOpen ? 'Open' : 'Closed'}
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}