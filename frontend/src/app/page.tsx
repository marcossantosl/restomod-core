'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { Database, Trash2, RefreshCw } from 'lucide-react'

const CORES = ['#ff6b0a','#ff8c35','#ffb570','#e85500','#c04000','#963200','#ff6b0a','#ff8c35','#ffb570','#e85500']

export default function Dashboard() {
  const [servicosOficina, setServicosOficina] = useState<any[]>([])
  const [horasMecanico,   setHorasMecanico]   = useState<any[]>([])
  const [pecasUsadas,     setPecasUsadas]     = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const loadConsultas = () => {
    api.get('/api/dashboard/servicos-por-oficina').then(r => setServicosOficina(r.data || []))
    api.get('/api/dashboard/horas-por-mecanico').then(r => setHorasMecanico(r.data || []))
    api.get('/api/dashboard/pecas-utilizadas').then(r => setPecasUsadas(r.data || []))
  }

  useEffect(() => { loadConsultas() }, [])

  const handleSeed = async () => {
    if (!confirm('Isso vai popular o banco com dados de exemplo. Continuar?')) return
    setLoading(true)
    try {
      await api.post('/api/seed')
      setMsg('✅ Banco populado com sucesso!')
      loadConsultas()
    } catch { setMsg('Erro ao popular banco') }
    setLoading(false)
  }

  const handleDrop = async () => {
    if (!confirm('Isso vai APAGAR todos os dados. Tem certeza?')) return
    setLoading(true)
    try {
      await api.delete('/api/drop')
      setMsg('Todas as tabelas foram limpas!')
      loadConsultas()
    } catch { setMsg('Erro ao limpar banco') }
    setLoading(false)
  }

  return (
    <div className="fade-up">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 800, textTransform: 'uppercase' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Análises e gestão do banco de dados</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSeed} disabled={loading} style={btnStyle('#22c55e')}>
            <Database size={15} /> Carregar Banco
          </button>
          <button onClick={handleDrop} disabled={loading} style={btnStyle('#ef4444')}>
            <Trash2 size={15} /> Limpar Banco
          </button>
        </div>
      </div>

      {msg && (
        <div style={{ background: 'var(--bg-50)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 14 }}>
          {msg}
        </div>
      )}

      {/* Consulta 1 */}
      <div style={cardStyle}>
        <h2 style={h2Style}>Consulta 1 — Valor Total de Serviços por Oficina</h2>
        <p style={descStyle}>Soma do valor de todos os serviços agrupados por oficina, permitindo identificar quais unidades geram mais receita.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 20 }}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={servicosOficina} margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="oficina" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-100)', border: '1px solid var(--border)', borderRadius: 6 }} />
              <Bar dataKey="valor_total" name="Valor Total (R$)" radius={[4,4,0,0]}>
                {servicosOficina.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead><tr>{['Oficina','Serviços','Valor Total'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {servicosOficina.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={tdStyle}>{r.oficina}</td>
                    <td style={tdStyle}>{r.total_servicos}</td>
                    <td style={tdStyle}>R$ {Number(r.valor_total).toLocaleString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Consulta 2 */}
      <div style={cardStyle}>
        <h2 style={h2Style}>Consulta 2 — Horas Trabalhadas por Mecânico</h2>
        <p style={descStyle}>Total de horas realizadas por cada mecânico em todos os serviços, permitindo avaliar produtividade e carga de trabalho.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 20 }}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={horasMecanico} margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mecanico" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-100)', border: '1px solid var(--border)', borderRadius: 6 }} />
              <Bar dataKey="total_horas" name="Total de Horas" radius={[4,4,0,0]}>
                {horasMecanico.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead><tr>{['Mecânico','Especialidade','Serviços','Horas'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {horasMecanico.map((r, i) => (
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
        </div>
      </div>

      {/* Consulta 3 */}
      <div style={cardStyle}>
        <h2 style={h2Style}>Consulta 3 — Peças Mais Utilizadas</h2>
        <p style={descStyle}>Quantidade total de cada peça utilizada nos serviços e o valor financeiro movimentado, auxiliando no controle de estoque.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 20 }}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pecasUsadas} margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="peca" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-100)', border: '1px solid var(--border)', borderRadius: 6 }} />
              <Bar dataKey="total_usado" name="Qtd Utilizada" radius={[4,4,0,0]}>
                {pecasUsadas.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead><tr>{['Peça','Tipo','Qtd','Valor Mov.'].map(h => <th key={h} style={thStyle}>{h}</th>)}</tr></thead>
              <tbody>
                {pecasUsadas.map((r, i) => (
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
        </div>
      </div>

    </div>
  )
}

const btnStyle = (color: string): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 8,
  background: color, color: '#fff', border: 'none',
  borderRadius: 7, padding: '10px 18px', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
  textTransform: 'uppercase',
})
const cardStyle: React.CSSProperties = {
  background: 'var(--bg-50)', border: '1px solid var(--border)',
  borderRadius: 10, padding: 28, marginBottom: 24,
}
const h2Style: React.CSSProperties = {
  fontSize: 22, fontWeight: 700, textTransform: 'uppercase',
  color: 'var(--accent)', marginBottom: 4,
}
const descStyle: React.CSSProperties = { fontSize: 13, color: 'var(--text-muted)' }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const thStyle: React.CSSProperties = {
  padding: '8px 12px', textAlign: 'left', fontWeight: 700,
  fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)',
  borderBottom: '1px solid var(--border)',
}
const tdStyle: React.CSSProperties = { padding: '8px 12px', color: 'var(--text)' }