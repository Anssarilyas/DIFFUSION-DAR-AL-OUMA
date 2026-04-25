import { motion } from 'framer-motion'
import { Edit3, Eye, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getSubjectTheme, levelTone, truncate, whatsappLink } from '../../utils/helpers'
import { Badge, Button } from '../ui/index.jsx'

function BookCard({ book, canManage = false, creatorName, onEdit, onDelete }) {
  const theme = getSubjectTheme(book.subject)

  return (
    <motion.article
      layout
      whileHover={{ y: -6 }}
      className={`glass-panel group overflow-hidden rounded-[32px] border ${theme.border} ${theme.glow}`}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={book.imageUrl}
          alt={book.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-30`}
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge className={theme.soft}>{book.subject}</Badge>
          <Badge className={levelTone[book.level]}>{book.level}</Badge>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
            {book.title}
          </h3>
          {creatorName ? (
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              Created by {creatorName}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {truncate(book.description, 145)}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to={`/books/${book.id}`} className="min-w-[150px] flex-1">
            <Button variant="accent" icon={Eye} className="w-full">
              Voir détails
            </Button>
          </Link>

          <a
            href={whatsappLink(book.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[170px] flex-1"
          >
            <Button variant="secondary" className="w-full">
              Commander via WhatsApp
            </Button>
          </a>
        </div>

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
