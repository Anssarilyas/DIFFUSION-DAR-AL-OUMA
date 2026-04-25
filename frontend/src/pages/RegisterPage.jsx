import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Select } from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'

function RegisterPage() {
  const navigate = useNavigate()
  const { register, state, loading } = useAppContext()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    level: state.levels[0] || 'Primaire',
  })
  const [error, setError] = useState('')

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    try {
      const user = await register(form)
      navigate(`/dashboard/${user.role}`)
    } catch (submissionError) {
      setError(submissionError.message)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-[40px] p-6 sm:p-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
            Inscription
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-950 dark:text-white">
            Créer un compte parent ou élève.
          </h1>
          <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
            Formulaire propre, validations simples et onboarding rapide vers le
            dashboard utilisateur.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <Input
            label="Prénom"
            value={form.firstName}
            onChange={(event) => setField('firstName', event.target.value)}
            required
          />
          <Input
            label="Nom"
            value={form.lastName}
            onChange={(event) => setField('lastName', event.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setField('email', event.target.value)}
            required
          />
          <Input
            label="Téléphone"
            value={form.phone}
            onChange={(event) => setField('phone', event.target.value)}
            required
          />
          <Select
            label="Niveau principal"
            value={form.level}
            onChange={(event) => setField('level', event.target.value)}
          >
            {state.levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
          <Input
            label="Mot de passe"
            type="password"
            value={form.password}
            onChange={(event) => setField('password', event.target.value)}
            required
          />

          <div className="md:col-span-2">
            {error ? (
              <div className="mb-4 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-200">
                {error}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="accent" disabled={loading}>
                {loading ? 'Création...' : 'Créer mon compte'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/login')}>
                J’ai déjà un compte
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage
