import { useState } from 'react'

const CODECS = {
  none: { label: 'None', ratio: 1.0, speed: 100, splittable: true, note: 'No compression — fastest to read/write and always splittable, but uses the most disk and network I/O.' },
  gzip: { label: 'Gzip', ratio: 2.7, speed: 40, splittable: false, note: 'High compression ratio but CPU-heavy and not splittable, so a compressed file must be processed by a single Map task.' },
  bzip2: { label: 'Bzip2', ratio: 3.5, speed: 15, splittable: true, note: 'The best compression ratio of the four, and unusually it is splittable — but it is by far the slowest to encode/decode.' },
  lzo: { label: 'LZO', ratio: 2.2, speed: 80, splittable: true, note: 'Fast, and splittable when paired with a separate .index file built by the LZO indexer — a common choice for large working sets.' },
  snappy: { label: 'Snappy', ratio: 2.0, speed: 95, splittable: false, note: 'Optimized for speed over ratio; very fast but not natively splittable, so it is usually used inside splittable container formats like SequenceFile or Parquet.' },
}

const MAX_RATIO = 3.5

const EMPLOYEES = [
  { dept: 'Sales', salary: 72000 },
  { dept: 'Engineering', salary: 95000 },
  { dept: 'Sales', salary: 68000 },
  { dept: 'Marketing', salary: 61000 },
  { dept: 'Engineering', salary: 88000 },
  { dept: 'Sales', salary: 81000 },
  { dept: 'Marketing', salary: 73000 },
  { dept: 'Engineering', salary: 102000 },
]

function Bar({ value, max, color, label, suffix = '' }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="row" style={{ justifyContent: 'space-between', fontSize: '.8rem', marginBottom: 3 }}>
        <span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>{label}</span>
        <span className="mono" style={{ color: `var(--${color})`, fontWeight: 700 }}>{value}{suffix}</span>
      </div>
      <div className="progress-bar">
        <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: `var(--${color})` }} />
      </div>
    </div>
  )
}

export default function CompressionSortBench() {
  const [codec, setCodec] = useState('gzip')
  const [sorted, setSorted] = useState(false)
  const c = CODECS[codec]

  const rows = sorted
    ? [...EMPLOYEES].sort((a, b) => a.dept.localeCompare(b.dept) || b.salary - a.salary)
    : EMPLOYEES

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Compare Hadoop's common compression codecs, then try a <b>secondary sort</b>: sorting by a composite
        key (department, then salary within department) — a pattern MapReduce uses to deliver pre-grouped,
        pre-ordered values to each reducer.
      </p>

      <select value={codec} onChange={(e) => setCodec(e.target.value)} style={{ width: '100%', marginBottom: 16 }}>
        {Object.entries(CODECS).map(([id, x]) => (
          <option key={id} value={id}>{x.label}</option>
        ))}
      </select>

      <Bar value={c.ratio} max={MAX_RATIO} color="amber" label="Compression ratio" suffix="x" />
      <Bar value={c.speed} max={100} color="teal" label="Encoding speed (relative)" />
      <div className="row" style={{ margin: '10px 0' }}>
        <span className="mono" style={{ fontSize: '.85rem', fontWeight: 600 }}>Splittable:</span>
        <span className={`chip ${c.splittable ? 'amber' : 'drop'}`}>{c.splittable ? 'Yes' : 'No'}</span>
      </div>
      <p className="note">{c.note}</p>

      <h4 style={{ marginTop: 22, marginBottom: 8, fontSize: '1rem' }}>Secondary Sort Demo</h4>
      <p className="lead" style={{ fontSize: '.9rem', marginBottom: 10 }}>
        Values arrive at the reducer grouped by department, but within a group they are in shuffle-arrival
        order. A composite key (department + salary) sort orders them by department, then by salary
        descending within each department.
      </p>
      <button className="btn amber" onClick={() => setSorted((s) => !s)}>
        {sorted ? 'Show unsorted (arrival order)' : 'Apply composite-key sort'}
      </button>

      <table className="data" style={{ marginTop: 12 }}>
        <thead>
          <tr><th>#</th><th>Department</th><th>Salary</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.dept}-${r.salary}`}>
              <td className="mono">{i}</td>
              <td>{r.dept}</td>
              <td className="mono">${r.salary.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
