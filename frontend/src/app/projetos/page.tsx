'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function ProjetosPage() {
  const [data, setData]         = useState<any[]>([])
  const [editing, setEditing]   = useState<any | null>(null)
  const [cliente, setCliente]   = useState<any[]>([])
  const [oficina, setOficina]   = useState<any[]>([]) 
  const [veiculos, setVeiculos] = useState<any[]>([])   
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = async () => {
    try {
      const resProj = await api.get('/api/projetos')
      setData(resProj.data)
      const resCli = await api.get('/api/clientes')
      setCliente(resCli.data)
      const resOfi = await api.get('/api/oficinas')
      setOficina(resOfi.data)
      const resVei = await api.get('/api/veiculos')
      setVeiculos(resVei.data)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    try {
      // Blindagem para garantir que os IDs sejam enviados como números
      const payload = {
        ...item,
        orcamento_total: Number(item.orcamento_total) || 0,
        id_cliente: Number(item.id_cliente) || null,
        id_oficina: Number(item.id_oficina) || null,
        id_veiculo: Number(item.id_veiculo) || null,
      }

      // Limpa os objetos aninhados para não bugar o GORM no backend
      delete payload.cliente
      delete payload.oficina
      delete payload.veiculo

      if (item.id_projeto) {
        await api.put(`/api/projetos/${item.id_projeto}`, payload)
        setEditing(null)
      } else {
        await api.post('/api/projetos', payload)
        setCreating(false)
        setNewItem({})
      }
      load()
    } catch (error) {
      console.error("Erro ao salvar projeto:", error)
      alert("Erro ao salvar os dados.")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este projeto? Serviços e Históricos atrelados serão apagados!')) {
      await api.delete(`/api/projetos/${id}`)
      load()
    }
  }

  // ─── A MÁGICA DO FILTRO ACONTECE AQUI ─────────────────────────────────
  // Descobre qual cliente está selecionado no formulário atual (criando ou editando)
  const activeClientId = editing ? editing.id_cliente : (creating ? newItem.id_cliente : null);

  // Filtra os veículos para mostrar apenas os que pertencem ao cliente selecionado
  const veiculosDoCliente = activeClientId 
    ? veiculos.filter((v: any) => Number(v.id_cliente) === Number(activeClientId))
    : [];
  // ──────────────────────────────────────────────────────────────────────

  const columns = [
    { key: 'id_projeto',        label: 'ID', readOnly: true },
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
      options: cliente.map(m => ({ label: m.nome, value: m.id_cliente }))
    },

    {
      key: 'oficina.nome',
      label: 'Oficina responsável',
      type: 'select' as const,
      editKey: 'id_oficina',
      options: oficina.map(o => ({ label: o.nome, value: o.id_oficina }))
    },
    
    {
      key: 'veiculo.modelo',
      label: 'Veículo envolvido',
      type: 'select' as const,
      // BUG CORRIGIDO: Estava 'id_oficina', agora é 'id_veiculo'
      editKey: 'id_veiculo',
      
      // Usa a lista filtrada em vez da lista completa!
      // Adicionei a placa do lado do modelo para ficar mais fácil de identificar na interface
      options: veiculosDoCliente.map(v => ({ label: `${v.modelo} (${v.placa})`, value: v.id_veiculo }))
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