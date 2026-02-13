'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
    const supabase = await createClient()
    const content = formData.get('content') as string
    const type = (formData.get('type') as string) || 'hot_take'

    if (!content || content.length > 280) {
        return { error: 'Invalid content length' }
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // If trying to post a question, verify admin status
    if (type === 'question') {
        const { data: userData } = await supabase
            .from('techtakes_user')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (!userData?.is_admin) {
            return { error: 'Only admins can post questions' }
        }
    }

    const { error } = await supabase.from('techtakes_post').insert({
        user_id: user.id,
        content,
        type,
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

export async function createComment(postId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    if (!content || content.length > 500) {
        return { error: 'Comment must be 1-500 characters' }
    }

    const { error } = await supabase.from('techtakes_comment').insert({
        user_id: user.id,
        post_id: postId,
        content,
    })

    if (error) {
        console.error('Error creating comment:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}

export async function getComments(postId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('techtakes_comment')
        .select('*, techtakes_user:user_id(username, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching comments:', error)
        return []
    }


    return data || []
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const username = formData.get('username') as string
    const avatarUrl = formData.get('avatarUrl') as string
    const password = formData.get('password') as string

    // 1. Update Supabase Auth (Password & Metadata)
    const authUpdates: any = {
        data: {
            username,
            avatar_url: avatarUrl,
        }
    }

    if (password && password.trim().length >= 6) {
        authUpdates.password = password
    }

    const { error: authError } = await supabase.auth.updateUser(authUpdates)

    if (authError) {
        return { error: `Auth Error: ${authError.message}` }
    }

    // 2. Update Public User Table
    const { error: dbError } = await supabase
        .from('techtakes_user')
        .update({
            username,
            avatar_url: avatarUrl,
        })
        .eq('id', user.id)

    if (dbError) {
        return { error: `Database Error: ${dbError.message}` }
    }

    revalidatePath('/')
    return { success: true }
}

export async function deletePost(postId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if user is admin or owner
    const { data: userData } = await supabase
        .from('techtakes_user')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    const { data: post } = await supabase
        .from('techtakes_post')
        .select('user_id')
        .eq('id', postId)
        .single()

    if (!userData?.is_admin && post?.user_id !== user.id) {
        return { error: 'Unauthorized to delete this post' }
    }

    const { error } = await supabase
        .from('techtakes_post')
        .delete()
        .eq('id', postId)

    if (error) {
        console.error('Error deleting post:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}

export async function deleteComment(commentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if user is admin or owner
    const { data: userData } = await supabase
        .from('techtakes_user')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    const { data: comment } = await supabase
        .from('techtakes_comment')
        .select('user_id')
        .eq('id', commentId)
        .single()

    if (!userData?.is_admin && comment?.user_id !== user.id) {
        return { error: 'Unauthorized to delete this comment' }
    }

    const { error } = await supabase
        .from('techtakes_comment')
        .delete()
        .eq('id', commentId)

    if (error) {
        console.error('Error deleting comment:', error)
        return { error: error.message }
    }

    revalidatePath('/')
    return { success: true }
}

