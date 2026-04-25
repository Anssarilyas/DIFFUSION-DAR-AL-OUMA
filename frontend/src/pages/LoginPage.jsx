import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAppContext()
  const [form, setForm] = useState({
    email: 'admin@ktoba.ma',
    password: '123456789',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const user = await login(form)
      navigate(
        location.state?.from?.startsWith('/dashboard')
          ? location.state.from
          : `/dashboard/${user.role}`,
      )
    } catch (submissionError) {
      setError(submissionError.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
            Authentification
          </p>
          <h1 className="font-display text-4xl font-extrabold text-slate-950 dark:text-white sm:text-5xl">
            Reviens sur ton espace DIFFUSION DAR AL OUMA.
          </h1>
          <p className="max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Gestion JWT côté API Laravel, dashboards sécurisés et permissions par rôle
            pour chaque profil.
          </p>

          <div className="glass-panel rounded-[32px] p-6">
            <div className="flex items-center gap-4">
              <ShieldCheck className="text-sky-500" size={24} />
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">
                  Comptes de démonstration
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  `admin@ktoba.ma / 123456789`, `ilyas@ktoba.ma / teacher123`,
                  `oussama@ktoba.ma / teacher123`, `user@ktoba.ma / student123`
                </p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-[36px] p-6 sm:p-8">
          <div className="space-y-5">
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              required
            />

            {error ? (
              <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => navigate('/register')}
            >
              Créer un nouveau compte
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
