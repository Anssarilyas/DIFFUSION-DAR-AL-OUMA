import { motion } from 'framer-motion'
import { BookOpen, Download, LayoutDashboard, LogIn, Sparkles } from 'lucide-react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext.jsx'
import { Button, ThemeToggle } from '../ui/index.jsx'

export function PublicLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAppContext()
  const guidePdfPath = '/downloads/Guide_Utilisateur_DIFFUSION_DAR_AL_OUMA.pdf'

  const navItems = [
    { to: '/', label: 'Accueil' },
    { to: '/books', label: 'Livres' },
    { to: '/requests', label: 'Reunions' },
  ]

  return (
    <div className="relative overflow-hidden">
      <div className="hero-orb left-[-90px] top-28 h-44 w-44 bg-sky-400/35" />
      <div className="hero-orb right-[-70px] top-40 h-56 w-56 bg-orange-400/25" />
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            className="flex items-center gap-3 text-left"
            onClick={() => navigate('/')}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-500 to-orange-400 text-white shadow-soft">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-slate-950 dark:text-white">
                DIFFUSION DAR AL OUMA
              </p>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Edu SaaS Library
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-2 rounded-full border border-white/50 bg-white/70 px-2 py-2 dark:border-white/10 dark:bg-white/5 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a
              href={guidePdfPath}
              download
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Guide PDF
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a href={guidePdfPath} download className="hidden lg:block">
              <Button variant="secondary" icon={Download}>
                Télécharger guide
              </Button>
            </a>
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
        transition={{ duration: 0.35 }}
      >
        <Outlet />
      </motion.main>

      <footer className="border-t border-white/30 bg-white/50 py-10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-display text-xl font-bold text-slate-950 dark:text-white">
              DIFFUSION DAR AL OUMA
            </p>
            <p className="mt-2 max-w-xl text-sm text-slate-600 dark:text-slate-300">
              Une plateforme premium pour découvrir, lire et réserver les meilleurs
              livres scolaires par matière et niveau.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 rounded-full border border-white/40 bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <Sparkles className="text-sky-500" size={18} />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Design responsive, dark mode, animations fluides et routes sécurisées.
              </span>
            </div>
            <a href={guidePdfPath} download>
              <Button variant="secondary" icon={Download}>
                Guide utilisateur PDF
              </Button>
            </a>
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
