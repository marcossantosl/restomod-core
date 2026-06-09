'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { Database, Trash2, FileText, LayoutDashboard } from 'lucide-react'

const CORES = ['#ff6b0a','#ff8c35','#ffb570','#e85500','#c04000','#963200','#ff6b0a','#ff8c35','#ffb570','#e85500']

export default function Dashboard() {
  const [servicosOficina, setServicosOficina] = useState<any[]>([])
  const [horasMecanico,   setHorasMecanico]   = useState<any[]>([])
  const [pecasUsadas,     setPecasUsadas]     = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  
  // Controle de abas para não poluir a tela
  const [activeTab, setActiveTab] = useState<'docs' | 'charts'>('docs')

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
          <h1 style={{ fontSize: 42, fontWeight: 800, textTransform: 'uppercase' }}>Restomod-Core</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Gestão, Logbook e Modelagem de Banco de Dados</p>
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

      {/* Navegação de Abas */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button 
          onClick={() => setActiveTab('docs')} 
          style={{ ...tabStyle, opacity: activeTab === 'docs' ? 1 : 0.5, borderBottom: activeTab === 'docs' ? '2px solid var(--accent)' : 'none' }}
        >
          <FileText size={18} /> Documentação Técnica
        </button>
        <button 
          onClick={() => setActiveTab('charts')} 
          style={{ ...tabStyle, opacity: activeTab === 'charts' ? 1 : 0.5, borderBottom: activeTab === 'charts' ? '2px solid var(--accent)' : 'none' }}
        >
          <LayoutDashboard size={18} /> Consultas e Análises
        </button>
      </div>

      {/* =======================================================================
          ABA 1: DOCUMENTAÇÃO (Textos e Modelagem exigidos)
          ======================================================================= */}
      {activeTab === 'docs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={cardStyle}>
            <h2 style={h2Style}>1. Objetivo Geral do Sistema</h2>
            <p style={{ ...textStyle, marginTop: 12 }}>
              O objetivo geral do sistema Restomod-Core é fornecer uma plataforma integrada de gestão e documentação técnica para oficinas automotivas, com foco especializado em serviços de manutenção convencional e projetos de Restomod (restauração e modificação de performance). O sistema visa centralizar o controle de toda a cadeia operacional da oficina, desde o cadastro de clientes, veículos e fornecedores, até a alocação de mecânicos especializados e o rigoroso controle de inventário de peças. O grande diferencial da aplicação é atuar como um diário de bordo digital (logbook) detalhado, permitindo a rastreabilidade total do ciclo de vida das modificações de um veículo. Ao amarrar dados financeiros de serviços e peças a históricos técnicos de upgrades — como sistemas doadores e aferições de potência —, o sistema garante a integridade das informações operacionais e otimiza a tomada de decisão gerencial.
            </p>
          </div>

          <div style={cardStyle}>
            <h2 style={h2Style}>2. Descrição Detalhada e Requisitos de Modelagem</h2>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={textStyle}>
                O sistema Restomod-Core foi concebido para atender às demandas complexas de oficinas mecânicas de alta performance, operando através de módulos lógicos interconectados que ditam os requisitos fundamentais para a modelagem do banco de dados.
              </p>
              
              <h3 style={h3Style}>2.1. Gestão de Cadastros e Atores</h3>
              <p style={textStyle}>
                O sistema exige o registro detalhado dos Clientes e de seus respectivos Veículos. Um veículo não é tratado apenas de forma genérica; a modelagem exige o armazenamento de suas características de fábrica (WHP original e KGFM original), pois esses dados servem de base comparativa para projetos futuros. Além disso, a Oficina e os Mecânicos são mapeados com suas especialidades e níveis, essenciais para a alocação de equipe.
              </p>

              <h3 style={h3Style}>2.2. Gestão de Estoque e Suprimentos</h3>
              <p style={textStyle}>
                O controle de materiais exige a catalogação de Peças (fabricante, origem, preço) e sua relação de muitos-para-muitos com os Fornecedores. O requisito mais sensível é a integridade do inventário: a modelagem prevê a restrição de exclusão para peças em uso e a propagação em cascata para limpezas seguras do catálogo.
              </p>

              <h3 style={h3Style}>2.3. Controle Operacional (Serviços e Projetos)</h3>
              <p style={textStyle}>
                As intervenções são encapsuladas na entidade Projeto. A modelagem suporta duas relações N:N vitais: a alocação de equipe (um serviço realizado por vários mecânicos) e o uso de peças (um serviço consome múltiplas peças). A tabela de "Uso de Peça" possui restrição direta no serviço para evitar a exclusão acidental de mão de obra que já movimentou o estoque físico.
              </p>

              <h3 style={h3Style}>2.4. O Diferencial: Módulo Restomod</h3>
              <p style={textStyle}>
                A entidade Upgrade Restomod documenta a engenharia de adaptação (sistema alvo, veículo doador, resultados em dinamômetro). A modelagem permite que os Serviços sejam vinculados opcionalmente a um Upgrade específico, isolando o custo exato de mão de obra e peças de uma modificação pesada das manutenções rotineiras.
              </p>

              <h3 style={h3Style}>2.5. Diário de Bordo (Histórico)</h3>
              <p style={textStyle}>
                A entidade de Histórico de Projeto atua como uma linha do tempo consolidada. Ela registra status, data, quilometragem e descrições detalhadas. Normalizada na última versão, ela aponta diretamente para o Projeto, garantindo a rastreabilidade total da evolução automotiva sem redundância de dados estruturais.
              </p>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={h2Style}>3. Modelagem Conceitual</h2>
            <p style={descStyle}>Representação das entidades (mais de 10) e seus relacionamentos de negócio.</p>
            <div style={{ marginTop: 20, border: '1px solid var(--border)', borderRadius: 8, padding: 8, background: '#fff' }}>
              <img src="/conceitualfinal.jpg" alt="Modelo Conceitual do Sistema" style={{ width: '100%', height: 'auto', borderRadius: 4 }} />
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={h2Style}>4. Modelagem Lógica</h2>
            <p style={descStyle}>Representação das tabelas, tipos de dados e chaves estrangeiras geradas a partir do modelo conceitual.</p>
            <div style={{ marginTop: 20, border: '1px solid var(--border)', borderRadius: 8, padding: 8, background: '#fff' }}>
              <img src="/logicofinal.jpg" alt="Modelo Lógico do Sistema" style={{ width: '100%', height: 'auto', borderRadius: 4 }} />
            </div>
          </div>

        </div>
      )}

      {/* =======================================================================
          ABA 2: GRÁFICOS E CONSULTAS
          ======================================================================= */}
      {activeTab === 'charts' && (
        <>
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
        </>
      )}

    </div>
  )
}

