'use client'
import { useState, useRef, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, Check, Search, ChevronDown, CheckSquare, Square } from 'lucide-react'

interface Column {
  key: string
  label: string
  type?: 'text' | 'number' | 'date' | 'email' | 'select' | 'multi-select'
  editKey?: string
  options?: { label: string, value: string | number }[]
  render?: (row: any) => React.ReactNode 
  readOnly?: boolean
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

// --- Select Simples (1:N) ---
function SearchableSelect({ options, value, onChange }: { options: any[], value: any, onChange: (val: any) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
  const selectedLabel = options.find(opt => opt.value === value)?.label || "Selecione..."

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={selectBoxStyle}>
        <span style={truncateStyle}>{selectedLabel}</span> <ChevronDown size={14} />
      </div>
      {isOpen && (
        <div style={dropdownMenuDiv}>
          <div style={searchInputWrapper}>
            <Search size={14} color="var(--text-muted)" />
            <input autoFocus type="text" placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} style={searchInputStyle} />
          </div>
          <div style={{ maxHeight: 180, overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? filteredOptions.map(opt => (
              <div key={opt.value} onClick={(e) => { e.stopPropagation(); onChange(opt.value); setIsOpen(false); setSearch('') }}
                style={{ ...optionItemStyle, background: value === opt.value ? 'var(--accent)' : 'transparent', color: value === opt.value ? '#fff' : 'var(--text)' }}
                onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = 'rgba(255,107,10,0.1)' }}
                onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.background = 'transparent' }}
              >
                {opt.label}
              </div>
            )) : <div style={noResultStyle}>Nenhum resultado</div>}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Multi-Select (N:N) ---
function MultiSearchableSelect({ options, value = [], onChange }: { options: any[], value: any[], onChange: (val: any[]) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()))
  const safeValue = Array.isArray(value) ? value : []
  const labelText = safeValue.length > 0 ? `${safeValue.length} selecionado(s)` : "Selecione..."

