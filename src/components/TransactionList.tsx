import { useMemo, useState } from 'react'
import { CATEGORY_ICONS } from '../data/categories'
import type { Transaction, TransactionType } from '../types'
import { formatCurrency } from '../utils/finance'

interface Props {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

const PAGE_SIZE = 8

export function TransactionList({ transactions, onDelete }: Props) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<TransactionType | 'all'>('all')
  const [visible, setVisible] = useState(PAGE_SIZE)

  // useMemo: solo recalcula el filtro cuando cambian sus dependencias
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return transactions.filter(
      (t) =>
        (type === 'all' || t.type === type) &&
        (!q || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)),
    )
  }, [transactions, query, type])

  const shown = filtered.slice(0, visible)

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setVisible(PAGE_SIZE)
          }}
          placeholder="Buscar…"
          aria-label="Buscar movimientos"
          className="min-w-0 flex-1 rounded-lg border border-line bg-page px-3 py-2 text-sm text-ink outline-none focus:border-brand"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType | 'all')}
          aria-label="Filtrar por tipo"
          className="shrink-0 rounded-lg border border-line bg-page px-3 py-2 text-sm text-ink outline-none focus:border-brand"
        >
          <option value="all">Todos</option>
          <option value="income">Ingresos</option>
          <option value="expense">Gastos</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">No hay movimientos que coincidan.</p>
      ) : (
        <ul className="divide-y divide-line">
          {shown.map((t) => (
            <li key={t.id} className="group flex items-center gap-3 py-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-page text-base" aria-hidden>
                {CATEGORY_ICONS[t.category]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{t.description}</p>
                <p className="text-xs text-muted">
                  {t.category} · {new Date(`${t.date}T12:00:00`).toLocaleDateString('es-CR', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <span className={`tabular text-sm font-semibold ${t.type === 'income' ? 'text-good' : 'text-ink'}`}>
                {t.type === 'income' ? '+' : '−'}
                {formatCurrency(t.amount)}
              </span>
              <button
                onClick={() => onDelete(t.id)}
                aria-label={`Eliminar ${t.description}`}
                className="rounded-md p-1.5 text-muted opacity-60 transition hover:bg-page hover:text-critical group-hover:opacity-100 focus:opacity-100"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {visible < filtered.length && (
        <button
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="mt-3 w-full rounded-lg border border-line py-2 text-sm font-medium text-ink-2 hover:bg-page"
        >
          Ver más ({filtered.length - visible} restantes)
        </button>
      )}
    </div>
  )
}
