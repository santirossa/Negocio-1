// ── ACCOUNT ──────────────────────────────────────────────────────────────────
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store'
import { useOrdersStore } from '../store'
import { useToastStore } from '../store'

const fmt = v => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v)
const fmtDate = s => new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(s))

export function Account() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const getUserOrders = useOrdersStore(s => s.getUserOrders)
  const toast = useToastStore()

  if (!user) { navigate('/login'); return null }

  const orders = getUserOrders(user.id)
  const totalSpent = orders.reduce((s, o) => s + o.total, 0)
  const recent = orders.slice(0, 3)

  const handleLogout = () => {
    logout()
    toast.show('Sesión cerrada')
    navigate('/')
  }

  return (
    <div className="page-wrapper page-pb">
      {/* Header */}
      <div style={{
        background: 'linear-gradient(150deg, var(--cream-2), var(--cream))',
        padding: 'clamp(32px,6vw,56px) clamp(16px,4vw,48px) clamp(24px,4vw,48px)',
      }}>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold), var(--gold-2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'white',
            marginBottom: 20, boxShadow: 'var(--shadow-gold)',
          }}
        >
          {user.name.charAt(0).toUpperCase()}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,6vw,3rem)', fontWeight: 300, marginBottom: 4 }}
        >{user.name}</motion.h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginBottom: 4 }}>{user.email}</p>
        {user.createdAt && <p className="eyebrow" style={{ color: 'var(--gold)' }}>Miembro desde {fmtDate(user.createdAt)}</p>}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, padding: 'clamp(20px,4vw,32px) clamp(16px,4vw,48px)' }}>
        {[
          { val: orders.length, label: 'Pedidos' },
          { val: fmt(totalSpent).replace('€', '').trim(), label: 'Total €' },
          { val: orders.filter(o => o.status === 'delivered').length, label: 'Entregados' },
        ].map((stat, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 + 0.2 }}
            style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: 'clamp(16px,3vw,24px) 12px', textAlign: 'center', boxShadow: 'var(--shadow-xs)' }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 300 }}>{stat.val}</p>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 3 }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ padding: '0 clamp(16px,4vw,48px)' }}>
        {/* Recent orders */}
        {recent.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <p className="eyebrow">Pedidos recientes</p>
              <Link to="/pedidos" style={{ fontSize: '0.72rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>Ver todos →</Link>
            </div>
            {recent.map(order => (
              <Link to="/pedidos" key={order.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: 16, marginBottom: 10, boxShadow: 'var(--shadow-xs)', transition: 'transform 0.2s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = ''}
              >
                <span style={{ fontSize: '1.8rem', flexShrink: 0 }}>{order.items.map(i => i.emoji).slice(0, 3).join('')}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="eyebrow" style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>{order.id}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', marginTop: 2 }}>{fmtDate(order.createdAt)}</p>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', flexShrink: 0 }}>{fmt(order.total)}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Menu */}
        <div style={{ marginBottom: 32 }}>
          <p className="eyebrow" style={{ marginBottom: 4 }}>Navegación</p>
          {[
            { to: '/pedidos', icon: '📦', label: 'Mis pedidos' },
            { to: '/tienda', icon: '🛍️', label: 'Ir a la tienda' },
            { to: '/carrito', icon: '🛒', label: 'Mi carrito' },
          ].map(item => (
            <Link to={item.to} key={item.to} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--cream-3)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = ''}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, background: 'var(--cream-2)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{item.icon}</div>
                <span style={{ fontSize: '0.95rem', fontWeight: 300 }}>{item.label}</span>
              </div>
              <span style={{ color: 'var(--text-3)' }}>›</span>
            </Link>
          ))}
        </div>

        <button className="btn btn-outline btn-full" onClick={handleLogout} style={{ color: 'var(--text-3)', borderColor: 'var(--cream-3)' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

// ── ORDERS ────────────────────────────────────────────────────────────────────
export function Orders() {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const getUserOrders = useOrdersStore(s => s.getUserOrders)

  if (!user) { navigate('/login'); return null }

  const orders = getUserOrders(user.id)

  const statusLabel = { pending: 'Pendiente', processing: 'En proceso', delivered: 'Entregado' }
  const statusClass = { pending: 'badge-pending', processing: 'badge-processing', delivered: 'badge-delivered' }

  return (
    <div className="page-wrapper page-pb">
      <div style={{ padding: 'clamp(32px,6vw,56px) clamp(16px,4vw,48px) clamp(20px,4vw,40px)' }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Historial</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,8vw,4.5rem)', fontWeight: 300, lineHeight: 1.05 }}>Mis pedidos</h1>
      </div>

      <div style={{ padding: '0 clamp(16px,4vw,48px)', display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 700 }}>
        {!orders.length ? (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: 20, opacity: 0.35 }}>📦</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: 12 }}>Sin pedidos todavía</h2>
            <p style={{ color: 'var(--text-2)', marginBottom: 24 }}>Tu historial aparecerá aquí.</p>
            <Link to="/tienda" className="btn btn-primary">Explorar la tienda</Link>
          </div>
        ) : orders.map((order, i) => (
          <motion.article key={order.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: 'clamp(16px,3vw,24px)', boxShadow: 'var(--shadow-xs)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <p className="eyebrow" style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>{order.id}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', marginTop: 3 }}>{fmtDate(order.createdAt)}</p>
              </div>
              <span className={`badge ${statusClass[order.status] || 'badge-pending'}`}>{statusLabel[order.status] || order.status}</span>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {order.items.map((item, j) => (
                <span key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'var(--cream)', borderRadius: 'var(--r-full)', fontSize: '0.8rem' }}>
                  <span>{item.emoji}</span>{item.productName}{item.qty > 1 && <span style={{ color: 'var(--text-3)' }}>×{item.qty}</span>}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--cream-3)' }}>
              <div>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Total</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem,3vw,1.8rem)' }}>{fmt(order.total)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {order.paymentMethod === 'stripe' ? '💳 Stripe' : '🔵 MercadoPago'}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 2 }}>{order.items.reduce((s, i) => s + i.qty, 0)} productos</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}

// ── NOSOTROS ──────────────────────────────────────────────────────────────────
export function Nosotros() {
  return (
    <div className="page-wrapper page-pb">
      {/* Dark hero */}
      <div style={{
        background: 'var(--black)',
        minHeight: '65svh',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(40px,8vw,80px) clamp(16px,4vw,48px)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 75% 25%, rgba(196,164,107,0.15), transparent 60%)' }} />
        <span style={{ position: 'absolute', top: '10%', right: '5%', fontSize: 'clamp(7rem,20vw,14rem)', opacity: 0.12, transform: 'rotate(15deg)' }} aria-hidden>🌾</span>
        <div style={{ position: 'relative' }}>
          <p className="eyebrow" style={{ marginBottom: 20 }}>Nuestra historia</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem,9vw,6rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.0, marginBottom: 20 }}>
            El pan como<br /><em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>acto consciente.</em>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--pearl-2)', maxWidth: 400, lineHeight: 1.75 }}>
            No hacemos pan rápido. Hacemos pan que merece ser comido despacio.
          </p>
        </div>
      </div>

      {/* Story */}
      {[
        {
          label: 'El origen',
          title: 'Farine nació de una obsesión silenciosa.',
          body: 'La de entender por qué el pan de la memoria sabe diferente al pan de conveniencia. Después de años en cocinas de alto nivel en Francia y Japón, regresamos con una certeza: el tiempo no es un lujo, es la materia prima más importante.',
        },
        {
          label: 'El proceso',
          title: 'Cada producto tiene su ritmo propio.',
          body: 'Los croissants requieren tres días. La masa madre se alimenta cada mañana. Las tartas se preparan el día anterior. No hay atajos. Trabajamos de madrugada. Cuando la ciudad duerme, el horno despierta. A las 7h, todo está listo, fresco.',
          dark: true,
        },
      ].map((s, i) => (
        <section key={i} style={{ padding: 'clamp(56px,10vw,96px) clamp(16px,4vw,48px)', background: s.dark ? 'var(--white)' : 'var(--cream)' }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>{s.label}</p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.8rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: 24 }}
            ><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>{s.title.split(' ').slice(0, 4).join(' ')}</em> {s.title.split(' ').slice(4).join(' ')}</motion.h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', lineHeight: 1.85 }}>{s.body}</p>
          </div>
        </section>
      ))}

      {/* Quote */}
      <section style={{ background: 'var(--black)', padding: 'clamp(64px,12vw,120px) clamp(16px,5vw,64px)', textAlign: 'center' }}>
        <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,4.5vw,3rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--cream)', maxWidth: 620, margin: '0 auto 20px', lineHeight: 1.3 }}>
          "Trabajar con masa madre es una conversación. Escuchas, ajustas, confías."
        </blockquote>
        <p className="eyebrow">Farine — Método de elaboración</p>
      </section>

      {/* Ingredients */}
      <section style={{ padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,48px)', background: 'var(--cream-2)' }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Ingredientes de origen</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 300, marginBottom: 36 }}>Lo que usamos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {[
            { e: '🧈', name: 'Mantequilla AOP', origin: 'Bretaña, Francia', desc: 'Leche de vacas de pastoreo, 82% materia grasa.' },
            { e: '🌾', name: 'Harina de molino', origin: 'Castilla-La Mancha', desc: 'Triticum de variedad antigua, molienda en piedra.' },
            { e: '🍫', name: 'Chocolate Valrhona', origin: 'Tain l\'Hermitage', desc: 'Guanaja 70%, aromas terrosos y equilibrados.' },
            { e: '🌸', name: 'Vainilla Tahití', origin: 'Polinesia Francesa', desc: 'Vainas gruesas, perfume floral e intensidad única.' },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: 24 }}
            >
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: 12 }}>{item.e}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, marginBottom: 3 }}>{item.name}</h3>
              <p className="eyebrow" style={{ color: 'var(--gold)', fontSize: '0.58rem', marginBottom: 8 }}>{item.origin}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,48px)', textAlign: 'center' }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Pruébalo tú mismo</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, marginBottom: 16 }}>El resto lo explica el sabor</h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', maxWidth: 340, margin: '0 auto 32px', lineHeight: 1.75 }}>
          Todas las palabras del mundo no pueden reemplazar el primer mordisco de un croissant recién horneado.
        </p>
        <Link to="/tienda" className="btn btn-primary btn-lg">Explorar la colección</Link>
      </div>
    </div>
  )
}

