'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function InspecaoPage() {
  const [data, setData]         = useState<any[]>([])
  const [mecanicos, setMecanicos] = useState<any[]>([])
  const [veiculos, setVeiculos] = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => {
    api.get('/api/inspecao').then(r => setData(r.data))
    api.get('/api/veiculos').then(r => setVeiculos(r.data))
    api.get('/api/mecanicos').then(r => setMecanicos(r.data))
  }
  
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    // BLINDAGEM: Garante que os dados vão limpos para o GORM não dar Bad Request
    const payload = {
      ...item,
      id_inspecao: item.id_inspecao ? Number(item.id_inspecao) : undefined,
      id_veiculo: item.id_veiculo ? Number(item.id_veiculo) : null,
      id_mecanico: item.id_mecanico ? Number(item.id_mecanico) : null,
      data_inspecao: item.data_inspecao || '',
      tipo: item.tipo || '',
      resultado: item.resultado || '',
      observacoes: item.observacoes || ''
    }

    // CORREÇÃO: Testando o id correto (id_inspecao)
    if (item.id_inspecao) {
      await api.put(`/api/inspecao/${item.id_inspecao}`, payload)
      setEditing(null)
    } else {
      await api.post('/api/inspecao', payload)
      setCreating(false)
      setNewItem({})
    }
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar esta inspeção?')) {
      await api.delete(`/api/inspecao/${id}`)
      load()
    }
  }

  const columns = [
    { key: 'id_inspecao',   label: 'ID', readOnly: true },
    { key: 'data_inspecao', label: 'Data', type: 'date' as const },
    { key: 'tipo',          label: 'Tipo de Inspeção' },
    { key: 'resultado',     label: 'Resultado geral' },
    { key: 'observacoes',   label: 'Observações' },
    
    { 
      key: 'veiculo.modelo',
      label: 'Veículo Inspecionado',
      type: 'select' as const,
      editKey: 'id_veiculo',
      // CORREÇÃO: Usando a lista de veiculos e a chave placa
      options: veiculos.map(v => ({ label: v.placa, value: v.id_veiculo }))
    },
    {
      key: 'mecanico.nome',
      label: 'Mecânico',
      type: 'select' as const,
      editKey: 'id_mecanico',
      // CORREÇÃO: Usando a lista de mecanicos e a chave nome
      options: mecanicos.map(m => ({ label: m.nome, value: m.id_mecanico }))
    }
  ]

  return (
    <CrudTable
      title="Inspeção do veículo"
      data={data} columns={columns} idKey="id_inspecao"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}