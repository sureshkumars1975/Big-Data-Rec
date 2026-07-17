import { NavLink, Outlet } from 'react-router-dom'
import { UNITS } from '../data/course.js'

export default function Layout() {
  return (
    <>
      <header className="site">
        <div className="bar">
          <NavLink to="/" className="brand">
            <span className="k">Big <b>Data</b> Architecture</span>
            <span className="sub">Interactive Course</span>
          </NavLink>
          <nav className="tabs">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
              Home
            </NavLink>
            {UNITS.map((u) => (
              <NavLink
                key={u.id}
                to={`/${u.id}`}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Unit {u.number}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="wrap">
        <div className="view">
          <Outlet />
        </div>
      </main>
      <footer className="site">
        Big Data Architecture — Interactive Course · Built for hands-on learning with in-browser simulations
      </footer>
    </>
  )
}
