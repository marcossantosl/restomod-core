'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function VeiculosPage() {
  const [data, setData]         = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  
  // CORREÇÃO 1: Iniciar como um array vazio para não quebrar o .map()
  const [clientes, setClientes] = useState<any[]>([]) 
  
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  // CORREÇÃO 2: Melhor uso de async/await no load para evitar que as requisições se atropelem
  const load = async () => {
    try {
      const resVeiculos = await api.get('/api/veiculos')
      setData(resVeiculos.data)
      
      const resClientes = await api.get('/api/clientes')
      setClientes(resClientes.data)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  } 
  
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    try {
      // CORREÇÃO 3: Blindagem de tipos. Converte strings do HTML para números no Banco
      const payload = {
        ...item,
        ano_fabricacao: Number(item.ano_fabricacao) || 0,
        whp_original: Number(item.whp_original) || 0,
        kgfm_original: Number(item.kgfm_original) || 0,
        id_cliente: Number(item.id_cliente) || null, 
      }

      // Limpa o objeto aninhado para evitar que o GORM tente salvar um cliente fantasma
      delete payload.cliente

      if (item.id_veiculo) {
        await api.put(`/api/veiculos/${item.id_veiculo}`, payload)
        setEditing(null)
      } else {
        await api.post('/api/veiculos', payload)
        setCreating(false)
        setNewItem({})
      }
      
      load()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao salvar veículo.")
    }
  }

  const handleDelete = async (id: number) => {
    // Alerta útil lembrando a regra do CASCADE que configuramos no banco
    if (confirm('Deseja deletar este veículo? Projetos e Históricos atrelados a ele também serão excluídos pelo banco.')) {
      await api.delete(`/api/veiculos/${id}`)
      load()
    }
  }

  const columns = [
    { key: 'id_veiculo',     label: 'ID', readOnly: true },
    { key: 'marca',          label: 'Marca' },
    { key: 'modelo',         label: 'Modelo' },
    { key: 'ano_fabricacao', label: 'Ano', type: 'number' as const },
    { key: 'chassi',         label: 'Chassi' },
    { key: 'placa',          label: 'Placa' },
    { key: 'status',         label: 'Status' },
    { key: 'categoria',      label: 'Categoria' },
    { key: 'whp_original',   label: 'WHP', type: 'number' as const },
    { key: 'kgfm_original',  label: 'KGFM', type: 'number' as const },
    {
      key: 'cliente.nome',  
      label: 'Dono (Cliente)',
      type: 'select' as const,
      editKey: 'id_cliente',
      // Agora o map roda em segurança!
      options: clientes.map((v: any) => ({ label: v.nome, value: v.id_cliente }))
    }
  ]

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