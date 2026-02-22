import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store'
import { useAuthStore } from '../store'
import { useOrdersStore } from '../store'
import { useToastStore } from '../store'
import { PRODUCTS } from '../data'

const fmt = v => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v)

function Input({ label, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className="input" {...props} />
    </div>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore(s => s.items)
  const total = useCartStore(s => s.total(PRODUCTS))
  const clearCart = useCartStore(s => s.clear)
  const user = useAuthStore(s => s.user)
  const createOrder = useOrdersStore(s => s.create)
  const toast = useToastStore()

  const [step, setStep] = useState(1)
  const [payMethod, setPayMethod] = useState('stripe')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)

  const cartItems = items.map(i => ({ ...i, product: PRODUCTS.find(p => p.id === i.productId) })).filter(i => i.product)

  const [delivery, setDelivery] = useState({
    name: user?.name || '', email: user?.email || '',
    phone: '', address: '', city: '', zip: '',
  })
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', holder: '' })
  const [errors, setErrors] = useState({})

  if (!cartItems.length && !order) {
    return (
      <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100svh', gap: 20, textAlign: 'center', padding: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300 }}>Sin productos en el carrito</h2>
        <Link to="/tienda" className="btn btn-primary">Ir a la tienda</Link>
      </div>
    )
  }

  const validateDelivery = () => {
    const e = {}
    if (!delivery.name.trim()) e.name = 'Requerido'
    if (!delivery.email.trim() || !delivery.email.includes('@')) e.email = 'Email inválido'
    if (!delivery.address.trim()) e.address = 'Requerido'
    if (!delivery.city.trim()) e.city = 'Requerido'
    if (!delivery.zip.trim()) e.zip = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePay = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))

    const newOrder = createOrder({
      userId: user?.id || 'guest',
      userName: delivery.name,
      userEmail: delivery.email,
      items: cartItems.map(i => ({
        productId: i.productId,
        productName: i.product.name,
        emoji: i.product.emoji,
        price: i.product.price,
        qty: i.qty,
      })),
      total,
      delivery,
      paymentMethod: payMethod,
    })

    clearCart()
    setOrder(newOrder)
    setLoading(false)
  }

  // ── SUCCESS ──
  if (order) return (
    <div className="page-wrapper page-pb" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,48px)', textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
        style={{
          width: 88, height: 88, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold), var(--gold-2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', marginBottom: 32,
          boxShadow: 'var(--shadow-gold)',
          color: 'white',
        }}
      >✓</motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,6vw,3.5rem)', fontWeight: 300, marginBottom: 12 }}
      >¡Pedido confirmado!</motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        style={{ fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}
      >Pedido {order.id}</motion.p>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ fontSize: '0.95rem', color: 'var(--text-2)', maxWidth: 380, lineHeight: 1.75, marginBottom: 40 }}
      >
        Tu pedido ha sido procesado con éxito. Te enviaremos una confirmación a {order.userEmail}.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: 32, width: '100%', maxWidth: 440, marginBottom: 32, boxShadow: 'var(--shadow-sm)' }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, marginBottom: 16, textAlign: 'left' }}>Tu pedido</h3>
        {order.items.map(i => (
          <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.875rem', borderBottom: '1px solid var(--cream-3)' }}>
            <span style={{ color: 'var(--text-2)' }}>{i.emoji} {i.productName} × {i.qty}</span>
            <span>{fmt(i.price * i.qty)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16 }}>
          <span style={{ fontSize: '0.85rem' }}>Total pagado</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>{fmt(order.total)}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
        style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 440 }}
      >
        <Link to="/pedidos" className="btn btn-primary btn-full">Ver mis pedidos</Link>
        <Link to="/tienda" className="btn btn-outline btn-full">Seguir comprando</Link>
      </motion.div>
    </div>
  )

  // ── STEPS ──
  return (
    <div className="page-wrapper page-pb">
      <div style={{ padding: 'clamp(32px,6vw,56px) clamp(16px,4vw,48px) clamp(20px,4vw,40px)' }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Finalizar compra</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,6vw,3.5rem)', fontWeight: 300, lineHeight: 1.05, marginBottom: 32 }}>Checkout</h1>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, maxWidth: 360 }}>
          {[
            { n: 1, label: 'Envío' },
            { n: 2, label: 'Pago' },
          ].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < 1 ? 1 : 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: step > s.n ? 'var(--gold)' : step === s.n ? 'var(--black)' : 'var(--cream-3)',
                  color: step >= s.n ? 'white' : 'var(--text-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 400,
                  transition: 'all 0.3s',
                }}>{step > s.n ? '✓' : s.n}</div>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: step === s.n ? 'var(--text)' : 'var(--text-3)' }}>
                  {s.label}
                </span>
              </div>
              {i === 0 && <div style={{ flex: 1, height: 1, background: step > 1 ? 'var(--gold)' : 'var(--cream-3)', margin: '0 16px', transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        gap: 'clamp(16px,3vw,32px)',
        padding: '0 clamp(16px,4vw,48px)',
        alignItems: 'start',
      }}>
        {/* Form area */}
        <div>
          <AnimatePresence mode="wait">
            {/* STEP 1: Delivery */}
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, borderBottom: '1px solid var(--cream-3)', paddingBottom: 16 }}>Datos de entrega</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <Input label="Nombre completo" value={delivery.name} onChange={e => setDelivery(d => ({ ...d, name: e.target.value }))} placeholder="Ana García" className={`input${errors.name ? ' error' : ''}`} />
                  <Input label="Email" type="email" value={delivery.email} onChange={e => setDelivery(d => ({ ...d, email: e.target.value }))} placeholder="ana@email.com" className={`input${errors.email ? ' error' : ''}`} />
                </div>

                <Input label="Teléfono" type="tel" value={delivery.phone} onChange={e => setDelivery(d => ({ ...d, phone: e.target.value }))} placeholder="+34 600 000 000" />

                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, marginTop: 8, borderBottom: '1px solid var(--cream-3)', paddingBottom: 12 }}>Dirección</h3>

                <Input label="Calle y número" value={delivery.address} onChange={e => setDelivery(d => ({ ...d, address: e.target.value }))} placeholder="Calle Mayor, 12" className={`input${errors.address ? ' error' : ''}`} />

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                  <Input label="Ciudad" value={delivery.city} onChange={e => setDelivery(d => ({ ...d, city: e.target.value }))} placeholder="Madrid" className={`input${errors.city ? ' error' : ''}`} />
                  <Input label="C.P." value={delivery.zip} onChange={e => setDelivery(d => ({ ...d, zip: e.target.value }))} placeholder="28001" className={`input${errors.zip ? ' error' : ''}`} />
                </div>

                <button className="btn btn-primary btn-lg btn-full" style={{ marginTop: 8 }} onClick={() => {
                  if (validateDelivery()) setStep(2)
                }}>
                  Continuar al pago →
                </button>
              </motion.div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 400, borderBottom: '1px solid var(--cream-3)', paddingBottom: 16 }}>Método de pago</h2>

                <div style={{ padding: '10px 16px', background: 'rgba(196,164,107,0.1)', border: '1px solid rgba(196,164,107,0.25)', borderRadius: 'var(--r-md)', fontSize: '0.8rem', color: 'var(--gold-2)', textAlign: 'center' }}>
                  🔒 Modo sandbox — No se realizan cargos reales
                </div>

                {/* Payment options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { id: 'stripe', icon: '💳', title: 'Tarjeta de crédito / débito', sub: 'Powered by Stripe · Seguro y cifrado' },
                    { id: 'mercadopago', icon: '🔵', title: 'MercadoPago', sub: 'Paga con tu cuenta de MercadoPago' },
                  ].map(m => (
                    <div key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: 18,
                        background: payMethod === m.id ? 'rgba(196,164,107,0.07)' : 'var(--white)',
                        border: `2px solid ${payMethod === m.id ? 'var(--gold)' : 'var(--cream-3)'}`,
                        borderRadius: 'var(--r-lg)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        border: `2px solid ${payMethod === m.id ? 'var(--gold)' : 'var(--pearl)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {payMethod === m.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />}
                      </div>
                      <span style={{ fontSize: '1.5rem' }}>{m.icon}</span>
                      <div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 400 }}>{m.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{m.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card fields */}
                {payMethod === 'stripe' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, background: 'var(--cream)', borderRadius: 'var(--r-lg)', border: '1px solid var(--cream-3)' }}
                  >
                    <Input label="Número de tarjeta"
                      value={card.number}
                      onChange={e => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 16)
                        setCard(c => ({ ...c, number: v.replace(/(.{4})/g, '$1 ').trim() }))
                      }}
                      placeholder="4242 4242 4242 4242"
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Input label="Caducidad"
                        value={card.expiry}
                        onChange={e => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                          if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2)
                          setCard(c => ({ ...c, expiry: v }))
                        }}
                        placeholder="MM/AA"
                      />
                      <Input label="CVC" value={card.cvc} onChange={e => setCard(c => ({ ...c, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) }))} placeholder="123" />
                    </div>
                    <Input label="Nombre en la tarjeta" value={card.holder} onChange={e => setCard(c => ({ ...c, holder: e.target.value.toUpperCase() }))} placeholder="ANA GARCÍA" />
                  </motion.div>
                )}

                {payMethod === 'mercadopago' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ padding: 20, background: 'var(--cream)', borderRadius: 'var(--r-lg)', border: '1px solid var(--cream-3)' }}
                  >
                    <Input label="Email de MercadoPago" type="email" placeholder="tu@email.com" />
                  </motion.div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                  <motion.button
                    className="btn btn-gold btn-lg btn-full"
                    onClick={handlePay}
                    disabled={loading}
                    animate={loading ? { scale: 0.98 } : { scale: 1 }}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>⟳</motion.span>
                        Procesando...
                      </span>
                    ) : `Pagar ${fmt(total)}`}
                  </motion.button>
                  <button className="btn btn-outline btn-full" onClick={() => setStep(1)}>← Volver</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: 'var(--white)', borderRadius: 'var(--r-xl)', padding: 'clamp(20px,4vw,32px)', boxShadow: 'var(--shadow-sm)' }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, marginBottom: 20 }}>Tu pedido</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {cartItems.map(i => (
              <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--cream-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{i.product.emoji}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{i.product.name} × {i.qty}</span>
                </div>
                <span style={{ fontSize: '0.9rem' }}>{fmt(i.product.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <hr className="divider" style={{ margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="eyebrow">Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>{fmt(total)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
