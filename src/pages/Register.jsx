import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store'
import { useToastStore } from '../store'

function pwStrength(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function Register() {
  const navigate = useNavigate()
  const register = useAuthStore(s => s.register)
  const isLoggedIn = useAuthStore(s => !!s.user)
  const toast = useToastStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (isLoggedIn) navigate('/cuenta') }, [])

  const strength = pwStrength(password)
  const strengthColor = ['', 'var(--error)', 'var(--gold)', 'var(--gold)', 'var(--success)', 'var(--success)'][strength]
  const strengthLabel = ['', 'Débil', 'Media', 'Buena', 'Fuerte', 'Muy fuerte'][strength]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !password) { setError('Completa todos los campos.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = register(name, email, password)
    setLoading(false)

    if (result.ok) {
      toast.success('¡Cuenta creada con éxito!')
      navigate('/cuenta')
    } else {
      setError(result.error)
    }
  }

  return (
    <div style={{
      minHeight: '100svh',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
      background: 'var(--cream)',
    }}>
      {/* Panel */}
      <div style={{
        background: 'var(--black)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(40px,7vw,80px)',
        position: 'relative', overflow: 'hidden',
        minHeight: 'clamp(200px, 35vw, 600px)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 60%, rgba(196,164,107,0.13), transparent 65%)' }} />
        <motion.span
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 'clamp(4rem,10vw,7rem)', marginBottom: 'clamp(20px,3vw,36px)', position: 'relative', display: 'block' }}
        >🍞</motion.span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: 20, position: 'relative' }}>
          Únete a<br />Farine.
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
          {['Historial de pedidos completo', 'Checkout más rápido', 'Novedades exclusivas'].map(perk => (
            <div key={perk} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.875rem', color: 'var(--pearl-2)' }}>
              <span style={{ color: 'var(--gold)' }}>✓</span>
              {perk}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(48px,7vw,80px) clamp(24px,5vw,64px)',
        overflowY: 'auto',
      }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, letterSpacing: '0.1em', marginBottom: 40, display: 'block' }}>
          FARINE<span style={{ color: 'var(--gold)' }}>.</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 400 }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,2.8rem)', fontWeight: 300, marginBottom: 8 }}>Crear cuenta</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', marginBottom: 36 }}>Rápido, sin complicaciones.</p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '12px 16px', background: 'rgba(196,90,74,0.1)', border: '1px solid rgba(196,90,74,0.25)', borderRadius: 'var(--r-md)', fontSize: '0.85rem', color: 'var(--error)', marginBottom: 20 }}
            >{error}</motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="input-group">
              <label className="input-label">Nombre completo</label>
              <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ana García" autoComplete="name" />
            </div>

            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ana@email.com" autoComplete="email" />
            </div>

            <div className="input-group">
              <label className="input-label">Contraseña</label>
              <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
              {password && (
                <div>
                  <div style={{ height: 3, background: 'var(--cream-3)', borderRadius: 2, overflow: 'hidden', marginTop: 6 }}>
                    <motion.div
                      style={{ height: '100%', borderRadius: 2, background: strengthColor }}
                      animate={{ width: `${(strength / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p style={{ fontSize: '0.72rem', color: strengthColor, marginTop: 4 }}>{strengthLabel}</p>
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.6 }}>
              Al crear una cuenta aceptas nuestros{' '}
              <a href="#" style={{ color: 'var(--gold)' }}>Términos de servicio</a>{' '}y{' '}
              <a href="#" style={{ color: 'var(--gold)' }}>Política de privacidad</a>.
            </p>

            <motion.button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>⟳</motion.span> : 'Crear cuenta'}
            </motion.button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-2)', marginTop: 24 }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color 0.2s' }}
              onMouseEnter={e => e.target.style.textDecorationColor = 'var(--gold)'}
              onMouseLeave={e => e.target.style.textDecorationColor = 'transparent'}
            >Iniciar sesión</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
