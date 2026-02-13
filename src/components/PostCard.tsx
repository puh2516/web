'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Send, Loader2, Trash2 } from 'lucide-react'
import { castVote, createComment, getComments, deletePost, deleteComment } from '@/app/actions'
import { useOptimistic, startTransition, useState, useEffect } from 'react'

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

type Comment = {
    id: string
    user_id: string
    content: string
    created_at: string
    techtakes_user: {
        username: string
        avatar_url: string
    }
}

type Post = {
    id: string
    user_id: string
    content: string
    score: number
    created_at: string
    comment_count?: number
    type?: 'hot_take' | 'question'
    techtakes_user: {
        username: string
        avatar_url: string
    }
    user_vote?: 'up' | 'down' | null
}

export default function PostCard({
    post,
    initialExpanded = false,
    isFirst = false,
    currentUser
}: {
    post: Post,
    initialExpanded?: boolean,
    isFirst?: boolean,
    currentUser?: { id: string, is_admin: boolean } | null
}) {
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

    // ── Comments state ──
    const [showComments, setShowComments] = useState(initialExpanded)
    const [comments, setComments] = useState<Comment[]>([])
    const [loadingComments, setLoadingComments] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [submittingComment, setSubmittingComment] = useState(false)
    const [localCommentCount, setLocalCommentCount] = useState(post.comment_count || 0)

    useEffect(() => {
        if (initialExpanded) {
            const fetchComments = async () => {
                setLoadingComments(true)
                const data = await getComments(post.id)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const processed = data.map((c: any) => ({
                    ...c,
                    techtakes_user: Array.isArray(c.techtakes_user) ? c.techtakes_user[0] : c.techtakes_user
                }))
                setComments(processed)
                setLoadingComments(false)
            }
            fetchComments()
        }
    }, [initialExpanded, post.id])

    const toggleComments = async () => {
        if (!showComments) {
            setShowComments(true)
            setLoadingComments(true)
            const data = await getComments(post.id)
            const processed = data.map((c: any) => ({
                ...c,
                techtakes_user: Array.isArray(c.techtakes_user) ? c.techtakes_user[0] : c.techtakes_user
            }))
            setComments(processed)
            setLoadingComments(false)
        } else {
            setShowComments(false)
        }
    }

    const handleSubmitComment = async () => {
        if (!commentText.trim()) return
        setSubmittingComment(true)
        const result = await createComment(post.id, commentText.trim())
        if (result && 'success' in result) {
            // Refresh comments
            const data = await getComments(post.id)
            const processed = data.map((c: any) => ({
                ...c,
                techtakes_user: Array.isArray(c.techtakes_user) ? c.techtakes_user[0] : c.techtakes_user
            }))
            setComments(processed)
            setLocalCommentCount(prev => prev + 1)
            setCommentText('')
        }
        setSubmittingComment(false)
    }

    const handleDeletePost = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return
        const res = await deletePost(post.id)
        if (res?.error) alert(res.error)
    }

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm('Are you sure you want to delete this comment?')) return
        const res = await deleteComment(commentId)
        if (res?.error) {
            alert(res.error)
        } else {
            setComments(prev => prev.filter(c => c.id !== commentId))
            setLocalCommentCount(prev => prev - 1)
        }
    }

    const isUpvoted = optimisticPost.user_vote === 'up'
    const isDownvoted = optimisticPost.user_vote === 'down'

    // Highlight styles for the first post
    const firstPostStyles = isFirst && !initialExpanded ? {
        border: `1.5px solid ${post.type === 'question' ? 'var(--neon-blue)' : 'var(--neon-green)'}`,
        boxShadow: `0 0 40px ${post.type === 'question' ? 'rgba(57, 192, 237, 0.15)' : 'rgba(57, 255, 20, 0.1)'}`,
        background: 'rgba(18, 18, 28, 0.85)',
    } : {}

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="glass-card"
            style={{
                padding: '24px', marginBottom: '20px',
                transition: 'box-shadow 0.3s ease, transform 0.2s',
                ...firstPostStyles
            }}
            onMouseEnter={(e) => {
                if (!isFirst) {
                    e.currentTarget.style.boxShadow = '0 8px 40px rgba(168,85,247,0.15), 0 0 60px rgba(57,255,20,0.05)'
                } else {
                    e.currentTarget.style.boxShadow = `0 8px 50px ${post.type === 'question' ? 'rgba(57, 192, 237, 0.25)' : 'rgba(57, 255, 20, 0.25)'}`
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = (isFirst && !initialExpanded && firstPostStyles.boxShadow) ? firstPostStyles.boxShadow : 'none'
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '16px', color: 'var(--purple)' }}>
                                @{optimisticPost.techtakes_user?.username}
                            </span>
                            {post.type === 'question' && (
                                <span style={{
                                    fontSize: '10px', textTransform: 'uppercase', fontWeight: 800,
                                    padding: '2px 6px', borderRadius: '4px',
                                    background: 'rgba(57, 192, 237, 0.2)', color: 'var(--neon-blue)',
                                    border: '1px solid rgba(57, 192, 237, 0.4)',
                                    letterSpacing: '0.05em'
                                }}>
                                    Question
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {(currentUser?.is_admin || currentUser?.id === post.user_id) && (
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeletePost() }}
                                    style={{ color: 'rgba(255,255,255,0.2)', transition: 'color 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                            <span style={{ fontSize: '12px', color: 'rgba(240,240,245,0.35)', fontFamily: 'monospace' }}>
                                {timeAgo(optimisticPost.created_at)}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <Link href={`/post/${post.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                        <p style={{
                            fontSize: '18px', lineHeight: 1.6, fontWeight: 400,
                            color: 'rgba(240,240,245,0.9)', marginBottom: '20px',
                            wordBreak: 'break-word',
                            cursor: 'pointer'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(240,240,245,0.9)'}
                        >
                            {optimisticPost.content}
                        </p>
                    </Link>

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

                        {/* Comment + Share buttons */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                onClick={toggleComments}
                                style={{
                                    padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px',
                                    borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                                    transition: 'all 0.2s',
                                    color: showComments ? 'var(--purple)' : 'rgba(240,240,245,0.3)',
                                    background: showComments ? 'rgba(168,85,247,0.1)' : 'transparent',
                                }}
                                onMouseEnter={(e) => { if (!showComments) e.currentTarget.style.color = 'var(--purple)' }}
                                onMouseLeave={(e) => { if (!showComments) e.currentTarget.style.color = 'rgba(240,240,245,0.3)' }}
                            >
                                <MessageSquare style={{ width: 18, height: 18 }} />
                                {localCommentCount > 0 && <span>{localCommentCount}</span>}
                            </button>
                            <button style={{ padding: '8px', color: 'rgba(240,240,245,0.3)', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--neon-green)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(240,240,245,0.3)'}
                            >
                                <Share2 style={{ width: 18, height: 18 }} />
                            </button>
                        </div>
                    </div>

                    {/* ── Comments Section ── */}
                    <AnimatePresence>
                        {showComments && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{ overflow: 'hidden' }}
                            >
                                <div style={{
                                    marginTop: '20px', paddingTop: '20px',
                                    borderTop: '1px solid rgba(255,255,255,0.06)'
                                }}>
                                    {/* Comment input */}
                                    <div style={{
                                        display: 'flex', gap: '10px', marginBottom: '16px',
                                        alignItems: 'flex-end'
                                    }}>
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitComment() } }}
                                            placeholder="Add a comment..."
                                            maxLength={500}
                                            className="input-field"
                                            style={{ flex: 1, padding: '10px 14px', fontSize: '14px', borderRadius: '999px' }}
                                        />
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleSubmitComment}
                                            disabled={!commentText.trim() || submittingComment}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '50%',
                                                background: commentText.trim() ? 'linear-gradient(135deg, var(--neon-green), var(--purple))' : 'rgba(255,255,255,0.05)',
                                                color: commentText.trim() ? '#000' : 'rgba(240,240,245,0.3)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.2s',
                                                flexShrink: 0,
                                                cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                                                boxShadow: commentText.trim() ? '0 0 15px var(--neon-glow)' : 'none'
                                            }}
                                        >
                                            {submittingComment ? (
                                                <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} />
                                            ) : (
                                                <Send style={{ width: 16, height: 16 }} />
                                            )}
                                        </motion.button>
                                    </div>

                                    {/* Comments list */}
                                    {loadingComments ? (
                                        <div style={{ textAlign: 'center', padding: '16px', color: 'rgba(240,240,245,0.3)' }}>
                                            <Loader2 className="animate-spin" style={{ width: 20, height: 20, margin: '0 auto' }} />
                                        </div>
                                    ) : comments.length === 0 ? (
                                        <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(240,240,245,0.3)', padding: '12px 0' }}>
                                            No comments yet. Start the conversation!
                                        </p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {comments.map((comment) => (
                                                <motion.div
                                                    key={comment.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    style={{
                                                        display: 'flex', gap: '10px',
                                                        padding: '10px 14px',
                                                        background: 'rgba(0,0,0,0.3)',
                                                        borderRadius: '14px',
                                                        border: '1px solid rgba(255,255,255,0.04)'
                                                    }}
                                                >
                                                    <img
                                                        src={comment.techtakes_user?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${comment.techtakes_user?.username}`}
                                                        alt={comment.techtakes_user?.username}
                                                        style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }}
                                                    />
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '2px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                                <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--purple)' }}>
                                                                    @{comment.techtakes_user?.username}
                                                                </span>
                                                                <span style={{ fontSize: '11px', color: 'rgba(240,240,245,0.25)', fontFamily: 'monospace' }}>
                                                                    {timeAgo(comment.created_at)}
                                                                </span>
                                                            </div>
                                                            {(currentUser?.is_admin || currentUser?.id === comment.user_id) && (
                                                                <button
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                    style={{ color: 'rgba(255,255,255,0.15)', transition: 'color 0.2s' }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.15)'}
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'rgba(240,240,245,0.75)', wordBreak: 'break-word' }}>
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}
