import { useState } from 'react'

const COMPONENTS = [
  {
    id: 'driver',
    label: 'Driver',
    desc: 'Receives HiveQL statements from the CLI, JDBC/ODBC client or Beeline, opens a session, and manages the lifecycle of a query from submission through to returning the final result set.',
  },
  {
    id: 'compiler',
    label: 'Compiler',
    desc: 'Parses the HiveQL text, checks it against the Metastore for semantic correctness (do the tables/columns exist, do the types line up), then builds a logical plan and optimizes it into a DAG of execution stages.',
  },
  {
    id: 'metastore',
    label: 'Metastore',
    desc: "The catalog of Hive: stores table and partition schema, column types, and the HDFS location backing each table. Without it, Hive queries would have no idea which files on disk correspond to which table.",
  },
  {
    id: 'engine',
    label: 'Execution Engine',
    desc: 'Takes the compiled, optimized plan and submits it as MapReduce, Tez or Spark jobs to the Hadoop cluster, tracking job progress and assembling the final rows to hand back to the Driver.',
  },
  {
    id: 'hdfs',
    label: 'HDFS',
    desc: "The distributed storage layer underneath everything. A Hive table is really just a directory of files on HDFS — queries ultimately read and write those files, however the SQL was expressed above them.",
  },
]

const FORMATS = [
  { id: 'text', label: 'TextFile', storage: 20, speed: 25, note: 'Human-readable (you can just `cat` it) and simple, but row-based with no built-in compression — the least efficient choice for large analytical scans.' },
  { id: 'seq', label: 'SequenceFile', storage: 45, speed: 40, note: 'Binary, row-based, splittable and compressible — an improvement on TextFile, but still not columnar, so analytical queries still read whole rows.' },
  { id: 'orc', label: 'ORC', storage: 90, speed: 92, note: 'Columnar storage with built-in indexes, statistics and heavy compression — Hive’s own native format and usually the fastest choice for analytical queries.' },
  { id: 'parquet', label: 'Parquet', storage: 88, speed: 90, note: 'Columnar and cross-engine (Hive, Spark, Impala all read it natively) with excellent compression — the standard choice in most modern data lakes.' },
  { id: 'avro', label: 'Avro', storage: 60, speed: 55, note: 'Row-based with rich schema evolution support, great for interchange between systems, but reading a few columns still costs a full-row scan.' },
]

function Bar({ value, color, label }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div className="row" style={{ justifyContent: 'space-between', fontSize: '.8rem', marginBottom: 3 }}>
        <span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>{label}</span>
        <span className="mono" style={{ color: `var(--${color})`, fontWeight: 700 }}>{value}%</span>
      </div>
      <div className="progress-bar">
        <div style={{ width: `${value}%`, background: `var(--${color})` }} />
      </div>
    </div>
  )
}

export default function HiveArchitectureExplorer() {
  const [selected, setSelected] = useState('driver')
  const [format, setFormat] = useState('orc')

  const comp = COMPONENTS.find((c) => c.id === selected)
  const fmt = FORMATS.find((f) => f.id === format)

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Click a piece of Hive's architecture to see what it does, then compare how the underlying file format
        affects storage efficiency and query speed.
      </p>

      <div className="row" style={{ gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {COMPONENTS.map((c, i) => (
          <div key={c.id} className="row" style={{ gap: 8, alignItems: 'center' }}>
            <button
              className="node"
              style={{
                cursor: 'pointer',
                border: selected === c.id ? '2px solid var(--violet)' : '2px solid var(--line)',
                background: selected === c.id ? 'var(--violet-soft)' : '#fff',
                fontWeight: selected === c.id ? 700 : 500,
              }}
              onClick={() => setSelected(c.id)}
            >
              {c.label}
            </button>
            {i < COMPONENTS.length - 1 && <span style={{ color: 'var(--muted)' }}>&rarr;</span>}
          </div>
        ))}
      </div>

      <div className="card" style={{ background: 'var(--violet-soft)', border: '1px solid var(--violet)', margin: 0 }}>
        <span className="eyebrow" style={{ margin: 0, color: 'var(--violet)' }}>{comp.label}</span>
        <p style={{ margin: '8px 0 0' }}>{comp.desc}</p>
      </div>

      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid var(--line)' }} />

      <p style={{ fontWeight: 700, marginBottom: 8 }}>File format comparator</p>
      <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ width: '100%', marginBottom: 14 }}>
        {FORMATS.map((f) => (
          <option key={f.id} value={f.id}>{f.label}</option>
        ))}
      </select>

      <div className="grid2">
        <Bar value={fmt.storage} color="violet" label="Storage efficiency" />
        <Bar value={fmt.speed} color="teal" label="Query speed" />
      </div>

      <p className="note teal" style={{ marginTop: 4 }}>{fmt.note}</p>
    </div>
  )
}
