'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { setSession } from '@/lib/auth'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await api.post('/api/auth/login', { email, senha })
      setSession(res.data.token, email)
      // Volta para a página que o middleware bloqueou (?next=...), se houver.
      const next = new URLSearchParams(window.location.search).get('next')
      router.push(next && next.startsWith('/') && !next.startsWith('//') ? next : '/projetos')
      router.refresh()
    } catch (err: any) {
      setErro(err?.response?.data?.erro || 'Erro ao entrar. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <form onSubmit={handleSubmit} style={{
        background: 'var(--bg-50)', border: '1px solid var(--border)', borderRadius: 10,
        padding: 36, width: 360, display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
            letterSpacing: '0.05em', color: 'var(--accent)', textTransform: 'uppercase',
          }}>
            RESTOMOD-CORE
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Entre para criar, editar ou remover projetos
          </p>
        </div>

        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          E-mail
          <input
            type="email" required value={email} onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>

        <label style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Senha
          <input
            type="password" required value={senha} onChange={e => setSenha(e.target.value)}
            style={inputStyle}
          />
        </label>

        {erro && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{erro}</div>}

        <button type="submit" disabled={loading} style={btnStyle}>
          <LogIn size={15} /> {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
          Ainda não tem conta? <Link href="/registrar" style={{ color: 'var(--accent)' }}>Cadastre-se</Link>
        </p>
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', marginTop: 6,
  background: 'var(--bg-100)', border: '1px solid var(--border)', borderRadius: 5,
  padding: '8px 10px', color: 'var(--text)', fontSize: 14, outline: 'none',
}

const btnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7,
  padding: '10px 18px', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
  cursor: 'pointer', textTransform: 'uppercase',
}
