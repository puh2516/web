'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, PlusCircle, Loader2 } from 'lucide-react'
import { createPoll } from '@/app/actions'

export default function CreatePoll() {
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!question || !options) return
        setIsSubmitting(true)

        const optionsArray = options.split(',').map(o => o.trim()).filter(o => o !== '')
        const res = await createPoll(question, optionsArray)
        if (res?.error) {
            alert(res.error)
        } else {
            setQuestion('')
            setOptions('')
            setIsExpanded(false)
        }
        setIsSubmitting(false)
    }

    return (
        <div style={{ marginBottom: '24px' }}>
            {!isExpanded ? (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsExpanded(true)}
                    style={{
                        width: '100%', padding: '12px', borderRadius: '12px',
                        background: 'rgba(57, 192, 237, 0.1)', border: '1px dashed var(--neon-blue)',
                        color: 'var(--neon-blue)', fontWeight: 700, fontSize: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    <PlusCircle size={18} />
                    New Flash Poll
                </motion.button>
            ) : (
                <motion.form
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="glass-card"
                    style={{ padding: '20px', border: '1px solid var(--neon-blue)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Zap size={16} color="var(--neon-blue)" />
                        <span style={{ fontWeight: 800, fontSize: '14px', textTransform: 'uppercase' }}>Config New Poll</span>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Question</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g. Will Claude-4 release this month?"
                            className="input-field"
                            style={{ padding: '10px 14px', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '11px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Options (comma separated)</label>
                        <input
                            type="text"
                            value={options}
                            onChange={(e) => setOptions(e.target.value)}
                            placeholder="Yes, No, Maybe"
                            className="input-field"
                            style={{ padding: '10px 14px', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary"
                            style={{
                                flex: 1, padding: '10px', fontSize: '14px',
                                background: 'linear-gradient(135deg, var(--neon-blue), var(--purple))',
                                boxShadow: '0 0 15px rgba(57, 192, 237, 0.3)'
                            }}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Activate Poll'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            style={{
                                padding: '10px 16px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.05)', fontSize: '14px'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </motion.form>
            )}
        </div>
    )
}
