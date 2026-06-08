'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

const columns = [
  { key: 'id_veiculo',     label: 'ID',readOnly: true },
  { key: 'marca',          label: 'Marca' },
  { key: 'modelo',         label: 'Modelo' },
  { key: 'ano_fabricacao', label: 'Ano', type: 'number' as const },
  { key: 'chassi',         label: 'Chassi' },
  { key: 'placa',         label: 'Placa' },
  { key: 'status',         label: 'Status' },
  { key: 'categoria',      label: 'Categoria' },
  { key: 'whp_original',   label: 'WHP', type: 'number' as const },
  { key: 'kgfm_original',  label: 'KGFM', type: 'number' as const },
]

export default function VeiculosPage() {
  const [data, setData]         = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => api.get('/api/veiculos').then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_veiculo) {
      await api.put(`/api/veiculos/${item.id_veiculo}`, item)
      setEditing(null)
    } else {
      await api.post('/api/veiculos', item)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este veículo?')) {
      await api.delete(`/api/veiculos/${id}`)
      load()
    }
  }

  return (
    <CrudTable
      title="Veículos"
      data={data} columns={columns} idKey="id_veiculo"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}
