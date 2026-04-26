import { motion } from 'framer-motion'
import { Check, Search, SlidersHorizontal, X } from 'lucide-react'
import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/books/BookCard.jsx'
import {
  Button,
  EmptyState,
  SectionHeading,
  Select,
  SkeletonCard,
} from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { audienceOptions, classOptions, publisherOptions } from '../data/mockData'
import { filterBooks } from '../utils/helpers'

function BooksPage() {
  const { state } = useAppContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [subject, setSubject] = useState(searchParams.get('subject') || '')
  const [level, setLevel] = useState(searchParams.get('level') || '')
  const [classLevel, setClassLevel] = useState(searchParams.get('class') || '')
  const [audience, setAudience] = useState(searchParams.get('audience') || 'Enseignant')
  const [publisher, setPublisher] = useState(searchParams.get('publisher') || '')
  const [onlyNew, setOnlyNew] = useState(searchParams.get('new') === '1')
  const [loading, setLoading] = useState(true)
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 350)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const nextParams = new URLSearchParams()

    if (search) nextParams.set('q', search)
    if (subject) nextParams.set('subject', subject)
    if (level) nextParams.set('level', level)
    if (classLevel) nextParams.set('class', classLevel)
    if (audience) nextParams.set('audience', audience)
    if (publisher) nextParams.set('publisher', publisher)
    if (onlyNew) nextParams.set('new', '1')

    setSearchParams(nextParams, { replace: true })
  }, [
    audience,
    classLevel,
    level,
    onlyNew,
    publisher,
    search,
    setSearchParams,
    subject,
  ])

  const filteredBooks = useMemo(
    () =>
      filterBooks({
        books: state.books,
        query: deferredSearch,
        subject,
        level,
        classLevel,
        audience,
        publisher,
        onlyNew,
      }),
    [
      audience,
      classLevel,
      deferredSearch,
      level,
      onlyNew,
      publisher,
      state.books,
      subject,
    ],
  )

  const resetFilters = () => {
    setSearch('')
    setSubject('')
    setLevel('')
    setClassLevel('')
    setAudience('')
    setPublisher('')
    setOnlyNew(false)
  }

  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-[#f3f3f5] dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
              Enseignants, parents et élèves, découvrez les manuels numériques et
              leurs ressources associées.
            </p>
            <label className="mt-8 flex max-w-2xl items-center gap-4 rounded-[22px] bg-white px-6 py-4 shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Recherche par titre, chapitre, compétence, TND..."
                className="h-10 w-full bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <Search className="text-slate-900 dark:text-white" size={28} />
            </label>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_1fr_1fr_1fr]">
            <div className="lg:col-span-2">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
                Public
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {audienceOptions.map((item) => {
                  const selected = audience === item

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setAudience(selected ? '' : item)}
                      className={`flex h-14 items-center justify-between rounded-[18px] px-5 text-sm font-bold transition ${
                        selected
                          ? 'bg-pink-600 text-white shadow-sm'
                          : 'bg-white text-pink-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-pink-200 dark:ring-white/10'
                      }`}
                    >
                      Je suis {item.toLowerCase()}
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${
                          selected ? 'bg-white text-pink-600' : 'bg-pink-100 text-pink-500'
                        }`}
                      >
                        {selected ? <Check size={17} /> : null}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
                Niveau
              </p>
              <Select value={level} onChange={(event) => setLevel(event.target.value)}>
                <option value="">Tous</option>
                {state.levels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
                Classe
              </p>
              <Select
                value={classLevel}
                onChange={(event) => setClassLevel(event.target.value)}
              >
                <option value="">Tous</option>
                {classOptions
                  .filter((item) => item !== 'Tous')
                  .map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </Select>
            </div>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
                Discipline
              </p>
              <Select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              >
                <option value="">Tous</option>
                {state.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-slate-500">
                Éditeur
              </p>
              <Select
                value={publisher}
                onChange={(event) => setPublisher(event.target.value)}
              >
                <option value="">Tous</option>
                {publisherOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setOnlyNew((current) => !current)}
                className={`flex h-14 w-full items-center justify-between rounded-[18px] px-5 text-sm font-bold transition ${
                  onlyNew
                    ? 'bg-pink-600 text-white'
                    : 'bg-white text-pink-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-pink-200 dark:ring-white/10'
                }`}
              >
                Nouveautés
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-100 text-pink-500">
                  {onlyNew ? <Check size={17} /> : null}
                </span>
              </button>
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                icon={SlidersHorizontal}
                onClick={resetFilters}
                className="h-14 rounded-[18px]"
              >
                Reset
              </Button>
            </div>
          </div>

          {publisher ? (
            <button
              type="button"
              onClick={() => setPublisher('')}
              className="mt-6 inline-flex items-center gap-3 rounded-[18px] bg-pink-600 px-5 py-3 text-sm font-bold text-white"
            >
              {publisher}
              <X size={18} />
            </button>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Catalogue"
          title={`${filteredBooks.length} ressources numériques`}
          description="Tous les résultats restent centrés sur le manuel : chapitres, compétences, capsules de formation, activités numériques et guides parents."
        />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : filteredBooks.length ? (
          <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            title="Aucun manuel trouvé"
            description="Essayez un autre mot-clé, une autre classe ou retirez un filtre pour élargir les résultats."
            action={
              <Button variant="accent" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            }
          />
        )}
      </section>
    </div>
  )
}

export default BooksPage
