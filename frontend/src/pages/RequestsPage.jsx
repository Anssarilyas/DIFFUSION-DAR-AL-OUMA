import { motion } from 'framer-motion'
import { CheckCircle2, Clock3, Video, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Button, EmptyState, SectionHeading } from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { formatDate, requestTone } from '../utils/helpers'

function RequestsPage() {
  const { state, currentUser, updateRequestStatus } = useAppContext()

  const requests = state.requests.filter((request) => {
    if (!currentUser) {
      return false
    }

    if (currentUser.role === 'admin') {
      return true
    }

    if (currentUser.role === 'formateur') {
      return request.subject === currentUser.subject
    }

    return request.userId === currentUser.id
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Demandes"
        title="Suivi des réunions et confirmations"
        description="Les demandes passent par un statut clair: pending, confirmed ou refused. L’admin peut agir, le formateur suit les sujets de sa matière, l’utilisateur voit ses propres tickets."
      />

      {requests.length ? (
        <div className="grid gap-5">
          {requests.map((request) => {
            const book = state.books.find((item) => item.id === request.bookId)
            const user = state.users.find((item) => item.id === request.userId)

            return (
              <motion.div
                key={request.id}
                layout
                className="glass-panel rounded-[30px] p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={requestTone[request.status]}>
                        {request.status}
                      </Badge>
                      <Badge className="bg-white/70 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                        {request.subject}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                        {book?.title || 'Livre supprimé'}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Par {user?.firstName} {user?.lastName} • {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {request.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {currentUser?.role === 'admin' && request.status === 'pending' ? (
                      <>
                        <Button
                          variant="accent"
                          icon={CheckCircle2}
                          onClick={() =>
                            updateRequestStatus(request.id, 'confirmed')
                          }
                        >
                          Confirmer
                        </Button>
                        <Button
                          variant="danger"
                          icon={XCircle}
                          onClick={() => updateRequestStatus(request.id, 'refused')}
                        >
                          Refuser
                        </Button>
                      </>
                    ) : (
                      <div className="rounded-[24px] border border-slate-200 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                        <Clock3 className="mr-2 inline-block" size={16} />
                        Statut actuel: {request.status}
                      </div>
                    )}
                    {book ? (
                      <Link to={`/books/${book.id}`}>
                        <Button variant="secondary">Voir le livre</Button>
                      </Link>
                    ) : null}
                    {request.status === 'confirmed' ? (
                      <Link
                        to={request.meetingLinkPath || `/meeting-room/${request.id}`}
                      >
                        <Button variant="accent" icon={Video}>
                          Rejoindre la réunion
                        </Button>
                      </Link>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <EmptyState
          title="Aucune demande pour le moment"
          description="Quand les utilisateurs enverront des demandes de réunion, elles apparaîtront ici avec leur statut."
        />
      )}
    </div>
  )
}

export default RequestsPage
