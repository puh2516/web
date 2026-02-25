'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hey there! 👋 I'm the Hot Takes AI assistant. Ask me anything about the platform — how to post, vote, create polls, edit your profile, and more!"
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [isOpen])

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage: Message = { role: 'user', content: input.trim() }
        const newMessages = [...messages, userMessage]
        setMessages(newMessages)
        setInput('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages.filter(m => m.role === 'user' || m.role === 'assistant') }),
            })

            const data = await res.json()

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
            } else if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', content: `⚠️ ${data.error}` }])
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't process that. Please try again!" }])
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: "Oops! Something went wrong. Please try again." }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* ── Floating Chat Bubble ── */}
            <button
                id="chat-widget-toggle"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--neon-green), var(--purple))',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    boxShadow: '0 0 25px var(--neon-glow), 0 0 50px rgba(168, 85, 247, 0.2), 0 8px 32px rgba(0,0,0,0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isOpen ? 'scale(0.9) rotate(90deg)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = isOpen ? 'scale(0.95) rotate(90deg)' : 'scale(1.1)'
                    e.currentTarget.style.boxShadow = '0 0 35px var(--neon-glow), 0 0 70px rgba(168, 85, 247, 0.3), 0 12px 40px rgba(0,0,0,0.5)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = isOpen ? 'scale(0.9) rotate(90deg)' : 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 0 25px var(--neon-glow), 0 0 50px rgba(168, 85, 247, 0.2), 0 8px 32px rgba(0,0,0,0.4)'
                }}
            >
                {isOpen ? (
                    <X style={{ width: 26, height: 26, color: '#000' }} />
                ) : (
                    <MessageCircle style={{ width: 26, height: 26, color: '#000' }} />
                )}
            </button>

            {/* ── Pulse ring animation (when closed) ── */}
            {!isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '2px solid var(--neon-green)',
                        zIndex: 9998,
                        pointerEvents: 'none',
                        animation: 'chatPulse 2s ease-out infinite',
                    }}
                />
            )}

            {/* ── Chat Panel ── */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '96px',
                    right: '24px',
                    width: '380px',
                    maxWidth: 'calc(100vw - 48px)',
                    height: '520px',
                    maxHeight: 'calc(100vh - 140px)',
                    zIndex: 9999,
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(10, 10, 18, 0.95)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    boxShadow: '0 0 40px rgba(168, 85, 247, 0.15), 0 20px 60px rgba(0,0,0,0.6)',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                    pointerEvents: isOpen ? 'auto' : 'none',
                }}
            >
                {/* ── Header ── */}
                <div
                    style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, rgba(57, 255, 20, 0.1), rgba(168, 85, 247, 0.15))',
                        borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    <div
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--neon-green), var(--purple))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 15px var(--neon-glow)',
                        }}
                    >
                        <Sparkles style={{ width: 18, height: 18, color: '#000' }} />
                    </div>
                    <div>
                        <h3
                            style={{
                                fontSize: '14px',
                                fontWeight: 800,
                                fontFamily: "'Orbitron', sans-serif",
                                letterSpacing: '0.05em',
                                background: 'linear-gradient(135deg, var(--neon-green), var(--purple))',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent',
                                margin: 0,
                            }}
                        >
                            AI ASSISTANT
                        </h3>
                        <p style={{ fontSize: '11px', color: 'rgba(240,240,245,0.5)', margin: '2px 0 0 0' }}>
                            Ask about Hot Takes features
                        </p>
                    </div>
                    <div
                        style={{
                            marginLeft: 'auto',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--neon-green)',
                            boxShadow: '0 0 8px var(--neon-green)',
                        }}
                    />
                </div>

                {/* ── Messages ── */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                    }}
                >
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'flex-start',
                                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            }}
                        >
                            {/* Avatar */}
                            <div
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background:
                                        msg.role === 'assistant'
                                            ? 'linear-gradient(135deg, rgba(57,255,20,0.2), rgba(168,85,247,0.2))'
                                            : 'rgba(168, 85, 247, 0.2)',
                                    border: `1px solid ${msg.role === 'assistant' ? 'rgba(57,255,20,0.3)' : 'rgba(168,85,247,0.3)'}`,
                                }}
                            >
                                {msg.role === 'assistant' ? (
                                    <Bot style={{ width: 14, height: 14, color: 'var(--neon-green)' }} />
                                ) : (
                                    <User style={{ width: 14, height: 14, color: 'var(--purple)' }} />
                                )}
                            </div>

                            {/* Message bubble */}
                            <div
                                style={{
                                    maxWidth: '75%',
                                    padding: '10px 14px',
                                    borderRadius:
                                        msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                    background:
                                        msg.role === 'user'
                                            ? 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(124,58,237,0.2))'
                                            : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${msg.role === 'user' ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                    fontSize: '13px',
                                    lineHeight: '1.5',
                                    color: 'var(--foreground)',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                            <div
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, rgba(57,255,20,0.2), rgba(168,85,247,0.2))',
                                    border: '1px solid rgba(57,255,20,0.3)',
                                }}
                            >
                                <Bot style={{ width: 14, height: 14, color: 'var(--neon-green)' }} />
                            </div>
                            <div
                                style={{
                                    padding: '12px 16px',
                                    borderRadius: '14px 14px 14px 4px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    display: 'flex',
                                    gap: '4px',
                                    alignItems: 'center',
                                }}
                            >
                                <span className="typing-dot" style={{ animationDelay: '0ms' }} />
                                <span className="typing-dot" style={{ animationDelay: '150ms' }} />
                                <span className="typing-dot" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* ── Input ── */}
                <div
                    style={{
                        padding: '12px 16px',
                        borderTop: '1px solid rgba(168, 85, 247, 0.15)',
                        background: 'rgba(12, 12, 20, 0.8)',
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                    }}
                >
                    <input
                        ref={inputRef}
                        id="chat-widget-input"
                        type="text"
                        placeholder="Ask about features..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                sendMessage()
                            }
                        }}
                        disabled={isLoading}
                        style={{
                            flex: 1,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            padding: '10px 14px',
                            color: 'var(--foreground)',
                            fontSize: '13px',
                            fontFamily: 'inherit',
                            outline: 'none',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)'
                            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(168, 85, 247, 0.1)'
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                            e.currentTarget.style.boxShadow = 'none'
                        }}
                    />
                    <button
                        id="chat-widget-send"
                        onClick={sendMessage}
                        disabled={!input.trim() || isLoading}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background:
                                input.trim() && !isLoading
                                    ? 'linear-gradient(135deg, var(--neon-green), var(--purple))'
                                    : 'rgba(255,255,255,0.05)',
                            border: 'none',
                            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                            flexShrink: 0,
                            boxShadow:
                                input.trim() && !isLoading ? '0 0 15px var(--neon-glow)' : 'none',
                        }}
                    >
                        <Send
                            style={{
                                width: 16,
                                height: 16,
                                color: input.trim() && !isLoading ? '#000' : 'rgba(255,255,255,0.3)',
                            }}
                        />
                    </button>
                </div>
            </div>

            {/* ── Animations ── */}
            <style jsx global>{`
        @keyframes chatPulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        .typing-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--neon-green);
          display: inline-block;
          animation: typingBounce 1.2s ease-in-out infinite;
        }

        @keyframes typingBounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }
          30% {
            transform: translateY(-6px);
            opacity: 1;
          }
        }
      `}</style>
        </>
    )
}
