import { useState, type FormEvent } from 'react'
import { categoriesFor } from '../data/categories'
import type { Category, Transaction, TransactionType } from '../types'

interface Props {
  onAdd: (data: Omit<Transaction, 'id'>) => void
}

const today = () => new Date().toLocaleDateString('en-CA') // "YYYY-MM-DD" en hora local

/** Formulario "controlado": React es dueño del valor de cada input */
export function TransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<TransactionType>('expense')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Comida')
  const [date, setDate] = useState(today)
  const [error, setError] = useState<string | null>(null)

  function changeType(next: TransactionType) {
    setType(next)
    setCategory(categoriesFor(next)[0]) // evita una categoría que no aplica al nuevo tipo
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const value = Number(amount)
    if (!description.trim()) return setError('Escribe una descripción.')
    if (!Number.isFinite(value) || value <= 0) return setError('El monto debe ser mayor a 0.')

    onAdd({ type, description: description.trim(), amount: Math.round(value), category, date })
    setDescription('')
    setAmount('')
    setError(null)
  }

  const input =
    'w-full rounded-lg border border-line bg-page px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30'

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-page p-1" role="radiogroup" aria-label="Tipo de movimiento">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={type === t}
            onClick={() => changeType(t)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              type === t ? 'bg-surface text-ink shadow-sm' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {t === 'expense' ? 'Gasto' : 'Ingreso'}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-2">Descripción</span>
        <input className={input} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Supermercado" />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-2">Monto (₡)</span>
          <input
            className={`${input} tabular`}
            inputMode="numeric"
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="25000"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-2">Fecha</span>
          <input className={input} type="date" value={date} max={today()} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-ink-2">Categoría</span>
        <select className={input} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {categoriesFor(type).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>

      {error && (
        <p role="alert" className="text-sm text-critical">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-strong focus:outline-none focus:ring-2 focus:ring-brand/40"
      >
        Agregar {type === 'expense' ? 'gasto' : 'ingreso'}
      </button>
    </form>
  )
}
