import { createClient } from '@/utils/supabase/server'
import Feed from '@/components/Feed'
import CreatePost from '@/components/CreatePost'
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(240,240,245,0.6)' }}>@{username}</span>
            <img
              src={avatarUrl}
              alt={username}
              style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid var(--purple)', padding: 1 }}
            />
          </div>
        </header>

        {/* ── Create Post ── */}
        <section style={{ marginBottom: '48px' }}>
          <CreatePost />
        </section>

        {/* ── Feed ── */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--foreground)', whiteSpace: 'nowrap' }}>
              🔥 Trending Heat
            </h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(to right, var(--card-border), transparent)' }} />
          </div>
          <Feed />
        </section>
      </div>
    </main>
  )
}
