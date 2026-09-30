// Swap for <img src="/logo.png" /> once you add your logo file to /public
export default function Logo({ size = 72 }) {
  return (
    <div className="logo" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" width={size * 0.6} height={size * 0.6} fill="none">
        <path d="M30 6c-6 6-3 12-10 16-6 3-10 8-8 14 2 5 9 7 15 4" stroke="#ffcff6" strokeWidth="4" strokeLinecap="box" />
        <path d="M14 30c4 6 12 6 18 0" stroke="#100911" strokeWidth="3" strokeLinecap="box" />
      </svg>
      <span style={{ fontSize: Math.max(size * 0.12, 8) }}>CRYPSYS<b>Intern</b></span>
    </div>
  )
}