// Estilos
const btnStyle = (color: string): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', gap: 8,
  background: color, color: '#fff', border: 'none',
  borderRadius: 7, padding: '10px 18px', cursor: 'pointer',
  fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600,
  textTransform: 'uppercase',
})
const tabStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  background: 'transparent', color: 'var(--text)', border: 'none',
  padding: '8px 12px', cursor: 'pointer', fontSize: 16, fontWeight: 700,
  textTransform: 'uppercase', fontFamily: 'var(--font-display)',
  transition: 'all 0.2s ease'
}
const cardStyle: React.CSSProperties = {
  background: 'var(--bg-50)', border: '1px solid var(--border)',
  borderRadius: 10, padding: 28, marginBottom: 24,
}
const h2Style: React.CSSProperties = {
  fontSize: 22, fontWeight: 700, textTransform: 'uppercase',
  color: 'var(--accent)', marginBottom: 4,
}
const h3Style: React.CSSProperties = {
  fontSize: 16, fontWeight: 600, color: 'var(--text)', marginTop: 8
}
const textStyle: React.CSSProperties = { 
  fontSize: 15, color: 'var(--text)', lineHeight: 1.6, textAlign: 'justify' 
}
const descStyle: React.CSSProperties = { fontSize: 13, color: 'var(--text-muted)' }
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 }
const thStyle: React.CSSProperties = {
  padding: '8px 12px', textAlign: 'left', fontWeight: 700,
  fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)',
  borderBottom: '1px solid var(--border)',
}
const tdStyle: React.CSSProperties = { padding: '8px 12px', color: 'var(--text)' }