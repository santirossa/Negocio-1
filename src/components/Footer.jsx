import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--black)',
      color: 'var(--cream)',
      padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,48px) clamp(24px,5vw,40px)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 300, letterSpacing: '0.1em', color: 'var(--gold)', marginBottom: 8 }}>
            FARINE
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--pearl-2)', letterSpacing: '0.1em' }}>
            Artesanía del tiempo. Precisión del detalle.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 40, marginBottom: 48 }}>
          {[
            { title: 'Tienda', links: [
              { to: '/tienda', label: 'Colección' },
              { to: '/tienda?cat=Panes', label: 'Panes' },
              { to: '/tienda?cat=Viennoiserie', label: 'Viennoiserie' },
              { to: '/tienda?cat=Tartas', label: 'Tartas' },
            ]},
            { title: 'Nosotros', links: [
              { to: '/nosotros', label: 'Historia' },
              { to: '/contacto', label: 'Contacto' },
            ]},
            { title: 'Cuenta', links: [
              { to: '/cuenta', label: 'Mi cuenta' },
              { to: '/pedidos', label: 'Mis pedidos' },
              { to: '/carrito', label: 'Carrito' },
            ]},
          ].map(col => (
            <div key={col.title}>
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>
                {col.title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <Link key={l.to} to={l.to} style={{
                    fontSize: '0.85rem', fontWeight: 300, color: 'var(--pearl-2)',
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.target.style.color = 'var(--cream)'}
                    onMouseLeave={e => e.target.style.color = 'var(--pearl-2)'}
                  >{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 24 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--pearl-2)' }}>© 2025 Farine. Todos los derechos reservados.</p>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.18em', color: 'var(--gold)', textTransform: 'uppercase' }}>Premium Bakery</p>
        </div>
      </div>
    </footer>
  )
}
