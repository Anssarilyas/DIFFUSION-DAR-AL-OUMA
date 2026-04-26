import { AnimatePresence, motion } from 'framer-motion'
import { MoonStar, SunMedium, X } from 'lucide-react'
import { useAppContext } from '../../context/AppContext.jsx'
import { cn } from '../../utils/helpers'

export function Button({
  children,
  variant = 'primary',
  className,
  icon: Icon,
  ...props
}) {
  const variants = {
    primary:
      'bg-ink text-white hover:bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200',
    secondary:
      'bg-white/80 text-slate-900 ring-1 ring-slate-200 hover:bg-white dark:bg-white/5 dark:text-white dark:ring-white/10 dark:hover:bg-white/10',
    accent:
      'bg-pink-600 text-white hover:bg-pink-700',
    danger:
      'bg-rose-500 text-white hover:bg-rose-600 dark:hover:bg-rose-500',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400/50 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  )
}

export function Badge({ children, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Input({ label, className, hint, ...props }) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </span>
      ) : null}
      <input
        className={cn(
          'w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white',
          className,
        )}
        {...props}
      />
      {hint ? (
        <span className="text-xs text-slate-500 dark:text-slate-400">{hint}</span>
      ) : null}
    </label>
  )
}

export function Select({ label, className, children, ...props }) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </span>
      ) : null}
      <select
        className={cn(
          'w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}

export function Textarea({ label, className, ...props }) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </span>
      ) : null}
      <textarea
        className={cn(
          'min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10 dark:border-white/10 dark:bg-white/5 dark:text-white',
          className,
        )}
        {...props}
      />
    </label>
  )
}

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600 dark:text-pink-300">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h2 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="glass-panel overflow-hidden rounded-[28px] p-5">
      <div className="mb-5 h-48 animate-pulse rounded-[24px] bg-slate-200 dark:bg-white/10" />
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-6 w-3/4 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
      </div>
    </div>
  )
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="glass-panel rounded-[32px] px-6 py-12 text-center">
      <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export function Modal({ open, title, description, children, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] p-6"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                  {title}
                </h3>
                {description ? (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {description}
                  </p>
                ) : null}
              </div>
              <Button variant="ghost" onClick={onClose} aria-label="Close modal">
                <X size={18} />
              </Button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export function ThemeToggle() {
  const { state, toggleTheme } = useAppContext()

  return (
    <Button
      variant="secondary"
      className="rounded-full px-3 py-3"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
    >
      {state.theme === 'dark' ? <SunMedium size={18} /> : <MoonStar size={18} />}
    </Button>
  )
}

export function ToastViewport() {
  const { toasts } = useAppContext()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] mx-auto flex max-w-xl flex-col gap-3 px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={cn(
              'glass-panel pointer-events-auto rounded-3xl border px-5 py-4',
              toast.tone === 'success' && 'border-emerald-200/60 dark:border-emerald-400/20',
              toast.tone === 'error' && 'border-rose-200/60 dark:border-rose-400/20',
            )}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            <p className="text-sm font-semibold text-slate-950 dark:text-white">
              {toast.title}
            </p>
            {toast.message ? (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {toast.message}
              </p>
            ) : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
