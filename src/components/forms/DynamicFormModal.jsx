import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Swal from 'sweetalert2'
import { formService } from '../../services/formService'

export default function DynamicFormModal({
  isOpen,
  onClose,
  form
}) {
  const [responses, setResponses] = useState({})

  if (!isOpen || !form) return null

  const handleChange = (fieldName, value) => {
    setResponses(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {

    await formService.submitFormResponse(
      form.id,
      form.slug,
      responses
    )

    Swal.fire({
      icon: 'success',
      title: 'Form Submitted',
      text: 'Your response has been recorded.',
      confirmButtonColor: '#111827'
    })

    onClose()

  } catch (error) {

    console.error(error)

    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: error.message || 'Please try again.'
    })
  }
}

  const renderField = (field) => {
    switch (field.type) {

      case 'textarea':
        return (
          <textarea
            required={field.required}
            rows={4}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none"
            onChange={(e) =>
              handleChange(field.label, e.target.value)
            }
          />
        )

      case 'select':
        return (
          <select
            required={field.required}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none"
            onChange={(e) =>
              handleChange(field.label, e.target.value)
            }
          >
            <option value="">
              Select
            </option>

            {(field.options || []).map(option => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        )

      case 'date':
        return (
          <input
            type="date"
            required={field.required}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none"
            onChange={(e) =>
              handleChange(field.label, e.target.value)
            }
          />
        )

      default:
        return (
          <input
            type={field.type || 'text'}
            required={field.required}
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none"
            onChange={(e) =>
              handleChange(field.label, e.target.value)
            }
          />
        )
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-start">
            <div>

              <h2 className="text-3xl font-bold mt-2">
                {form.title}
              </h2>

              {form.description && (
                <p className="text-gray-600 mt-3">
                  {form.description}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={22} />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-8 space-y-6"
          >
            {(form.fields || []).map((field, index) => (
              <div key={index}>
                <label className="block mb-2 font-medium">
                  {field.label}

                  {field.required && (
                    <span className="text-red-500 ml-1">
                      *
                    </span>
                  )}
                </label>

                {renderField(field)}
              </div>
            ))}

            <button
              type="submit"
              className="
                w-full
                bg-black
                text-white
                py-4
                rounded-md
                font-semibold
                hover:opacity-90
                transition
              "
            >
              Submit Form
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}