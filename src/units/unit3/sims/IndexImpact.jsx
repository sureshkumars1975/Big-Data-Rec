import { useState } from 'react'

const TOTAL_DOCS = 100000
const CS_DOCS = 3200

export default function IndexImpact() {
  const [indexed, setIndexed] = useState(false)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)

  function run() {
    setRunning(true)
    setResult(null)
    const scanned = indexed ? CS_DOCS : TOTAL_DOCS
    const latencyMs = indexed ? 6 + Math.round(Math.random() * 4) : 380 + Math.round(Math.random() * 60)
    setTimeout(() => {
      setResult({ scanned, latencyMs })
      setRunning(false)
    }, 500)
  }

  const maxLatency = 440
  const pct = result ? Math.min(100, (result.latencyMs / maxLatency) * 100) : 0

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        A <code>students</code> collection with 100,000 documents. Toggle a secondary index on the{' '}
        <code>dept</code> field and re-run the same query to see the difference between a full <b>collection
        scan</b> and an <b>index scan</b>.
      </p>

      <div className="row" style={{ marginBottom: 16, justifyContent: 'space-between' }}>
        <label className="ctl">
          <input type="checkbox" checked={indexed} onChange={(e) => setIndexed(e.target.checked)} />
          Index on <code>dept</code> field: <b>{indexed ? 'ON' : 'OFF'}</b>
        </label>
        <button className="btn amber" onClick={run} disabled={running}>
          {running ? 'Running…' : "Run: find({dept: 'CS'}) on 100,000 docs"}
        </button>
      </div>

      {!result && !running && (
        <p className="note">Run the query with the index off, then on, to compare documents scanned and latency.</p>
      )}

      {running && <p className="note">Executing query…</p>}

      {result && (
        <div>
          <div className="grid2" style={{ marginBottom: 14 }}>
            <div className="node active">
              Documents scanned
              <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: 4 }}>{result.scanned.toLocaleString()}</div>
            </div>
            <div className="node active">
              Latency
              <div style={{ fontSize: '1.3rem', fontWeight: 700, marginTop: 4 }}>{result.latencyMs} ms</div>
            </div>
          </div>
          <div className="progress-bar" style={{ marginBottom: 6 }}>
            <div style={{ width: `${pct}%`, background: indexed ? 'var(--teal)' : 'var(--coral)' }} />
          </div>
          <p className="note" style={{ margin: '10px 0 0' }}>
            {indexed
              ? `With a B-tree index on dept, MongoDB seeks directly to the "CS" bucket instead of scanning the full collection — only ~${result.scanned.toLocaleString()} matching documents are touched.`
              : `Without an index, MongoDB performs a COLLSCAN — it must inspect all ${TOTAL_DOCS.toLocaleString()} documents to find the ones where dept = "CS".`}
          </p>
        </div>
      )}
    </div>
  )
}
