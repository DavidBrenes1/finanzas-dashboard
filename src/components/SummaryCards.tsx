import type { Summary } from '../types'
import { formatCurrency } from '../utils/finance'

interface Props {
  summary: Summary
  periodLabel: string
}

export function SummaryCards({ summary, periodLabel }: Props) {
  const balancePositive = summary.balance >= 0

  const items = [
    { label: 'Ingresos', value: formatCurrency(summary.income), dot: 'bg-income' },
    { label: 'Gastos', value: formatCurrency(summary.expenses), dot: 'bg-expense' },
    {
      label: 'Balance',
      value: formatCurrency(summary.balance),
      tone: balancePositive ? 'text-good' : 'text-critical',
      hint: balancePositive ? '▲ a favor' : '▼ en contra',
    },
    {
      label: 'Tasa de ahorro',
      value: `${Math.round(summary.savingsRate * 100)} %`,
      hint: 'del ingreso',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-line bg-surface p-4">
          <p className="flex items-center gap-2 text-sm text-ink-2">
            {item.dot && <span className={`size-2.5 rounded-full ${item.dot}`} aria-hidden />}
            {item.label}
          </p>
          <p className={`mt-1 truncate text-xl font-semibold sm:text-2xl ${item.tone ?? 'text-ink'}`}>{item.value}</p>
          <p className="mt-0.5 text-xs text-muted">
            {item.hint ? `${item.hint} · ` : ''}
            {periodLabel}
          </p>
        </div>
      ))}
    </div>
  )
}
