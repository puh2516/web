'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, signup } from './actions'
import { Loader2, Zap } from 'lucide-react'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true)
        setError(null)
        const action = isLogin ? login : signup
        const result = await action(formData)
        if (result && 'error' in result) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div style={{
            display: 'flex', minHeight: '100vh', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', padding: '24px',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Animated background orbs */}
            <div style={{
                position: 'fixed', top: '-30%', left: '-20%',
                width: '60%', height: '60%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(57,255,20,0.1) 0%, transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none',
                animation: 'pulse 6s ease-in-out infinite alternate'
            }} />
            <div style={{
                position: 'fixed', bottom: '-30%', right: '-20%',
                width: '60%', height: '60%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none',
                animation: 'pulse 8s ease-in-out infinite alternate-reverse'
            }} />

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.7; }
                    100% { transform: scale(1.15); opacity: 1; }
                }
                @keyframes glitch {
                    0%, 100% { text-shadow: 2px 0 var(--neon-green), -2px 0 var(--purple); }
                    25% { text-shadow: -2px 0 var(--neon-green), 2px 0 var(--purple); }
                    50% { text-shadow: 1px 1px var(--neon-green), -1px -1px var(--purple); }
                    75% { text-shadow: -1px -1px var(--neon-green), 1px 1px var(--purple); }
                }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}
            >
                {/* ── Futuristic Title Section ── */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    {/* Decorative line */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '12px', marginBottom: '20px'
                    }}>
                        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to right, transparent, var(--neon-green))' }} />
                        <div style={{
                            fontSize: '11px', fontFamily: "'Orbitron', monospace",
                            letterSpacing: '0.3em', textTransform: 'uppercase',
                            color: 'var(--neon-green)', fontWeight: 600
                        }}>
                            AI Opinion Arena
                        </div>
                        <div style={{ height: '1px', width: '60px', background: 'linear-gradient(to left, transparent, var(--neon-green))' }} />
                    </div>

                    {/* Main title with Orbitron */}
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 150, delay: 0.2 }}
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontSize: '52px',
                            fontWeight: 900,
                            letterSpacing: '-0.01em',
                            lineHeight: 1.1,
                            marginBottom: '8px',
                        }}
                    >
                        <span className="text-gradient" style={{ filter: 'drop-shadow(0 0 20px rgba(57,255,20,0.3))' }}>
                            HOT
                        </span>
                        <br />
                        <span style={{
                            color: 'var(--foreground)',
                            textShadow: '0 0 40px rgba(168,85,247,0.3)',
                        }}>
                            TAKES
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <p style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: '11px', letterSpacing: '0.25em',
                        textTransform: 'uppercase', marginTop: '16px',
                        color: 'rgba(240,240,245,0.4)'
                    }}>
                        {isLogin ? '[ System Access ]' : '[ Initialize Profile ]'}
                    </p>
                </div>

                {/* ── Card ── */}
                <div className="glass-card" style={{ padding: '32px' }}>
                    {/* Card header tab */}
                    <div style={{
                        display: 'flex', gap: '0', marginBottom: '28px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)'
                    }}>
                        <button
                            onClick={() => { setIsLogin(true); setError(null) }}
                            style={{
                                flex: 1, padding: '10px 0', fontSize: '12px',
                                fontFamily: "'Orbitron', monospace", letterSpacing: '0.15em',
                                textTransform: 'uppercase', fontWeight: 700,
                                color: isLogin ? 'var(--neon-green)' : 'rgba(240,240,245,0.3)',
                                transition: 'all 0.3s',
                                background: 'none', cursor: 'pointer',
                                borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                                borderBottomStyle: 'solid',
                                borderBottomWidth: '2px',
                                borderBottomColor: isLogin ? 'var(--neon-green)' : 'transparent',
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(null) }}
                            style={{
                                flex: 1, padding: '10px 0', fontSize: '12px',
                                fontFamily: "'Orbitron', monospace", letterSpacing: '0.15em',
                                textTransform: 'uppercase', fontWeight: 700,
                                color: !isLogin ? 'var(--purple)' : 'rgba(240,240,245,0.3)',
                                background: 'none', cursor: 'pointer',
                                borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                                borderBottomStyle: 'solid',
                                borderBottomWidth: '2px',
                                borderBottomColor: !isLogin ? 'var(--purple)' : 'transparent',
                                transition: 'all 0.3s',
                            }}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="username"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label htmlFor="username" style={{
                                        display: 'block', fontSize: '11px',
                                        fontFamily: "'Orbitron', monospace",
                                        letterSpacing: '0.15em', textTransform: 'uppercase',
                                        color: 'rgba(240,240,245,0.4)', marginBottom: '6px', fontWeight: 600
                                    }}>Handle</label>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required={!isLogin}
                                        className="input-field"
                                        placeholder="your_username"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label htmlFor="email" style={{
                                display: 'block', fontSize: '11px',
                                fontFamily: "'Orbitron', monospace",
                                letterSpacing: '0.15em', textTransform: 'uppercase',
                                color: 'rgba(240,240,245,0.4)', marginBottom: '6px', fontWeight: 600
                            }}>Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="input-field"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" style={{
                                display: 'block', fontSize: '11px',
                                fontFamily: "'Orbitron', monospace",
                                letterSpacing: '0.15em', textTransform: 'uppercase',
                                color: 'rgba(240,240,245,0.4)', marginBottom: '6px', fontWeight: 600
                            }}>Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    style={{
                                        background: 'rgba(255,51,102,0.1)',
                                        border: '1px solid rgba(255,51,102,0.3)',
                                        borderRadius: '10px',
                                        padding: '10px 14px',
                                        fontSize: '13px',
                                        color: 'var(--error)',
                                        textAlign: 'center'
                                    }}
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary"
                            style={{
                                marginTop: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                fontFamily: "'Orbitron', sans-serif",
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                fontSize: '13px'
                            }}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" style={{ width: 20, height: 20 }} />
                            ) : (
                                <>
                                    <Zap style={{ width: 16, height: 16 }} />
                                    {isLogin ? 'Access System' : 'Initialize'}
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                {/* Footer decoration */}
                <div style={{
                    textAlign: 'center', marginTop: '24px',
                    fontSize: '10px', fontFamily: "'Orbitron', monospace",
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'rgba(240,240,245,0.2)'
                }}>
                    v2.0 · neuralnet active
                </div>
            </motion.div>
        </div>
    )
}
