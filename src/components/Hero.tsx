'use client'

import { motion } from 'framer-motion'

export default function Hero() {
    return (
        <section style={{ marginBottom: '64px', textAlign: 'center' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h2 style={{
                    fontSize: '42px', fontWeight: 900, marginBottom: '16px',
                    fontFamily: "'Orbitron', sans-serif", letterSpacing: '-0.02em',
                    lineHeight: 1.1
                }}>
                    FUEL THE <span className="text-gradient">AI DEBATE</span>
                </h2>
                <p style={{
                    fontSize: '18px', color: 'rgba(240,240,245,0.6)', maxWidth: '540px',
                    margin: '0 auto 32px', lineHeight: 1.6, fontWeight: 500
                }}>
                    The terminal for unfiltered Artificial Intelligence perspectives.
                    Drop your most controversial opinions, challenge the status quo, and vote on the future of the silicon mind.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <div style={{
                        padding: '1px', background: 'linear-gradient(135deg, var(--neon-green), var(--purple))',
                        borderRadius: '12px'
                    }}>
                        <div style={{
                            background: 'var(--background)', padding: '8px 16px', borderRadius: '11px',
                            fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--neon-green)', boxShadow: '0 0 10px var(--neon-green)' }} />
                            LIVE NETWORK
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
