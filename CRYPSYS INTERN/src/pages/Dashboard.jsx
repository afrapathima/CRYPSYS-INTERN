import { useState } from 'react'
import { useAuth } from '../auth.jsx'
import Logo from '../components/Logo.jsx'

const nav = ['Dashboard', 'Sales', 'Purchases', 'Inventory', 'Accounting', 'HR', 'Reports', 'Settings']
const stats = [
  { label: 'Revenue (month)', value: 'Rs. 4.82M', delta: '+12.4%' },
  { label: 'Open orders', value: '128', delta: '+8' },
  { label: 'Low stock items', value: '17', delta: '-3' },
  { label: 'Outstanding invoices', value: 'Rs. 1.26M', delta: '+2.1%' },
]
const bars = [42, 58, 51, 74, 66, 88, 79, 95, 84, 102, 91, 118]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const orders = [
  ['SO-1042', 'Ceylon Foods', 'Rs. 184,500', 'Paid'],
  ['SO-1041', 'Blue Wave Traders', 'Rs. 92,300', 'Pending'],
  ['SO-1040', 'Nila Hardware', 'Rs. 310,000', 'Shipped'],
  ['SO-1039', 'Harbour Cafe', 'Rs. 47,800', 'Paid'],
  ['SO-1038', 'Lotus Pharma', 'Rs. 256,900', 'Overdue'],
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [active, setActive] = useState('Dashboard')
  const [open, setOpen] = useState(false)
  const max = Math.max(...bars)

  return (
    <div className="app">
      <aside className={`side ${open ? 'open' : ''}`}>
        <Logo size={64} />
        <nav>
          {nav.map((n) => (
            <button key={n} className={n === active ? 'active' : ''} onClick={() => { setActive(n); setOpen(false) }}>{n}</button>
          ))}
        </nav>
      </aside>
      <div className="content">
        <header className="top">
          <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
          <input className="search" placeholder="Search orders, customers, items…" />
          <div className="who">
            <span className="avatar">{user.name?.[0] || 'U'}</span>
            <div><b>{user.name}</b><small>{user.business}</small></div>
            <button className="btn outline sm" onClick={logout}>Sign out</button>
          </div>
        </header>
        <section className="page">
          <h2>{active === 'Dashboard' ? `Good day, ${user.name.split(' ')[0]}` : active}</h2>
          {active !== 'Dashboard' ? (
            <p className="sub left">The {active} module is not built yet. Add its page and route here.</p>
          ) : (
            <>
              <div className="stats">
                {stats.map((s) => (
                  <div className="stat" key={s.label}>
                    <small>{s.label}</small><strong>{s.value}</strong><em>{s.delta} vs last month</em>
                  </div>
                ))}
              </div>
              <div className="grid">
                <div className="panel">
                  <h3>Sales by month</h3>
                  <div className="chart">
                    {bars.map((b, i) => (
                      <div key={i} className="col"><i style={{ height: `${(b / max) * 100}%` }} /><span>{months[i]}</span></div>
                    ))}
                  </div>
                </div>
                <div className="panel">
                  <h3>Recent sales orders</h3>
                  <div className="scroll">
                    <table>
                      <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o[0]}><td>{o[0]}</td><td>{o[1]}</td><td>{o[2]}</td><td><span className={`tag ${o[3].toLowerCase()}`}>{o[3]}</span></td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
