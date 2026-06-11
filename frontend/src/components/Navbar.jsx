import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate    = useNavigate()
  const location    = useLocation()
  const token       = localStorage.getItem('access_token')
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/login')
  }

  const isHome   = location.pathname === '/'
  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav style={{
        ...styles.nav,
        background: scrolled || !isHome
          ? 'rgba(0,0,0,0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #111' : '1px solid transparent',
      }}>

        {/* لوغو */}
        <Link to="/" style={styles.logo}>
          <img src="/logo.png" alt="تصميمك" style={{ height: 44, objectFit: 'contain' }}
            onError={e => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span style={{ display: 'none', fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, letterSpacing: 3, color: '#fff' }}>
            تصميمك<span style={{ color: '#00d4ff' }}>.</span>
          </span>
        </Link>

        {/* روابط وسط */}
        <div style={styles.links}>
          {[
            ['/',        'الرئيسية'],
            ['/designs', 'التصاميم'],
            ['/ai',      'توليد AI'],
          ].map(([path, label]) => (
            <Link key={path} to={path} style={{
              ...styles.link,
              color:        isActive(path) ? '#fff' : '#888',
              borderBottom: isActive(path) ? '2px solid #00d4ff' : '2px solid transparent',
            }}>
              {label}
            </Link>
          ))}
        </div>

        {/* يمين */}
        <div style={styles.right}>
          {token ? (
            <>
              <Link to="/orders"         style={styles.iconBtn} title="طلباتي">📦</Link>
              <Link to="/profile"        style={styles.iconBtn} title="بروفايلي">👤</Link>
              <Link to="/admin-dashboard" style={styles.iconBtn} title="لوحة التحكم">⚙️</Link>
              <button
                onClick={logout}
                className="btn btn-outline-white"
                style={{ padding: '8px 22px', fontSize: 12, letterSpacing: 1 }}
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ ...styles.link, color: '#888' }}>دخول</Link>
              <Link to="/register" className="btn btn-white" style={{ padding: '8px 24px', fontSize: 13 }}>
                انضم الآن
              </Link>
            </>
          )}
        </div>

        {/* زر موبايل */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={styles.menuBtn}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* قائمة موبايل */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {[['/', 'الرئيسية'], ['/designs', 'التصاميم'], ['/ai', 'توليد AI'], ['/orders', 'طلباتي'], ['/profile', 'بروفايلي']].map(([path, label]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              style={styles.mobileLink}
            >
              {label}
            </Link>
          ))}
          {token ? (
            <button onClick={logout} style={{ ...styles.mobileLink, background: 'none', border: 'none', textAlign: 'right', width: '100%', color: '#ff4444', cursor: 'pointer' }}>
              تسجيل الخروج
            </button>
          ) : (
            <Link to="/register" onClick={() => setMenuOpen(false)} style={{ ...styles.mobileLink, color: '#00d4ff' }}>
              إنشاء حساب
            </Link>
          )}
        </div>
      )}

      <style>{`
        nav a { transition: all 0.2s; }
        nav a:hover { color: #fff !important; }
      `}</style>
    </>
  )
}

const styles = {
  nav: {
    position:   'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display:    'flex', alignItems: 'center', justifyContent: 'space-between',
    padding:    '0 48px', height: 64,
    transition: 'all 0.3s ease',
  },
  logo: {
    display: 'flex', alignItems: 'center',
  },
  links: {
    display: 'flex', gap: 36,
  },
  link: {
    fontSize: 13, fontWeight: 600,
    letterSpacing: 1, textTransform: 'uppercase',
    transition: 'all 0.2s', paddingBottom: 4,
  },
  right:   { display: 'flex', alignItems: 'center', gap: 16 },
  iconBtn: {
    color: '#888', fontSize: 18,
    transition: 'all 0.2s', padding: '4px',
  },
  menuBtn: {
    display: 'none', background: 'none', border: 'none',
    color: '#fff', fontSize: 22, cursor: 'pointer',
    '@media(max-width:768px)': { display: 'block' }
  },
  mobileMenu: {
    position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
    background: 'rgba(0,0,0,0.97)', backdropFilter: 'blur(12px)',
    padding: '20px 24px', borderBottom: '1px solid #111',
    display: 'flex', flexDirection: 'column', gap: 4,
  },
  mobileLink: {
    display: 'block', padding: '14px 0',
    color: '#aaa', fontSize: 15, fontWeight: 600,
    letterSpacing: 1, textTransform: 'uppercase',
    borderBottom: '1px solid #111',
  },
}