  const toggleOption = (optValue: any) => {
    if (safeValue.includes(optValue)) onChange(safeValue.filter(v => v !== optValue))
    else onChange([...safeValue, optValue])
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div onClick={() => setIsOpen(!isOpen)} style={selectBoxStyle}>
        <span style={truncateStyle}>{labelText}</span> <ChevronDown size={14} />
      </div>
      {isOpen && (
        <div style={dropdownMenuDiv}>
          <div style={searchInputWrapper}>
            <Search size={14} color="var(--text-muted)" />
            <input autoFocus type="text" placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} style={searchInputStyle} />
          </div>
          <div style={{ maxHeight: 180, overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? filteredOptions.map(opt => {
              const isSelected = safeValue.includes(opt.value)
              return (
                <div key={opt.value} onClick={(e) => { e.stopPropagation(); toggleOption(opt.value); }}
                  style={{ ...optionItemStyle, display: 'flex', alignItems: 'center', gap: 8, background: isSelected ? 'rgba(255,107,10,0.05)' : 'transparent' }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,107,10,0.1)' }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                >
                  {isSelected ? <CheckSquare size={14} color="var(--accent)" /> : <Square size={14} color="var(--text-muted)" />}
                  {opt.label}
                </div>
              )
            }) : <div style={noResultStyle}>Nenhum resultado</div>}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CrudTable({
  title, data, columns, idKey,
  onSave, onDelete,
  editing, setEditing,
  creating, setCreating,
  newItem, setNewItem,
}: CrudTableProps) {

  const inputStyle = {
    background: 'var(--bg-100)', border: '1px solid var(--border)', borderRadius: 5,
    padding: '6px 10px', color: 'var(--text)', fontSize: 13, width: '100%', outline: 'none',
  }

  const getValue = (row: any, key: string) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.')
      return row[parent]?.[child] ?? '—'
    }
    return row[key] ?? '—'
  }

  const renderInput = (c: Column, itemState: any, setItemState: any) => {
    const valKey = c.editKey || c.key
    
    if (c.type === 'select' && c.options) {
      return <SearchableSelect options={c.options} value={itemState[valKey]} onChange={(val) => setItemState({ ...itemState, [valKey]: val })} />
    } 
    if (c.type === 'multi-select' && c.options) {
      return <MultiSearchableSelect options={c.options} value={itemState[valKey]} onChange={(val) => setItemState({ ...itemState, [valKey]: val })} />
    }
    
    return (
      <input
        style={{
          ...inputStyle,
          ...(c.readOnly ? { 
            background: 'rgba(0, 0, 0, 0.2)', 
            cursor: 'not-allowed', 
            color: 'var(--text-muted)',
            borderColor: 'transparent'
          } : {})
        }}
        type={c.type || 'text'}
        placeholder={c.readOnly ? 'Auto' : c.label}
        value={itemState[c.key] || ''}
        disabled={c.readOnly}
        onChange={e => setItemState({ ...itemState, [c.key]: c.type === 'number' ? Number(e.target.value) : e.target.value })}
      />
    )
  }

  return (
    <div className="fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 42, fontWeight: 800, textTransform: 'uppercase' }}>{title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{data.length} registros</p>
        </div>
        <button onClick={() => { setCreating(true); setEditing(null) }} style={btnNovoStyle}>
          <Plus size={15} /> Novo
        </button>
      </div>

      <div style={{ background: 'var(--bg-50)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'visible' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {columns.map(c => (<th key={c.key} style={thStyle}>{c.label}</th>))}
              <th style={{ padding: '12px 16px', width: 80 }} />
            </tr>
          </thead>
          <tbody>

            {creating && (
              <tr style={{ background: 'rgba(255,107,10,0.05)', borderBottom: '1px solid var(--border)' }}>
                {columns.map(c => (
                  <td key={c.key} style={{ padding: '10px 12px' }}>
                    {renderInput(c, newItem, setNewItem)}
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

            {data.map((row, i) => (
              <tr key={row[idKey]} style={{ borderBottom: i < data.length - 1 ? '1px solid var(--border)' : 'none', background: editing?.[idKey] === row[idKey] ? 'rgba(255,107,10,0.05)' : 'transparent', transition: 'background 0.15s' }}>
                {columns.map(c => (
                  <td key={c.key} style={{ padding: '10px 16px', color: 'var(--text)' }}>
                    {editing?.[idKey] === row[idKey] 
                      ? renderInput(c, editing, setEditing) 
                      : (c.render ? c.render(row) : <span>{getValue(row, c.key)}</span>)
                    }
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
                        <button onClick={() => { 
                          // EXTRAÇÃO INTELIGENTE: A própria tabela busca os objetos aninhados e converte para IDs
                          const editData = { ...row };
                          columns.forEach(c => {
                            if (c.type === 'multi-select' && c.editKey) {
                              const arrayProp = Object.keys(row).find(k => Array.isArray(row[k]) && row[k].length > 0 && row[k][0][c.editKey]);
                              if (arrayProp) {
                                editData[c.editKey] = row[arrayProp].map((item: any) => item[c.editKey]);
                              } else if (Array.isArray(row.mecanicos) && c.editKey === 'id_mecanico') {
                                editData[c.editKey] = row.mecanicos.map((m: any) => m.id_mecanico);
                              } else {
                                editData[c.editKey] = [];
                              }
                            }
                          });
                          setEditing(editData);
                          setCreating(false);
                        }} style={{ ...iconBtn, color: 'var(--text-muted)' }}><Pencil size={14} /></button>
                        <button onClick={() => onDelete(row[idKey])} style={{ ...iconBtn, color: 'var(--danger)' }}><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const btnNovoStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 7, padding: '10px 18px', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase' }
const thStyle: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }
const iconBtn: React.CSSProperties = { background: 'var(--bg-100)', border: '1px solid var(--border)', borderRadius: 5, padding: '5px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.15s' }
const selectBoxStyle: React.CSSProperties = { background: 'var(--bg-100)', border: '1px solid var(--border)', borderRadius: 5, padding: '6px 10px', color: 'var(--text)', fontSize: 13, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
const truncateStyle: React.CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
const dropdownMenuDiv: React.CSSProperties = { position: 'absolute', top: '100%', left: 0, width: '100%', background: 'var(--bg-50)', border: '1px solid var(--border)', borderRadius: 5, marginTop: 4, zIndex: 50, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }
const searchInputWrapper: React.CSSProperties = { padding: 8, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6 }
const searchInputStyle: React.CSSProperties = { border: 'none', background: 'transparent', outline: 'none', color: 'var(--text)', fontSize: 13, width: '100%' }
const optionItemStyle: React.CSSProperties = { padding: '8px 10px', fontSize: 13, cursor: 'pointer' }
const noResultStyle: React.CSSProperties = { padding: '8px 10px', fontSize: 13, color: 'var(--text-muted)' }