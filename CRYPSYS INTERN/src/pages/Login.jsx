import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../auth.jsx'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ id: '', pw: '', remember: false })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!f.id || !f.pw) return setErr('Enter your email or username and password.')
    setBusy(true); setErr('')
    try { await login(f.id.trim(), f.pw, f.remember); nav('/verify') }
    catch (x) { setErr(x.message) }
    finally { setBusy(false) }
  }

  return (
    <AuthLayout>
      <Logo size={72} />
      <h2>Welcome Back</h2>
      <p className="sub">Sign in to your CRYPSYS Intern account</p>
      <form onSubmit={submit} noValidate>
        <label>Email or Username
          <input value={f.id} onChange={(e) => setF({ ...f, id: e.target.value })} placeholder="Enter your email or username" autoComplete="username" />
        </label>
        <label>Password
          <span className="pw">
            <input type={show ? 'text' : 'password'} value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} placeholder="Enter your password" autoComplete="current-password" />
            <button type="button" className="ghost" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
          </span>
        </label>
        <div className="row">
          <label className="check"><input type="checkbox" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })} /> Remember me</label>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Signing in…' : 'Sign In'}</button>
      </form>
      <p className="foot">Don't have a registered business? <Link to="/register">Register Business</Link></p>
      <p className="note">Demo login: admin / admin123</p>
    </AuthLayout>
  )
}
