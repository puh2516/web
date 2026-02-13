'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EditProfileModal from './EditProfileModal' // Import the modal we just created
import { Edit2 } from 'lucide-react'

interface UserProfileProps {
    userId: string
    username: string
    avatarUrl: string
}

export default function UserProfile({ userId, username, avatarUrl }: UserProfileProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', position: 'relative'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--foreground)' }}>@{username}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Edit Profile <Edit2 size={10} />
                    </span>
                </div>

                <div style={{ position: 'relative' }}>
                    <img
                        src={avatarUrl}
                        alt={username}
                        style={{
                            width: 40, height: 40, borderRadius: '50%',
                            border: '2px solid var(--purple)', padding: 2,
                            background: 'rgba(0,0,0,0.2)'
                        }}
                    />
                    <div style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: 'var(--neon-green)', border: '2px solid #000'
                    }} />
                </div>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <EditProfileModal
                        currentUsername={username}
                        currentAvatarUrl={avatarUrl}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}
