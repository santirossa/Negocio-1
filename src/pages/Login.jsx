import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store'
import { useToastStore } from '../store'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const login = useAuthStore(s => s.login)
  const isLoggedIn = useAuthStore(s => !!s.user)
  const seedDemo = useAuthStore(s => s.seedDemo)
  const toast = useToastStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    seedDemo()
    if (isLoggedIn) navigate('/cuenta')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Completa todos los campos.'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = login(email, password)
    setLoading(false)

    if (result.ok) {
      toast.success('¡Bienvenido/a!')
      const redirect = searchParams.get('redirect') || '/cuenta'
      navigate(redirect)
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
      {/* Side panel */}
      <div style={{
        background: 'var(--black)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(40px,7vw,80px)',
        position: 'relative', overflow: 'hidden',
        minHeight: 'clamp(200px, 35vw, 600px)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 40%, rgba(196,164,107,0.15), transparent 65%)' }} />
        <motion.span
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 'clamp(4rem,10vw,7rem)', marginBottom: 'clamp(24px,4vw,40px)', position: 'relative', display: 'block' }}
        >🥐</motion.span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: 16, position: 'relative' }}>
          Bienvenido<br />a Farine.
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--pearl-2)', lineHeight: 1.7, position: 'relative' }}>
          Tu panadería premium de confianza. Elaboración artesanal, entrega a domicilio.
        </p>
      </div>

      {/* Form */}
      <div style={{
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: 'clamp(48px,7vw,80px) clamp(24px,5vw,64px)',
      }}>
        <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, letterSpacing: '0.1em', marginBottom: 40, display: 'block' }}>
          FARINE<span style={{ color: 'var(--gold)' }}>.</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 400 }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,2.8rem)', fontWeight: 300, marginBottom: 8 }}>Iniciar sesión</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', marginBottom: 36 }}>Accede a tu cuenta y gestiona tus pedidos.</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: '12px 16px', background: 'rgba(196,90,74,0.1)', border: '1px solid rgba(196,90,74,0.25)', borderRadius: 'var(--r-md)', fontSize: '0.85rem', color: 'var(--error)', marginBottom: 20 }}
            >{error}</motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" autoComplete="email" />
            </div>

            <div className="input-group">
              <label className="input-label">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contraseña" autoComplete="current-password" style={{ paddingRight: 52 }} />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.72rem', letterSpacing: '0.08em', color: 'var(--text-3)',
                }}>{showPw ? 'Ocultar' : 'Ver'}</button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>⟳</motion.span> : 'Entrar'}
            </motion.button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '24px 0', color: 'var(--text-3)', fontSize: '0.75rem' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--cream-3)' }} />
            <span>o</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--cream-3)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-2)' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={{ color: 'var(--gold)', textDecoration: 'underline', textDecorationColor: 'transparent', transition: 'text-decoration-color 0.2s' }}
              onMouseEnter={e => e.target.style.textDecorationColor = 'var(--gold)'}
              onMouseLeave={e => e.target.style.textDecorationColor = 'transparent'}
            >Crear una cuenta</Link>
          </p>

          <p style={{ marginTop: 24, fontSize: '0.75rem', color: 'var(--text-3)', textAlign: 'center', fontStyle: 'italic' }}>
            Prueba: demo@farine.com / demo1234
          </p>
        </motion.div>
      </div>
    </div>
  )
}
