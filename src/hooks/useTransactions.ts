import { useCallback } from 'react'
import { createSeedTransactions, SEED_BUDGETS } from '../data/seed'
import type { Budgets, Category, Transaction } from '../types'
import { createId } from '../utils/finance'
import { useLocalStorage } from './useLocalStorage'

/**
 * Custom hook: concentra toda la lógica de datos en un solo lugar.
 * Los componentes solo llaman a estas funciones, sin saber cómo se guardan los datos.
 */
export function useTransactions() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('fd:transactions', createSeedTransactions)
  const [budgets, setBudgets] = useLocalStorage<Budgets>('fd:budgets', SEED_BUDGETS)

  const addTransaction = useCallback(
    (data: Omit<Transaction, 'id'>) => {
      setTransactions((prev) => [{ ...data, id: createId() }, ...prev].sort((a, b) => b.date.localeCompare(a.date)))
    },
    [setTransactions],
  )

  const deleteTransaction = useCallback(
    (id: string) => setTransactions((prev) => prev.filter((t) => t.id !== id)),
    [setTransactions],
  )

  const setBudget = useCallback(
    (category: Category, amount: number | null) => {
      setBudgets((prev) => {
        const next = { ...prev }
        if (amount === null || amount <= 0) delete next[category]
        else next[category] = amount
        return next
      })
    },
    [setBudgets],
  )

  const resetDemo = useCallback(() => {
    setTransactions(createSeedTransactions())
    setBudgets(SEED_BUDGETS)
  }, [setTransactions, setBudgets])

  const clearAll = useCallback(() => {
    setTransactions([])
    setBudgets({})
  }, [setTransactions, setBudgets])

  return { transactions, budgets, addTransaction, deleteTransaction, setBudget, resetDemo, clearAll }
}
