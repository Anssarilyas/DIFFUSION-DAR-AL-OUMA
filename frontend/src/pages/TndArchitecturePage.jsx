import { motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Layers3,
  Network,
  Search,
  ShieldAlert,
} from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { architectureSections } from '../data/mockData'
import { normalizeSearch } from '../utils/helpers'
import { Badge, Button, SectionHeading } from '../components/ui/index.jsx'

const keySignals = [
  {
    icon: BookOpen,
    title: 'Manuel central',
    text: 'Le manuel scolaire reste l’unité éditoriale et pédagogique principale.',
  },
  {
    icon: Layers3,
    title: 'Formation TND',
    text: 'Les modules enseignants et parents expliquent, guident et scénarisent.',
  },
  {
    icon: Activity,
    title: 'Numérique léger',
    text: 'La plateforme relie les ressources, suit l’usage et évite le diagnostic.',
  },
]

const renderSectionBody = (section) => {
  if (section.diagram) {
    return (
      <div className="mt-6 grid gap-3">
        {section.diagram.map((item, index) => (
          <div
            key={`${section.id}-${item}`}
            className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
              index === 0
                ? 'border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-400/20 dark:bg-pink-500/10 dark:text-pink-200'
                : 'border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'
            }`}
          >
            {item}
          </div>
        ))}
      </div>
    )
  }

  if (section.groups) {
    return (
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {section.groups.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"
          >
            <h3 className="font-display text-lg font-semibold text-slate-950 dark:text-white">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"
                >
                  <CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )
  }

  if (section.table) {
    return (
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
        <div className="grid grid-cols-[1fr_1fr_120px] bg-slate-950 text-sm font-bold text-white">
          <div className="px-4 py-3">Niveau</div>
          <div className="px-4 py-3">Usage</div>
          <div className="px-4 py-3">Statut</div>
        </div>
        {section.table.map((row) => (
          <div
            key={row.level}
            className="grid grid-cols-[1fr_1fr_120px] border-t border-slate-200 bg-white text-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="px-4 py-4 font-semibold text-slate-950 dark:text-white">
              {row.level}
            </div>
            <div className="px-4 py-4 text-slate-600 dark:text-slate-300">
              {row.usage}
            </div>
            <div className="px-4 py-4">
              <Badge
                className={
                  row.priority === 'optionnel'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200'
                }
              >
                {row.priority}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ul className="mt-6 grid gap-3 md:grid-cols-2">
      {(section.points || []).map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
        >
          <CheckCircle2 className="mt-1 shrink-0 text-emerald-500" size={16} />
          {item}
        </li>
      ))}
    </ul>
  )
}

function TndArchitecturePage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const visibleSections = useMemo(() => {
    const normalizedQuery = normalizeSearch(deferredQuery)

    if (!normalizedQuery) {
      return architectureSections
    }

    return architectureSections.filter((section) => {
      const groupText = (section.groups || [])
        .map((group) => `${group.title} ${group.items.join(' ')}`)
        .join(' ')
      const tableText = (section.table || [])
        .map((row) => `${row.level} ${row.usage} ${row.priority}`)
        .join(' ')
      const text = normalizeSearch(
        `${section.number} ${section.title} ${section.lead} ${(section.points || []).join(' ')} ${(section.diagram || []).join(' ')} ${groupText} ${tableText}`,
      )

      return text.includes(normalizedQuery)
    })
  }, [deferredQuery])

  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-200">
              Manuel + Formation + TND
            </Badge>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-5xl">
              Architecture adaptée au contexte éditorial et formatif.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Le projet est réorienté d’une logique d’application éducative vers un
              écosystème éditorial-formatif instrumenté, centré sur le manuel scolaire.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/books">
                <Button variant="accent">Voir les manuels</Button>
              </Link>
              <Link to="/dashboard/admin?section=books">
                <Button variant="secondary">Ajouter un PDF</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {keySignals.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <item.icon className="text-pink-600" size={22} />
                <h2 className="mt-4 font-display text-xl font-semibold text-slate-950 dark:text-white">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Recherche"
          title="Retrouver un bloc, un mot ou un caractère"
          description="La recherche accepte les accents, apostrophes, mots TND, termes techniques et variantes sans accent."
        />
        <label className="mb-10 flex max-w-3xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/5">
          <Search className="text-pink-600" size={20} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ex. phonologie, activité, À la maison, TDDP, écosystème..."
            className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
        </label>

        <div className="grid gap-6">
          {visibleSections.map((section, index) => (
            <motion.article
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.03 }}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <Badge className="bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                    {section.number}
                  </Badge>
                  <h2 className="mt-4 font-display text-2xl font-bold text-slate-950 dark:text-white">
                    {section.title}
                  </h2>
                  <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {section.lead}
                  </p>
                </div>
                {section.id === 'integration-tnd' ? (
                  <ShieldAlert className="text-amber-500" size={28} />
                ) : section.id === 'structure-technique' ? (
                  <Network className="text-indigo-500" size={28} />
                ) : section.id === 'niveau-donnees' ? (
                  <BarChart3 className="text-emerald-500" size={28} />
                ) : null}
              </div>
              {renderSectionBody(section)}
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TndArchitecturePage
