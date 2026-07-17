import { useMemo, useState } from 'react'

const ORDERS = [
  { product: 'Laptop', category: 'Electronics', amount: 55000 },
  { product: 'Headphones', category: 'Electronics', amount: 2500 },
  { product: 'Notebook Set', category: 'Stationery', amount: 350 },
  { product: 'Desk Chair', category: 'Furniture', amount: 7200 },
  { product: 'Monitor', category: 'Electronics', amount: 12000 },
  { product: 'Pen Pack', category: 'Stationery', amount: 150 },
  { product: 'Bookshelf', category: 'Furniture', amount: 4800 },
  { product: 'Mouse', category: 'Electronics', amount: 800 },
]

const CATEGORIES = ['Electronics', 'Stationery', 'Furniture']

function runPipeline(stages) {
  let data = ORDERS.map((o) => ({ ...o }))
  for (const stage of stages) {
    if (stage.type === 'match') {
      data = data.filter((d) => d.category === stage.category)
    } else if (stage.type === 'group') {
      const groups = {}
      for (const d of data) {
        if (!groups[d.category]) groups[d.category] = { _id: d.category, total: 0, count: 0 }
        groups[d.category].total += d.amount
        groups[d.category].count += 1
      }
      data = Object.values(groups)
    } else if (stage.type === 'sort') {
      const key = data[0] && 'total' in data[0] ? 'total' : 'amount'
      data = [...data].sort((a, b) => b[key] - a[key])
    } else if (stage.type === 'limit') {
      data = data.slice(0, stage.n)
    } else if (stage.type === 'skip') {
      data = data.slice(stage.n)
    }
  }
  return data
}

function stageLabel(stage) {
  if (stage.type === 'match') return `{ $match: { category: "${stage.category}" } }`
  if (stage.type === 'group') return `{ $group: { _id: "$category", total: { $sum: "$amount" } } }`
  if (stage.type === 'sort') return `{ $sort: { total: -1 } }`
  if (stage.type === 'limit') return `{ $limit: ${stage.n} }`
  if (stage.type === 'skip') return `{ $skip: ${stage.n} }`
  return ''
}

export default function AggregationPipeline() {
  const [stages, setStages] = useState([])
  const [matchCategory, setMatchCategory] = useState('Electronics')
  const [limitN, setLimitN] = useState(2)

  const result = useMemo(() => runPipeline(stages), [stages])
  const columns = result.length > 0 ? Object.keys(result[0]) : ['product', 'category', 'amount']

  function addStage(stage) {
    setStages((s) => [...s, stage])
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        The aggregation pipeline processes documents through a sequence of stages, each transforming the output
        of the last. Add stages below and watch the sample <code>orders</code> collection transform live.
      </p>

      <h4 style={{ fontSize: '.95rem', marginBottom: 8 }}>Base collection: orders</h4>
      <table className="data" style={{ marginBottom: 16 }}>
        <thead>
          <tr>
            <th>product</th>
            <th>category</th>
            <th>amount</th>
          </tr>
        </thead>
        <tbody>
          {ORDERS.map((o, i) => (
            <tr key={i}>
              <td>{o.product}</td>
              <td>{o.category}</td>
              <td>{o.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row" style={{ gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
        <label className="ctl">
          <select value={matchCategory} onChange={(e) => setMatchCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button className="btn ghost" onClick={() => addStage({ type: 'match', category: matchCategory })}>
          + $match category
        </button>
        <button className="btn ghost" onClick={() => addStage({ type: 'group' })}>
          + $group by category (sum amount)
        </button>
        <button className="btn ghost" onClick={() => addStage({ type: 'sort' })}>
          + $sort desc
        </button>
        <label className="ctl">
          <input type="number" min={1} max={8} value={limitN} onChange={(e) => setLimitN(Number(e.target.value))} style={{ width: 60 }} />
        </label>
        <button className="btn ghost" onClick={() => addStage({ type: 'limit', n: limitN })}>
          + $limit
        </button>
        <button className="btn coral" onClick={() => setStages([])}>
          Reset pipeline
        </button>
      </div>

      <div className="term" style={{ marginBottom: 16, maxHeight: 140 }}>
        {stages.length === 0 && <div className="out">db.orders.aggregate([ ])  — add a stage above to build the pipeline</div>}
        {stages.length > 0 && (
          <div className="out">
            {'db.orders.aggregate([\n'}
            {stages.map((s, i) => `  ${stageLabel(s)}${i < stages.length - 1 ? ',' : ''}\n`).join('')}
            {'])'}
          </div>
        )}
      </div>

      <h4 style={{ fontSize: '.95rem', marginBottom: 8 }}>Live result ({result.length} document{result.length === 1 ? '' : 's'})</h4>
      <table className="data">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c}>{r[c]}</td>
              ))}
            </tr>
          ))}
          {result.length === 0 && (
            <tr>
              <td colSpan={columns.length}>no documents match</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
