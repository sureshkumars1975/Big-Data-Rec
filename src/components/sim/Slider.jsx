export default function Slider({ label, value, min, max, step = 1, unit = '', onChange, formatValue }) {
  const display = formatValue ? formatValue(value) : `${value}${unit}`
  return (
    <label className="ctl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
      <span style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span className="mono" style={{ color: 'var(--teal)', fontWeight: 700 }}>
          {display}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}
