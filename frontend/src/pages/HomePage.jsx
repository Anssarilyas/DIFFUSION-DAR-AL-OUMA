import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers3,
  ScanLine,
  Search,
  Users2,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BookCard from '../components/books/BookCard.jsx'
import { Badge, Button, SectionHeading } from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'

const levelLinks = [
  'Maternelle',
  'Élémentaire',
  'Collège',
  'Lycée',
  'Formation TND',
  'Parents',
]

const platformPillars = [
  {
    icon: BookOpen,
    title: 'Manuel instrumenté',
    text: 'Chapitres, compétences et activités deviennent les points d’entrée de la plateforme.',
  },
  {
    icon: GraduationCap,
    title: 'Formation scénarisée',
    text: 'Capsules enseignants et parents liées aux usages réels du manuel.',
  },
  {
    icon: Layers3,
    title: 'Suivi non diagnostique',
    text: 'Données au niveau activité et session, sans interprétation clinique.',
  },
]

function HomePage() {
  const navigate = useNavigate()
  const { state, stats } = useAppContext()
  const [query, setQuery] = useState('')

  const featuredBooks = state.books.filter((book) => book.featured).slice(0, 3)

  const handleSearch = (event) => {
    event.preventDefault()
    navigate(`/books?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="bg-white dark:bg-slate-950">
      <section
        className="relative min-h-[72vh] overflow-hidden bg-slate-950"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(15,23,42,0.82), rgba(15,23,42,0.42)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <Badge className="w-fit bg-white text-pink-700">
            Plateforme éditoriale et formative
          </Badge>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            DIFFUSION DAR AL OUMA
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
            Manuels scolaires instrumentés, ressources numériques, capsules TND et
            accompagnement enseignant-parent autour d’un même catalogue.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-3xl flex-col gap-3 rounded-[24px] bg-white p-3 shadow-xl sm:flex-row"
          >
            <label className="flex flex-1 items-center gap-3 rounded-[18px] bg-slate-50 px-4">
              <Search className="text-slate-500" size={22} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Recherche par titre, chapitre, compétence, TND..."
                className="h-14 w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>
            <Button type="submit" variant="accent" className="h-14 rounded-[18px] px-6">
              Rechercher
            </Button>
          </form>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/books">
              <Button variant="secondary" icon={BookOpen}>
                Explorer le catalogue
              </Button>
            </Link>
            <Link to="/architecture-tnd">
              <Button variant="secondary" icon={ArrowRight}>
                Architecture TND
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 py-5 sm:px-6 md:grid-cols-3 lg:grid-cols-6 lg:px-8">
          {levelLinks.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => navigate(`/books?level=${encodeURIComponent(level)}`)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-pink-200 hover:text-pink-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
            >
              {level}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          { label: 'Manuels', value: stats.totalBooks, icon: BookOpen },
          { label: 'Utilisateurs', value: stats.totalUsers, icon: Users2 },
          { label: 'Accès QR / chapitre', value: 'Prêt', icon: ScanLine },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <item.icon className="text-pink-600" size={24} />
            <p className="mt-5 text-3xl font-extrabold text-slate-950 dark:text-white">
              {item.value}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              {item.label}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Système"
          title="Le manuel reste le centre"
          description="La plateforme prolonge le manuel, enrichit les usages et structure la formation sans le remplacer."
          action={
            <Link to="/architecture-tnd">
              <Button variant="secondary">Voir les 10 blocs</Button>
            </Link>
          }
        />
        <div className="grid gap-5 md:grid-cols-3">
          {platformPillars.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
            >
              <item.icon className="text-pink-600" size={24} />
              <h3 className="mt-5 font-display text-xl font-semibold text-slate-950 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sélection"
          title="Manuels et modules mis en avant"
          description="Une sélection éditoriale pensée pour la classe, la maison et la formation TND."
          action={
            <Link to="/books">
              <Button variant="secondary">Voir tout le catalogue</Button>
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
