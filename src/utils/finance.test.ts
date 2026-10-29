import { describe, expect, it } from 'vitest'
import type { Transaction } from '../types'
import {
  availableMonths,
  expensesByCategory,
  filterByMonth,
  getSummary,
  monthlyTotals,
  toCSV,
} from './finance'

const sample: Transaction[] = [
  { id: '1', description: 'Salario', amount: 1_000_000, type: 'income', category: 'Salario', date: '2026-09-01' },
  { id: '2', description: 'Alquiler', amount: 300_000, type: 'expense', category: 'Vivienda', date: '2026-09-02' },
  { id: '3', description: 'Súper', amount: 80_000, type: 'expense', category: 'Comida', date: '2026-09-10' },
  { id: '4', description: 'Salario', amount: 1_000_000, type: 'income', category: 'Salario', date: '2026-10-01' },
  { id: '5', description: 'Pizza', amount: 20_000, type: 'expense', category: 'Comida', date: '2026-10-05' },
]

describe('getSummary', () => {
  it('suma ingresos, gastos y calcula el balance', () => {
    const s = getSummary(sample)
    expect(s.income).toBe(2_000_000)
    expect(s.expenses).toBe(400_000)
    expect(s.balance).toBe(1_600_000)
    expect(s.savingsRate).toBeCloseTo(0.8)
  })

  it('no divide entre cero cuando no hay ingresos', () => {
    expect(getSummary([]).savingsRate).toBe(0)
  })
})

describe('expensesByCategory', () => {
  it('agrupa solo gastos y ordena de mayor a menor', () => {
    expect(expensesByCategory(sample)).toEqual([
      { category: 'Vivienda', total: 300_000 },
      { category: 'Comida', total: 100_000 },
    ])
  })
})

describe('monthlyTotals', () => {
  it('agrupa por mes en orden cronológico', () => {
    expect(monthlyTotals(sample)).toEqual([
      { month: '2026-09', income: 1_000_000, expenses: 380_000 },
      { month: '2026-10', income: 1_000_000, expenses: 20_000 },
    ])
  })
})

describe('filterByMonth y availableMonths', () => {
  it('filtra por mes y lista meses del más reciente al más antiguo', () => {
    expect(filterByMonth(sample, '2026-10')).toHaveLength(2)
    expect(filterByMonth(sample, 'all')).toHaveLength(5)
    expect(availableMonths(sample)).toEqual(['2026-10', '2026-09'])
  })
})

describe('toCSV', () => {
  it('genera encabezado y escapa comillas', () => {
    const csv = toCSV([{ ...sample[0], description: 'Pago "extra"' }])
    const [header, row] = csv.split('\n')
    expect(header).toContain('"Monto"')
    expect(row).toContain('"Pago ""extra"""')
  })
})
