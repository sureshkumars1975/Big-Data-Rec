import { useState } from 'react'

const FIELDS = [
  { key: '_id', value: 'ObjectId("64f1a2b3c9e77a001f3d1234")', type: 'ObjectId', note: 'Unique 12-byte identifier, auto-generated for every document.' },
  { key: 'name', value: '"Anita Rao"', type: 'String', note: 'UTF-8 text.' },
  { key: 'age', value: '21', type: 'Number (Int32)', note: 'Numeric — BSON distinguishes Int32, Int64 and Double.' },
  { key: 'isActive', value: 'true', type: 'Boolean', note: 'true / false.' },
  { key: 'grades', value: '[88, 91, 76]', type: 'Array', note: 'Ordered list — elements can even be mixed types.' },
  { key: 'address', value: '{ city: "Chennai", pin: "600001" }', type: 'Object (embedded document)', note: 'A nested BSON document — no join needed.' },
  { key: 'joinedAt', value: 'ISODate("2024-06-01T00:00:00Z")', type: 'Date', note: 'Stored as milliseconds since epoch.' },
  { key: 'middleName', value: 'null', type: 'Null', note: 'Explicitly represents "no value".' },
]

export default function BsonDocInspector() {
  const [active, setActive] = useState(null)

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Click any field in this sample student document to see its BSON data type.
      </p>
      <div className="term" style={{ marginBottom: 14 }}>
        <div className="out">{'{'}</div>
        {FIELDS.map((f) => (
          <div
            key={f.key}
            className="out"
            onClick={() => setActive(f.key)}
            style={{
              cursor: 'pointer',
              paddingLeft: 16,
              background: active === f.key ? 'rgba(255,255,255,.08)' : 'transparent',
              borderRadius: 4,
            }}
          >
            <span className="prompt">{f.key}</span>: {f.value},
          </div>
        ))}
        <div className="out">{'}'}</div>
      </div>
      {active ? (
        (() => {
          const f = FIELDS.find((x) => x.key === active)
          return (
            <div className="note coral">
              <b>{f.key}</b> → type <span className="chip amber">{f.type}</span>
              <br />
              {f.note}
            </div>
          )
        })()
      ) : (
        <p className="note">Select a field above to inspect its BSON type.</p>
      )}
    </div>
  )
}
