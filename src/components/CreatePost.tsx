'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPost } from '@/app/actions'
import { Send, Loader2, Sparkles } from 'lucide-react'

export default function CreatePost({ isAdmin }: { isAdmin?: boolean }) {
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [postType, setPostType] = useState<'hot_take' | 'question'>('hot_take')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        setIsSubmitting(true)
        const formData = new FormData()
        formData.append('content', content)
        formData.append('type', postType)

        await createPost(formData)

        setContent('')
        setPostType('hot_take')
        setIsSubmitting(false)
        setIsFocused(false)
    }

    return (
        <div>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '12px'
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    fontSize: '13px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: postType === 'question' ? 'var(--neon-blue)' : 'var(--neon-green)'
                }}>
                    <Sparkles style={{ width: 16, height: 16 }} />
                    <span>{postType === 'question' ? 'Ask a Question' : 'Drop a Hot Take'}</span>
                </div>

                {isAdmin && (
                    <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
                        <button
                            type="button"
                            onClick={() => setPostType('hot_take')}
                            style={{
                                padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                                background: postType === 'hot_take' ? 'var(--neon-green)' : 'transparent',
                                color: postType === 'hot_take' ? '#000' : 'rgba(255,255,255,0.4)',
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            Hot Take
                        </button>
                        <button
                            type="button"
                            onClick={() => setPostType('question')}
                            style={{
                                padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                                background: postType === 'question' ? 'var(--neon-blue)' : 'transparent',
                                color: postType === 'question' ? '#000' : 'rgba(255,255,255,0.4)',
                                border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            Question
                        </button>
                    </div>
                )}
            </div>

            <motion.form
                layout
                onSubmit={handleSubmit}
                className="glass-card"
                style={{
                    padding: '24px',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    borderColor: isFocused ? (postType === 'question' ? 'var(--neon-blue)' : 'var(--purple)') : undefined,
                    boxShadow: isFocused ? `0 0 30px ${postType === 'question' ? 'rgba(57, 192, 237, 0.15)' : 'rgba(168,85,247,0.15)'}, 0 0 60px rgba(57,255,20,0.05)` : '0 4px 20px rgba(0,0,0,0.3)'
                }}
            >
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => !content && setIsFocused(false)}
                    placeholder={postType === 'question' ? "Ask the community something..." : "What's your controversial opinion on AI?"}
                    style={{
                        width: '100%', background: 'transparent', color: 'var(--foreground)',
                        resize: 'none', outline: 'none', border: 'none',
                        fontSize: '18px', fontWeight: 400, fontFamily: 'inherit',
                        minHeight: '100px', lineHeight: 1.6,
                    }}
                    maxLength={280}
                />

                <AnimatePresence>
                    {(isFocused || content) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                marginTop: '16px', paddingTop: '16px',
                                borderTop: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <span style={{
                                fontSize: '12px', fontFamily: 'monospace',
                                padding: '4px 10px', borderRadius: '6px',
                                background: content.length > 250 ? 'rgba(255,51,102,0.15)' : 'rgba(255,255,255,0.05)',
                                color: content.length > 250 ? 'var(--error)' : 'rgba(240,240,245,0.4)'
                            }}>
                                {content.length}/280
                            </span>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={!content.trim() || isSubmitting}
                                className="btn-primary"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px',
                                    background: postType === 'question' ? 'linear-gradient(135deg, var(--neon-blue), var(--purple))' : undefined
                                }}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="animate-spin" style={{ width: 18, height: 18 }} />
                                ) : (
                                    <>Post <Send style={{ width: 16, height: 16 }} /></>
                                )}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.form>
        </div>
    )
}
