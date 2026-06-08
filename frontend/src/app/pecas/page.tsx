'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function PecasPage() {
  const [data, setData]                 = useState<any[]>([])
  const [fornecedores, setFornecedores] = useState<any[]>([]) // Novo estado para o N:N
  const [editing, setEditing]           = useState<any | null>(null)
  const [creating, setCreating]         = useState(false)
  const [newItem, setNewItem]           = useState<any>({})

  const load = () => {
    api.get('/api/pecas').then(r => setData(r.data))
    api.get('/api/fornecedor').then(r => setFornecedores(r.data)) // Carrega opções
  }
  
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    try {
      // 1. Extrai os IDs dos fornecedores selecionados no frontend
      const fornecedorIds: number[] = item.id_fornecedor || [];

      // 2. Limpa o payload principal para o GORM não dar erro ao atualizar a Peça
      const pecaPayload = { ...item };
      delete pecaPayload.id_fornecedor;
      delete pecaPayload.fornecedores; // Garante que o array aninhado não vá junto

      // Blindagem de números
      pecaPayload.estoque = Number(pecaPayload.estoque) || 0;
      pecaPayload.preco_referencia = Number(pecaPayload.preco_referencia) || 0;

      let idPeca = item.id_peca;

      // 3. Salva ou Edita a Peça Base
      if (idPeca) {
        await api.put(`/api/pecas/${idPeca}`, pecaPayload);
        setEditing(null);
        // Limpa os vínculos antigos na tabela N:N (fornece)
        await api.delete(`/api/fornecedorpeca/limpar?id_peca=${idPeca}`);
      } else {
        const response = await api.post('/api/pecas', pecaPayload);
        idPeca = response.data.id_peca;
        setCreating(false);
        setNewItem({});
      }

      // 4. Recria os vínculos com os novos fornecedores na tabela N:N
      if (idPeca && fornecedorIds.length > 0) {
        const promises = fornecedorIds.map(idForn => 
          api.post('/api/fornecedorpeca', {
            id_peca: Number(idPeca),
            id_fornecedor: Number(idForn)
          })
        );
        await Promise.all(promises);
      }

      load();
    } catch (error) {
      console.error("Erro ao salvar peça e fornecedores:", error);
      alert("Erro ao salvar os dados.");
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar esta peça?')) {
      await api.delete(`/api/pecas/${id}`)
      load()
    }
  }

  // Movido para dentro para enxergar o estado "fornecedores"
  const columns = [
    { key: 'id_peca',          label: 'ID', readOnly: true },
    { key: 'nome',             label: 'Nome' },
    { key: 'fabricante',       label: 'Fabricante' },
    { key: 'tipo_peca',        label: 'Tipo' },
    { key: 'origem',           label: 'Origem' },
    { key: 'estoque',          label: 'Estoque',  type: 'number' as const },
    { key: 'preco_referencia', label: 'Preço R$', type: 'number' as const },
    {
      key: 'fornecedor.nome',
      label: 'Fornecedores',
      type: 'multi-select' as const,
      editKey: 'id_fornecedor', 
      options: fornecedores.map(f => ({ label: f.nome, value: f.id_fornecedor })),
      
      // Renderização visual em balões
      render: (row: any) => {
        if (!row.fornecedores || row.fornecedores.length === 0) {
          return <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Nenhum</span>
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {row.fornecedores.map((f: any) => (
              <span 
                key={f.id_fornecedor} 
                style={{
                  background: 'var(--bg-100)', border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '2px 8px', borderRadius: '12px',
                  fontSize: '11px', fontWeight: 500, display: 'inline-block', whiteSpace: 'nowrap'
                }}
              >
                {f.nome}
              </span>
            ))}
          </div>
        )
      }
    }
  ]

  return (
    <CrudTable
      title="Peças"
      data={data} columns={columns} idKey="id_peca"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}