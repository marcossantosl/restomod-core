'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

const columns = [
  { key: 'nome',             label: 'Nome' },
  { key: 'fabricante',       label: 'Fabricante' },
  { key: 'tipo_peca',        label: 'Tipo' },
  { key: 'origem',           label: 'Origem' },
  { key: 'estoque',          label: 'Estoque',  type: 'number' as const },
  { key: 'preco_referencia', label: 'Preço R$', type: 'number' as const },
]

export default function PecasPage() {
  const [data, setData]         = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => api.get('/api/pecas').then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_peca) {
      await api.put(`/api/pecas/${item.id_peca}`, item)
      setEditing(null)
    } else {
      await api.post('/api/pecas', item)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar esta peça?')) {
      await api.delete(`/api/pecas/${id}`)
      load()
    }
  }

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
