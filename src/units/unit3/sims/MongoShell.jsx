import { useState } from 'react'
import Terminal from '../../../components/sim/Terminal.jsx'

const SEED = [
  { _id: 1, name: 'Anita Rao', age: 21, dept: 'CS', grades: [88, 91, 76] },
  { _id: 2, name: 'Vikram Shah', age: 22, dept: 'ECE', grades: [65, 72, 80] },
  { _id: 3, name: 'Priya Menon', age: 20, dept: 'CS', grades: [95, 89, 93] },
  { _id: 4, name: 'Karthik Iyer', age: 23, dept: 'ME', grades: [55, 60, 58] },
  { _id: 5, name: 'Sneha Pillai', age: 21, dept: 'CS', grades: [78, 82, 85] },
]

function fmt(docs) {
  if (docs.length === 0) return '[ ] (empty result set)'
  return docs.map((d) => JSON.stringify(d)).join('\n')
}

function parseLoose(str) {
  try {
    const withQuotedKeys = str.replace(/([{,]\s*)(\$?[A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')
    return JSON.parse(withQuotedKeys)
  } catch {
    return null
  }
}

function matches(doc, query) {
  if (!query || Object.keys(query).length === 0) return true
  return Object.entries(query).every(([key, cond]) => {
    const val = doc[key]
    if (cond && typeof cond === 'object' && !Array.isArray(cond)) {
      return Object.entries(cond).every(([op, opVal]) => {
        if (op === '$eq') return val === opVal
        if (op === '$gt') return val > opVal
        if (op === '$gte') return val >= opVal
        if (op === '$lt') return val < opVal
        if (op === '$lte') return val <= opVal
        if (op === '$in') return Array.isArray(opVal) && opVal.includes(val)
        return false
      })
    }
    if (Array.isArray(val)) return val.includes(cond)
    return val === cond
  })
}

export default function MongoShell() {
  const [docs, setDocs] = useState(SEED)
  const [nextId, setNextId] = useState(SEED.length + 1)

  function resolver(cmd) {
    const findMatch = cmd.match(/^db\.students\.find\((.*)\)$/s)
    if (findMatch) {
      const arg = findMatch[1].trim()
      const query = arg ? parseLoose(arg) : {}
      if (arg && query === null) return { output: `SyntaxError: could not parse query: ${arg}`, isError: true }
      const result = docs.filter((d) => matches(d, query))
      return { output: fmt(result) }
    }

    const insertOneMatch = cmd.match(/^db\.students\.insertOne\((.*)\)$/s)
    if (insertOneMatch) {
      const doc = parseLoose(insertOneMatch[1])
      if (!doc) return { output: 'SyntaxError: insertOne expects a single JSON document', isError: true }
      const withId = { _id: nextId, grades: [], ...doc }
      setDocs((d) => [...d, withId])
      setNextId((n) => n + 1)
      return { output: `{ acknowledged: true, insertedId: ${withId._id} }` }
    }

    const insertManyMatch = cmd.match(/^db\.students\.insertMany\(\[(.*)\]\)$/s)
    if (insertManyMatch) {
      const parsed = parseLoose(`[${insertManyMatch[1]}]`)
      if (!Array.isArray(parsed)) return { output: 'SyntaxError: insertMany expects an array of documents', isError: true }
      let id = nextId
      const withIds = parsed.map((doc) => ({ _id: id++, grades: [], ...doc }))
      setDocs((d) => [...d, ...withIds])
      setNextId(id)
      return { output: `{ acknowledged: true, insertedIds: [${withIds.map((d) => d._id).join(', ')}] }` }
    }

    const updateOneMatch = cmd.match(/^db\.students\.updateOne\((.*)\)$/s)
    if (updateOneMatch) {
      const parts = updateOneMatch[1].trim()
      const splitIdx = findTopLevelComma(parts)
      if (splitIdx === -1) return { output: 'SyntaxError: updateOne(filter, update) needs two arguments', isError: true }
      const filter = parseLoose(parts.slice(0, splitIdx))
      const update = parseLoose(parts.slice(splitIdx + 1))
      if (!filter || !update || !update.$set) {
        return { output: 'SyntaxError: expected updateOne({...filter}, { $set: {...} })', isError: true }
      }
      let matched = 0
      setDocs((all) =>
        all.map((d) => {
          if (matched === 0 && matches(d, filter)) {
            matched = 1
            return { ...d, ...update.$set }
          }
          return d
        }),
      )
      return { output: matched ? '{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }' : '{ acknowledged: true, matchedCount: 0, modifiedCount: 0 }' }
    }

    const deleteOneMatch = cmd.match(/^db\.students\.deleteOne\((.*)\)$/s)
    if (deleteOneMatch) {
      const filter = parseLoose(deleteOneMatch[1])
      if (!filter) return { output: 'SyntaxError: deleteOne expects a filter document', isError: true }
      let removed = 0
      setDocs((all) => {
        const idx = all.findIndex((d) => matches(d, filter))
        if (idx === -1) return all
        removed = 1
        return all.filter((_, i) => i !== idx)
      })
      return { output: removed ? '{ acknowledged: true, deletedCount: 1 }' : '{ acknowledged: true, deletedCount: 0 }' }
    }

    if (cmd === 'db.students.count()' || cmd === 'db.students.countDocuments()') {
      return { output: `${docs.length}` }
    }

    return {
      output: `Unrecognized command: ${cmd}\nTry: db.students.find(), db.students.find({dept: "CS"}), db.students.insertOne({...}), db.students.updateOne({...}, {$set:{...}}), db.students.deleteOne({...})`,
      isError: true,
    }
  }

  return (
    <div>
      <p className="lead" style={{ marginBottom: 14 }}>
        A live in-memory <code>students</code> collection. Type real MongoDB shell commands below — inserts,
        updates and deletes actually mutate the collection state.
      </p>
      <Terminal
        prompt=">"
        welcome={[
          'MongoDB shell sandbox — students collection loaded (5 documents).',
          'Try: db.students.find({dept: "CS"})',
          'Try: db.students.insertOne({name: "Rahul Dev", age: 22, dept: "IT"})',
          'Try: db.students.updateOne({name: "Anita Rao"}, {$set: {age: 22}})',
        ]}
        resolver={resolver}
        placeholder="db.students.find(...)"
      />
    </div>
  )
}

function findTopLevelComma(str) {
  let depth = 0
  for (let i = 0; i < str.length; i++) {
    const c = str[i]
    if (c === '{' || c === '[') depth++
    else if (c === '}' || c === ']') depth--
    else if (c === ',' && depth === 0) return i
  }
  return -1
}
