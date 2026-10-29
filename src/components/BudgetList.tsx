import { useState } from 'react'
import { CATEGORY_ICONS, EXPENSE_CATEGORIES } from '../data/categories'
import type { Budgets, Category } from '../types'
import { formatCurrency } from '../utils/finance'

interface Props {
  budgets: Budgets
  spent: Partial<Record<Category, number>>
  onChange: (category: Category, amount: number | null) => void
  isMonthSelected: boolean
}

/** Estado del presupuesto: color + ícono + texto (nunca solo color) */
function status(ratio: number) {
  if (ratio >= 1) return { bar: 'bg-critical', text: 'text-critical', icon: '⛔', label: 'Excedido' }
  if (ratio >= 0.8) return { bar: 'bg-warning', text: 'text-ink-2', icon: '⚠️', label: 'Cerca del límite' }
  return { bar: 'bg-good', text: 'text-good', icon: '✓', label: 'En orden' }
}

export function BudgetList({ budgets, spent, onChange, isMonthSelected }: Props) {
  const [adding, setAdding] = useState<Category | ''>('')
  const [amount, setAmount] = useState('')

  const entries = Object.entries(budgets) as [Category, number][]
  const available = EXPENSE_CATEGORIES.filter((c) => !(c in budgets))

  function save() {
    if (!adding || Number(amount) <= 0) return
    onChange(adding, Math.round(Number(amount)))
    setAdding('')
    setAmount('')
  }

  return (
    <div className="space-y-4">
      {!isMonthSelected && (
        <p className="rounded-lg bg-page px-3 py-2 text-xs text-ink-2">
          Los presupuestos son mensuales. Elige un mes arriba para ver el avance real.
        </p>
      )}

      {entries.length === 0 && <p className="text-sm text-muted">Todavía no tienes presupuestos.</p>}

      <ul className="space-y-4">
        {entries.map(([category, limit]) => {
          const used = spent[category] ?? 0
          const ratio = limit > 0 ? used / limit : 0
          const s = status(ratio)
          return (
            <li key={category}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="text-ink">
                  <span aria-hidden>{CATEGORY_ICONS[category]}</span> {category}
                </span>
                <button
                  onClick={() => onChange(category, null)}
                  className="text-xs text-muted hover:text-critical"
                  aria-label={`Quitar presupuesto de ${category}`}
                >
                  Quitar
                </button>
              </div>
              <div
                className="h-2.5 w-full overflow-hidden rounded-full bg-page"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={limit}
                aria-valuenow={Math.min(used, limit)}
                aria-label={`${category}: ${Math.round(ratio * 100)} % usado`}
              >
                <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${Math.min(100, ratio * 100)}%` }} />
              </div>
              <p className="mt-1 flex justify-between text-xs">
                <span className={s.text}>
                  {s.icon} {s.label}
                </span>
                <span className="tabular text-muted">
                  {formatCurrency(used)} / {formatCurrency(limit)}
                </span>
              </p>
            </li>
          )
        })}
      </ul>

      {available.length > 0 && (
        <div className="flex gap-2 border-t border-line pt-4">
          <select
            value={adding}
            onChange={(e) => setAdding(e.target.value as Category)}
            aria-label="Categoría del presupuesto"
            className="min-w-0 flex-1 rounded-lg border border-line bg-page px-2 py-2 text-sm text-ink"
          >
            <option value="">Nueva categoría…</option>
            {available.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="₡ límite"
            aria-label="Límite mensual"
            className="tabular w-28 rounded-lg border border-line bg-page px-2 py-2 text-sm text-ink"
          />
          <button
            onClick={save}
            disabled={!adding || Number(amount) <= 0}
            className="rounded-lg bg-brand px-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
