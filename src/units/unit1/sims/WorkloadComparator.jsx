import { useState } from 'react'

const WORKLOADS = [
  {
    id: 'quarterly',
    label: 'Quarterly financial report for the board',
    dw: 92,
    hadoop: 35,
    reason: 'Small, well-structured, high-integrity data with SQL aggregates — exactly what a data warehouse and BI tools are optimized for.',
  },
  {
    id: 'clickstream',
    label: 'Click-stream analysis across 2 billion events/day',
    dw: 30,
    hadoop: 90,
    reason: 'Volume and velocity make this uneconomical for a warehouse; a distributed Hadoop/Spark cluster scales horizontally at low cost per byte.',
  },
  {
    id: 'fraud',
    label: 'Real-time fraud scoring on structured transactions',
    dw: 55,
    hadoop: 75,
    reason: 'Structured, but needs near real-time processing at scale — often a hybrid: streaming big-data pipeline feeding curated marts.',
  },
  {
    id: 'sentiment',
    label: 'Sentiment analysis of social media posts',
    dw: 15,
    hadoop: 88,
    reason: 'Unstructured text at huge scale is a poor fit for rigid warehouse schemas; big data frameworks handle raw text natively.',
  },
  {
    id: 'adhoc',
    label: 'Ad-hoc SQL report for tomorrow\'s meeting',
    dw: 95,
    hadoop: 40,
    reason: 'Interactive, low-latency SQL over curated, governed data — the warehouse\'s home turf.',
  },
  {
    id: 'imagery',
    label: 'Processing petabytes of satellite imagery',
    dw: 10,
    hadoop: 93,
    reason: 'Massive unstructured binary data needs distributed storage (HDFS/object storage) and parallel compute, not a relational warehouse.',
  },
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

export default function WorkloadComparator() {
  const [sel, setSel] = useState(WORKLOADS[0].id)
  const w = WORKLOADS.find((x) => x.id === sel)

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Data warehouses (BI) and Hadoop-style big data platforms coexist — pick a workload and see which one
        fits better, and why.
      </p>
      <select value={sel} onChange={(e) => setSel(e.target.value)} style={{ width: '100%', marginBottom: 16 }}>
        {WORKLOADS.map((w) => (
          <option key={w.id} value={w.id}>
            {w.label}
          </option>
        ))}
      </select>

      <div className="grid2">
        <div>
          <Bar value={w.dw} color="amber" label="Data Warehouse / BI" />
        </div>
        <div>
          <Bar value={w.hadoop} color="teal" label="Hadoop / Big Data Platform" />
        </div>
      </div>

      <p className="note teal" style={{ marginTop: 4 }}>{w.reason}</p>

      <p className="lead" style={{ fontSize: '.88rem', marginTop: 10 }}>
        In practice these systems <b>coexist</b>: raw, high-volume, varied data lands in Hadoop/data lake
        storage first, and curated, high-value subsets are then modeled into the warehouse for fast BI
        queries.
      </p>
    </div>
  )
}
