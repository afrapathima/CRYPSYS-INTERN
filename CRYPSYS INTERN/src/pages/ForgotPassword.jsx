import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../auth.jsx'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Enter a valid email address.')
    setBusy(true); setErr('')
    await forgotPassword(email)
    setBusy(false); setSent(true)
  }

  return (
    <AuthLayout>
      <Logo size={72} />
      <h2 className="big">Forgot Password?</h2>
      {sent ? (
        <p className="success">If <b>{email}</b> is registered, a reset link is on its way. Check your inbox.</p>
      ) : (
        <>
          <p className="sub">Enter your registered email address and we will send you a link to reset your password.</p>
          <form onSubmit={submit} noValidate>
            <label>Email Address
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" />
            </label>
            {err && <p className="error" role="alert">{err}</p>}
            <button className="btn" disabled={busy}>{busy ? 'Sending…' : 'Send Reset Link'}</button>
          </form>
        </>
      )}
      <p className="foot"><Link to="/login">← Back to Login</Link></p>
    </AuthLayout>
  )
}
