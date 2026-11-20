'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getUserEmail, clearSession } from '@/lib/auth'
import {
  Home, Users, Folder, Car,
  MapPin, Wrench, Package, Cpu, UserCog,
  ShoppingBag, Clock, Clipboard, Layers, LogIn, LogOut, FileBarChart
} from 'lucide-react'

const nav = [
  { href: '/',                  label: 'Dashboard',                 icon: Home },
  { href: '/relatorios',        label: 'Relatórios (SSR)',          icon: FileBarChart },
  { href: '/clientes',          label: 'Clientes',                  icon: Users },
  { href: '/projetos',          label: 'Projetos',                  icon: Folder },
  { href: '/historico_projeto', label: 'Histórico Projeto',         icon: Clock },
  { href: '/upgrade_restomod',  label: 'Upgrade Projeto',           icon: Clock },
  { href: '/veiculos',          label: 'Veículos',                  icon: Car },
  { href: '/mecanicos',         label: 'Mecânicos',                 icon: UserCog },
  { href: '/oficinas',          label: 'Oficinas',                  icon: MapPin },
  { href: '/servicos',          label: 'Serviços',                  icon: Wrench },
  { href: '/uso_peca',          label: 'Peças Serviço',             icon: Layers },
  { href: '/pecas',             label: 'Peças',                     icon: Package },
  { href: '/fornecedor',        label: 'Fornecedor',                icon: ShoppingBag },
  { href: '/inspecao',          label: 'Inspeção (Análise Veículo)', icon: Clipboard },
  { href: '/assistente',        label: 'IA Gemini',                 icon: Cpu }
]

// Client Component: precisa de estado (e-mail da sessão), de hooks de
// navegação (rota ativa) e de evento de clique (logout). Fica separado do
// layout raiz para que o layout continue sendo Server Component e possa
// exportar os metadados de SEO.
export default function Sidebar() {
  const path = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => { setEmail(getUserEmail()) }, [path])

  const handleLogout = () => {
    clearSession()
    setEmail(null)
    router.push('/login')
  }

  return (
    <aside style={{
      width: 220,
      background: 'var(--bg-50)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 24px 20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: '0.05em',
          color: 'var(--accent)',
          textTransform: 'uppercase',
        }}>
          RESTOMOD-CORE
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
          Sistema de Gestão
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 12px', flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/' && path.startsWith(href))
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 6,
                marginBottom: 2,
                background: active ? 'rgba(255,107,10,0.12)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: active ? 500 : 400,
                fontSize: 14,
                transition: 'all 0.15s',
                cursor: 'pointer',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
              }}>
                <Icon size={15} />
                {label}
              </div>
            </Link>
          )
        })}
      </nav>

      <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)' }}>
        {email ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {email}
            </span>
            <button onClick={handleLogout} title="Sair" style={{
              background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', padding: 4,
            }}>
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--accent)' }}>
              <LogIn size={15} /> Entrar
            </div>
          </Link>
        )}
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
          v1.0.0 · Docker
        </div>
      </div>
    </aside>
  )
}
