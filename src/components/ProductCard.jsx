import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '../store'
import { useToastStore } from '../store'

export default function ProductCard({ product, index = 0 }) {
  const [added, setAdded] = useState(false)
  const addToCart = useCartStore(s => s.add)
  const toast = useToastStore()

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product.id, 1)
    toast.success(`${product.name} añadido`)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/producto/${product.id}`}>
        <div className="card" style={{ cursor: 'pointer' }}>
          {/* Image area */}
          <div style={{
            width: '100%',
            aspectRatio: '3/4',
            background: product.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(3rem, 8vw, 4.5rem)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {product.featured && (
              <span style={{
                position: 'absolute', top: 12, left: 12,
                background: 'var(--gold)',
                color: 'white',
                fontSize: '0.58rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 'var(--r-full)',
              }}>Favorito</span>
            )}
            <span style={{ filter: 'drop-shadow(0 8px 20px rgba(22,20,15,0.2))' }}>
              {product.emoji}
            </span>
            {/* Overlay gradient */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(22,20,15,0.18) 0%, transparent 50%)',
            }} />
          </div>

          {/* Body */}
          <div style={{ padding: '14px 16px 20px' }}>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>
              {product.category}
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem,2.5vw,1.2rem)', fontWeight: 400, marginBottom: 2 }}>
              {product.name}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', marginBottom: 14 }}>
              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(product.price)}
            </p>

            <motion.button
              className="btn btn-outline btn-full btn-sm"
              onClick={handleAdd}
              animate={added ? { background: 'var(--gold)', color: 'white', borderColor: 'var(--gold)' } : {}}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              {added ? <>✓ Añadido</> : <>Añadir</>}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
