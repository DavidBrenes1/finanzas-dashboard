// Datos de ejemplo para que el dashboard no se vea vacío la primera vez.
// Se generan para los últimos 6 meses a partir de hoy.

import type { Budgets, Category, Transaction } from '../types'

const pad = (n: number) => String(n).padStart(2, '0')

function dateIn(monthsAgo: number, day: number): string {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
  // En el mes actual no creamos fechas en el futuro
  const maxDay = monthsAgo === 0 ? now.getDate() : 28
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(Math.min(day, maxDay))}`
}

type Template = [description: string, category: Category, base: number, day: number]

const MONTHLY_EXPENSES: Template[] = [
  ['Alquiler apartamento', 'Vivienda', 320_000, 1],
  ['Supermercado', 'Comida', 95_000, 4],
  ['Electricidad y agua', 'Servicios', 38_000, 6],
  ['Internet y celular', 'Servicios', 32_000, 7],
  ['Tarjeta de bus', 'Transporte', 28_000, 8],
  ['Almuerzos', 'Comida', 54_000, 15],
  ['Curso online de React', 'Educación', 18_000, 12],
  ['Cine y salidas', 'Entretenimiento', 35_000, 20],
  ['Uber', 'Transporte', 16_000, 22],
  ['Farmacia', 'Salud', 14_000, 25],
]

export function createSeedTransactions(): Transaction[] {
  const list: Transaction[] = []
  let n = 0
  for (let m = 5; m >= 0; m--) {
    // Variación determinística (siempre igual) para que el gráfico tenga "vida"
    const wobble = (i: number) => 1 + (((m * 7 + i * 3) % 9) - 4) / 20

    list.push({ id: `seed-${n++}`, description: 'Salario mensual', amount: 1_150_000, type: 'income', category: 'Salario', date: dateIn(m, 1) })
    if (m % 2 === 0) {
      list.push({ id: `seed-${n++}`, description: 'Proyecto freelance', amount: 180_000 + m * 15_000, type: 'income', category: 'Freelance', date: dateIn(m, 18) })
    }
    MONTHLY_EXPENSES.forEach(([description, category, base, day], i) => {
      list.push({ id: `seed-${n++}`, description, amount: Math.round((base * wobble(i)) / 500) * 500, type: 'expense', category, date: dateIn(m, day) })
    })
  }
  return list.sort((a, b) => b.date.localeCompare(a.date))
}

export const SEED_BUDGETS: Budgets = {
  Comida: 150_000,
  Transporte: 45_000,
  Entretenimiento: 30_000,
  Servicios: 75_000,
}
