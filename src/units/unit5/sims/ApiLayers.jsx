import { useState } from 'react'

const LAYERS = [
  {
    id: 'rdd',
    label: 'RDD',
    desc: 'The Resilient Distributed Dataset is Spark\'s original, low-level abstraction: an immutable, partitioned collection of objects spread across executors, rebuilt from lineage if a partition is lost. Powerful and flexible, but you manage schema and optimization yourself.',
    code: `rdd = sc.textFile("logs.txt").filter(lambda l: "ERROR" in l)`,
  },
  {
    id: 'dataframe',
    label: 'DataFrame',
    desc: 'A DataFrame is a distributed table with named, typed columns — conceptually like a pandas DataFrame or a SQL table. It sits above RDDs and lets Catalyst, Spark\'s optimizer, plan and rewrite your query before running it.',
    code: `df.filter(df.age > 30).select("name", "age")`,
  },
  {
    id: 'sql',
    label: 'Spark SQL',
    desc: 'Spark SQL lets you register a DataFrame as a temporary view and query it with ordinary SQL, mixing declarative queries with programmatic DataFrame code in the same job.',
    code: `spark.sql("SELECT name FROM people WHERE age > 30")`,
  },
  {
    id: 'streaming',
    label: 'Structured Streaming',
    desc: 'Structured Streaming treats a live data stream as an unbounded table that keeps growing — you write the same DataFrame/SQL logic you\'d write for a batch job, and Spark incrementally re-runs it as new data arrives.',
    code: `stream.writeStream.outputMode("append").start()`,
  },
  {
    id: 'mllib',
    label: 'MLlib',
    desc: 'MLlib is Spark\'s machine learning library: distributed implementations of classification, regression, clustering and recommendation algorithms, plus pipelines for feature engineering and model tuning.',
    code: `LogisticRegression().fit(trainingDF)`,
  },
  {
    id: 'graphx',
    label: 'GraphX',
    desc: 'GraphX extends RDDs with a graph abstraction (vertices + edges) and ships graph-parallel algorithms like PageRank and connected components for network-shaped data.',
    code: `graph.pageRank(0.0001).vertices`,
  },
]

export default function ApiLayers() {
  const [selected, setSelected] = useState(null)
  const layer = LAYERS.find((l) => l.id === selected)

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        A Spark application is just the driver and its executors working together — but you talk to that
        application through several API layers, all built on the same <b>SparkSession</b> entry point. Click a
        layer to see what it's for.
      </p>

      <div className="badge-row">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            className="chip"
            style={{
              cursor: 'pointer',
              border: selected === l.id ? '1px solid var(--blue)' : undefined,
              background: selected === l.id ? 'var(--blue-soft)' : undefined,
              color: selected === l.id ? '#1d3f63' : undefined,
              fontWeight: selected === l.id ? 700 : 400,
            }}
            onClick={() => setSelected(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ margin: '14px 0 0', background: layer ? 'var(--blue-soft)' : 'var(--panel-2)', border: `1px solid ${layer ? '#b9cbe0' : 'var(--line)'}` }}>
        {layer ? (
          <>
            <span className="eyebrow" style={{ margin: 0, color: 'var(--blue)' }}>{layer.label}</span>
            <p style={{ margin: '8px 0 10px', color: 'var(--ink-soft)' }}>{layer.desc}</p>
            <code style={{ display: 'block', background: '#0c1620', color: '#c8d6da', padding: '9px 12px', borderRadius: 8, fontSize: '.82rem' }}>
              {layer.code}
            </code>
          </>
        ) : (
          <p style={{ margin: 0, color: 'var(--muted)' }}>Select an API layer above to see what it does.</p>
        )}
      </div>
    </div>
  )
}
