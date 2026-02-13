import { createClient } from '@/utils/supabase/server'
import Feed from '@/components/Feed'
import CreatePost from '@/components/CreatePost'
import UserProfile from '@/components/UserProfile'
import FeaturedTopics from '@/components/FeaturedTopics'
import { redirect } from 'next/navigation'
import { Flame, LogOut } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const avatarUrl = user.user_metadata.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.user_metadata.username || 'user'}`
  const username = user.user_metadata.username || user.email?.split('@')[0] || 'User'

  const { data: userData } = await supabase
    .from('techtakes_user')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const isAdmin = userData?.is_admin || false

  return (
    <main style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Decorative background blobs */}
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

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '16px', position: 'relative', zIndex: 10 }}>
        {/* ── Header ── */}
        <header className="glass-card" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 24px', marginBottom: '48px',
          position: 'sticky', top: '16px', zIndex: 50,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 60px rgba(168,85,247,0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--neon-green), var(--purple))',
              padding: '6px', borderRadius: '10px',
              boxShadow: '0 0 15px var(--neon-glow)'
            }}>
              <Flame style={{ width: 20, height: 20, color: '#000' }} />
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.05em', fontFamily: "'Orbitron', sans-serif", textTransform: 'uppercase' as const }}>
              <span className="text-gradient">Hot Takes</span>
            </h1>
          </div>


          <UserProfile userId={user.id} username={username} avatarUrl={avatarUrl} />
        </header>

        {/* ── Create Post ── */}
        <section style={{ marginBottom: '48px' }}>
          <CreatePost isAdmin={isAdmin} />
        </section>

        {/* ── Featured Topics ── */}
        <FeaturedTopics />

        {/* ── Community Questions ── */}
        <section style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--neon-blue)', whiteSpace: 'nowrap', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.05em' }}>
              ❓ QUESTIONS
            </h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, rgba(57, 192, 237, 0.3), transparent)' }} />
          </div>
          <Feed type="question" />
        </section>

        {/* ── Hot Takes ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--neon-green)', whiteSpace: 'nowrap', fontFamily: "'Orbitron', sans-serif", letterSpacing: '0.05em' }}>
              🔥 HOT TAKES
            </h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, rgba(57, 255, 20, 0.2), transparent)' }} />
          </div>
          <Feed type="hot_take" />
        </section>
      </div>
    </main>
  )
}
