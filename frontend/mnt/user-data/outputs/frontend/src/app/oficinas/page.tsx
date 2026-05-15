'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

const columns = [
  { key: 'nome',          label: 'Nome' },
  { key: 'cnpj',          label: 'CNPJ' },
  { key: 'especialidade', label: 'Especialidade' },
  { key: 'endereco',      label: 'Endereço' },
  { key: 'telefone',      label: 'Telefone' },
]

export default function OficinasPage() {
  const [data, setData]         = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => api.get('/api/oficinas').then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_oficina) {
      await api.put(`/api/oficinas/${item.id_oficina}`, item)
      setEditing(null)
    } else {
      await api.post('/api/oficinas', item)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar esta oficina?')) {
      await api.delete(`/api/oficinas/${id}`)
      load()
    }
  }

  return (
    <CrudTable
      title="Oficinas"
      data={data} columns={columns} idKey="id_oficina"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}
