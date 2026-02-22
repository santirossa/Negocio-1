import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store'
import { useAuthStore } from '../store'
import { useToastStore } from '../store'

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const cartCount = useCartStore(s => s.count())
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const toast = useToastStore()

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/tienda', label: 'Tienda' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/contacto', label: 'Contacto' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 'var(--nav-h)',
        display: 'flex', alignItems: 'center',
        padding: '0 clamp(16px, 4vw, 48px)',
        background: scrolled ? 'rgba(246,241,233,0.92)' : 'rgba(246,241,233,0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(196,164,107,0.15)' : 'transparent'}`,
        transition: 'all 0.4s ease',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.6rem',
          fontWeight: 300,
          letterSpacing: '0.1em',
          color: 'var(--black)',
          flex: 1,
        }}>
          FARINE<span style={{ color: 'var(--gold)' }}>.</span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hide-mobile">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: location.pathname === l.to ? 'var(--gold)' : 'var(--text-2)',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = location.pathname === l.to ? 'var(--gold)' : 'var(--text-2)'}
            >{l.label}</Link>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 24 }}>
          {/* Account */}
          <Link to={user ? '/cuenta' : '/login'} style={{
            width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--r-full)',
            color: 'var(--text)',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,164,107,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>

          {/* Cart */}
          <Link to="/carrito" style={{
            width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 'var(--r-full)',
            color: 'var(--text)',
            position: 'relative',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(196,164,107,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 16, height: 16,
                    background: 'var(--gold)',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '0.58rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >{cartCount}</motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Menu button */}
          <button
            onClick={() => setDrawerOpen(o => !o)}
            style={{
              width: 40, height: 40,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 5,
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--r-full)',
              cursor: 'pointer',
            }}
          >
            {[0,1,2].map(i => (
              <motion.span key={i}
                animate={drawerOpen ? {
                  rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
                  y: i === 0 ? 6 : i === 2 ? -6 : 0,
                  opacity: i === 1 ? 0 : 1,
                  scaleX: i === 1 ? 0 : 1,
                } : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'block', width: 18, height: 1.5, background: 'var(--black)', borderRadius: 2 }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Drawer overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 150,
              background: 'rgba(22,20,15,0.45)',
              backdropFilter: 'blur(4px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(340px, 88vw)',
              background: 'var(--white)',
              zIndex: 200,
              display: 'flex', flexDirection: 'column',
              padding: '80px 40px 40px',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.1 }}
                >
                  <Link to={l.to} style={{
                    display: 'block',
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.2rem',
                    fontWeight: 300,
                    color: location.pathname === l.to ? 'var(--gold)' : 'var(--black)',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--cream-3)',
                    transition: 'color 0.2s, padding-left 0.25s',
                  }}
                    onMouseEnter={e => { e.target.style.color = 'var(--gold)'; e.target.style.paddingLeft = '8px' }}
                    onMouseLeave={e => {
                      e.target.style.color = location.pathname === l.to ? 'var(--gold)' : 'var(--black)'
                      e.target.style.paddingLeft = '0'
                    }}
                  >{l.label}</Link>
                </motion.div>
              ))}
            </nav>

            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to={user ? '/cuenta' : '/login'} style={{ fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--text-2)', textTransform: 'uppercase' }}>
                {user ? `Mi cuenta — ${user.name.split(' ')[0]}` : 'Iniciar sesión'}
              </Link>
              {user && (
                <button onClick={handleLogout} style={{
                  background: 'none', border: 'none',
                  fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--text-3)', textTransform: 'uppercase',
                  cursor: 'pointer', textAlign: 'left', padding: 0,
                }}>
                  Cerrar sesión →
                </button>
              )}
            </div>

            <div style={{ marginTop: 'auto' }}>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>FARINE.</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>Artesanía del tiempo.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {[
          { to: '/', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>, label: 'Inicio' },
          { to: '/tienda', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, label: 'Tienda' },
          { to: '/carrito', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>, label: 'Carrito', badge: cartCount },
          { to: user ? '/cuenta' : '/login', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Cuenta' },
        ].map(item => (
          <Link key={item.to} to={item.to}
            className={`bnav-item ${location.pathname === item.to ? 'active' : ''}`}
          >
            {item.icon}
            {item.label}
            {item.badge > 0 && <span className="bnav-badge">{item.badge}</span>}
          </Link>
        ))}
      </nav>

      <style>{`.hide-mobile { display: none; } @media(min-width:768px){.hide-mobile{display:flex;}}`}</style>
    </>
  )
}
