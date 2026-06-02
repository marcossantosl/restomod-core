'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

const columns = [
  { key: 'id_upgrade_restomod',     label: 'ID',readOnly: true },
  { key: 'sistema_alvo',      label: 'Sistema Alvo' },
  { key: 'veiculo_doador',    label: 'Veiculo Doador'},
  { key: 'descricao_adaptacao', label: 'Descricao da Adaptacao' },
  { key: 'whp_final', label: 'WHP após upgrade', type: 'number' as const},
  { key: 'kgfm_final', label: 'Torque após upgrade',type: 'number' as const},
  { key: 'data_upgrade', label: 'Data do upgrade', type: 'date' as const },
]

export default function UpgradeRestomodPage() {
  const [data, setData]       = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem] = useState<any>({})

  const load = () => api.get('/api/upgraderestomod').then(r => setData(r.data))
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_cliente) {
      await api.put(`/api/upgraderestomod/${item.id_cliente}`, item)
      setEditing(null)
    } else {
      await api.post('/api/upgraderestomod', item)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este item?')) {
      await api.delete(`/api/upgraderestomod/${id}`)
      load()
    }
  }

  return (
    <CrudTable
      title="Upgrade Restomod"
      data={data}
      columns={columns}
      idKey="id_upgrade_restomod"
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
