import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PRODUCTS, CATEGORIES } from '../data'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCat = searchParams.get('cat') || 'all'
  const [activeCategory, setActiveCategory] = useState(initialCat)

  const filtered = useMemo(() =>
    activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory),
    [activeCategory]
  )

  const setCategory = (cat) => {
    setActiveCategory(cat)
    if (cat === 'all') searchParams.delete('cat')
    else searchParams.set('cat', cat)
    setSearchParams(searchParams)
  }

  return (
    <div className="page-wrapper page-pb">
      {/* Header */}
      <div style={{ padding: 'clamp(32px,6vw,64px) clamp(16px,4vw,48px) clamp(24px,4vw,48px)' }}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 12 }}
        >Colección</motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,8vw,5rem)', fontWeight: 300, lineHeight: 1.05, marginBottom: 12 }}
        >Nuestra tienda</motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ fontSize: '0.95rem', color: 'var(--text-2)', maxWidth: 400, lineHeight: 1.7 }}
        >
          Cada pieza elaborada con cuidado, tiempo e ingredientes de origen único.
        </motion.p>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 clamp(16px,4vw,48px)', marginBottom: 32,
        overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4,
      }}>
        {['all', ...CATEGORIES].map((cat, i) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => setCategory(cat)}
            style={{
              flexShrink: 0,
              padding: '9px 22px',
              borderRadius: 'var(--r-full)',
              border: `1.5px solid ${activeCategory === cat ? 'var(--black)' : 'var(--pearl)'}`,
              background: activeCategory === cat ? 'var(--black)' : 'transparent',
              color: activeCategory === cat ? 'var(--cream)' : 'var(--text-2)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.72rem',
              fontWeight: 300,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.25s',
              whiteSpace: 'nowrap',
            }}
          >
            {cat === 'all' ? 'Todo' : cat}
          </motion.button>
        ))}
      </div>

      {/* Count */}
      <p style={{ padding: '0 clamp(16px,4vw,48px)', marginBottom: 20, fontSize: '0.78rem', color: 'var(--text-3)', letterSpacing: '0.06em' }}>
        {filtered.length} producto{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 45vw), 1fr))',
        gap: 'clamp(10px, 2vw, 20px)',
        padding: '0 clamp(16px,4vw,48px)',
      }}>
        {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </div>
  )
}
