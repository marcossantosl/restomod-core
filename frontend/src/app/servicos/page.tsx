'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

const columns = [
  { key: 'categoria',        label: 'Categoria' },
  { key: 'descricao',        label: 'Descrição' },
  { key: 'horas_estimadas',  label: 'Hrs Est.', type: 'number' as const },
  { key: 'horas_realizadas', label: 'Hrs Real.', type: 'number' as const },
  { key: 'valor',            label: 'Valor R$',  type: 'number' as const },
  { key: 'id_projeto',       label: 'ID Projeto', type: 'number' as const },
]

export default function ServicosPage() {
  const [data, setData]         = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => api.get('/api/servicos').then(r => setData(r.data))
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
