import { motion } from 'framer-motion'
import { BookOpen, LayoutDashboard, LogIn } from 'lucide-react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext.jsx'
import { Button, ThemeToggle } from '../ui/index.jsx'

export function PublicLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAppContext()

  const navItems = [
    { to: '/', label: 'Accueil' },
    { to: '/books', label: 'Manuels' },
    { to: '/architecture-tnd', label: 'Architecture TND' },
    { to: '/requests', label: 'Réunions' },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => navigate('/')}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-600 text-white shadow-sm">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="font-display text-lg font-bold">
                DIFFUSION DAR AL OUMA
              </p>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Manuels instrumentés
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {currentUser ? (
              <Button
                variant="accent"
                icon={LayoutDashboard}
                onClick={() => navigate(`/dashboard/${currentUser.role}`)}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                variant="secondary"
                icon={LogIn}
                onClick={() =>
                  navigate('/login', { state: { from: location.pathname } })
                }
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
      >
        <Outlet />
      </motion.main>

      <footer className="border-t border-slate-200 bg-slate-50 py-10 dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-display text-xl font-bold">
              DIFFUSION DAR AL OUMA
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Catalogue de manuels scolaires enrichis par des ressources numériques,
              des capsules TND et un suivi d’usage simple.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <NavLink to="/books">
              <Button variant="secondary">Manuels</Button>
            </NavLink>
            <NavLink to="/architecture-tnd">
              <Button variant="secondary">Architecture TND</Button>
            </NavLink>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function ProtectedRoute({ children }) {
  const { currentUser } = useAppContext()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}
