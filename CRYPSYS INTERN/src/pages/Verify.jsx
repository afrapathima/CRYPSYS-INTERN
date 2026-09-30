import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../auth.jsx'

export default function Verify() {
  const { pending, verifyOtp } = useAuth()
  const nav = useNavigate()
  const [digits, setDigits] = useState(Array(6).fill(''))
  const [left, setLeft] = useState(30)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const refs = useRef([])

  useEffect(() => {
    if (left <= 0) return
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left])

  if (!pending) return <Navigate to="/login" replace />

  const change = (i, v) => {
    v = v.replace(/\D/g, '').slice(-1)
    const d = [...digits]; d[i] = v; setDigits(d)
    if (v && i < 5) refs.current[i + 1].focus()
  }
  const key = (i, e) => { if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1].focus() }
  const paste = (e) => {
    const p = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!p) return
    e.preventDefault()
    setDigits(Array.from({ length: 6 }, (_, i) => p[i] || ''))
    refs.current[Math.min(p.length, 5)].focus()
  }

  const submit = async (e) => {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < 6) return setErr('Enter all 6 digits.')
    setBusy(true); setErr('')
    try { await verifyOtp(code); nav('/dashboard') }
    catch (x) { setErr(x.message) }
    finally { setBusy(false) }
  }

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  return (
    <AuthLayout>
      <Logo size={72} />
      <h2 className="big">Verify Your Identity</h2>
      <p className="sub">Enter the 6-digit verification code sent to your registered email or device.</p>
      <form onSubmit={submit}>
        <div className="otp" onPaste={paste}>
          {digits.map((d, i) => (
            <input key={i} ref={(el) => (refs.current[i] = el)} value={d} inputMode="numeric" maxLength={1}
              autoFocus={i === 0} aria-label={`Digit ${i + 1}`}
              onChange={(e) => change(i, e.target.value)} onKeyDown={(e) => key(i, e)} />
          ))}
        </div>
        <p className="timer">Resend code in <b>{mm}:{ss}</b></p>
        <p className="foot">Didn't receive the code?{' '}
          <button type="button" className="link" disabled={left > 0} onClick={() => { setLeft(30); setErr('') }}>Resend Code</button>
        </p>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Verifying…' : 'Verify & Continue'}</button>
      </form>
      <p className="foot"><Link to="/login">← Back to Login</Link></p>
    </AuthLayout>
  )
}
