'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api'
import CrudTable from '@/components/CrudTable'

export default function ServicosPage() {
  const [data, setData]                 = useState<any[]>([])
  const [projetos, setProjetos]         = useState<any[]>([]) 
  const [mecanicos, setMecanicos]       = useState<any[]>([]) 
  const [upgraderestomod, setUpgradeRestomod] = useState<any[]>([]) 
  const [editing, setEditing]           = useState<any | null>(null)
  const [creating, setCreating]         = useState(false)
  const [newItem, setNewItem]           = useState<any>({})

  // CORREÇÃO 1: Função load agora busca os serviços e aplica o escudo anti-crash
  const load = async () => {
    api.get('/api/projetos').then(r => setProjetos(r.data))
    api.get('/api/mecanicos').then(r => setMecanicos(r.data)) 
    api.get('/api/upgraderestomod').then(r => setUpgradeRestomod(r.data)) 

    try {
      const response = await api.get('/api/servicos') // (ou /api/servico dependendo da sua rota)
      
      // Tratamento anti-crash: Cria uma string segura para exibir na tabela
      const servicosTratados = response.data.map((servico: any) => ({
        ...servico,
        upgrade_nome: servico.upgrade_restomod?.sistema_alvo || 'Nenhum (Manutenção Padrão)'
      }))
      
      setData(servicosTratados)
    } catch (error) {
      console.error("Erro ao carregar serviços:", error)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (item: any) => {
    try {
      const mecanicoIds: number[] = item.id_mecanico || [];

      const servicoPayload = { ...item };
      
      // BLINDAGEM DE TIPOS: Evita Erro 400 no backend Go
      servicoPayload.horas_estimadas = Number(servicoPayload.horas_estimadas) || 0;
      servicoPayload.horas_realizadas = Number(servicoPayload.horas_realizadas) || 0;
      servicoPayload.valor = Number(servicoPayload.valor) || 0;
      servicoPayload.id_projeto = Number(servicoPayload.id_projeto) || 0;
      
      // Trata o campo opcional: Se estiver vazio, envia nulo pro banco aceitar a ausência
      servicoPayload.id_upgrade_restomod = servicoPayload.id_upgrade_restomod ? Number(servicoPayload.id_upgrade_restomod) : null;

      // Limpa lixo do frontend para não confundir o GORM
      delete servicoPayload.id_mecanico;
      delete servicoPayload.mecanicos; 
      delete servicoPayload.projeto;
      delete servicoPayload.upgrade_restomod;
      delete servicoPayload.upgrade_nome; // Remove o campo fake que criamos pro frontend

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
      alert("Erro ao salvar os dados. Verifique o console.");
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Deseja deletar este serviço? O banco bloqueará se houver peças usadas!')) {
      await api.delete(`/api/servicos/${id}`)
      load()
    }
  }

  const columns = [
    { key: 'id_servico',       label: 'ID', readOnly: true },
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
    
    // CORREÇÃO 2: Usa a key limpa (upgrade_nome) e mapeia os Upgrades corretamente!
    { 
      key: 'upgrade_nome', 
      label: 'Upgrade Relacionado (opcional)', 
      type: 'select' as const, 
      editKey: 'id_upgrade_restomod', 
      options: upgraderestomod.map(u => ({ label: u.sistema_alvo, value: u.id_upgrade_restomod})) 
    },

    {
      key: 'mecanico.titulo',
      label: 'Equipe (Mecânicos)',
      type: 'multi-select' as const,
      editKey: 'id_mecanico', 
      options: mecanicos.map(m => ({ label: m.nome, value: m.id_mecanico })),
      
      // Renderização em formato de balões organizados
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