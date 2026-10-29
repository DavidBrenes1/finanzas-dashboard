import type { Category } from '../types'
import { CATEGORY_ICONS } from '../data/categories'
import { formatCurrency } from '../utils/finance'

interface Props {
  data: { category: Category; total: number }[]
}

/**
 * Gasto por categoría como barras horizontales ordenadas.
 * Se hace con HTML + Tailwind (sin librería) para mostrar que no todo necesita un paquete.
 * Un solo color: aquí importa la magnitud, no la identidad.
 */
export function CategoryChart({ data }: Props) {
  if (data.length === 0) return <p className="py-16 text-center text-sm text-muted">Sin gastos en este periodo.</p>

  const max = data[0].total
  const total = data.reduce((sum, d) => sum + d.total, 0)

  return (
    <ul className="space-y-3">
      {data.map((d) => {
        const share = Math.round((d.total / total) * 100)
        return (
          <li key={d.category} title={`${d.category}: ${formatCurrency(d.total)} (${share} %)`}>
            <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
              <span className="text-ink">
                <span aria-hidden>{CATEGORY_ICONS[d.category]}</span> {d.category}
              </span>
              <span className="tabular text-ink-2">
                {formatCurrency(d.total)} <span className="text-muted">· {share} %</span>
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-page" aria-hidden>
              <div className="h-full rounded-full bg-expense" style={{ width: `${Math.max(2, (d.total / max) * 100)}%` }} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
