import { motion } from 'framer-motion'
import { BookText, CalendarPlus, ExternalLink, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Input, Textarea } from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { getSubjectTheme, levelTone, whatsappLink } from '../utils/helpers'

function BookDetailsPage() {
  const navigate = useNavigate()
  const { bookId } = useParams()
  const { state, currentUser, notify, submitMeetingRequest } = useAppContext()
  const [message, setMessage] = useState('')

  const book = state.books.find((item) => item.id === bookId)

  if (!book) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-[32px] p-10 text-center">
          <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
            Livre introuvable
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
        message || `Je souhaite organiser une réunion autour du livre ${book.title}.`,
    })
    setMessage('')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel overflow-hidden rounded-[36px]"
        >
          <div className="relative h-[340px]">
            <img
              src={book.imageUrl}
              alt={book.title}
              className="h-full w-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-35`} />
          </div>
          <div className="space-y-5 p-6">
            <div className="flex flex-wrap gap-3">
              <Badge className={theme.soft}>{book.subject}</Badge>
              <Badge className={levelTone[book.level]}>{book.level}</Badge>
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-slate-950 dark:text-white">
                {book.title}
              </h1>
              <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                {book.description}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {book.pdfUrl ? (
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="accent" icon={BookText} className="w-full">
                    Lire PDF
                  </Button>
                </a>
              ) : (
                <div className="rounded-[24px] border border-dashed border-amber-300 bg-amber-50 px-4 py-4 text-sm font-semibold text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
                  PDF غير متوفر حاليا
                </div>
              )}

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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="glass-panel rounded-[32px] p-6">
            <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
              Informations rapides
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: 'Matière', value: book.subject },
                { label: 'Niveau', value: book.level },
                { label: 'Commande', value: 'WhatsApp direct' },
                { label: 'Lecture', value: book.pdfUrl ? 'PDF disponible' : 'PDF indisponible' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
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

          <div className="glass-panel rounded-[32px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                  Demande réunion
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Envoie une demande, elle restera en attente jusqu’à validation par
                  l’administration.
                </p>
              </div>
              <CalendarPlus className="text-sky-500" size={22} />
            </div>

            <form onSubmit={handleRequest} className="mt-6 space-y-4">
              <Input label="Sujet" value={book.subject} disabled />
              <Textarea
                label="Message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Précise ton besoin: niveau, créneau souhaité, questions..."
              />
              <Button type="submit" variant="primary">
                Envoyer la demande
              </Button>
            </form>

            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Besoin d’une réponse plus rapide ? Tu peux aussi ouvrir WhatsApp
              directement.
              <button
                className="ml-2 inline-flex items-center gap-1 font-semibold text-sky-500"
                onClick={() => {
                  navigator.clipboard.writeText(whatsappLink(book.title))
                  notify({
                    title: 'Lien WhatsApp prêt',
                    message: 'Le lien a été copié dans le presse-papiers.',
                  })
                }}
                type="button"
              >
                Copier le lien <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookDetailsPage
