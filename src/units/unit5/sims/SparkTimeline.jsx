import { useState } from 'react'

const ERAS = [
  { year: 2009, title: 'AMPLab research project', scale: 'UC Berkeley', detail: 'Spark begins life as a research project inside UC Berkeley\'s AMPLab, aiming to make cluster computing faster for iterative algorithms than the disk-heavy MapReduce model.' },
  { year: 2010, title: 'Open-sourced', scale: 'BSD license', detail: 'The AMPLab releases Spark as open-source software, letting the wider community experiment with in-memory distributed computing.' },
  { year: 2013, title: 'Donated to the ASF', scale: 'Apache Incubator', detail: 'Spark is donated to the Apache Software Foundation and enters incubation, bringing it under an open, vendor-neutral governance model.' },
  { year: 2014, title: 'Top-Level Project & Spark 1.0', scale: 'Sorting record', detail: 'Spark graduates to an Apache Top-Level Project. Spark 1.0 ships, and Spark sets a new world record for large-scale sorting — beating Hadoop MapReduce using far less hardware.' },
  { year: 2016, title: 'Spark 2.0', scale: 'Unified APIs', detail: 'DataFrames and Datasets are unified into a single API, and Structured Streaming is introduced — letting the same engine express streaming jobs as continuously-updating tables.' },
  { year: 2020, title: 'Spark 3.0', scale: 'Adaptive & GPU-aware', detail: 'Adaptive Query Execution (AQE) re-optimizes query plans at runtime, GPU-aware scheduling lands for ML workloads, and the pandas API on Spark matures significantly.' },
  { year: 2024, title: 'Present & future', scale: 'Lakehouse + AI', detail: 'Kubernetes becomes the standard way to run Spark clusters. Deeper integration with lakehouse table formats (Delta Lake, Apache Iceberg) and growing support for generative-AI / vector workloads shape where Spark is headed next.' },
]

export default function SparkTimeline() {
  const [idx, setIdx] = useState(0)
  const era = ERAS[idx]

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Drag the slider across fifteen years to see how Spark grew from a Berkeley research project into the
        default engine for large-scale data processing.
      </p>
      <input
        type="range"
        min={0}
        max={ERAS.length - 1}
        step={1}
        value={idx}
        onChange={(e) => setIdx(Number(e.target.value))}
        style={{ width: '100%' }}
      />
      <div className="row" style={{ justifyContent: 'space-between', fontSize: '.72rem', color: 'var(--muted)', marginTop: 2 }}>
        {ERAS.map((e, i) => (
          <span key={e.year} style={{ fontWeight: i === idx ? 700 : 400, color: i === idx ? 'var(--blue)' : 'var(--muted)' }}>
            {e.year}
          </span>
        ))}
      </div>

      <div className="card" style={{ marginTop: 18, background: 'var(--blue-soft)', border: '1px solid #b9cbe0' }}>
        <span className="eyebrow" style={{ margin: 0, color: 'var(--blue)' }}>
          <span className="n" style={{ background: 'var(--blue)' }}>{era.year}</span> {era.title}
        </span>
        <p style={{ margin: '10px 0 4px', fontSize: '1.4rem', fontFamily: 'var(--display)', fontWeight: 700 }}>
          {era.scale}
        </p>
        <p style={{ margin: 0, color: 'var(--ink-soft)' }}>{era.detail}</p>
      </div>
    </div>
  )
}
