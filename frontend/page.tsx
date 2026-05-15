'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { Users, Car, FolderKanban, Wrench } from 'lucide-react'

export default function Dashboard() {
  const [counts, setCounts] = useState({ clientes: 0, veiculos: 0, projetos: 0, servicos: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/api/clientes'),
      api.get('/api/veiculos'),
      api.get('/api/projetos'),
      api.get('/api/servicos'),
    ]).then(([c, v, p, s]) => {
      setCounts({
        clientes: c.data?.length ?? 0,
        veiculos: v.data?.length ?? 0,
        projetos: p.data?.length ?? 0,
        servicos: s.data?.length ?? 0,
      })
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Clientes',  value: counts.clientes, icon: Users,          color: '#3b82f6' },
    { label: 'Veículos',  value: counts.veiculos, icon: Car,            color: '#22c55e' },
    { label: 'Projetos',  value: counts.projetos, icon: FolderKanban,   color: 'var(--accent)' },
    { label: 'Serviços',  value: counts.servicos, icon: Wrench,         color: '#a855f7' },
  ]

  return (
    <div className="fade-up">
      <h1 style={{ fontSize: 42, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>
        Dashboard
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>
        Visão geral do sistema
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {cards.map(({ label, value, icon: Icon, color }, i) => (
          <div key={label} className={`fade-up-delay-${i}`} style={{
            background: 'var(--bg-50)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 3, background: color,
            }} />
            <div style={{ color, marginBottom: 12 }}>
              <Icon size={22} />
            </div>
            <div style={{ fontSize: 40, fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1 }}>
              {value}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
              {label} cadastrados
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
