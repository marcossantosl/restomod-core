'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Zap } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export default function AssistentePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Olá! Sou o assistente de diagnóstico da oficina. Descreva o problema do veículo ou me faça uma pergunta sobre serviços, peças ou projetos.',
    },
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/assistente',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mensagem: userMsg }),
        }
      )
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', text: data.resposta || data.output || 'Sem resposta.' }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Erro ao conectar com o assistente. Verifique se o n8n está rodando.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 72px)' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'rgba(255,107,10,0.15)', borderRadius: 8,
            padding: '8px 10px', color: 'var(--accent)',
          }}>
            <Zap size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 800, textTransform: 'uppercase' }}>IA Gemini</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Assistente de diagnóstico e recomendação</p>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: 'var(--bg-50)', border: '1px solid var(--border)',
        borderRadius: 10, padding: 20, display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12,
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
          }}>
            {/* Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'assistant' ? 'rgba(255,107,10,0.15)' : 'var(--bg-200)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: msg.role === 'assistant' ? 'var(--accent)' : 'var(--text-muted)',
            }}>
              {msg.role === 'assistant' ? <Bot size={15} /> : <User size={15} />}
            </div>
            {/* Balão */}
            <div style={{
              maxWidth: '70%',
              background: msg.role === 'assistant' ? 'var(--bg-100)' : 'rgba(255,107,10,0.12)',
              border: `1px solid ${msg.role === 'assistant' ? 'var(--border)' : 'rgba(255,107,10,0.3)'}`,
              borderRadius: 10, padding: '10px 14px',
              fontSize: 14, lineHeight: 1.6, color: 'var(--text)',
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,107,10,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)',
            }}>
              <Bot size={15} />
            </div>
            <div style={{
              background: 'var(--bg-100)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '12px 16px',
              display: 'flex', gap: 5, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--accent)',
                  animation: `pulse-accent 1.2s ease ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex', gap: 10, marginTop: 12,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Descreva o problema do veículo ou faça uma pergunta..."
          style={{
            flex: 1,
            background: 'var(--bg-50)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '12px 16px',
            color: 'var(--text)', fontSize: 14, outline: 'none',
          }}
        />
        <button onClick={send} disabled={loading} style={{
          background: 'var(--accent)', color: '#fff',
          border: 'none', borderRadius: 8, padding: '12px 18px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 14, letterSpacing: '0.03em',
          transition: 'all 0.15s',
        }}>
          <Send size={15} /> Enviar
        </button>
      </div>
    </div>
  )
}
