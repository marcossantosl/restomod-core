'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function HistoricoProjetoPage() {
  const [data, setData]       = useState<any[]>([])
  const [servicos, setServicos] = useState<any[]>([])
  const [pecas, setPecas] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem] = useState<any>({})

  const load = () => {
  api.get('/api/usopeca').then(r => setData(r.data))
  api.get('/api/servicos').then(r => setServicos(r.data))
  api.get('/api/pecas').then(r => setPecas(r.data))
  }
  useEffect(() => { load() }, [])

const handleSave = async (item: any) => {
  try {
    // Clona o item para não sujar o estado da tela
    const payload = { ...item };

    // 1. BLINDAGEM DE TIPOS: Força tudo que é número a virar Number real do JavaScript
    payload.quantidade  = Number(payload.quantidade) || 0;
    payload.valor_venda = Number(payload.valor_venda) || 0;
    payload.id_peca     = Number(payload.id_peca) || 0;
    payload.id_servico  = Number(payload.id_servico) || 0;

    // 2. Limpa os objetos que o Preload trouxe para o Go não se confundir
    delete payload.Peca;
    delete payload.Servico;

    if (item.id_uso_peca) {
      await api.put(`/api/usopeca/${item.id_uso_peca}`, payload);
      setEditing(null);
    } else {
      await api.post('/api/usopeca', payload);
      setCreating(false);
      setNewItem({});
    }
    load();
  } catch (error) {
    console.error("Erro ao salvar uso de peça:", error);
    alert("Erro 400: Verifique se os dados inseridos são válidos.");
  }
}

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este uso?')) {
      await api.delete(`/api/usopeca/${id}`)
      load()
    }
  }

const columns = [
  { key: 'id_uso_peca',     label: 'ID', readOnly: true },
  { key: 'valor_venda',     label: 'Valor de Venda', type: 'number' as const },
  { key: 'quantidade',      label: 'Quantidade', type: 'number' as const },
   {
   key: 'peca.nome',  // Usado para exibição (renderiza via getValue)
   label: 'Peça',
  type: 'select' as const,
   editKey: 'id_peca',
   options: pecas.map(p => ({label: p.nome, value: p.id_peca}))
  },

    {
  key: 'servico.descricao',  // Usado para exibição (renderiza via getValue)
  label: 'Serviço',
  type: 'select' as const,
  editKey: 'id_servico',
  options: servicos.map(v => ({label: v.descricao, value: v.id_servico}))
   }
]

  return (
    <CrudTable
      title="Uso Peça"
      data={data} columns={columns} idKey="id_uso_peca"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}
