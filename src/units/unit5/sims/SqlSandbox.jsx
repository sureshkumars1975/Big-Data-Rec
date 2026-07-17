import { useState } from 'react'
import Terminal from '../../../components/sim/Terminal.jsx'

const ORDERS = [
  { id: 1, customer: 'Alice', product: 'Laptop', amount: 1200, status: 'shipped' },
  { id: 2, customer: 'Bob', product: 'Mouse', amount: 25, status: 'pending' },
  { id: 3, customer: 'Alice', product: 'Keyboard', amount: 75, status: 'shipped' },
  { id: 4, customer: 'Carol', product: 'Monitor', amount: 300, status: 'delivered' },
  { id: 5, customer: 'Bob', product: 'Laptop', amount: 1150, status: 'shipped' },
  { id: 6, customer: 'Dave', product: 'Mouse', amount: 20, status: 'cancelled' },
  { id: 7, customer: 'Carol', product: 'Keyboard', amount: 80, status: 'pending' },
]

function formatTable(columns, rows) {
  const widths = columns.map((c, i) =>
    Math.max(c.length, ...rows.map((r) => String(r[i]).length), 1),
  )
  const sep = '+' + widths.map((w) => '-'.repeat(w + 2)).join('+') + '+'
  const headerRow = '|' + columns.map((c, i) => ' ' + c.padStart(widths[i]) + ' ').join('|') + '|'
  const bodyRows = rows.map(
    (r) => '|' + r.map((v, i) => ' ' + String(v).padStart(widths[i]) + ' ').join('|') + '|',
  )
  return [sep, headerRow, sep, ...bodyRows, sep, `(${rows.length} row${rows.length === 1 ? '' : 's'})`].join('\n')
}

const HINT =
  "Unrecognized query. Try one of:\n  SELECT * FROM orders\n  SELECT * FROM orders WHERE status = 'shipped'\n  SELECT customer, SUM(amount) FROM orders GROUP BY customer"

export default function SqlSandbox() {
  const [orders] = useState(ORDERS)

  function resolver(raw) {
    const cmd = raw.trim().replace(/;$/, '')

    if (/^select\s+\*\s+from\s+orders\s*$/i.test(cmd)) {
      const table = formatTable(
        ['id', 'customer', 'product', 'amount', 'status'],
        orders.map((o) => [o.id, o.customer, o.product, o.amount, o.status]),
      )
      const plan = '== Physical Plan ==\n*(1) Scan orders'
      return { output: `${table}\n\n${plan}` }
    }

    const whereMatch = cmd.match(/^select\s+\*\s+from\s+orders\s+where\s+status\s*=\s*'(\w+)'\s*$/i)
    if (whereMatch) {
      const value = whereMatch[1].toLowerCase()
      const filtered = orders.filter((o) => o.status.toLowerCase() === value)
      const table = formatTable(
        ['id', 'customer', 'product', 'amount', 'status'],
        filtered.map((o) => [o.id, o.customer, o.product, o.amount, o.status]),
      )
      const plan = `== Physical Plan ==\n*(1) Filter (status#12 = ${value})\n+- *(1) Scan orders`
      return { output: `${table}\n\n${plan}` }
    }

    if (/^select\s+customer\s*,\s*sum\(amount\)\s+from\s+orders\s+group\s+by\s+customer\s*$/i.test(cmd)) {
      const sums = {}
      orders.forEach((o) => {
        sums[o.customer] = (sums[o.customer] || 0) + o.amount
      })
      const rows = Object.entries(sums)
      const table = formatTable(['customer', 'sum(amount)'], rows.map(([c, s]) => [c, s]))
      const plan =
        '== Physical Plan ==\n*(2) HashAggregate(keys=[customer#3], functions=[sum(amount#5)])\n' +
        '+- Exchange hashpartitioning(customer#3, 200)\n' +
        '   +- *(1) HashAggregate(keys=[customer#3], functions=[partial_sum(amount#5)])\n' +
        '      +- *(1) Scan orders'
      return { output: `${table}\n\n${plan}` }
    }

    return { output: HINT, isError: true }
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        An in-memory <code>orders</code> DataFrame is registered as a table. Query it with Spark SQL — Catalyst
        turns each query into a physical plan, printed underneath the result just like{' '}
        <code>df.explain()</code> would.
      </p>
      <Terminal
        prompt="spark-sql>"
        welcome={[
          "orders DataFrame loaded: id, customer, product, amount, status (7 rows).",
          "Try: SELECT * FROM orders",
        ]}
        resolver={resolver}
        placeholder="SELECT * FROM orders WHERE status = 'shipped'"
      />
    </div>
  )
}
