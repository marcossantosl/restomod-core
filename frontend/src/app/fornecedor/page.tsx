'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { requireAuth, handleAuthError } from '@/lib/auth'
import CrudTable from '@/components/CrudTable'

const columns = [
  { key: 'id_fornecedor',     label: 'ID',readOnly: true },
  { key: 'nome',     label: 'Nome' },
  { key: 'contato',    label: 'Contato'},
  { key: 'especialidade', label: 'Especialidade' },
]

export default function FornecedorPage() {
  const router = useRouter()
  const [data, setData]       = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem] = useState<any>({})

  const load = () => api.get('/api/fornecedor').then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (!requireAuth(router)) return
    try {
      if (item.id_fornecedor) {
        await api.put(`/api/fornecedor/${item.id_fornecedor}`, item)
        setEditing(null)
      } else {
        await api.post('/api/fornecedor', item)
        setCreating(false)
        setNewItem({})
      }
      load()
    } catch (error: any) {
      if (!handleAuthError(error, router)) alert('Erro ao salvar fornecedor.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!requireAuth(router)) return
    if (confirm('Deseja deletar este fornecedor?')) {
      try {
        await api.delete(`/api/fornecedor/${id}`)
        load()
      } catch (error: any) {
        if (!handleAuthError(error, router)) alert('Erro ao remover fornecedor.')
      }
    }
  }

  return (
    <CrudTable
      title="Fornecedor"
      data={data}
      columns={columns}
      idKey="id_fornecedor"
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
