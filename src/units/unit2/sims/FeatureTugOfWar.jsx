import { useState } from 'react'

const DIMENSIONS = [
  {
    id: 'schema',
    label: 'Schema flexibility',
    rdbms: 25,
    hadoop: 90,
    note: 'RDBMS enforces schema-on-write — every column and type is fixed before data lands. Hadoop is schema-on-read: raw files of any shape land first, and structure is applied at query time.',
  },
  {
    id: 'scale',
    label: 'Scale-out cost efficiency',
    rdbms: 30,
    hadoop: 88,
    note: 'RDBMS typically scales vertically (bigger, pricier servers). Hadoop scales horizontally across commodity hardware, so cost per terabyte falls as you add nodes.',
  },
  {
    id: 'acid',
    label: 'Transaction (ACID) support',
    rdbms: 95,
    hadoop: 35,
    note: 'RDBMS gives strong Atomicity, Consistency, Isolation and Durability for every transaction. Hadoop batch jobs favor throughput over per-record transactional guarantees.',
  },
  {
    id: 'latency',
    label: 'Query latency (interactive SQL)',
    rdbms: 90,
    hadoop: 45,
    note: 'Indexed RDBMS queries return in milliseconds. Classic MapReduce-backed Hadoop queries are batch-oriented and can take minutes, though engines like Spark/Tez/Impala narrow this gap.',
  },
  {
    id: 'variety',
    label: 'Data variety support',
    rdbms: 25,
    hadoop: 92,
    note: 'RDBMS wants clean structured rows. Hadoop happily stores structured, semi-structured and unstructured data (text, images, logs, video) side by side.',
  },
]

function DualBar({ value, color, label }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div className="row" style={{ justifyContent: 'space-between', fontSize: '.8rem', marginBottom: 3 }}>
        <span style={{ fontWeight: 600, color: 'var(--ink-soft)' }}>{label}</span>
        <span className="mono" style={{ color: `var(--${color})`, fontWeight: 700 }}>{value}/100</span>
      </div>
      <div className="progress-bar">
        <div style={{ width: `${value}%`, background: `var(--${color})` }} />
      </div>
    </div>
  )
}

export default function FeatureTugOfWar() {
  const [sel, setSel] = useState(DIMENSIONS[0].id)
  const d = DIMENSIONS.find((x) => x.id === sel)

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Pick a dimension to compare a traditional RDBMS against a Hadoop-based platform. Neither side wins
        every round — that's why the two are usually complementary, not competing.
      </p>

      <select value={sel} onChange={(e) => setSel(e.target.value)} style={{ width: '100%', marginBottom: 16 }}>
        {DIMENSIONS.map((x) => (
          <option key={x.id} value={x.id}>
            {x.label}
          </option>
        ))}
      </select>

      <div className="grid2">
        <DualBar value={d.rdbms} color="blue" label="RDBMS" />
        <DualBar value={d.hadoop} color="amber" label="Hadoop" />
      </div>

      <p className="note" style={{ marginTop: 4 }}>{d.note}</p>
    </div>
  )
}
