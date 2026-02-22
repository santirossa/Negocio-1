import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { PRODUCTS } from '../data'
import ProductCard from '../components/ProductCard'
import { useCartStore } from '../store'
import { useToastStore } from '../store'

const fmt = v => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(v)

const MARQUEE_ITEMS = ['Masa Madre', 'Mantequilla AOP', 'Harina Artesanal', 'Fermentación 72h', 'Ingredientes de Origen', 'Sin Prisa']

function Marquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div style={{ overflow: 'hidden', background: 'var(--black)', padding: '20px 0', borderTop: '1px solid rgba(196,164,107,0.12)', borderBottom: '1px solid rgba(196,164,107,0.12)' }}>
      <motion.div
        style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 48 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--cream)', letterSpacing: '0.06em' }}>{item}</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, display: 'inline-block' }} />
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const featured = PRODUCTS.filter(p => p.featured)

  return (
    <div>
      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        position: 'relative',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: 'clamp(48px, 10vw, 96px)',
        overflow: 'hidden',
        background: 'var(--cream)',
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 25% 15%, rgba(196,164,107,0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 85%, rgba(196,164,107,0.1) 0%, transparent 45%),
            linear-gradient(155deg, var(--cream) 0%, var(--cream-2) 60%, var(--cream-3) 100%)
          `,
        }} />

        {/* Floating visual */}
        <motion.div
          style={{
            position: 'absolute',
            top: '8%', right: '-2%',
            width: 'clamp(240px, 45vw, 520px)',
            height: 'clamp(300px, 55vw, 640px)',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            background: 'linear-gradient(140deg, var(--cream-3) 0%, var(--gold-3) 45%, var(--pearl) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'clamp(6rem, 18vw, 14rem)',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
            y: heroY,
          }}
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.span
            style={{ filter: 'drop-shadow(0 12px 32px rgba(196,164,107,0.4))' }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >🥐</motion.span>
        </motion.div>

        {/* Content */}
        <motion.div style={{ position: 'relative', padding: '0 clamp(20px,5vw,64px)', maxWidth: 680, opacity: heroOpacity }}>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ marginBottom: 20 }}
          >
            Artesanía del tiempo
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.5rem, 11vw, 8rem)',
              fontWeight: 300,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              marginBottom: 24,
            }}
          >
            El pan<br />como{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>ritual.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.52 }}
            style={{ fontSize: 'clamp(0.95rem,2vw,1.1rem)', color: 'var(--text-2)', maxWidth: 340, lineHeight: 1.75, marginBottom: 36 }}
          >
            Elaborado con ingredientes de origen único. Fermentación lenta. Precisión en cada detalle.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.68 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
          >
            <Link to="/tienda" className="btn btn-primary btn-lg">Explorar colección</Link>
            <Link to="/nosotros" className="btn btn-outline btn-lg">Nuestra historia</Link>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          style={{
            position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Scroll</span>
          <motion.div
            style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--gold), transparent)' }}
            animate={{ scaleY: [1, 0.4, 1], opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee />

      {/* ── FEATURED ── */}
      <section style={{ padding: 'clamp(48px,8vw,80px) 0' }}>
        <div style={{ padding: '0 clamp(16px,4vw,48px)', marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Selección</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 300 }}>Nuestros favoritos</h2>
          </div>
          <Link to="/tienda" style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            Ver todo →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 45vw), 1fr))',
          gap: 'clamp(10px, 2vw, 20px)',
          padding: '0 clamp(16px,4vw,48px)',
        }}>
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section style={{ background: 'var(--white)', padding: 'clamp(64px,12vw,120px) clamp(16px,5vw,64px)', textAlign: 'center' }}>
        <hr className="divider-gold" style={{ maxWidth: 200, margin: '0 auto 56px' }} />
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem,4.5vw,3.2rem)',
            fontWeight: 300, fontStyle: 'italic',
            lineHeight: 1.3,
            color: 'var(--text)',
            maxWidth: 640, margin: '0 auto 20px',
          }}
        >
          "El tiempo no es un ingrediente más. Es el ingrediente principal."
        </motion.blockquote>
        <p className="eyebrow">Farine — Filosofía de elaboración</p>
        <hr className="divider-gold" style={{ maxWidth: 200, margin: '56px auto 0' }} />
      </section>

      {/* ── VALUES ── */}
      <section style={{ padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,48px)' }}>
        <div style={{ marginBottom: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Por qué Farine</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 300 }}>Principios que nos definen</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { n: '72', title: 'Horas de hojaldrado', desc: 'Cada croissant requiere tres días. No existe el atajo.' },
            { n: '5', title: 'Años de masa madre', desc: 'Nuestro levain tiene historia propia y sabor único.' },
            { n: '12', title: 'Proveedores de origen', desc: 'Cada ingrediente tiene una historia y un lugar.' },
            { n: '01', title: 'Horneado diario', desc: 'Todo se elabora de madrugada. Fresco cada mañana.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{
                padding: 'clamp(20px,3vw,32px)',
                background: 'var(--white)',
                borderRadius: 'var(--r-xl)',
                border: '1px solid var(--cream-3)',
              }}
            >
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,5vw,3.5rem)', fontWeight: 300, color: 'var(--gold)', lineHeight: 1, marginBottom: 10 }}>{item.n}</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <div style={{ padding: '0 clamp(16px,4vw,48px)', paddingBottom: 'clamp(48px,8vw,80px)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{
            background: 'var(--black)',
            borderRadius: 'var(--r-xl)',
            padding: 'clamp(40px,6vw,72px) clamp(24px,5vw,64px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(196,164,107,0.12), transparent 70%)',
          }} />
          <p className="eyebrow" style={{ marginBottom: 16 }}>Colección completa</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, color: 'var(--cream)', marginBottom: 16, lineHeight: 1.1, position: 'relative' }}>
            Descubre toda<br />la panadería
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--pearl-2)', maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.7, position: 'relative' }}>
            Croissants, panes de masa madre, tartas y pequeña pastelería. Elaborados con el mismo cuidado.
          </p>
          <Link to="/tienda" className="btn btn-gold btn-lg" style={{ position: 'relative' }}>
            Explorar tienda
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
