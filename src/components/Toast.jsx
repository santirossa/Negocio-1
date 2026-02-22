import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore } from '../store'

export default function Toast() {
  const toasts = useToastStore(s => s.toasts)

  return (
    <div className="toast-wrap">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            className="toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.type === 'success' && <span style={{ color: 'var(--gold)' }}>✓</span>}
            {t.type === 'error' && <span style={{ color: '#E87060' }}>✕</span>}
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
