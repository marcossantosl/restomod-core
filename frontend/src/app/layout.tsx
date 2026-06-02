'use client'
import './globals.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, Users, Folder, Car, User, 
  MapPin, Wrench, Package, Cpu, UserCog, 
  ShoppingBag, Clock, Clipboard, Layers
} from 'lucide-react'

const nav = [
  { href: '/',                  label: 'Dashboard',                 icon: Home },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  return (
    <html lang="pt-BR">
      <body style={{ display: 'flex', minHeight: '100vh' }}>

        {/* ── Sidebar ── */}
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
              Oficina
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              Sistema de Gestão
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding: '12px 12px', flex: 1 }}>
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

          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)' }}>
            v1.0.0 · Docker
          </div>
        </aside>

        {/* ── Conteúdo ── */}
        <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
          {children}
        </main>

      </body>
    </html>
  )
}
