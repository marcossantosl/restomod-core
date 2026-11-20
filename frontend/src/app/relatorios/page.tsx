import type { Metadata } from 'next'
import Link from 'next/link'

// Server Component: sem 'use client'. Busca os dados direto no servidor,
// a cada requisição (sem cache), e renderiza o HTML já pronto — nenhum
// JavaScript de fetch roda no navegador para montar esta página.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Relatórios',
  description: 'Relatórios da oficina: valor de serviços por oficina, horas por mecânico e peças mais utilizadas.',
}

const BACKEND_URL =
  process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

async function getJson(path: string) {
  const resposta = await fetch(`${BACKEND_URL}${path}`, { cache: 'no-store' })
  if (!resposta.ok) return []
  return resposta.json()
}

export default async function RelatoriosPage() {
  const [servicosOficina, horasMecanico, pecasUsadas] = await Promise.all([
    getJson('/api/dashboard/servicos-por-oficina'),
    getJson('/api/dashboard/horas-por-mecanico'),
    getJson('/api/dashboard/pecas-utilizadas'),
  ])

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, textTransform: 'uppercase' }}>Relatórios</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Página renderizada no servidor (Server Component) — os dados abaixo vêm direto da API em
          cada requisição, sem fetch no cliente.
        </p>
      </div>

      <div style={cardStyle}>
        <h2 style={h2Style}>Valor de Serviços por Oficina</h2>
        <table style={tableStyle}>
          <thead>
            <tr>{['Oficina', 'Serviços', 'Valor Total'].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {servicosOficina.map((r: any, i: number) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={tdStyle}>{r.oficina}</td>
                <td style={tdStyle}>{r.total_servicos}</td>
                <td style={tdStyle}>R$ {Number(r.valor_total).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={cardStyle}>
        <h2 style={h2Style}>Horas por Mecânico</h2>
        <table style={tableStyle}>
          <thead>
            <tr>{['Mecânico', 'Especialidade', 'Serviços', 'Horas'].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {horasMecanico.map((r: any, i: number) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={tdStyle}>{r.mecanico}</td>
                <td style={tdStyle}>{r.especialidade}</td>
                <td style={tdStyle}>{r.total_servicos}</td>
                <td style={tdStyle}>{r.total_horas}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={cardStyle}>
        <h2 style={h2Style}>Peças Mais Utilizadas</h2>
        <table style={tableStyle}>
          <thead>
            <tr>{['Peça', 'Tipo', 'Qtd', 'Valor Mov.'].map((h) => <th key={h} style={thStyle}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {pecasUsadas.map((r: any, i: number) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={tdStyle}>{r.peca}</td>
                <td style={tdStyle}>{r.tipo_peca}</td>
                <td style={tdStyle}>{r.total_usado}</td>
                <td style={tdStyle}>R$ {Number(r.valor_movimentado).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link href="/projetos" style={{ color: 'var(--accent)', fontSize: 13 }}>
        → Ver Projetos
      </Link>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-50)',
  border: '1px solid var(--border)',
  borderRadius: 10,
  padding: 28,
  marginBottom: 24,
}
const h2Style: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  textTransform: 'uppercase',
  color: 'var(--accent)',
  marginBottom: 12,
}
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const thStyle: React.CSSProperties = {
  padding: '8px 12px',
  textAlign: 'left',
  fontWeight: 700,
  fontSize: 11,
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  borderBottom: '1px solid var(--border)',
}
const tdStyle: React.CSSProperties = { padding: '8px 12px', color: 'var(--text)' }
