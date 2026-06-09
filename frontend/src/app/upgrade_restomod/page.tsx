'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function UpgradeRestomodPage() {
  const [data, setData]       = useState<any[]>([])
   const [projetos, setProjetos] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem] = useState<any>({})

  const load = () => {
    api.get('/api/upgraderestomod').then(r => setData(r.data))
     api.get('/api/projetos').then(r => setProjetos(r.data))
  }
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_cliente) {
      await api.put(`/api/upgraderestomod/${item.id_upgrade_restomod}`, item)
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


const columns = [
  { key: 'id_upgrade_restomod',     label: 'ID',readOnly: true },
  { key: 'sistema_alvo',      label: 'Sistema Alvo' },
  { key: 'veiculo_doador',    label: 'Veiculo Doador'},
  { key: 'descricao_adaptacao', label: 'Descricao da Adaptacao' },
  { key: 'whp_final', label: 'WHP após upgrade'},
  { key: 'kgfm_final', label: 'Torque após upgrade'},
  { key: 'data_upgrade_inicio', label: 'Data do upgrade Inicio', type: 'date' as const },
  { key: 'data_upgrade_fim', label: 'Data do upgrade Fim', type: 'date' as const },

   {  key: 'projeto.titulo',
   label: 'Projeto relacionado',
  type: 'select' as const,
   editKey: 'id_projeto',
   options: projetos.map(p => ({label: p.titulo, value: p.id_projeto}))
  }
]

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
