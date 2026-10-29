import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatCompact, formatCurrency, monthLabel } from '../utils/finance'

interface Props {
  data: { month: string; income: number; expenses: number }[]
}

/** Ingresos vs. gastos por mes (barras agrupadas, un solo eje) */
export function MonthlyChart({ data }: Props) {
  if (data.length === 0) return <p className="py-16 text-center text-sm text-muted">Aún no hay datos.</p>

  const rows = data.map((d) => ({ ...d, label: monthLabel(d.month, false) }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} barGap={2} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--grid)" />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: 'var(--grid)' }} tick={{ fill: 'var(--axis)', fontSize: 12 }} />
          <YAxis
            tickFormatter={formatCompact}
            tickLine={false}
            axisLine={false}
            width={64}
            tick={{ fill: 'var(--axis)', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'var(--grid)', opacity: 0.5 }}
            formatter={(value, name) => [formatCurrency(Number(value)), name]}
            labelFormatter={(_, payload) => (payload?.[0] ? monthLabel(payload[0].payload.month) : '')}
            contentStyle={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-line)',
              borderRadius: 12,
              color: 'var(--color-ink)',
              fontSize: 13,
            }}
          />
          <Legend
            iconType="circle"
            iconSize={9}
            itemSorter={null}
            wrapperStyle={{ fontSize: 13 }}
            formatter={(value) => <span style={{ color: 'var(--color-ink-2)' }}>{value}</span>}
          />
          <Bar dataKey="income" name="Ingresos" fill="var(--series-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="expenses" name="Gastos" fill="var(--series-2)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
