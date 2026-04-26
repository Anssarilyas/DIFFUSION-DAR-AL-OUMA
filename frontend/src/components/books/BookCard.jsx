import { motion } from 'framer-motion'
import { BookOpen, Edit3, Eye, MessageCircle, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getSubjectTheme, levelTone, truncate, whatsappLink } from '../../utils/helpers'
import { Badge, Button } from '../ui/index.jsx'

function BookCard({ book, canManage = false, creatorName, onEdit, onDelete }) {
  const theme = getSubjectTheme(book.subject)

  return (
    <motion.article
      layout
      whileHover={{ y: -5 }}
      className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-xl dark:bg-white/5 ${theme.border}`}
    >
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/60 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {book.isNew ? (
            <Badge className="bg-pink-600 text-white">Nouveauté</Badge>
          ) : null}
          <Badge className={theme.soft}>{book.subject}</Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-white">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
            {book.classLevel || book.level}
          </span>
          <span className="text-xs font-semibold">{book.publisher || 'Dar Al Ouma'}</span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge className={levelTone[book.level] || levelTone['Collège']}>
              {book.level}
            </Badge>
            <Badge className="bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200">
              {book.audience || 'Enseignant'}
            </Badge>
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold leading-tight text-slate-950 dark:text-white">
            {book.title}
          </h3>
          {creatorName ? (
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              Ajouté par {creatorName}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {truncate(book.description, 150)}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Link to={`/books/${book.id}`} className="min-w-0">
            <Button variant="secondary" icon={Eye} className="w-full rounded-xl">
              Fiche
            </Button>
          </Link>
          <Link to={`/books/${book.id}/read`} className="min-w-0">
            <Button variant="accent" icon={BookOpen} className="w-full rounded-xl">
              Lire
            </Button>
          </Link>
        </div>

        <a
          href={whatsappLink(book.title)}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button variant="ghost" icon={MessageCircle} className="w-full rounded-xl">
            Commander via WhatsApp
          </Button>
        </a>

        {canManage ? (
          <div className="flex flex-wrap gap-3 border-t border-slate-200/70 pt-4 dark:border-white/10">
            <Button variant="ghost" icon={Edit3} onClick={() => onEdit(book)}>
              Modifier
            </Button>
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => onDelete(book)}
            >
              Supprimer
            </Button>
          </div>
        ) : null}
      </div>
    </motion.article>
  )
}

export default BookCard
