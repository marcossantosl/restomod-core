'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

const columns = [
  { key: 'nome',          label: 'Nome' },
  { key: 'cpf',           label: 'CPF' },
  { key: 'especialidade', label: 'Especialidade' },
  { key: 'nivel',         label: 'Nível' },
  { key: 'id_oficina',    label: 'ID Oficina', type: 'number' as const },
]

export default function MecanicosPage() {
  const [data, setData]         = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => api.get('/api/mecanicos').then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_mecanico) {
      await api.put(`/api/mecanicos/${item.id_mecanico}`, item)
      setEditing(null)
    } else {
      await api.post('/api/mecanicos', item)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este mecânico?')) {
      await api.delete(`/api/mecanicos/${id}`)
      load()
    }
  }

  return (
    <CrudTable
      title="Mecânicos"
      data={data} columns={columns} idKey="id_mecanico"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}
