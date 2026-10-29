// Tipos centrales de la app. TypeScript nos avisa si usamos mal cualquier dato.

export type TransactionType = 'income' | 'expense'

export type Category =
  | 'Salario'
  | 'Freelance'
  | 'Comida'
  | 'Transporte'
  | 'Vivienda'
  | 'Servicios'
  | 'Entretenimiento'
  | 'Salud'
  | 'Educación'
  | 'Otros'

export interface Transaction {
  id: string
  description: string
  amount: number // siempre positivo; el tipo indica si suma o resta
  type: TransactionType
  category: Category
  date: string // formato ISO: "2026-10-28"
}

/** Límite mensual de gasto por categoría */
export type Budgets = Partial<Record<Category, number>>

export interface Summary {
  income: number
  expenses: number
  balance: number
  savingsRate: number // 0..1
}
