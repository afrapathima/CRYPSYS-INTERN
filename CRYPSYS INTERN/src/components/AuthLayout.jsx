import Logo from './Logo.jsx'

export default function AuthLayout({ children }) {
  return (
    <div className="auth">
      <aside className="auth-hero">
        <Logo size={84} />
        <div className="hero-copy">
          <h1>One Platform.<br /><span>Smarter</span> Business.</h1>
          <p>Manage your business operations with a simple, secure and powerful ERP platform designed to help your organization work smarter.</p>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-card">{children}</div>
      </main>
    </div>
  )
}
