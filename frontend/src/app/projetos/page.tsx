'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function ProjetosPage() {
  const [data, setData]         = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [cliente, setCliente] = useState<any[]>([])
  const [oficina, setOficina] = useState<any[]>([])  
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => {
    api.get('/api/projetos').then(r => setData(r.data))
    api.get('/api/clientes').then(r => setCliente(r.data))
    api.get('/api/oficinas').then(r => setOficina(r.data))
  }

  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_projeto) {
      await api.put(`/api/projetos/${item.id_projeto}`, item)
      setEditing(null)
    } else {
      await api.post('/api/projetos', item)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este projeto?')) {
      await api.delete(`/api/projetos/${id}`)
      load()
    }
  }

  const columns = [
  { key: 'id_projeto',        label: 'ID',readOnly: true },
  { key: 'titulo',            label: 'Titulo' },
  { key: 'categoria_projeto', label: 'Categoria' },
  { key: 'data_inicio',       label: 'Início',   type: 'date' as const },
  { key: 'data_previsao',     label: 'Previsão', type: 'date' as const },
  { key: 'orcamento_total',   label: 'Orçamento', type: 'number' as const },
  
  {
   key: 'cliente.nome',
   label: 'Cliente destino',
   type: 'select' as const,
   editKey: 'id_cliente',
   options: cliente.map(m => ({label: m.nome, value: m.id_cliente}))
  },

  {
    key: 'oficina.nome',
   label: 'Oficina responsável',
   type: 'select' as const,
   editKey: 'id_oficina',
   options: oficina.map(m => ({label: m.nome, value: m.id_oficina}))
  }
  
]

  return (
    <CrudTable
      title="Projetos"
      data={data} columns={columns} idKey="id_projeto"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}
