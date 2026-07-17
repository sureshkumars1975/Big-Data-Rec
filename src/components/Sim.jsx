// Wrapper card for a single interactive simulation.
// color should match one of the CSS vars registered in index.css: teal, amber, coral, violet, blue
export default function Sim({ title, tag = 'Simulation', color = 'teal', children }) {
  return (
    <div className="sim">
      <div className="head">
        <div className="t">
          <span className="tag" style={{ background: `var(--${color})` }}>
            {tag}
          </span>
          <h4>{title}</h4>
        </div>
      </div>
      <div className="body">{children}</div>
    </div>
  )
}
