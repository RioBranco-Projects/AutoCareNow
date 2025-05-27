import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

export default function AnimatedLayout() {
  const { pathname } = useLocation()

  return (
    <div className="page-container">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div>
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

