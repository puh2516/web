import { createClient } from '@/utils/supabase/server'
import PostCard from './PostCard'

export default async function Feed({ type }: { type?: 'hot_take' | 'question' }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
        .from('techtakes_post')
        .select(`
          *,
          techtakes_user (username, avatar_url)
        `)

    if (type) {
        query = query.eq('type', type)
    }

    const { data: posts, error } = await query.order('score', { ascending: false })

    if (error) {
        console.error('Error fetching posts:', error)
        return <div className="text-center text-red-500 py-8">Error loading feed. Try refreshing.</div>
    }

    // Fetch user votes for these posts if user is logged in
    let userVotesMap: Record<string, 'up' | 'down'> = {}
    if (user && posts.length > 0) {
        const { data: votes } = await supabase
            .from('techtakes_vote')
            .select('post_id, vote_type')
            .eq('user_id', user.id)
            .in('post_id', posts.map(p => p.id))

        if (votes) {
            votes.forEach(v => {
                userVotesMap[v.post_id] = v.vote_type as 'up' | 'down'
            })
        }
    }

    const processedPosts = posts.map(post => ({
        ...post,
        techtakes_user: Array.isArray(post.techtakes_user) ? post.techtakes_user[0] : post.techtakes_user,
        user_vote: userVotesMap[post.id] || null
    }))

    return (
        <div className="space-y-4">
            {processedPosts.map((post, index) => (
                <PostCard
                    key={post.id}
                    post={post}
                    isFirst={index === 0}
                />
            ))}
            {processedPosts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    <p>No hot takes yet. Be the first!</p>
                </div>
            )}
        </div>
    )
}
