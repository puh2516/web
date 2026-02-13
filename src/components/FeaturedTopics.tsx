'use client'

import { motion } from 'framer-motion'
import { Flame, MessageCircleQuestion, Zap, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function FeaturedTopics() {
    const topics = [
        {
            id: 'controversy',
            title: 'Controversial Topic',
            description: 'The heat is real here.',
            icon: <Flame size={24} color="var(--neon-green)" />,
            glow: 'rgba(57, 255, 20, 0.15)',
            href: '/', // We'll jump to the feed
            label: 'Trending'
        },
        {
            id: 'qna',
            title: 'Admin Questions',
            description: 'Answers from the source.',
            icon: <MessageCircleQuestion size={24} color="var(--neon-blue)" />,
            glow: 'rgba(57, 192, 237, 0.15)',
            href: '/',
            label: 'Exclusive'
        },
        {
            id: 'ai-news',
            title: 'AI Flash',
            description: 'Latest breakthroughs.',
            icon: <Zap size={24} color="var(--purple)" />,
            glow: 'rgba(168, 85, 247, 0.15)',
            href: '/',
            label: 'Fast'
        }
    ]

    return (
        <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px', marginBottom: '40px'
        }}>
            {topics.map((topic, i) => (
                <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="glass-card"
                    style={{
                        padding: '20px', position: 'relative', overflow: 'hidden',
                        cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)'
                    }}
                >
                    <div style={{
                        position: 'absolute', top: '-20px', right: '-20px',
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: topic.glow, filter: 'blur(30px)', zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                            marginBottom: '12px'
                        }}>
                            <div style={{
                                padding: '8px', borderRadius: '12px',
                                background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                {topic.icon}
                            </div>
                            <span style={{
                                fontSize: '10px', fontWeight: 900, textTransform: 'uppercase',
                                letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '4px',
                                background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)'
                            }}>
                                {topic.label}
                            </span>
                        </div>

                        <h3 style={{
                            fontSize: '16px', fontWeight: 800, marginBottom: '4px',
                            fontFamily: "'Orbitron', sans-serif"
                        }}>
                            {topic.title}
                        </h3>
                        <p style={{
                            fontSize: '13px', color: 'rgba(240,240,245,0.5)',
                            lineHeight: 1.4
                        }}>
                            {topic.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
