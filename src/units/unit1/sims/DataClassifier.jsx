import { useState } from 'react'

const ITEMS = [
  { id: 'sales', label: 'Relational sales table (rows & columns)', correct: 'structured' },
  { id: 'sensor', label: 'CSV export of factory sensor readings', correct: 'structured' },
  { id: 'bank', label: 'Bank transaction ledger record', correct: 'structured' },
  { id: 'xml', label: 'XML product catalog feed', correct: 'semi' },
  { id: 'json', label: 'JSON response from a weather API', correct: 'semi' },
  { id: 'email', label: 'Email (To/From/Subject headers + free-text body)', correct: 'semi' },
  { id: 'log', label: 'Server log line (timestamp key=value pairs)', correct: 'semi' },
  { id: 'tweet', label: 'Text of a tweet / social post', correct: 'unstructured' },
  { id: 'photo', label: 'JPEG photo from a phone camera', correct: 'unstructured' },
  { id: 'video', label: 'MP4 CCTV footage', correct: 'unstructured' },
]

const BINS = [
  { id: 'structured', label: 'Structured', color: 'teal', hint: 'Fixed schema, rows & columns, lives happily in a RDBMS.' },
  { id: 'semi', label: 'Semi-structured', color: 'amber', hint: 'Has tags/keys for self-description but no rigid schema.' },
  { id: 'unstructured', label: 'Unstructured', color: 'coral', hint: 'No predefined model — text, images, audio, video.' },
]

export default function DataClassifier() {
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState(false)

  const answered = Object.keys(answers).length
  const score = ITEMS.filter((i) => answers[i.id] === i.correct).length

  function pick(itemId, binId) {
    if (revealed) return
    setAnswers((a) => ({ ...a, [itemId]: binId }))
  }

  function reset() {
    setAnswers({})
    setRevealed(false)
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        Classify each sample of digital data into one of the three types. Click a bin for every card, then
        check your answers.
      </p>
      <div className="col">
        {ITEMS.map((item) => {
          const chosen = answers[item.id]
          const isCorrect = revealed && chosen === item.correct
          const isWrong = revealed && chosen && chosen !== item.correct
          return (
            <div
              key={item.id}
              className="row"
              style={{
                justifyContent: 'space-between',
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: '10px 14px',
                background: isCorrect ? 'var(--teal-soft)' : isWrong ? 'var(--coral-soft)' : '#fff',
              }}
            >
              <span style={{ fontSize: '.92rem', flex: 1, minWidth: 220 }}>{item.label}</span>
              <div className="row" style={{ gap: 6 }}>
                {BINS.map((bin) => (
                  <button
                    key={bin.id}
                    className="btn ghost"
                    style={{
                      fontSize: '.78rem',
                      padding: '6px 10px',
                      borderColor: `var(--${bin.color})`,
                      color: chosen === bin.id ? '#fff' : `var(--${bin.color})`,
                      background: chosen === bin.id ? `var(--${bin.color})` : '#fff',
                    }}
                    onClick={() => pick(item.id, bin.id)}
                  >
                    {bin.label}
                  </button>
                ))}
                {revealed && chosen !== item.correct && (
                  <span className="pill" style={{ fontSize: '.72rem' }}>
                    answer: {BINS.find((b) => b.id === item.correct).label}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="row" style={{ marginTop: 16, justifyContent: 'space-between' }}>
        <div className="row" style={{ gap: 16 }}>
          {BINS.map((b) => (
            <span key={b.id} className="pill">
              <b style={{ color: `var(--${b.color})` }}>{b.label}</b>: {b.hint}
            </span>
          ))}
        </div>
      </div>

      <div className="row" style={{ marginTop: 14 }}>
        <button className="btn" onClick={() => setRevealed(true)} disabled={answered < ITEMS.length}>
          Check answers ({answered}/{ITEMS.length} classified)
        </button>
        <button className="btn ghost" onClick={reset}>
          Reset
        </button>
        {revealed && (
          <span className="note teal" style={{ margin: 0 }}>
            Score: {score} / {ITEMS.length} correct
          </span>
        )}
      </div>
    </div>
  )
}
