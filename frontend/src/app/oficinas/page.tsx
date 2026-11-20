'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { requireAuth, handleAuthError } from '@/lib/auth'
import CrudTable from '@/components/CrudTable'

const columns = [
  { key: 'id_oficina',     label: 'ID', readOnly: true },
  { key: 'nome',          label: 'Nome' },
  { key: 'cnpj',          label: 'CNPJ' },
  { key: 'especialidade', label: 'Especialidade' },
  { key: 'endereco',      label: 'Endereço' },
  { key: 'telefone',      label: 'Telefone' },
]

export default function OficinasPage() {
  const router = useRouter()
  const [data, setData]         = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => api.get('/api/oficinas').then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (!requireAuth(router)) return
    try {
      if (item.id_oficina) {
        await api.put(`/api/oficinas/${item.id_oficina}`, item)
        setEditing(null)
      } else {
        await api.post('/api/oficinas', item)
        setCreating(false)
        setNewItem({})
      }
      load()
    } catch (error: any) {
      if (!handleAuthError(error, router)) alert('Erro ao salvar oficina.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!requireAuth(router)) return
    if (confirm('Deseja deletar esta oficina?')) {
      try {
        await api.delete(`/api/oficinas/${id}`)
        load()
      } catch (error: any) {
        if (!handleAuthError(error, router)) alert('Erro ao remover oficina.')
      }
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
