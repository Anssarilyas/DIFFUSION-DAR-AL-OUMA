import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookCheck,
  Clock3,
  Download,
  Search,
  ShieldCheck,
  Users2,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BookCard from '../components/books/BookCard.jsx'
import { Badge, Button, SectionHeading } from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { getSubjectTheme } from '../utils/helpers'

function HomePage() {
  const navigate = useNavigate()
  const { state, stats } = useAppContext()
  const [query, setQuery] = useState('')
  const guidePdfPath = '/downloads/Guide_Utilisateur_DIFFUSION_DAR_AL_OUMA.pdf'

  const featuredBooks = state.books.filter((book) => book.featured).slice(0, 3)

  const handleSearch = (event) => {
    event.preventDefault()
    navigate(`/books?q=${encodeURIComponent(query)}`)
  }

  return (
    <div>
      <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <div className="hero-grid glass-panel relative overflow-hidden rounded-[40px] px-6 py-10 sm:px-10 lg:px-14 lg:py-16">
          <div className="hero-orb left-[10%] top-14 h-32 w-32 bg-sky-400/25" />
          <div className="hero-orb right-[12%] top-10 h-44 w-44 bg-orange-400/20" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative z-10">
              <Badge className="bg-white/80 text-sky-700 dark:bg-white/10 dark:text-sky-200">
                Bibliothèque scolaire moderne
              </Badge>
              <h1 className="mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                Gérer, découvrir et partager les meilleurs livres scolaires.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
                Une expérience premium pour les parents, les élèves, les formateurs
                et l administration : catalogue intelligent, lecture PDF, demandes de
                réunion, commandes WhatsApp et dashboards orientés métier.
              </p>

              <form
                onSubmit={handleSearch}
                className="mt-8 flex flex-col gap-3 rounded-[28px] border border-white/50 bg-white/80 p-3 shadow-soft dark:border-white/10 dark:bg-white/5 sm:flex-row"
              >
                <div className="flex flex-1 items-center gap-3 rounded-[22px] bg-slate-50 px-4 dark:bg-white/5">
                  <Search className="text-slate-400" size={18} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Chercher un livre, une matière ou un niveau"
                    className="h-14 w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400 dark:text-white"
                  />
                </div>
                <Button type="submit" variant="accent" className="h-14 px-6">
                  Rechercher
                </Button>
              </form>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => navigate('/books')}>
                  Explorer le catalogue
                </Button>
                <Button
                  variant="secondary"
                  icon={ArrowRight}
                  onClick={() => navigate('/register')}
                >
                  Créer un compte
                </Button>
                <a href={guidePdfPath} download>
                  <Button variant="secondary" icon={Download}>
                    Télécharger le guide PDF
                  </Button>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="glass-panel relative rounded-[36px] p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      icon: BookCheck,
                      label: 'Livres disponibles',
                      value: stats.totalBooks,
                    },
                    {
                      icon: Users2,
                      label: 'Utilisateurs actifs',
                      value: stats.totalUsers,
                    },
                    {
                      icon: Clock3,
                      label: 'Demandes totales',
                      value: stats.totalRequests,
                    },
                    {
                      icon: ShieldCheck,
                      label: 'Demandes en attente',
                      value: stats.pendingRequests,
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ y: -4 }}
                      className="rounded-[28px] border border-white/40 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5"
                    >
                      <item.icon className="text-sky-500" size={20} />
                      <p className="mt-5 text-3xl font-extrabold text-slate-950 dark:text-white">
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {item.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="glass-panel overflow-hidden rounded-[34px] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">
                Guide utilisateur
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold text-slate-950 dark:text-white">
                Un PDF complet en francais pour comprendre toute la plateforme
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Le guide explique en détail le fonctionnement du site pour le Super
                Admin, les formateurs et les utilisateurs. Il peut être téléchargé
                directement depuis cette page et partagé avec les équipes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a href={guidePdfPath} download>
                <Button variant="accent" icon={Download}>
                  Télécharger le PDF
                </Button>
              </a>
              <a
                href={guidePdfPath}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary">Ouvrir le guide</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Matières"
          title="Couleurs, catégories et parcours d apprentissage"
          description="Chaque matière possède sa propre identité visuelle pour rendre l exploration plus intuitive, plus agréable et plus mémorable."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {state.categories.map((category) => {
            const theme = getSubjectTheme(category)

            return (
              <motion.div
                key={category}
                whileHover={{ y: -6, rotate: -0.5 }}
                className={`glass-panel overflow-hidden rounded-[30px] border ${theme.border} p-6`}
              >
                <div
                  className={`mb-5 h-2 rounded-full bg-gradient-to-r ${theme.gradient}`}
                />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                      {category}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      Collection dédiée avec filtres, recommandations et livres
                      adaptés aux besoins de la matière.
                    </p>
                  </div>
                  <Badge className={theme.soft}>
                    {
                      state.books.filter((book) => book.subject === category).length
                    }{' '}
                    livres
                  </Badge>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Sélection"
          title="Livres mis en avant"
          description="Une curation éditoriale pensée pour faire ressortir les références les plus demandées du moment."
          action={
            <Button variant="secondary" onClick={() => navigate('/books')}>
              Voir tout le catalogue
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plateforme"
          title="Pensée comme un vrai produit SaaS éducation"
          description="Navigation rapide, dashboards segmentés par rôle, commandes directes et validation des demandes par workflow sécurisé."
        />

        <div className="grid gap-5 lg:grid-cols-4">
          {[
            'Authentification JWT et accès par rôles',
            'Recherche filtrée par matière et niveau',
            'Ouverture PDF instantanée dans un nouvel onglet',
            'Demandes réunion avec confirmation admin',
          ].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="glass-panel rounded-[28px] p-6"
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                0{index + 1}
              </p>
              <p className="mt-4 font-display text-xl font-semibold text-slate-950 dark:text-white">
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
