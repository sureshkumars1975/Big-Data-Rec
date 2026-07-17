import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Unit1 from './units/unit1/index.jsx'
import Unit2 from './units/unit2/index.jsx'
import Unit3 from './units/unit3/index.jsx'
import Unit4 from './units/unit4/index.jsx'
import Unit5 from './units/unit5/index.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="unit-1" element={<Unit1 />} />
        <Route path="unit-2" element={<Unit2 />} />
        <Route path="unit-3" element={<Unit3 />} />
        <Route path="unit-4" element={<Unit4 />} />
        <Route path="unit-5" element={<Unit5 />} />
      </Route>
    </Routes>
  )
}

export default App
