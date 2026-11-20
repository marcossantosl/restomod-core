'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { requireAuth, handleAuthError } from '@/lib/auth'
import CrudTable from '@/components/CrudTable'

const columns = [
  { key: 'id_cliente',     label: 'ID',readOnly: true},
  { key: 'nome',     label: 'Nome' },
  { key: 'cpf',      label: 'CPF' },
  { key: 'email',    label: 'Email', type: 'email' as const },
  { key: 'telefone', label: 'Telefone' },
  { key: 'endereco', label: 'Endereço' },
]

export default function ClientesPage() {
  const router = useRouter()
  const [data, setData]       = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem] = useState<any>({})

  const load = () => api.get('/api/clientes').then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (!requireAuth(router)) return
    try {
      if (item.id_cliente) {
        await api.put(`/api/clientes/${item.id_cliente}`, item)
        setEditing(null)
      } else {
        await api.post('/api/clientes', item)
        setCreating(false)
        setNewItem({})
      }
      load()
    } catch (error: any) {
      if (!handleAuthError(error, router)) alert('Erro ao salvar cliente.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!requireAuth(router)) return
    if (confirm('Deseja deletar este cliente?')) {
      try {
        await api.delete(`/api/clientes/${id}`)
        load()
      } catch (error: any) {
        if (!handleAuthError(error, router)) alert('Erro ao remover cliente.')
      }
    }
  }

  return (
    <CrudTable
      title="Clientes"
      data={data}
      columns={columns}
      idKey="id_cliente"
      onSave={handleSave}
      onDelete={handleDelete}
      editing={editing}
      setEditing={setEditing}
      creating={creating}
      setCreating={setCreating}
      newItem={newItem}
      setNewItem={setNewItem}
    />
  )
}
