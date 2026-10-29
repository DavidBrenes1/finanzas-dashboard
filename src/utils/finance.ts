// Funciones "puras": reciben datos y devuelven resultados, sin tocar React ni el navegador.
// Por eso son fáciles de probar (ver finance.test.ts).

import type { Category, Summary, Transaction } from '../types'

const currencyFormatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/** Formato corto para ejes de gráficos: ₡1,2 M, ₡350 k */
export function formatCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `₡${(value / 1_000_000).toFixed(1)} M`
  if (Math.abs(value) >= 1_000) return `₡${Math.round(value / 1_000)} k`
  return `₡${value}`
}

/** "2026-10-28" -> "2026-10" */
export function monthKey(date: string): string {
  return date.slice(0, 7)
}

/** "2026-10" -> "oct 2026" */
export function monthLabel(key: string, withYear = true): string {
  const [year, month] = key.split('-').map(Number)
  const d = new Date(year, month - 1, 1)
  return d.toLocaleDateString('es-CR', withYear ? { month: 'short', year: 'numeric' } : { month: 'short' })
}

export function filterByMonth(transactions: Transaction[], key: string | 'all'): Transaction[] {
  if (key === 'all') return transactions
  return transactions.filter((t) => monthKey(t.date) === key)
}

export function getSummary(transactions: Transaction[]): Summary {
  let income = 0
  let expenses = 0
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount
    else expenses += t.amount
  }
  const balance = income - expenses
  const savingsRate = income > 0 ? balance / income : 0
  return { income, expenses, balance, savingsRate }
}

/** Gastos agrupados por categoría, de mayor a menor */
export function expensesByCategory(transactions: Transaction[]): { category: Category; total: number }[] {
  const totals = new Map<Category, number>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
}

/** Ingresos y gastos por mes, en orden cronológico */
export function monthlyTotals(transactions: Transaction[]): { month: string; income: number; expenses: number }[] {
  const byMonth = new Map<string, { income: number; expenses: number }>()
  for (const t of transactions) {
    const key = monthKey(t.date)
    const entry = byMonth.get(key) ?? { income: 0, expenses: 0 }
    if (t.type === 'income') entry.income += t.amount
    else entry.expenses += t.amount
    byMonth.set(key, entry)
  }
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, v]) => ({ month, ...v }))
}

/** Meses disponibles, del más reciente al más antiguo */
export function availableMonths(transactions: Transaction[]): string[] {
  return [...new Set(transactions.map((t) => monthKey(t.date)))].sort().reverse()
}

/** Exporta a CSV; escapa comillas para que Excel lo abra sin problemas */
export function toCSV(transactions: Transaction[]): string {
  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const header = ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto']
  const rows = transactions.map((t) =>
    [t.date, t.description, t.category, t.type === 'income' ? 'Ingreso' : 'Gasto', t.amount].map(escape).join(','),
  )
  return [header.map(escape).join(','), ...rows].join('\n')
}

export function createId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}
