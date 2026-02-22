import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import { Account, Orders, Nosotros, Contacto } from './pages/OtherPages'

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Pages that don't need the standard nav/footer (auth pages)
const AUTH_PAGES = ['/login', '/registro']

function Layout() {
  const { pathname } = useLocation()
  const isAuth = AUTH_PAGES.includes(pathname)

  return (
    <>
      {/* Film grain overlay */}
      <div className="grain" aria-hidden />

      {!isAuth && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tienda" element={<Shop />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/cuenta" element={<Account />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="*" element={
          <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 'var(--nav-h)' }}>
            <span style={{ fontSize: '5rem' }}>🥐</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 300 }}>Página no encontrada</h1>
            <a href="/" className="btn btn-primary">Volver al inicio</a>
          </div>
        } />
      </Routes>

      {!isAuth && <Footer />}
      <Toast />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  )
}
