'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Image as ImageIcon, Lock, Check, Loader2 } from 'lucide-react'
import { updateProfile } from '@/app/actions'

interface EditProfileModalProps {
    currentUsername: string
    currentAvatarUrl: string
    onClose: () => void
}

export default function EditProfileModal({
    currentUsername,
    currentAvatarUrl,
    onClose
}: EditProfileModalProps) {
    const [username, setUsername] = useState(currentUsername)
    const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl)
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!username.trim() || !avatarUrl.trim()) {
            setError('Username and Avatar URL are required')
            return
        }

        setIsSubmitting(true)
        setError(null)

        const formData = new FormData()
        formData.append('username', username)
        formData.append('avatarUrl', avatarUrl)
        if (password) {
            formData.append('password', password)
        }

        const result = await updateProfile(formData)

        if (result.error) {
            setError(result.error)
            setIsSubmitting(false)
        } else {
            onClose()
            // Optional: force reload logic if revalidatePath isn't enough for client-side state
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)'
        }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card"
                style={{
                    width: '100%', maxWidth: '420px', padding: '32px',
                    margin: '20px', position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>
                        Edit Profile
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent', border: 'none', color: 'var(--foreground)',
                            cursor: 'pointer', padding: '4px'
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <div style={{
                        padding: '12px', borderRadius: '8px', marginBottom: '20px',
                        background: 'rgba(255,51,102,0.1)', border: '1px solid var(--error)',
                        color: 'var(--error)', fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Username */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neon-green)' }} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', outline: 'none', fontSize: '15px'
                                }}
                                placeholder="Enter username"
                            />
                        </div>
                    </div>

                    {/* Avatar URL */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                            Avatar Image URL
                        </label>
                        <div style={{ position: 'relative' }}>
                            <ImageIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--purple)' }} />
                            <input
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', outline: 'none', fontSize: '15px'
                                }}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                            New Password <span style={{ opacity: 0.5, fontSize: '12px' }}>(Optional)</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--blue)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white', outline: 'none', fontSize: '15px'
                                }}
                                placeholder="Leave empty to keep current"
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px', borderRadius: '8px',
                                background: 'rgba(255,255,255,0.05)', border: 'none',
                                color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                                fontSize: '14px', fontWeight: 500
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary"
                            style={{
                                padding: '10px 24px', borderRadius: '8px',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                fontSize: '14px', fontWeight: 600
                            }}
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <>Save Changes <Check size={18} /></>}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
