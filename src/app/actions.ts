'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
    const supabase = await createClient()
    const content = formData.get('content') as string

    if (!content || content.length > 280) {
        return { error: 'Invalid content length' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase.from('techtakes_post').insert({
        user_id: user.id,
        content,
    })

    if (error) {
        console.error('Error creating post:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}

export async function castVote(postId: string, voteType: 'up' | 'down') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if vote exists
    const { data: existingVote } = await supabase
        .from('techtakes_vote')
        .select('vote_type')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single()

    if (existingVote) {
        if (existingVote.vote_type === voteType) {
            // Toggle off (remove vote)
            await supabase
                .from('techtakes_vote')
                .delete()
                .eq('user_id', user.id)
                .eq('post_id', postId)
        } else {
            // Change vote
            await supabase
                .from('techtakes_vote')
                .update({ vote_type: voteType })
                .eq('user_id', user.id)
                .eq('post_id', postId)
        }
    } else {
        // Insert new vote
        await supabase.from('techtakes_vote').insert({
            user_id: user.id,
            post_id: postId,
            vote_type: voteType,
        })
    }

    revalidatePath('/')
    return { success: true }
}
