'use client'
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react'

interface Column {
  key: string
  label: string
  type?: 'text' | 'number' | 'date' | 'email'
}

interface CrudTableProps {
  title: string
  data: any[]
  columns: Column[]
  idKey: string
  onSave: (item: any) => void
  onDelete: (id: number) => void
  editing: any | null
  setEditing: (item: any | null) => void
  creating: boolean
  setCreating: (v: boolean) => void
  newItem: any
  setNewItem: (v: any) => void
}

export default function CrudTable({
  title, data, columns, idKey,
  onSave, onDelete,
  editing, setEditing,
  creating, setCreating,
  newItem, setNewItem,
}: CrudTableProps) {

  const inputStyle = {
    background: 'var(--bg-100)',
    border: '1px solid var(--border)',
    borderRadius: 5,
    padding: '6px 10px',
    color: 'var(--text)',
    fontSize: 13,
    width: '100%',
    outline: 'none',
  }

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 800, textTransform: 'uppercase' }}>{title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{data.length} registros</p>
        </div>
        <button
          onClick={() => { setCreating(true); setEditing(null) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--accent)', color: '#fff',
            border: 'none', borderRadius: 7, padding: '10px 18px',
            fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600,
            letterSpacing: '0.03em', cursor: 'pointer', textTransform: 'uppercase',
          }}>
          <Plus size={15} /> Novo
        </button>
      </div>

      {/* Tabela */}
      <div style={{ background: 'var(--bg-50)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {columns.map(c => (
                <th key={c.key} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: 'var(--font-display)', fontSize: 12,
                  fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: 'var(--text-muted)',
                }}>
                  {c.label}
                </th>
              ))}
              <th style={{ padding: '12px 16px', width: 80 }} />
            </tr>
          </thead>
          <tbody>

            {/* Linha de criação */}
            {creating && (
              <tr style={{ background: 'rgba(255,107,10,0.05)', borderBottom: '1px solid var(--border)' }}>
                {columns.map(c => (
                  <td key={c.key} style={{ padding: '10px 12px' }}>
                    <input
                      style={inputStyle}
                      type={c.type || 'text'}
                      placeholder={c.label}
                      value={newItem[c.key] || ''}
                      onChange={e => setNewItem({ ...newItem, [c.key]: e.target.value })}
                    />
                  </td>
                ))}
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => onSave(newItem)} style={{ ...iconBtn, color: 'var(--success)' }}><Check size={14} /></button>
                    <button onClick={() => setCreating(false)} style={{ ...iconBtn, color: 'var(--danger)' }}><X size={14} /></button>
                  </div>
                </td>
              </tr>
            )}

            {/* Linhas de dados */}
            {data.map((row, i) => (
              <tr key={row[idKey]} style={{
                borderBottom: i < data.length - 1 ? '1px solid var(--border)' : 'none',
                background: editing?.[idKey] === row[idKey] ? 'rgba(255,107,10,0.05)' : 'transparent',
                transition: 'background 0.15s',
              }}>
                {columns.map(c => (
                  <td key={c.key} style={{ padding: '10px 16px', color: 'var(--text)' }}>
                    {editing?.[idKey] === row[idKey] ? (
                      <input
                        style={inputStyle}
                        type={c.type || 'text'}
                        value={editing[c.key] || ''}
                        onChange={e => setEditing({ ...editing, [c.key]: e.target.value })}
                      />
                    ) : (
                      <span>{row[c.key] ?? '—'}</span>
                    )}
                  </td>
                ))}
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {editing?.[idKey] === row[idKey] ? (
                      <>
                        <button onClick={() => onSave(editing)} style={{ ...iconBtn, color: 'var(--success)' }}><Check size={14} /></button>
                        <button onClick={() => setEditing(null)} style={{ ...iconBtn, color: 'var(--danger)' }}><X size={14} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditing({ ...row }); setCreating(false) }} style={{ ...iconBtn, color: 'var(--text-muted)' }}><Pencil size={14} /></button>
                        <button onClick={() => onDelete(row[idKey])} style={{ ...iconBtn, color: 'var(--danger)' }}><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {data.length === 0 && !creating && (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const iconBtn: React.CSSProperties = {
  background: 'var(--bg-100)',
  border: '1px solid var(--border)',
  borderRadius: 5,
  padding: '5px 7px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.15s',
}
