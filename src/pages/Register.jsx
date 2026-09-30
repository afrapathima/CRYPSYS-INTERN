import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'
import Logo from '../components/Logo.jsx'
import { useAuth } from '../auth.jsx'

const steps = ['Business', 'Admin account', 'Review']
const init = { business: '', industry: '', country: '', name: '', email: '', username: '', password: '', confirm: '', terms: false }

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [f, setF] = useState(init)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const validate = () => {
    if (step === 0 && (!f.business || !f.industry || !f.country)) return 'Fill in all business details.'
    if (step === 1) {
      if (!f.name || !f.username) return 'Enter your name and a username.'
      if (!/^\S+@\S+\.\S+$/.test(f.email)) return 'Enter a valid email address.'
      if (f.password.length < 8) return 'Password must be at least 8 characters.'
      if (f.password !== f.confirm) return 'Passwords do not match.'
    }
    if (step === 2 && !f.terms) return 'Accept the terms to continue.'
    return ''
  }

  const next = async (e) => {
    e.preventDefault()
    const v = validate(); setErr(v)
    if (v) return
    if (step < 2) return setStep(step + 1)
    setBusy(true)
    try {
      const { confirm, terms, ...data } = f
      await register(data)
      nav('/login')
    } catch (x) { setErr(x.message) }
    finally { setBusy(false) }
  }

  return (
    <AuthLayout>
      <Logo size={72} />
      <h2 className="big">Register Business</h2>
      <ol className="steps">
        {steps.map((s, i) => <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''}>{s}</li>)}
      </ol>
      <form onSubmit={next} noValidate>
        {step === 0 && <>
          <label>Business name<input value={f.business} onChange={set('business')} placeholder="e.g. Lanka Traders (Pvt) Ltd" /></label>
          <label>Industry
            <select value={f.industry} onChange={set('industry')}>
              <option value="">Select industry</option>
              {['Retail', 'Manufacturing', 'Distribution', 'Services', 'Hospitality', 'Other'].map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label>Country<input value={f.country} onChange={set('country')} placeholder="e.g. Sri Lanka" /></label>
        </>}
        {step === 1 && <>
          <label>Full name<input value={f.name} onChange={set('name')} placeholder="Your full name" /></label>
          <label>Email<input type="email" value={f.email} onChange={set('email')} placeholder="you@company.com" /></label>
          <label>Username<input value={f.username} onChange={set('username')} placeholder="Choose a username" /></label>
          <label>Password<input type="password" value={f.password} onChange={set('password')} placeholder="At least 8 characters" /></label>
          <label>Confirm password<input type="password" value={f.confirm} onChange={set('confirm')} placeholder="Re-enter password" /></label>
        </>}
        {step === 2 && <>
          <dl className="review">
            <dt>Business</dt><dd>{f.business}</dd>
            <dt>Industry</dt><dd>{f.industry}</dd>
            <dt>Country</dt><dd>{f.country}</dd>
            <dt>Admin</dt><dd>{f.name} ({f.username})</dd>
            <dt>Email</dt><dd>{f.email}</dd>
          </dl>
          <label className="check"><input type="checkbox" checked={f.terms} onChange={set('terms')} /> I agree to the Terms of Service and Privacy Policy</label>
        </>}
        {err && <p className="error" role="alert">{err}</p>}
        <div className="btns">
          {step > 0 && <button type="button" className="btn outline" onClick={() => { setStep(step - 1); setErr('') }}>Back</button>}
          <button className="btn" disabled={busy}>{step < 2 ? 'Continue' : busy ? 'Creating…' : 'Create Account'}</button>
        </div>
      </form>
      <p className="foot">Already registered? <Link to="/login">Sign In</Link></p>
    </AuthLayout>
  )
}
