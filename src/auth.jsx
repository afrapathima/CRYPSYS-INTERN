import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const DEMO_OTP = '123456' // demo only – validate on your server
const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || sessionStorage.getItem(k)) } catch { return null } }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read('crypsys_user'))
  const [pending, setPending] = useState(null) // user waiting for OTP

  // Step 1: credentials. Replace with POST /api/auth/login
  const login = async (identifier, password, remember) => {
    await new Promise((r) => setTimeout(r, 600))
    const accounts = read('crypsys_accounts') || []
    const acc = accounts.find(
      (a) => (a.email === identifier || a.username === identifier) && a.password === password
    )
    if (!acc && !(identifier === 'admin' && password === 'admin123'))
      throw new Error('Invalid email/username or password.')
    setPending({
      name: acc?.name || 'Admin User',
      email: acc?.email || 'admin@crypsys.com',
      business: acc?.business || 'CRYPSYS Demo Co.',
      remember,
    })
  }

  // Step 2: OTP. Replace with POST /api/auth/verify-otp
  const verifyOtp = async (code) => {
    await new Promise((r) => setTimeout(r, 500))
    if (code !== DEMO_OTP) throw new Error('Incorrect code. Demo code is 123456.')
    const { remember, ...u } = pending
    setUser(u)
    ;(remember ? localStorage : sessionStorage).setItem('oneorca_user', JSON.stringify(u))
    setPending(null)
  }

  // Replace with POST /api/auth/register
  const register = async (data) => {
    await new Promise((r) => setTimeout(r, 700))
    const accounts = read('crypsys_accounts') || []
    if (accounts.some((a) => a.email === data.email)) throw new Error('This email is already registered.')
    localStorage.setItem('crypsys_accounts', JSON.stringify([...accounts, data]))
  }

  const forgotPassword = async () => new Promise((r) => setTimeout(r, 600)) // POST /api/auth/forgot

  const logout = () => {
    localStorage.removeItem('crypsys_user')
    sessionStorage.removeItem('crypsys_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, pending, login, verifyOtp, register, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
