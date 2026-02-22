import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PRODUCTS } from '../data'
import { useCartStore } from '../store'
import { useToastStore } from '../store'
import ProductCard from '../components/ProductCard'

const fmt = v => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v)

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS.find(p => p.id === id)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const addToCart = useCartStore(s => s.add)
  const toast = useToastStore()

  if (!product) return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100svh', gap: 20, textAlign: 'center', padding: 24 }}>
      <span style={{ fontSize: '5rem' }}>🍞</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300 }}>Producto no encontrado</h1>
      <Link to="/tienda" className="btn btn-primary">Volver a la tienda</Link>
    </div>
  )

  const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3)

  const handleAdd = () => {
    addToCart(product.id, qty)
    toast.success(`${product.name} añadido al carrito`)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="page-wrapper page-pb">
      {/* Layout: image + info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
        minHeight: '100svh',
      }}>
        {/* Image side */}
        <div style={{
          position: 'sticky',
          top: 'var(--nav-h)',
          height: 'calc(100svh - var(--nav-h))',
          background: product.gradient,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {/* Back link */}
          <Link to="/tienda" style={{
            position: 'absolute', top: 20, left: 20,
            fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(22,20,15,0.5)',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 0.2s',
          }}>
            ← Tienda
          </Link>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 'clamp(7rem, 22vw, 14rem)', filter: 'drop-shadow(0 20px 48px rgba(22,20,15,0.18))' }}
          >
            {product.emoji}
          </motion.div>

          {/* Glow */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.15), transparent 65%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Info side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: 'clamp(32px,5vw,64px) clamp(20px,4vw,56px)',
            background: 'var(--cream)',
            display: 'flex', flexDirection: 'column', gap: 28,
          }}
        >
          {/* Category + badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="eyebrow">{product.category}</p>
            {product.featured && <span className="badge badge-gold">Favorito</span>}
          </div>

          {/* Name */}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,6vw,4rem)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
            {product.name}
          </h1>

          {/* Short desc */}
          <p style={{ fontSize: '1rem', color: 'var(--text-2)', lineHeight: 1.75, borderLeft: '2px solid var(--gold)', paddingLeft: 20, fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
            {product.short}
          </p>

          {/* Long desc */}
          <p style={{ fontSize: '0.9rem', color: 'var(--text-2)', lineHeight: 1.8 }}>
            {product.long}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {product.tags.map(t => (
              <span key={t} style={{ padding: '5px 14px', border: '1px solid var(--cream-3)', borderRadius: 'var(--r-full)', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--text-3)' }}>
                {t}
              </span>
            ))}
            <span style={{ padding: '5px 14px', border: '1px solid var(--cream-3)', borderRadius: 'var(--r-full)', fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--text-3)' }}>
              {product.stock} en stock
            </span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,5vw,3rem)', fontWeight: 400 }}>
              {fmt(product.price)}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-3)', letterSpacing: '0.08em' }}>por unidad</span>
          </div>

          {/* Add to cart */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="qty">
              <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span className="qty-val">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <motion.button
              className="btn btn-primary btn-lg"
              style={{ flex: 1, minWidth: 180 }}
              onClick={handleAdd}
              animate={added ? { background: 'var(--gold)' } : { background: 'var(--black)' }}
            >
              {added ? `✓ Añadido (${qty})` : `Añadir al carrito`}
            </motion.button>
          </div>

          {/* Extra info */}
          <div style={{ padding: 20, background: 'var(--white)', borderRadius: 'var(--r-lg)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '🚚', label: 'Envío gratuito en todos los pedidos' },
              { icon: '⏰', label: 'Horneado fresco cada mañana' },
              { icon: '🌿', label: 'Ingredientes de origen certificado' },
            ].map(i => (
              <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.82rem', color: 'var(--text-2)' }}>
                <span style={{ fontSize: '1rem' }}>{i.icon}</span>
                {i.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,48px)' }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>También en {product.category}</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 300, marginBottom: 32 }}>Puede interesarte</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 45vw), 1fr))', gap: 'clamp(10px,2vw,20px)' }}>
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  )
}