// ── CONTACTO ──────────────────────────────────────────────────────────────────
import { useState } from 'react'

export function Contacto() {
  const [sent, setSent] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToastStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !msg) { toast.error('Completa los campos requeridos.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    toast.success('Mensaje enviado')
  }

  return (
    <div className="page-wrapper page-pb">
      <div style={{ padding: 'clamp(32px,6vw,56px) clamp(16px,4vw,48px) clamp(20px,4vw,40px)' }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Hablemos</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,8vw,4.5rem)', fontWeight: 300, lineHeight: 1.05, marginBottom: 10 }}>Contacto</h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-2)', maxWidth: 400, lineHeight: 1.7 }}>Estamos aquí para cualquier pregunta sobre nuestros productos o pedidos.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        gap: 'clamp(16px,3vw,32px)',
        padding: '0 clamp(16px,4vw,48px)',
        alignItems: 'start',
      }}>
        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { icon: '📍', label: 'Dirección', val: 'Calle del Pan, 1', sub: 'Madrid, 28001' },
            { icon: '🕐', label: 'Horario', val: 'Lun–Sáb · 7h–14h', sub: 'Dom · 8h–13h' },
            { icon: '✉️', label: 'Email', val: 'hola@farine.es', sub: 'Respuesta en 24h' },
            { icon: '📦', label: 'Envíos', val: 'Entrega a domicilio', sub: 'Madrid y área metropolitana' },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 18, background: 'var(--white)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-xs)' }}
            >
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, var(--gold), var(--gold-2))', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <p className="eyebrow" style={{ color: 'var(--gold)', fontSize: '0.58rem', marginBottom: 3 }}>{item.label}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: 2 }}>{item.val}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: 'clamp(24px,4vw,36px)', boxShadow: 'var(--shadow-sm)' }}
        >
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200 }}
                style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--gold), var(--gold-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 24px', color: 'white' }}
              >✓</motion.div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, marginBottom: 10 }}>Mensaje enviado</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-2)' }}>Te responderemos en menos de 24 horas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, marginBottom: 4 }}>Envíanos un mensaje</h2>
              <div className="input-group">
                <label className="input-label">Nombre *</label>
                <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required />
              </div>
              <div className="input-group">
                <label className="input-label">Email *</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
              </div>
              <div className="input-group">
                <label className="input-label">Asunto</label>
                <select className="input" value={subject} onChange={e => setSubject(e.target.value)}>
                  <option value="">Selecciona un asunto</option>
                  {['Información de productos', 'Pedido personalizado', 'Problema con un pedido', 'Prensa y colaboraciones', 'Otro'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Mensaje *</label>
                <textarea className="input" value={msg} onChange={e => setMsg(e.target.value)} rows={5} placeholder="Cuéntanos en qué podemos ayudarte..." required style={{ resize: 'vertical' }} />
              </div>
              <motion.button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} whileTap={{ scale: 0.98 }}>
                {loading ? '...' : 'Enviar mensaje'}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
