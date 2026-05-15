'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

const columns = [
  { key: 'categoria_projeto', label: 'Categoria' },
  { key: 'data_inicio',       label: 'Início',   type: 'date' as const },
  { key: 'data_previsao',     label: 'Previsão', type: 'date' as const },
  { key: 'orcamento_total',   label: 'Orçamento', type: 'number' as const },
  { key: 'id_cliente',        label: 'ID Cliente', type: 'number' as const },
  { key: 'id_oficina',        label: 'ID Oficina', type: 'number' as const },
]

export default function ProjetosPage() {
  const [data, setData]         = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => api.get('/api/projetos').then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_projeto) {
      await api.put(`/api/projetos/${item.id_projeto}`, item)
      setEditing(null)
    } else {
      await api.post('/api/projetos', item)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este projeto?')) {
      await api.delete(`/api/projetos/${id}`)
      load()
    }
  }

  return (
    <CrudTable
      title="Projetos"
      data={data} columns={columns} idKey="id_projeto"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}
