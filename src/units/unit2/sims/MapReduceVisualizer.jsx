import { useMemo, useState } from 'react'

const DEFAULT_TEXT = 'the quick fox jumps over the lazy dog the dog barks at the quick fox in the yard'

const STAGE_LABELS = ['Input Splits', 'Map Output', 'Combiner', 'Shuffle & Sort', 'Reduce Output']

function clean(word) {
  return word.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function chunk(arr, n) {
  const size = Math.max(1, Math.ceil(arr.length / n))
  const out = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function pairBytes(word, count) {
  return word.length + String(count).length + 6
}

export default function MapReduceVisualizer() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [combinerOn, setCombinerOn] = useState(true)
  const [stage, setStage] = useState(-1)

  const model = useMemo(() => {
    const words = text.split(/\s+/).map(clean).filter(Boolean)
    const splits = chunk(words, 3)

    const mapOutput = splits.map((s) => s.map((w) => [w, 1]))

    const combinerOutput = splits.map((s) => {
      const counts = {}
      s.forEach((w) => { counts[w] = (counts[w] || 0) + 1 })
      return Object.entries(counts)
    })

    const shuffledPairs = (combinerOn ? combinerOutput : mapOutput).flat()
    const bytesShuffled = shuffledPairs.reduce((sum, [w, c]) => sum + pairBytes(w, c), 0)
    const pairCount = shuffledPairs.length

    const grouped = {}
    shuffledPairs.forEach(([w, c]) => {
      if (!grouped[w]) grouped[w] = []
      grouped[w].push(c)
    })

    const reduced = Object.entries(grouped)
      .map(([w, counts]) => [w, counts.reduce((a, b) => a + b, 0)])
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))

    const rawPairCount = mapOutput.flat().length
    const rawBytes = mapOutput.flat().reduce((sum, [w, c]) => sum + pairBytes(w, c), 0)

    return { splits, mapOutput, combinerOutput, grouped, reduced, bytesShuffled, pairCount, rawPairCount, rawBytes }
  }, [text, combinerOn])

  function run() {
    setStage(0)
  }

  function next() {
    setStage((s) => Math.min(STAGE_LABELS.length - 1, s + 1))
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Edit the sample text, choose whether a Combiner runs locally before the shuffle, then step through
        the classic word-count pipeline: Input Split → Map → Combine → Shuffle &amp; Sort → Reduce.
      </p>

      <textarea rows={2} value={text} onChange={(e) => { setText(e.target.value); setStage(-1) }} />

      <div className="row" style={{ marginTop: 12, justifyContent: 'space-between' }}>
        <label className="ctl">
          <input
            type="checkbox"
            checked={combinerOn}
            onChange={(e) => { setCombinerOn(e.target.checked); setStage(-1) }}
          />
          Use Combiner
        </label>
        <div className="row">
          <button className="btn amber" onClick={run}>Run</button>
          <button className="btn ghost" onClick={next} disabled={stage < 0 || stage >= STAGE_LABELS.length - 1}>
            Next stage →
          </button>
        </div>
      </div>

      {stage >= 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="badge-row">
            {STAGE_LABELS.map((label, i) => (
              <span key={label} className={`chip ${i <= stage ? 'amber' : 'drop'}`}>{i + 1}. {label}</span>
            ))}
          </div>

          {stage >= 0 && (
            <div className="card" style={{ margin: '12px 0' }}>
              <h3 style={{ fontSize: '1rem' }}>Input Splits</h3>
              <div className="grid3">
                {model.splits.map((s, i) => (
                  <div key={i} className="node active" style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Split {i}</div>
                    <div className="mono" style={{ fontSize: '.78rem' }}>{s.join(' ') || '(empty)'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage >= 1 && (
            <div className="card" style={{ margin: '12px 0' }}>
              <h3 style={{ fontSize: '1rem' }}>Map Output — (word, 1) pairs per split</h3>
              <div className="grid3">
                {model.mapOutput.map((pairs, i) => (
                  <div key={i} className="node" style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Split {i}</div>
                    {pairs.map(([w, c], j) => (
                      <span key={j} className="pill" style={{ fontSize: '.72rem' }}>({w},{c})</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage >= 2 && (
            <div className="card" style={{ margin: '12px 0' }}>
              <h3 style={{ fontSize: '1rem' }}>Combiner — local pre-aggregation</h3>
              {combinerOn ? (
                <div className="grid3">
                  {model.combinerOutput.map((pairs, i) => (
                    <div key={i} className="node active" style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Split {i} (combined)</div>
                      {pairs.map(([w, c], j) => (
                        <span key={j} className="chip amber" style={{ fontSize: '.72rem' }}>({w},{c})</span>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="note" style={{ margin: 0 }}>
                  Combiner disabled — every raw (word,1) pair from the Map stage is sent to the shuffle
                  unmodified, including duplicates within the same split.
                </p>
              )}
            </div>
          )}

          {stage >= 3 && (
            <div className="card" style={{ margin: '12px 0' }}>
              <h3 style={{ fontSize: '1rem' }}>Shuffle &amp; Sort — grouped by key</h3>
              <div className="badge-row">
                {Object.entries(model.grouped).sort((a, b) => a[0].localeCompare(b[0])).map(([w, counts]) => (
                  <span key={w} className="chip">{w}: [{counts.join(', ')}]</span>
                ))}
              </div>
              <div className="badge-row" style={{ marginTop: 10 }}>
                <span className={`chip ${combinerOn ? 'amber' : ''}`}>
                  {model.pairCount} pairs shuffled · ~{model.bytesShuffled} bytes over the network
                </span>
                {combinerOn && (
                  <span className="chip drop">
                    without combiner: {model.rawPairCount} pairs · ~{model.rawBytes} bytes
                  </span>
                )}
              </div>
            </div>
          )}

          {stage >= 4 && (
            <div className="card" style={{ margin: '12px 0' }}>
              <h3 style={{ fontSize: '1rem' }}>Reduce Output — final word counts</h3>
              <table className="data">
                <thead>
                  <tr><th>Word</th><th>Count</th></tr>
                </thead>
                <tbody>
                  {model.reduced.map(([w, c]) => (
                    <tr key={w}><td className="mono">{w}</td><td>{c}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
