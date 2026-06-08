'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function ServicosPage() {
  const [data, setData]         = useState<any[]>([])
  const [projetos, setProjetos] = useState<any[]>([]) 
  const [mecanicos, setMecanicos] = useState<any[]>([]) 
  const [editing, setEditing]   = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [newItem, setNewItem]   = useState<any>({})

  const load = () => {
    api.get('/api/servicos').then(r => setData(r.data))
    api.get('/api/projetos').then(r => setProjetos(r.data))
    api.get('/api/mecanicos').then(r => setMecanicos(r.data)) 
  }
  
  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    try {
      const mecanicoIds: number[] = item.id_mecanico || [];

      const servicoPayload = { ...item };
      delete servicoPayload.id_mecanico;
      delete servicoPayload.mecanicos; 

      let idServico = item.id_servico;

      if (idServico) {
        await api.put(`/api/servicos/${idServico}`, servicoPayload);
        setEditing(null);
        await api.delete(`/api/mecanicoservico/limpar?id_servico=${idServico}`);
      } else {
        const response = await api.post('/api/servicos', servicoPayload);
        idServico = response.data.id_servico;
        setCreating(false);
        setNewItem({});
      }

      if (idServico && mecanicoIds.length > 0) {
        const promises = mecanicoIds.map(idMec => 
          api.post('/api/mecanicoservico', {
            id_servico: Number(idServico),
            id_mecanico: Number(idMec)
          })
        );
        await Promise.all(promises);
      }

      load();
    } catch (error) {
      console.error("Erro ao salvar serviço e relacionamentos:", error);
      alert("Erro ao salvar os dados.");
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este serviço?')) {
      await api.delete(`/api/servicos/${id}`)
      load()
    }
  }


  const columns = [
      { key: 'id_servico',     label: 'ID',readOnly: true},
    { key: 'categoria',        label: 'Categoria' },
    { key: 'descricao',        label: 'Descrição' },
    { key: 'horas_estimadas',  label: 'Hrs Est.', type: 'number' as const },
    { key: 'horas_realizadas', label: 'Hrs Real.', type: 'number' as const },
    { key: 'valor',            label: 'Valor R$',  type: 'number' as const },
    
    { 
      key: 'projeto.titulo', 
      label: 'Projeto', 
      type: 'select' as const, 
      editKey: 'id_projeto', 
      options: projetos.map(o => ({ label: o.titulo, value: o.id_projeto})) 
    },

    {
      key: 'mecanico.titulo',
      label: 'Equipe (Mecânicos)',
      type: 'multi-select' as const,
      editKey: 'id_mecanico', 
      options: mecanicos.map(m => ({ label: m.nome, value: m.id_mecanico })),
      
      // AJUSTE DE DESIGN: Renderização em formato de balões organizados
      render: (row: any) => {
        if (!row.mecanicos || row.mecanicos.length === 0) {
          return <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Nenhum</span>
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {row.mecanicos.map((m: any) => (
              <span 
                key={m.id_mecanico} 
                style={{
                  background: 'var(--bg-100)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 500,
                  display: 'inline-block',
                  whiteSpace: 'nowrap'
                }}
              >
                {m.nome}
              </span>
            ))}
          </div>
        )
      }
    }
  ]

  return (
    <CrudTable
      title="Serviços"
      data={data} columns={columns} idKey="id_servico"
      onSave={handleSave} onDelete={handleDelete}
      editing={editing} setEditing={setEditing}
      creating={creating} setCreating={setCreating}
      newItem={newItem} setNewItem={setNewItem}
    />
  )
}