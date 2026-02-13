import { createClient } from '@/utils/supabase/server'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function PostDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch post
    const { data: post, error } = await supabase
        .from('techtakes_post')
        .select(`*, techtakes_user (username, avatar_url)`)
        .eq('id', id)
        .single()

    if (error || !post) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                Post not found or has been deleted.
                <br />
                <Link href="/" style={{ color: 'var(--neon-green)', marginTop: '16px', display: 'inline-block' }}>
                    Return Home
                </Link>
            </div>
        )
    }

    // Fetch vote
    let userVote = null
    if (user) {
        const { data: vote } = await supabase
            .from('techtakes_vote')
            .select('vote_type')
            .eq('user_id', user.id)
            .eq('post_id', id)
            .single()
        if (vote) userVote = vote.vote_type
    }

    // Determine type (default 'hot_take' if undefined)
    const postType = post.type || 'hot_take'

    const processedPost = {
        ...post,
        techtakes_user: Array.isArray(post.techtakes_user) ? post.techtakes_user[0] : post.techtakes_user,
        user_vote: userVote,
        type: postType
    }

    return (
        <main style={{ minHeight: '100vh', position: 'relative', padding: '24px' }}>
            {/* Background blobs */}
            <div style={{
                position: 'fixed', top: '-25%', left: '-15%',
                width: '50%', height: '50%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(57,255,20,0.06) 0%, transparent 60%)',
                filter: 'blur(100px)', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed', bottom: '-25%', right: '-15%',
                width: '50%', height: '50%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 60%)',
                filter: 'blur(100px)', pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                <Link href="/" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'rgba(240,240,245,0.6)', textDecoration: 'none',
                    marginBottom: '24px', fontWeight: 600, fontSize: '14px',
                    transition: 'color 0.2s'
                }}>
                    <ArrowLeft size={16} /> Back to Feed
                </Link>

                <PostCard post={processedPost} initialExpanded={true} />
            </div>
        </main>
    )
}
