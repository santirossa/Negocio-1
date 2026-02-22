import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── AUTH STORE ───────────────────────────────────────────────────────────────

function hashStr(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return h.toString(36)
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      users: [],

      isLoggedIn: () => !!get().user,

      register: (name, email, password) => {
        const users = get().users
        if (users.find(u => u.email === email.toLowerCase().trim())) {
          return { ok: false, error: 'Este email ya tiene una cuenta.' }
        }
        const u = {
          id: 'usr_' + Date.now(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashStr(password),
          createdAt: new Date().toISOString(),
        }
        set(s => ({ users: [...s.users, u], user: { id: u.id, name: u.name, email: u.email, createdAt: u.createdAt } }))
        return { ok: true }
      },

      login: (email, password) => {
        const users = get().users
        const u = users.find(u => u.email === email.toLowerCase().trim())
        if (!u) return { ok: false, error: 'No existe una cuenta con este email.' }
        if (u.password !== hashStr(password)) return { ok: false, error: 'Contraseña incorrecta.' }
        set({ user: { id: u.id, name: u.name, email: u.email, createdAt: u.createdAt } })
        return { ok: true }
      },

      logout: () => set({ user: null }),

      seedDemo: () => {
        const users = get().users
        if (!users.find(u => u.email === 'demo@farine.com')) {
          const u = {
            id: 'usr_demo',
            name: 'Usuario Demo',
            email: 'demo@farine.com',
            password: hashStr('demo1234'),
            createdAt: new Date().toISOString(),
          }
          set(s => ({ users: [...s.users, u] }))
        }
      },
    }),
    { name: 'farine_auth' }
  )
)

// ─── CART STORE ───────────────────────────────────────────────────────────────

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      add: (productId, qty = 1) => {
        set(s => {
          const idx = s.items.findIndex(i => i.productId === productId)
          if (idx > -1) {
            const next = [...s.items]
            next[idx] = { ...next[idx], qty: next[idx].qty + qty }
            return { items: next }
          }
          return { items: [...s.items, { productId, qty }] }
        })
      },

      remove: (productId) => set(s => ({ items: s.items.filter(i => i.productId !== productId) })),

      setQty: (productId, qty) => {
        if (qty <= 0) { get().remove(productId); return }
        set(s => ({ items: s.items.map(i => i.productId === productId ? { ...i, qty } : i) }))
      },

      clear: () => set({ items: [] }),

      count: () => get().items.reduce((s, i) => s + i.qty, 0),

      total: (products) => get().items.reduce((s, i) => {
        const p = products.find(p => p.id === i.productId)
        return s + (p ? p.price * i.qty : 0)
      }, 0),
    }),
    { name: 'farine_cart' }
  )
)

// ─── ORDERS STORE ─────────────────────────────────────────────────────────────

export const useOrdersStore = create(
  persist(
    (set, get) => ({
      orders: [],

      create: (data) => {
        const order = {
          id: 'ORD-' + Date.now().toString(36).toUpperCase(),
          ...data,
          createdAt: new Date().toISOString(),
          status: 'pending',
        }
        set(s => ({ orders: [order, ...s.orders] }))
        return order
      },

      getUserOrders: (userId) => get().orders.filter(o => o.userId === userId),
    }),
    { name: 'farine_orders' }
  )
)

// ─── TOAST STORE ──────────────────────────────────────────────────────────────

export const useToastStore = create((set) => ({
  toasts: [],
  show: (msg, type = 'default') => {
    const id = Date.now()
    set(s => ({ toasts: [...s.toasts, { id, msg, type }] }))
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), 3000)
  },
  success: (msg) => useToastStore.getState().show(msg, 'success'),
  error: (msg) => useToastStore.getState().show(msg, 'error'),
}))
