import './globals.css'
import type { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'

// Server Component: o layout raiz não tem estado nem eventos, por isso pode
// exportar "metadata". A parte interativa (navegação e logout) fica em
// <Sidebar />, que é um Client Component.
export const metadata: Metadata = {
  title: {
    default: 'Restomod-Core — Gestão de Oficina de Restomod',
    template: '%s | Restomod-Core',
  },
  description:
    'Sistema de gestão para oficinas de restomod: clientes, veículos, projetos, serviços, peças, upgrades e inspeções de carros clássicos.',
  keywords: ['restomod', 'oficina', 'carros clássicos', 'restauração', 'gestão de projetos'],
  applicationName: 'Restomod-Core',
  openGraph: {
    title: 'Restomod-Core',
    description: 'Gestão completa de projetos de restomod: do orçamento à entrega.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />

        {/* ── Conteúdo ── */}
        <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
