'use client'

import { useState, useEffect, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, CheckCircle2, BarChart3, Loader2 } from 'lucide-react'
import { castPollVote } from '@/app/actions'

type Poll = {
    id: string
    question: string
    options: string[]
    votes?: { option_index: number; count: number }[]
    user_voted_index?: number | null
}

export default function FlashPoll({
    poll: initialPoll,
    userId
}: {
    poll: Poll | null,
    userId?: string
}) {
    const [poll, setPoll] = useState<Poll | null>(initialPoll)
    const [isVoting, setIsVoting] = useState(false)
    const [isPending, startTransition] = useTransition()

    if (!poll) return null

    const totalVotes = poll.votes?.reduce((acc, v) => acc + v.count, 0) || 0
    const hasVoted = poll.user_voted_index !== null && poll.user_voted_index !== undefined

    const handleVote = async (index: number) => {
        if (hasVoted || isVoting) return
        setIsVoting(true)
        const res = await castPollVote(poll.id, index)
        if (res?.error) {
            alert(res.error)
        } else {
            // Optimistic update or just wait for revalidate
            // For now, let's just show local feedback
        }
        setIsVoting(false)
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card"
            style={{
                padding: '24px',
                border: '1px solid var(--neon-blue)',
                boxShadow: '0 0 30px rgba(57, 192, 237, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Animated Zap Background */}
            <motion.div
                animate={{
                    opacity: [0.05, 0.15, 0.05],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{
                    position: 'absolute', top: '-20%', right: '-10%',
                    color: 'var(--neon-blue)', pointerEvents: 'none'
                }}
            >
                <Zap size={120} />
            </motion.div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{
                        padding: '6px', borderRadius: '8px', background: 'rgba(57, 192, 237, 0.1)',
                        border: '1px solid rgba(57, 192, 237, 0.3)'
                    }}>
                        <Zap size={18} color="var(--neon-blue)" />
                    </div>
                    <span style={{
                        fontSize: '12px', fontWeight: 900, textTransform: 'uppercase',
                        letterSpacing: '0.1em', color: 'var(--neon-blue)'
                    }}>
                        Flash Poll
                    </span>
                </div>

                <h3 style={{
                    fontSize: '18px', fontWeight: 800, marginBottom: '20px',
                    fontFamily: "'Orbitron', sans-serif", lineHeight: 1.4
                }}>
                    {poll.question}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {poll.options.map((option, idx) => {
                        const voteData = poll.votes?.find(v => v.option_index === idx)
                        const count = voteData?.count || 0
                        const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0
                        const isUserChoice = poll.user_voted_index === idx

                        return (
                            <motion.button
                                key={idx}
                                whileHover={!hasVoted ? { x: 5, background: 'rgba(255,255,255,0.05)' } : {}}
                                onClick={() => handleVote(idx)}
                                disabled={hasVoted || isVoting}
                                style={{
                                    width: '100%', padding: '14px 16px', borderRadius: '12px',
                                    background: isUserChoice ? 'rgba(57, 192, 237, 0.1)' : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${isUserChoice ? 'var(--neon-blue)' : 'rgba(255,255,255,0.08)'}`,
                                    color: 'inherit', textAlign: 'left', position: 'relative',
                                    overflow: 'hidden', cursor: hasVoted ? 'default' : 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {hasVoted && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        style={{
                                            position: 'absolute', left: 0, top: 0, bottom: 0,
                                            background: isUserChoice ? 'rgba(57, 192, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                                            zIndex: 0
                                        }}
                                    />
                                )}

                                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, fontSize: '15px' }}>{option}</span>
                                    {hasVoted && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {isUserChoice && <CheckCircle2 size={14} color="var(--neon-blue)" />}
                                            <span style={{ fontSize: '12px', opacity: 0.6, fontWeight: 700 }}>
                                                {percentage}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.button>
                        )
                    })}
                </div>

                {hasVoted && (
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'rgba(240,240,245,0.4)', fontWeight: 600 }}>
                            <BarChart3 size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            {totalVotes} total votes
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
