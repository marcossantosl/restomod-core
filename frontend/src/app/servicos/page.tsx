'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function ServicosPage() {
  const [data, setData]         = useState<any[]>([])
  const [projetos, setProjetos] = useState<any[]>([]) // Corrigido para plural
  const [mecanicos, setMecanicos] = useState<any[]>([]) // Novo: Lista de Mecânicos
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => {
    api.get('/api/servicos').then(r => setData(r.data))
    api.get('/api/projetos').then(r => setProjetos(r.data))
    api.get('/api/mecanicos').then(r => setMecanicos(r.data)) // Carrega os mecânicos
  }
  
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_servico) {
      await api.put(`/api/servicos/${item.id_servico}`, item)
      setEditing(null)
    } else {
      await api.post('/api/servicos', item)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este serviço?')) {
      await api.delete(`/api/servicos/${id}`)
      load()
    }
  }

  const columns = [
    { key: 'categoria',        label: 'Categoria' },
    { key: 'descricao',        label: 'Descrição' },
    { key: 'horas_estimadas',  label: 'Hrs Est.', type: 'number' as const },
    { key: 'horas_realizadas', label: 'Hrs Real.', type: 'number' as const },
    { key: 'valor',            label: 'Valor R$',  type: 'number' as const },
    
    // Corrigido: ´projeto -> projeto, editkey -> editKey. 
    // Como Projeto não tem a coluna "nome", usei categoria_projeto ou fallback para o ID.
    { 
      key: 'projeto.titulo', 
      label: 'Projeto', 
      type: 'select' as const, 
      editKey: 'id_projeto', 
      options: projetos.map(o => ({ label: o.titulo, value: o.id_projeto})) 
    },

    // NOVO: Relação N:N com Mecânicos
    {
      key: 'mecanico.titulo',
      label: 'Equipe (Mecânicos)',
      type: 'multi-select' as const,
      editKey: 'id_mecanico', // <- IMPORTANTE: É assim que o Front vai mandar no JSON: { mecanico_ids: [1, 5] }
      options: mecanicos.map(m => ({ label: m.nome, value: m.id_mecanico })),
      
      // Essa função serve para mostrar os nomes separados por vírgula quando NÃO está editando
      render: (row: any) => {
        if (!row.mecanicos || row.mecanicos.length === 0) return <span style={{ color: 'var(--text-muted)' }}>Nenhum</span>
        return row.mecanicos.map((m: any) => m.nome).join(', ')
      }
    }
  ]

  return (
    <CrudTable
      title="Serviços"
      data={data} columns={columns} idKey="id_servico"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}