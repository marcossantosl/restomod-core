'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function MecanicosPage() {
  const [data, setData]         = useState<any[]>([])
  const [oficinas, setOficinas] = useState<any[]>([])
  const [servicos, setServicos] = useState<any[]>([]) // 1. Novo estado para as oficinas
 // 1. Novo estado para as oficinas
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => {
    api.get('/api/mecanicos').then(r => setData(r.data))
    api.get('/api/oficinas').then(r => setOficinas(r.data))
    api.get('/api/servicos').then(r => setServicos(r.data))  // 2. Busca das oficinas adicionada aqui
  }
  
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    if (item.id_mecanico) {
      await api.put(`/api/mecanicos/${item.id_mecanico}`, item)
      setEditing(null)
    } else {
      await api.post('/api/mecanicos', item)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este mecânico?')) {
      await api.delete(`/api/mecanicos/${id}`)
      load()
    }
  }

  // 3. Array columns movido para dentro do componente para acessar o estado 'oficinas'
  const columns = [
    { key: 'id_mecanico',     label: 'ID' },
    { key: 'nome',          label: 'Nome' },
    { key: 'cpf',           label: 'CPF' },
    { key: 'especialidade', label: 'Especialidade' },
    { key: 'nivel',         label: 'Nível' },
    { 
      key: 'oficina.nome',  // Usado para exibição (renderiza via getValue)
      label: 'Oficina', 
      type: 'select' as const, // Força a tipagem exata
      editKey: 'id_oficina',   // Chave que será atualizada no JSON do backend
      options: oficinas.map(o => ({ label: o.nome, value: o.id_oficina })) // Opções mapeadas dinamicamente
    },
  ]

  return (
    <CrudTable
      title="Mecânicos"
      data={data} columns={columns} idKey="id_mecanico"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}