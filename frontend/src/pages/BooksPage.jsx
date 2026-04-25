import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useDeferredValue, useEffect, useState } from 'react'
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
import { filterBooks } from '../utils/helpers'

function BooksPage() {
  const { state } = useAppContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [subject, setSubject] = useState(searchParams.get('subject') || '')
  const [level, setLevel] = useState(searchParams.get('level') || '')
  const [loading, setLoading] = useState(true)
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const nextParams = new URLSearchParams()

    if (search) {
      nextParams.set('q', search)
    }
    if (subject) {
      nextParams.set('subject', subject)
    }
    if (level) {
      nextParams.set('level', level)
    }

    setSearchParams(nextParams, { replace: true })
  }, [level, search, setSearchParams, subject])

  const filteredBooks = filterBooks({
    books: state.books,
    query: deferredSearch,
    subject,
    level,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Catalogue"
        title="Trouver le bon livre au bon moment"
        description="Par matière, par niveau ou par mot-clé: le catalogue reste rapide et lisible, même sur mobile."
      />

      <div className="glass-panel mb-8 rounded-[32px] p-5">
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
          <label className="flex items-center gap-3 rounded-[24px] bg-slate-50 px-4 dark:bg-white/5">
            <Search className="text-slate-400" size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Math, SVT, Terminale..."
              className="h-14 w-full border-0 bg-transparent text-sm outline-none dark:text-white"
            />
          </label>

          <Select value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option value="">Toutes les matières</option>
            {state.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Select value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="">Tous les niveaux</option>
            {state.levels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>

          <Button
            variant="secondary"
            onClick={() => {
              setSearch('')
              setSubject('')
              setLevel('')
            }}
          >
            Reset
          </Button>
        </div>
      </div>

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
          title="Aucun livre trouvé"
          description="Essaie un autre mot-clé, une matière différente ou enlève un filtre pour élargir les résultats."
        />
      )}
    </div>
  )
}

export default BooksPage
