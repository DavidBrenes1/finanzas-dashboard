import type { Category, TransactionType } from '../types'

export const INCOME_CATEGORIES: Category[] = ['Salario', 'Freelance', 'Otros']

export const EXPENSE_CATEGORIES: Category[] = [
  'Comida',
  'Transporte',
  'Vivienda',
  'Servicios',
  'Entretenimiento',
  'Salud',
  'Educación',
  'Otros',
]

export function categoriesFor(type: TransactionType): Category[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

export const CATEGORY_ICONS: Record<Category, string> = {
  Salario: '💼',
  Freelance: '💻',
  Comida: '🍽️',
  Transporte: '🚌',
  Vivienda: '🏠',
  Servicios: '💡',
  Entretenimiento: '🎬',
  Salud: '🩺',
  Educación: '📚',
  Otros: '📦',
}
