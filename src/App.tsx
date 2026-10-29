import { useMemo, useState } from 'react'
import { BudgetList } from './components/BudgetList'
import { ExportPanel } from './components/ExportPanel'
import { Card } from './components/Card'
import { CategoryChart } from './components/CategoryChart'
import { MonthlyChart } from './components/MonthlyChart'
import { SummaryCards } from './components/SummaryCards'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { useTheme } from './hooks/useTheme'
import { useTransactions } from './hooks/useTransactions'
import type { Category } from './types'
import {
  availableMonths,
  expensesByCategory,
  filterByMonth,
  getSummary,
  monthKey,
  monthLabel,
  monthlyTotals,
  toCSV,
} from './utils/finance'

export default function App() {
  const { transactions, budgets, addTransaction, deleteTransaction, setBudget, resetDemo, clearAll } = useTransactions()
  const { theme, toggle } = useTheme()

  const months = useMemo(() => availableMonths(transactions), [transactions])
  // Inicializador perezoso: la fecha se lee una sola vez, no en cada render
  const [selectedMonth, setSelectedMonth] = useState<string>(() => monthKey(new Date().toLocaleDateString('en-CA')))

  // Si el mes elegido ya no tiene datos (p. ej. tras borrar todo), volvemos a "todo"
  const month = selectedMonth === 'all' || months.includes(selectedMonth) ? selectedMonth : 'all'

  // Datos derivados: se calculan a partir del estado, no se guardan aparte
  const periodTx = useMemo(() => filterByMonth(transactions, month), [transactions, month])
  const summary = useMemo(() => getSummary(periodTx), [periodTx])
  const byCategory = useMemo(() => expensesByCategory(periodTx), [periodTx])
  const monthly = useMemo(() => monthlyTotals(transactions).slice(-6), [transactions])
  const spent = useMemo(
    () => Object.fromEntries(byCategory.map((c) => [c.category, c.total])) as Partial<Record<Category, number>>,
    [byCategory],
  )

  const [showExport, setShowExport] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const periodLabel = month === 'all' ? 'todo el historial' : monthLabel(month)


  const btn = 'rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-ink-2 transition hover:text-ink'

  return (
    <div className="min-h-screen">
      <header style={{ top: 'env(safe-area-inset-top, 0px)' }}
        className="sticky z-10 border-b border-line bg-page/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white" aria-hidden>
              ₡
            </span>
            <h1 className="text-lg font-semibold">Mis Finanzas</h1>
          </div>

          <select
            value={month}
            onChange={(e) => setSelectedMonth(e.target.value)}
            aria-label="Periodo"
            className={`${btn} capitalize`}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {monthLabel(m)}
              </option>
            ))}
            <option value="all">Todo el historial</option>
          </select>
          <button onClick={() => setShowExport(true)} className={btn} disabled={periodTx.length === 0}>
            Exportar CSV
          </button>
          <button onClick={toggle} className={btn} aria-label="Cambiar tema">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
        <SummaryCards summary={summary} periodLabel={periodLabel} />

        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Ingresos vs. gastos · últimos 6 meses" className="lg:col-span-2">
            <MonthlyChart data={monthly} />
          </Card>
          <Card title="Nuevo movimiento">
            <TransactionForm onAdd={addTransaction} />
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card title="Gasto por categoría">
            <CategoryChart data={byCategory} />
          </Card>
          <Card title="Presupuestos mensuales">
            <BudgetList budgets={budgets} spent={spent} onChange={setBudget} isMonthSelected={month !== 'all'} />
          </Card>
          <Card title="Movimientos" action={<span className="text-xs text-muted">{periodTx.length}</span>}>
            <TransactionList key={month} transactions={periodTx} onDelete={deleteTransaction} />
          </Card>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-muted">
          <p>Los datos se guardan solo en tu navegador (localStorage).</p>
          <div className="flex gap-3">
            <button onClick={resetDemo} className="hover:text-ink">
              Restaurar datos de ejemplo
            </button>
            {confirmClear ? (
              <span className="flex items-center gap-2">
                ¿Borrar todo?
                <button
                  onClick={() => {
                    clearAll()
                    setConfirmClear(false)
                  }}
                  className="font-semibold text-critical"
                >
                  Sí, borrar
                </button>
                <button onClick={() => setConfirmClear(false)} className="hover:text-ink">
                  Cancelar
                </button>
              </span>
            ) : (
              <button onClick={() => setConfirmClear(true)} className="hover:text-critical">
                Empezar desde cero
              </button>
            )}
          </div>
        </footer>
      </main>

      {showExport && (
        <ExportPanel
          csv={toCSV(periodTx)}
          fileName={`finanzas-${month}.csv`}
          rows={periodTx.length}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}
