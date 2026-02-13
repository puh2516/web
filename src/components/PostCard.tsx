'use client'

import { motion } from 'framer-motion'
import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from 'lucide-react'
import { castVote } from '@/app/actions'
import { useOptimistic, startTransition } from 'react'

function timeAgo(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
}

type Post = {
    id: string
    content: string
    score: number
    created_at: string
    techtakes_user: {
        username: string
        avatar_url: string
    }
    user_vote?: 'up' | 'down' | null
}

export default function PostCard({ post, currentUserId }: { post: Post, currentUserId: string }) {
    const [optimisticPost, addOptimisticVote] = useOptimistic(
        post,
        (state, voteType: 'up' | 'down') => {
            const currentVote = state.user_vote
            let newScore = state.score
            let newVote = voteType

            if (currentVote === voteType) {
                newVote = null as any
                newScore -= (voteType === 'up' ? 1 : -1)
            } else if (currentVote) {
                newScore += (voteType === 'up' ? 2 : -2)
            } else {
                newScore += (voteType === 'up' ? 1 : -1)
            }

            return { ...state, score: newScore, user_vote: newVote }
        }
    )

    const handleVote = async (type: 'up' | 'down') => {
        startTransition(() => { addOptimisticVote(type) })
        await castVote(post.id, type)
    }

    const isUpvoted = optimisticPost.user_vote === 'up'
    const isDownvoted = optimisticPost.user_vote === 'down'

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="glass-card"
            style={{
                padding: '24px', marginBottom: '20px',
                transition: 'box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(168,85,247,0.15), 0 0 60px rgba(57,255,20,0.05)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            <div style={{ display: 'flex', gap: '16px' }}>
                {/* Avatar */}
                <img
                    src={optimisticPost.techtakes_user?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${optimisticPost.techtakes_user?.username}`}
                    alt={optimisticPost.techtakes_user?.username}
                    style={{
                        width: 48, height: 48, borderRadius: '50%',
                        border: '2px solid var(--purple)', padding: 2,
                        flexShrink: 0
                    }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--purple)' }}>
                            @{optimisticPost.techtakes_user?.username}
                        </span>
                        <span style={{ fontSize: '12px', color: 'rgba(240,240,245,0.35)', fontFamily: 'monospace' }}>
                            {timeAgo(optimisticPost.created_at)}
                        </span>
                    </div>

                    {/* Content */}
                    <p style={{
                        fontSize: '18px', lineHeight: 1.6, fontWeight: 400,
                        color: 'rgba(240,240,245,0.9)', marginBottom: '20px',
                        wordBreak: 'break-word'
                    }}>
                        {optimisticPost.content}
                    </p>

                    {/* Actions row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Vote pill */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            background: 'rgba(0,0,0,0.4)', borderRadius: '999px',
                            padding: '4px', border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={() => handleVote('up')}
                                style={{
                                    padding: '8px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    background: isUpvoted ? 'linear-gradient(135deg, var(--neon-green), var(--purple))' : 'transparent',
                                    color: isUpvoted ? '#000' : 'rgba(240,240,245,0.4)',
                                    boxShadow: isUpvoted ? '0 0 15px var(--neon-glow)' : 'none'
                                }}
                            >
                                <ThumbsUp style={{ width: 18, height: 18 }} />
                            </motion.button>

                            <span style={{
                                fontWeight: 700, minWidth: '32px', textAlign: 'center', fontSize: '15px',
                                color: optimisticPost.score > 0 ? 'var(--neon-green)' : optimisticPost.score < 0 ? 'var(--error)' : 'rgba(240,240,245,0.4)'
                            }}>
                                {optimisticPost.score}
                            </span>

                            <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={() => handleVote('down')}
                                style={{
                                    padding: '8px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    background: isDownvoted ? 'var(--error)' : 'transparent',
                                    color: isDownvoted ? '#fff' : 'rgba(240,240,245,0.4)',
                                }}
                            >
                                <ThumbsDown style={{ width: 18, height: 18 }} />
                            </motion.button>
                        </div>

                        {/* Secondary actions */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button style={{ padding: '8px', color: 'rgba(240,240,245,0.3)', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--purple)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(240,240,245,0.3)'}
                            >
                                <MessageSquare style={{ width: 18, height: 18 }} />
                            </button>
                            <button style={{ padding: '8px', color: 'rgba(240,240,245,0.3)', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--neon-green)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(240,240,245,0.3)'}
                            >
                                <Share2 style={{ width: 18, height: 18 }} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
