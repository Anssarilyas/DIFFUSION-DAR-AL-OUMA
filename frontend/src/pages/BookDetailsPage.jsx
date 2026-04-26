import { motion } from 'framer-motion'
import {
  BookOpen,
  CalendarPlus,
  CheckCircle2,
  ExternalLink,
  Layers3,
  MessageCircle,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Input, Textarea } from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { getSubjectTheme, levelTone, pdfAccessLabel, whatsappLink } from '../utils/helpers'

function BookDetailsPage() {
  const navigate = useNavigate()
  const { bookId } = useParams()
  const { state, currentUser, notify, submitMeetingRequest } = useAppContext()
  const [message, setMessage] = useState('')

  const book = state.books.find((item) => item.id === bookId)

  if (!book) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
          <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
            Manuel introuvable
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Cette fiche n’existe plus ou a été supprimée du catalogue.
          </p>
          <div className="mt-6">
            <Link to="/books">
              <Button variant="accent">Retour au catalogue</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const theme = getSubjectTheme(book.subject)

  const handleRequest = (event) => {
    event.preventDefault()

    if (!currentUser) {
      navigate('/login')
      return
    }

    submitMeetingRequest({
      bookId: book.id,
      subject: book.subject,
      message:
        message ||
        `Je souhaite organiser une réunion autour du manuel ${book.title}.`,
    })
    setMessage('')
  }

  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="relative h-[420px]">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="h-full w-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-25`} />
              {book.isNew ? (
                <Badge className="absolute left-5 top-5 bg-pink-600 text-white">
                  Nouveauté
                </Badge>
              ) : null}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="flex flex-wrap gap-3">
              <Badge className={theme.soft}>{book.subject}</Badge>
              <Badge className={levelTone[book.level] || levelTone['Collège']}>
                {book.level}
              </Badge>
              <Badge className="bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
                {book.classLevel}
              </Badge>
            </div>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-slate-950 dark:text-white">
              {book.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
              {book.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link to={`/books/${book.id}/read`}>
                <Button variant="accent" icon={BookOpen} className="w-full">
                  Ouvrir le manuel
                </Button>
              </Link>
              <a
                href={whatsappLink(book.title)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" icon={MessageCircle} className="w-full">
                  Commander via WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <Layers3 className="text-pink-600" size={22} />
              <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                Manuel instrumenté
              </h2>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Public', value: book.audience },
                { label: 'Éditeur', value: book.publisher },
                { label: 'Pages', value: `${book.pages || 0} pages` },
                { label: 'PDF', value: pdfAccessLabel(book) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
              Chapitres et ressources associées
            </h2>
            <div className="mt-6 grid gap-3">
              {(book.chapters || []).map((chapter) => (
                <Link
                  key={`${chapter.title}-${chapter.page}`}
                  to={`/books/${book.id}/read`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-pink-200 hover:bg-pink-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">
                        {chapter.title}
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {(chapter.resources || []).join(' · ')}
                      </p>
                    </div>
                    <Badge className="bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
                      page {chapter.page}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
              Compétences indexées
            </h2>
            <div className="mt-5 grid gap-3">
              {(book.competencies || []).map((competency) => (
                <div
                  key={competency}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5"
                >
                  <CheckCircle2 className="text-emerald-500" size={18} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {competency}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                  Demande de réunion
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Envoyez une demande, elle restera en attente jusqu’à validation.
                </p>
              </div>
              <CalendarPlus className="text-pink-600" size={22} />
            </div>

            <form onSubmit={handleRequest} className="mt-6 space-y-4">
              <Input label="Sujet" value={book.subject} disabled />
              <Textarea
                label="Message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Précisez votre besoin : usage classe, parent, PDF, formation TND..."
              />
              <Button type="submit" variant="primary">
                Envoyer la demande
              </Button>
            </form>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Besoin d’une réponse rapide ? Copiez le lien WhatsApp.
              <button
                className="ml-2 inline-flex items-center gap-1 font-semibold text-pink-600"
                onClick={() => {
                  navigator.clipboard.writeText(whatsappLink(book.title))
                  notify({
                    title: 'Lien WhatsApp prêt',
                    message: 'Le lien a été copié dans le presse-papiers.',
                  })
                }}
                type="button"
              >
                Copier <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookDetailsPage
