import { useState } from 'react'

const SALES = [
  { product: 'Laptop', region: 'North', amount: 1200 },
  { product: 'Phone', region: 'South', amount: 650 },
  { product: 'Tablet', region: 'North', amount: 450 },
  { product: 'Laptop', region: 'East', amount: 1300 },
  { product: 'Monitor', region: 'South', amount: 300 },
  { product: 'Phone', region: 'North', amount: 700 },
  { product: 'Tablet', region: 'East', amount: 520 },
  { product: 'Monitor', region: 'West', amount: 250 },
]

const filteredRows = SALES.filter((r) => r.amount > 500)

const groupedRaw = filteredRows.reduce((acc, r) => {
  ;(acc[r.region] = acc[r.region] || []).push(r)
  return acc
}, {})

const groupedRows = Object.entries(groupedRaw).map(([region, records]) => ({
  group: region,
  count: records.length,
  bag: records.map((r) => `${r.product}:${r.amount}`).join(', '),
}))

const foreachRows = Object.entries(groupedRaw).map(([region, records]) => ({
  region,
  total: records.reduce((s, r) => s + r.amount, 0),
}))

const orderedRows = [...foreachRows].sort((a, b) => b.total - a.total)

const STEPS = [
  {
    label: 'LOAD',
    statement: "sales = LOAD 'sales.csv' AS (product:chararray, region:chararray, amount:int);",
    columns: ['product', 'region', 'amount'],
    rows: SALES,
    note: 'Loads the raw dataset into the sales relation — all 8 tuples, untouched.',
  },
  {
    label: 'FILTER',
    statement: 'filtered = FILTER sales BY amount > 500;',
    columns: ['product', 'region', 'amount'],
    rows: filteredRows,
    note: `Keeps only tuples where amount > 500 — ${filteredRows.length} of 8 tuples survive.`,
  },
  {
    label: 'GROUP BY region',
    statement: 'grouped = GROUP filtered BY region;',
    columns: ['group', 'count', 'bag'],
    rows: groupedRows,
    note: "GROUP buckets tuples into a bag per distinct region. Unlike SQL's GROUP BY, Pig materializes the bag itself as a nested field.",
  },
  {
    label: 'FOREACH GENERATE',
    statement: 'totals = FOREACH grouped GENERATE group AS region, SUM(filtered.amount) AS total;',
    columns: ['region', 'total'],
    rows: foreachRows,
    note: 'Projects one output tuple per group, aggregating each bag with SUM().',
  },
  {
    label: 'ORDER BY DESC',
    statement: 'final = ORDER totals BY total DESC;',
    columns: ['region', 'total'],
    rows: orderedRows,
    note: 'Sorts the final relation by total, descending, ready for DUMP or STORE.',
  },
]

export default function PigLatinFlowSimulator() {
  const [addedCount, setAddedCount] = useState(0)
  const [mode, setMode] = useState('local')

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Build up a Pig Latin script one statement at a time and watch the relation narrow and transform at each
        step — this is the procedural, dataflow style that sets Pig Latin apart from declarative SQL.
      </p>

      <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        {STEPS.map((s, i) => (
          <button
            key={s.label}
            className="btn"
            disabled={i !== addedCount}
            style={{
              background: i < addedCount ? 'var(--violet-soft)' : i === addedCount ? 'var(--violet)' : '#fff',
              color: i === addedCount ? '#fff' : i < addedCount ? 'var(--violet)' : 'var(--muted)',
              borderColor: 'var(--violet)',
              opacity: i > addedCount ? 0.5 : 1,
            }}
            onClick={() => setAddedCount(i + 1)}
          >
            {i + 1}. {s.label}
          </button>
        ))}
        <button className="btn ghost" onClick={() => setAddedCount(0)}>Reset script</button>
      </div>

      <div className="row" style={{ gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: '.85rem', fontWeight: 600 }}>Execution mode:</span>
        <button className={`btn ${mode === 'local' ? '' : 'ghost'}`} onClick={() => setMode('local')}>Local</button>
        <button className={`btn ${mode === 'mapreduce' ? '' : 'ghost'}`} onClick={() => setMode('mapreduce')}>MapReduce</button>
        <span className="note" style={{ margin: 0, padding: '6px 12px', fontSize: '.82rem' }}>
          {mode === 'local'
            ? 'Simulated runtime: ~0.8s startup — runs against the local filesystem, ideal for small data and testing scripts.'
            : 'Simulated runtime: ~15s startup (job submission overhead) — runs distributed across the Hadoop cluster, scales to huge data.'}
        </span>
      </div>

      {addedCount === 0 && <p style={{ color: 'var(--muted)', fontSize: '.88rem' }}>No statements added yet — click "1. LOAD" to begin.</p>}

      <div className="col" style={{ gap: 16 }}>
        {STEPS.slice(0, addedCount).map((s) => (
          <div key={s.label}>
            <div className="mono" style={{ background: '#1e1b2e', color: '#e4dcff', padding: '8px 12px', borderRadius: 8, fontSize: '.82rem', marginBottom: 6 }}>
              {s.statement}
            </div>
            <table className="data">
              <thead>
                <tr>{s.columns.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {s.rows.map((r, ri) => (
                  <tr key={ri}>
                    {s.columns.map((c) => <td key={c}>{r[c]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: '.82rem', color: 'var(--ink-soft)', margin: '6px 0 0' }}>{s.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
