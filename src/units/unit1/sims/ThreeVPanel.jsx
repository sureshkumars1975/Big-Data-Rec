import { useMemo, useState } from 'react'
import Slider from '../../../components/sim/Slider.jsx'

const PALETTE = ['#0f766e', '#b5842a', '#b4472e', '#5b4b8a', '#2b5a8a', '#1f8a4c']
const SHAPES = ['sales record', 'tweet', 'sensor reading', 'video frame', 'log line', 'GPS ping']

export default function ThreeVPanel() {
  const [volume, setVolume] = useState(4)
  const [velocity, setVelocity] = useState(4)
  const [variety, setVariety] = useState(3)

  const packets = useMemo(() => {
    const count = 8 + volume * 4
    return Array.from({ length: count }, (_, i) => {
      const colorIdx = i % Math.max(1, variety)
      return {
        id: i,
        top: 10 + ((i * 37) % 140),
        size: 10 + (i % 3) * 4,
        color: PALETTE[colorIdx],
        delay: -(i % 12) * 0.4,
        duration: Math.max(1.4, 6.5 - velocity * 0.55),
        shape: SHAPES[colorIdx],
      }
    })
  }, [volume, velocity, variety])

  const veracityNote =
    variety >= 5
      ? 'High variety across many formats makes veracity (trustworthiness) harder to guarantee — expect more cleaning.'
      : 'Fewer formats keep the pipeline simpler, but you may be missing signal that lives in unstructured sources.'

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Adjust the three defining dimensions of Big Data and watch the data stream respond: more <b>Volume</b>{' '}
        means more packets, more <b>Velocity</b> means they move faster, and more <b>Variety</b> means more
        distinct kinds of data (colors) flowing at once.
      </p>

      <div className="grid3">
        <Slider label="Volume" value={volume} min={1} max={10} onChange={setVolume} formatValue={(v) => `${v}/10`} />
        <Slider label="Velocity" value={velocity} min={1} max={10} onChange={setVelocity} formatValue={(v) => `${v}/10`} />
        <Slider label="Variety" value={variety} min={1} max={6} onChange={setVariety} formatValue={(v) => `${v} formats`} />
      </div>

      <div className="flow-box" style={{ marginTop: 16 }}>
        {packets.map((p) => (
          <span
            key={p.id}
            className="packet"
            title={p.shape}
            style={{
              top: p.top,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="badge-row">
        <span className="chip">Volume {volume}/10 → ~{8 + volume * 4} records/tick</span>
        <span className="chip amber">Velocity {velocity}/10 → {Math.max(1.4, 6.5 - velocity * 0.55).toFixed(1)}s traversal</span>
        <span className="chip" style={{ background: 'var(--violet-soft)', color: '#3d3160', borderColor: '#cfc3e8' }}>
          Variety {variety} data formats
        </span>
      </div>

      <p className="note" style={{ marginTop: 12 }}>{veracityNote}</p>
    </div>
  )
}
