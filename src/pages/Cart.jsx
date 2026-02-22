import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../store'
import { useToastStore } from '../store'
import { PRODUCTS } from '../data'

const fmt = v => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v)

export default function Cart() {
  const items = useCartStore(s => s.items)
  const setQty = useCartStore(s => s.setQty)
  const remove = useCartStore(s => s.remove)
  const total = useCartStore(s => s.total(PRODUCTS))
  const toast = useToastStore()

  const cartItems = items.map(i => ({ ...i, product: PRODUCTS.find(p => p.id === i.productId) })).filter(i => i.product)

  if (!cartItems.length) return (
    <div className="page-wrapper page-pb" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100svh', gap: 20, textAlign: 'center', padding: 24 }}>
      <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 0.4 }} style={{ fontSize: '5rem', display: 'block' }}>🛍️</motion.span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 300 }}>Tu carrito está vacío</h1>
      <p style={{ color: 'var(--text-2)', maxWidth: 300, lineHeight: 1.7 }}>Aún no has añadido nada. Explora nuestra colección.</p>
      <Link to="/tienda" className="btn btn-primary btn-lg">Explorar la tienda</Link>
    </div>
  )

  const handleRemove = (id, name) => {
    remove(id)
    toast.show(`${name} eliminado`)
  }

  return (
    <div className="page-wrapper page-pb">
      <div style={{ padding: 'clamp(32px,6vw,64px) clamp(16px,4vw,48px) clamp(20px,4vw,40px)' }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Tu selección</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,8vw,4.5rem)', fontWeight: 300, lineHeight: 1.05 }}>
          Carrito
        </h1>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
        gap: 'clamp(16px,3vw,32px)',
        padding: '0 clamp(16px,4vw,48px)',
        alignItems: 'start',
      }}>
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {cartItems.map(item => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: 16,
                  alignItems: 'center',
                  background: 'var(--white)',
                  borderRadius: 'var(--r-xl)',
                  padding: 16,
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                {/* Image */}
                <div style={{
                  width: 80, height: 80,
                  borderRadius: 'var(--r-lg)',
                  background: item.product.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.2rem',
                  flexShrink: 0,
                }}>
                  {item.product.emoji}
                </div>

                {/* Info */}
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 2 }}>
                    {item.product.category}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,2.5vw,1.2rem)', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>
                    {item.product.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>{fmt(item.product.price)} / ud</p>
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400 }}>
                    {fmt(item.product.price * item.qty)}
                  </span>
                  <div className="qty">
                    <button className="qty-btn" onClick={() => setQty(item.productId, item.qty - 1)}>−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => setQty(item.productId, item.qty + 1)}>+</button>
                  </div>
                  <button onClick={() => handleRemove(item.productId, item.product.name)} style={{
                    background: 'none', border: 'none',
                    fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'var(--text-3)', cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.target.style.color = 'var(--error)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-3)'}
                  >
                    Eliminar
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            background: 'var(--white)',
            borderRadius: 'var(--r-xl)',
            padding: 'clamp(24px,4vw,36px)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 300, marginBottom: 24 }}>Resumen</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { label: `${cartItems.reduce((s, i) => s + i.qty, 0)} productos`, value: fmt(total) },
              { label: 'Envío', value: <span style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>Gratis</span> },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--cream-3)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0 0' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 400 }}>{fmt(total)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28 }}>
            <Link to="/checkout" className="btn btn-primary btn-lg btn-full">Finalizar compra</Link>
            <Link to="/tienda" className="btn btn-outline btn-full">Seguir comprando</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
