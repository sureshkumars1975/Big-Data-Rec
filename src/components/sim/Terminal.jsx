import { useRef, useState } from 'react'

// Generic fake command-line sandbox. Each unit supplies its own `resolver`
// function that maps an input command string to a text response, so the
// same component drives MongoDB shell, CQLSH, Hive, Pig and HDFS CLI demos.
//
// resolver(command: string) => { output: string, isError?: boolean }
export default function Terminal({ prompt = '$', welcome = [], resolver, placeholder = 'type a command…' }) {
  const [history, setHistory] = useState(() => welcome.map((line) => ({ type: 'info', text: line })))
  const [value, setValue] = useState('')
  const [past, setPast] = useState([])
  const [cursor, setCursor] = useState(-1)
  const scrollRef = useRef(null)

  function run(cmd) {
    const trimmed = cmd.trim()
    if (!trimmed) return
    const result = resolver(trimmed)
    setHistory((h) => [
      ...h,
      { type: 'cmd', text: trimmed },
      { type: result.isError ? 'err' : 'out', text: result.output },
    ])
    setPast((p) => [...p, trimmed])
    setCursor(-1)
    setValue('')
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    })
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      run(value)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (past.length === 0) return
      const idx = cursor === -1 ? past.length - 1 : Math.max(0, cursor - 1)
      setCursor(idx)
      setValue(past[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (cursor === -1) return
      const idx = cursor + 1
      if (idx >= past.length) {
        setCursor(-1)
        setValue('')
      } else {
        setCursor(idx)
        setValue(past[idx])
      }
    }
  }

  return (
    <div>
      <div className="term" ref={scrollRef}>
        {history.map((line, i) =>
          line.type === 'cmd' ? (
            <div key={i}>
              <span className="prompt">{prompt} </span>
              {line.text}
            </div>
          ) : (
            <div key={i} className={line.type === 'err' ? 'err' : 'out'}>
              {line.text}
            </div>
          ),
        )}
      </div>
      <div className="term-input-row">
        <span className="prompt">{prompt}</span>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
        />
        <button className="btn" onClick={() => run(value)}>
          Run
        </button>
      </div>
    </div>
  )
}
