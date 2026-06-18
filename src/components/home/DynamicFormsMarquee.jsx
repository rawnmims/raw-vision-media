import { useEffect, useState } from 'react'
import { formService } from '../../services/formService'
import DynamicFormModal from '../forms/DynamicFormModal'

export default function DynamicFormsMarquee() {
    const [forms, setForms] = useState([])
    const [selectedForm, setSelectedForm] = useState(null)

    useEffect(() => {
        async function loadForms() {
            try {
                const data = await formService.getForms({
                    homepageOnly: true,
                    marqueeOnly: true
                })

                console.log('Homepage Forms:', data)

                setForms(data || [])
            } catch (err) {
                console.error(err)
            }
        }

        loadForms()
    }, [])

    if (!forms.length) return null

    const repeatedForms = [...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms, ...forms,]

    return (
        <>
            <section className="bg-[#6b1111] border-y border-[#7f2323] overflow-hidden">
                <div className="marquee-track py-4 whitespace-nowrap">
                    {repeatedForms.map((form, index) => (
                        <span
                            key={`${form.id}-${index}`}
                            className="inline-flex items-center"
                        >
                            <button
                                onClick={() => setSelectedForm(form)}
                                className="font-serif italic text-[#f5e9e1] hover:text-white transition-colors"
                            >
                                <span className="font-bold uppercase">
                                    OPEN NOW:
                                </span>{" "}
                                {form.title} — {form.description}
                            </button>

                            <span className="mx-20 text-[#c58f8f]">•</span>
                        </span>
                    ))}
                </div>
            </section>

            {selectedForm && (
                <DynamicFormModal
                    form={selectedForm}
                    isOpen={!!selectedForm}
                    onClose={() => setSelectedForm(null)}
                />
            )}
        </>
    )
}