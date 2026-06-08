'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function HistoricoProjetoPage() {
  const [data, setData]         = useState<any[]>([])
  const [projetos, setProjetos] = useState<any[]>([])
  const [veiculos, setVeiculos] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem] = useState<any>({})

  const load = () => {
  api.get('/api/historicoprojeto').then(r => setData(r.data))
  api.get('/api/veiculos').then(r => setVeiculos(r.data))
  api.get('/api/projetos').then(r => setProjetos(r.data))
  }
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_historico) {
      await api.put(`/api/historicoprojeto/${item.id_historico}`, item)
      setEditing(null)
    } else {
      await api.post('/api/historicoprojeto', item)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este histórico?')) {
      await api.delete(`/api/historicoprojeto/${id}`)
      load()
    }
  }

const columns = [
  { key: 'id_historico',     label: 'ID', readOnly: true },
  { key: 'status',     label: 'Status Projeto' },
  { key: 'data',      label: 'Data Histórico',  type: 'date' as const },
  { key: 'km_registrado',    label: 'KM Registrado', type: 'number' as const },
  { key: 'tipo_servico', label: 'Tipo de Serviço' },
  { key: 'descricao', label: 'Descrição' },
    {  key: 'projeto.titulo',
   label: 'Projeto relacionado',
  type: 'select' as const,
   editKey: 'id_projeto',
   options: projetos.map(p => ({label: p.titulo, value: p.id_projeto}))
  },

    {
    key: 'veiculo.modelo',
   label: 'Veículo',
    type: 'select' as const,
    editKey: 'id_veiculo',
    options: veiculos.map(v => ({label: v.placa, value: v.id_veiculo}))
   }
]

  return (
    <CrudTable
      title="Histórico de Projetos"
      data={data} columns={columns} idKey="id_historico"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}
