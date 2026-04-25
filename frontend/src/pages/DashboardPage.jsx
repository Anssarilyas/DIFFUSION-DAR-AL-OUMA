import { motion } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  FolderKanban,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Plus,
  ShieldCheck,
  UserCog,
  Users2,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import BookCard from '../components/books/BookCard.jsx'
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Modal,
  SectionHeading,
  Select,
  Textarea,
} from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { formatDate, requestTone, roleLabel } from '../utils/helpers'

const dashboardSections = {
  admin: [
    { key: 'overview', label: 'Stats', icon: LayoutDashboard },
    { key: 'books', label: 'Books', icon: BookOpen },
    { key: 'users', label: 'Users', icon: Users2 },
    { key: 'requests', label: 'Requests', icon: ShieldCheck },
    { key: 'categories', label: 'Categories', icon: FolderKanban },
  ],
  utilisateur: [
    { key: 'overview', label: 'Books', icon: BookOpen },
    { key: 'requests', label: 'My Requests', icon: ShieldCheck },
    { key: 'profile', label: 'Profile', icon: UserCog },
  ],
  formateur: [
    { key: 'overview', label: 'My Books', icon: BookOpen },
    { key: 'requests', label: 'Requests', icon: ShieldCheck },
  ],
}

const initialBookForm = {
  title: '',
  description: '',
  imageUrl: '',
  pdfUrl: '',
  subject: 'Math',
  level: 'Lycée',
}

const initialFormateurForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: 'teacher123',
  role: 'formateur',
  subject: 'Math',
  level: 'LycÃ©e',
}

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Impossible de lire ce fichier.'))
    reader.readAsDataURL(file)
  })

function DashboardPage() {
  const navigate = useNavigate()
  const { roleName } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    state,
    currentUser,
    stats,
    logout,
    saveBook,
    deleteBook,
    saveUser,
    createUser,
    deleteUser,
    updateRequestStatus,
    addCategory,
    removeCategory,
    addLevel,
    removeLevel,
    updateProfile,
  } = useAppContext()
  const [bookForm, setBookForm] = useState(initialBookForm)
  const [bookModalOpen, setBookModalOpen] = useState(false)
  const [bookImageName, setBookImageName] = useState('')
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [formateurModalOpen, setFormateurModalOpen] = useState(false)
  const [formateurForm, setFormateurForm] = useState(initialFormateurForm)
  const [categoryName, setCategoryName] = useState('')
  const [levelName, setLevelName] = useState('')
  const activeRole = currentUser?.role
  const sectionList = dashboardSections[activeRole] || dashboardSections.utilisateur
  const activeSection = searchParams.get('section') || sectionList[0].key

  useEffect(() => {
    if (currentUser && roleName !== currentUser.role) {
      navigate(`/dashboard/${currentUser.role}`, { replace: true })
    }
  }, [currentUser, navigate, roleName])

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const allowedBooks =
    currentUser.role === 'formateur'
      ? state.books.filter((book) => book.subject === currentUser.subject)
      : state.books

  const visibleRequests = state.requests.filter((request) => {
    if (currentUser.role === 'admin') {
      return true
    }
    if (currentUser.role === 'formateur') {
      return request.subject === currentUser.subject
    }
    return request.userId === currentUser.id
  })

  const updateSection = (section) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('section', section)
    setSearchParams(nextParams, { replace: true })
  }

  const startCreateBook = () => {
    setBookForm({
      ...initialBookForm,
      subject: state.categories[0] || 'Math',
      level: state.levels[0] || 'Primaire',
    })
    setBookImageName('')
    setBookModalOpen(true)
  }

  const startEditBook = (book) => {
    setBookForm(book)
    setBookImageName('Image actuelle')
    setBookModalOpen(true)
  }

  const handleBookImageChange = async (event) => {
    const [file] = event.target.files || []

    if (!file) {
      return
    }

    const imageUrl = await readFileAsDataUrl(file)

    setBookForm((current) => ({
      ...current,
      imageUrl,
    }))
    setBookImageName(file.name)
  }

  const submitBookForm = (event) => {
    event.preventDefault()
    saveBook(bookForm)
    setBookModalOpen(false)
    setBookForm(initialBookForm)
    setBookImageName('')
  }

  const overviewCards = [
    { label: 'Users', value: stats.totalUsers, icon: Users2 },
    { label: 'Books', value: stats.totalBooks, icon: BookOpen },
    { label: 'Requests', value: stats.totalRequests, icon: ShieldCheck },
    { label: 'Pending', value: stats.pendingRequests, icon: BarChart3 },
  ]

  const formateurs = state.users.filter((user) => user.role === 'formateur')
  const utilisateurs = state.users.filter((user) => user.role === 'utilisateur')

  const submitFormateurForm = (event) => {
    event.preventDefault()
    createUser(formateurForm)
    setFormateurModalOpen(false)
    setFormateurForm({
      ...initialFormateurForm,
      subject: state.categories[0] || 'Math',
      level: state.levels[0] || 'Primaire',
    })
  }

  const renderAdminSection = () => {
    if (activeSection === 'overview') {
      return (
        <div className="space-y-6">
          <div className="glass-panel rounded-[32px] p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-500">
                  Super Admin Control
                </p>
                <h3 className="mt-3 font-display text-3xl font-semibold text-slate-950 dark:text-white">
                  Gestion complète des comptes formateurs
                </h3>
                <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                  Le Super Admin pilote les accès, assigne les matières et garde la
                  main sur tous les comptes des formateurs.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200">
                  {formateurs.length} formateurs
                </Badge>
                <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
                  {utilisateurs.length} utilisateurs
                </Badge>
              </div>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((item) => (
              <div key={item.label} className="glass-panel rounded-[30px] p-5">
                <item.icon className="text-sky-500" size={20} />
                <p className="mt-5 text-3xl font-extrabold text-slate-950 dark:text-white">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="glass-panel rounded-[32px] p-6">
            <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
              Lecture rapide des performances
            </h3>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {state.categories.map((category) => (
                <div
                  key={category}
                  className="rounded-[24px] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {category}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {state.books.filter((book) => book.subject === category).length}{' '}
                    livres •{' '}
                    {
                      state.requests.filter((request) => request.subject === category)
                        .length
                    }{' '}
                    demandes
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (activeSection === 'books') {
      return (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button variant="accent" icon={Plus} onClick={startCreateBook}>
              Ajouter un livre
            </Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {state.books.map((book) => {
              const creator = state.users.find((user) => user.id === book.createdBy)
              const creatorName = creator
                ? `${creator.firstName} ${creator.lastName}`
                : 'Admin'

              return (
                <BookCard
                  key={book.id}
                  book={book}
                  canManage
                  creatorName={creatorName}
                  onEdit={startEditBook}
                  onDelete={setDeleteCandidate}
                />
              )
            })}
          </div>
        </div>
      )
    }

    if (activeSection === 'users') {
      return (
        <div className="space-y-6">
          <div className="glass-panel rounded-[30px] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-500">
                  Formateurs
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                  Le Super Admin gère les comptes des formateurs
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Création, affectation de matière et mise à jour des accès en un seul endroit.
                </p>
              </div>
              <Button
                variant="accent"
                icon={Plus}
                onClick={() => {
                  setFormateurForm({
                    ...initialFormateurForm,
                    subject: state.categories[0] || 'Math',
                    level: state.levels[0] || 'Primaire',
                  })
                  setFormateurModalOpen(true)
                }}
              >
                Ajouter formateur
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {state.users.map((user) => (
            <div key={user.id} className="glass-panel rounded-[28px] p-5">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.7fr_0.7fr_auto] lg:items-center">
                <div>
                  <p className="font-display text-xl font-semibold text-slate-950 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {user.email} • {user.phone}
                  </p>
                </div>

                <Select
                  value={user.role}
                  onChange={(event) =>
                    saveUser({ id: user.id, role: event.target.value })
                  }
                >
                  <option value="admin">admin</option>
                  <option value="formateur">formateur</option>
                  <option value="utilisateur">utilisateur</option>
                </Select>

                <Select
                  value={user.subject || ''}
                  onChange={(event) =>
                    saveUser({
                      id: user.id,
                      subject: event.target.value || null,
                    })
                  }
                >
                  <option value="">Sans matière</option>
                  {state.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>

                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Badge className="bg-white/70 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                    {user.isSuperAdmin ? 'Super Admin' : roleLabel[user.role]}
                  </Badge>
                  {user.id !== currentUser.id ? (
                    <Button variant="danger" onClick={() => deleteUser(user.id)}>
                      Supprimer
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      )
    }

    if (activeSection === 'requests') {
      return (
        <div className="grid gap-4">
          {visibleRequests.map((request) => {
            const book = state.books.find((item) => item.id === request.bookId)
            const user = state.users.find((item) => item.id === request.userId)

            return (
              <div key={request.id} className="glass-panel rounded-[28px] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-3">
                      <Badge className={requestTone[request.status]}>
                        {request.status}
                      </Badge>
                      <Badge className="bg-white/70 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                        {request.subject}
                      </Badge>
                    </div>
                    <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                      {book?.title || 'Livre supprimé'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {user?.firstName} {user?.lastName} • {formatDate(request.createdAt)}
                    </p>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                      {request.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {request.status === 'pending' ? (
                      <>
                        <Button
                          variant="accent"
                          onClick={() =>
                            updateRequestStatus(request.id, 'confirmed')
                          }
                        >
                          Confirmer
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => updateRequestStatus(request.id, 'refused')}
                        >
                          Refuser
                        </Button>
                      </>
                    ) : (
                      <Badge className={requestTone[request.status]}>
                        {request.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="glass-panel rounded-[30px] p-5">
          <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
            Catégories
          </h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {state.categories.map((category) => (
              <div
                key={category}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 py-2 dark:border-white/10 dark:bg-white/5"
              >
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  {category}
                </span>
                <button
                  type="button"
                  className="text-xs font-bold text-rose-500"
                  onClick={() => removeCategory(category)}
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <Input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Nouvelle catégorie"
            />
            <Button
              variant="primary"
              onClick={() => {
                addCategory(categoryName)
                setCategoryName('')
              }}
            >
              Ajouter
            </Button>
          </div>
        </div>

        <div className="glass-panel rounded-[30px] p-5">
          <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
            Niveaux
          </h3>
          <div className="mt-5 flex flex-wrap gap-3">
            {state.levels.map((level) => (
              <div
                key={level}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/70 px-4 py-2 dark:border-white/10 dark:bg-white/5"
              >
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  {level}
                </span>
                <button
                  type="button"
                  className="text-xs font-bold text-rose-500"
                  onClick={() => removeLevel(level)}
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <Input
              value={levelName}
              onChange={(event) => setLevelName(event.target.value)}
              placeholder="Nouveau niveau"
            />
            <Button
              variant="primary"
              onClick={() => {
                addLevel(levelName)
                setLevelName('')
              }}
            >
              Ajouter
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderUtilisateurSection = () => {
    if (activeSection === 'overview') {
      return (
        <div className="grid gap-6 lg:grid-cols-2">
          {state.books.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )
    }

    if (activeSection === 'requests') {
      if (!visibleRequests.length) {
        return (
          <EmptyState
            title="Aucune demande encore"
            description="Les demandes envoyées depuis une fiche livre apparaîtront ici."
            action={
              <Link to="/books">
                <Button variant="accent">Parcourir les livres</Button>
              </Link>
            }
          />
        )
      }

      return (
        <div className="grid gap-4">
          {visibleRequests.map((request) => {
            const book = state.books.find((item) => item.id === request.bookId)
            return (
              <div key={request.id} className="glass-panel rounded-[28px] p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                      {book?.title || 'Livre supprimé'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {request.message}
                    </p>
                  </div>
                  <Badge className={requestTone[request.status]}>
                    {request.status}
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div className="glass-panel rounded-[32px] p-6">
        <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
          Profil utilisateur
        </h3>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Input
            label="Prénom"
            defaultValue={currentUser.firstName}
            onBlur={(event) => updateProfile({ firstName: event.target.value })}
          />
          <Input
            label="Nom"
            defaultValue={currentUser.lastName}
            onBlur={(event) => updateProfile({ lastName: event.target.value })}
          />
          <Input
            label="Email"
            defaultValue={currentUser.email}
            onBlur={(event) => updateProfile({ email: event.target.value })}
          />
          <Input
            label="Téléphone"
            defaultValue={currentUser.phone}
            onBlur={(event) => updateProfile({ phone: event.target.value })}
          />
        </div>
      </div>
    )
  }

  const renderFormateurSection = () => {
    if (activeSection === 'overview') {
      return allowedBooks.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {allowedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucun livre assigné"
          description="Les formateurs ne voient que les livres de leur matière. Mets à jour la matière côté admin pour alimenter cette vue."
        />
      )
    }

    return visibleRequests.length ? (
      <div className="grid gap-4">
        {visibleRequests.map((request) => {
          const book = state.books.find((item) => item.id === request.bookId)
          const user = state.users.find((item) => item.id === request.userId)
          return (
            <div key={request.id} className="glass-panel rounded-[28px] p-5">
              <Badge className={requestTone[request.status]}>{request.status}</Badge>
              <h3 className="mt-4 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                {book?.title || 'Livre supprimé'}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {request.message}
              </p>
            </div>
          )
        })}
      </div>
    ) : (
      <EmptyState
        title="Aucune demande sur ta matière"
        description="Les demandes liées à ta matière apparaîtront ici automatiquement."
      />
    )
  }

  const roleTitle = {
    admin: 'Admin dashboard',
    utilisateur: 'User dashboard',
    formateur: 'Formateur dashboard',
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 xl:grid-cols-[280px_1fr]">
        <aside className="glass-panel h-fit rounded-[32px] p-5">
          <div className="rounded-[28px] bg-gradient-to-br from-sky-500 via-indigo-500 to-orange-400 p-5 text-white shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
              {currentUser.isSuperAdmin ? 'Super Admin' : roleLabel[activeRole]}
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold">
              {currentUser.firstName} {currentUser.lastName}
            </h2>
            <p className="mt-2 text-sm text-white/80">{currentUser.email}</p>
          </div>

          <div className="mt-6 grid gap-2">
            {sectionList.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => updateSection(item.key)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeSection === item.key
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/books" className="flex-1">
              <Button variant="secondary" className="w-full">
                Catalogue
              </Button>
            </Link>
            <Button
              variant="ghost"
              icon={LogOut}
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Quitter
            </Button>
          </div>
        </aside>

        <section className="space-y-6">
          <SectionHeading
            eyebrow="Dashboard"
            title={roleTitle[activeRole]}
            description="Une vue métier claire, responsive et pensée pour garder les actions importantes accessibles en quelques clics."
          />

          <motion.div layout className="space-y-6">
            {activeRole === 'admin'
              ? renderAdminSection()
              : activeRole === 'formateur'
                ? renderFormateurSection()
                : renderUtilisateurSection()}
          </motion.div>
        </section>
      </div>

      <Modal
        open={bookModalOpen}
        title={bookForm.id ? 'Modifier le livre' : 'Ajouter un livre'}
        description="Complète les informations principales du livre pour le catalogue."
        onClose={() => setBookModalOpen(false)}
      >
        <form onSubmit={submitBookForm} className="grid gap-5 md:grid-cols-2">
          <Input
            label="Titre"
            value={bookForm.title}
            onChange={(event) =>
              setBookForm((current) => ({ ...current, title: event.target.value }))
            }
            required
          />
          <Select
            label="Matière"
            value={bookForm.subject}
            onChange={(event) =>
              setBookForm((current) => ({ ...current, subject: event.target.value }))
            }
          >
            {state.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select
            label="Niveau"
            value={bookForm.level}
            onChange={(event) =>
              setBookForm((current) => ({ ...current, level: event.target.value }))
            }
          >
            {state.levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Image du livre
            </span>
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                <ImagePlus size={18} />
                Choisir un fichier
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBookImageChange}
                  required={!bookForm.id && !bookForm.imageUrl}
                />
              </label>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {bookImageName || 'PNG, JPG ou WEBP. Le lien image n’est plus requis.'}
              </p>
              {bookForm.imageUrl ? (
                <img
                  src={bookForm.imageUrl}
                  alt="Aperçu couverture"
                  className="mt-4 h-36 w-full rounded-2xl object-cover"
                />
              ) : null}
            </div>
          </label>
          <Input
            label="PDF URL"
            value={bookForm.pdfUrl || ''}
            onChange={(event) =>
              setBookForm((current) => ({ ...current, pdfUrl: event.target.value }))
            }
            hint="Laisse vide si aucun PDF n’est encore disponible."
            className="md:col-span-2"
          />
          <Textarea
            label="Description"
            value={bookForm.description}
            onChange={(event) =>
              setBookForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className="md:col-span-2"
            required
          />
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" variant="accent">
              Sauvegarder
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setBookModalOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={formateurModalOpen}
        title="Créer un compte formateur"
        description="Le Super Admin peut créer et affecter les comptes formateurs directement depuis ce dashboard."
        onClose={() => setFormateurModalOpen(false)}
      >
        <form onSubmit={submitFormateurForm} className="grid gap-5 md:grid-cols-2">
          <Input
            label="Prénom"
            value={formateurForm.firstName}
            onChange={(event) =>
              setFormateurForm((current) => ({
                ...current,
                firstName: event.target.value,
              }))
            }
            required
          />
          <Input
            label="Nom"
            value={formateurForm.lastName}
            onChange={(event) =>
              setFormateurForm((current) => ({
                ...current,
                lastName: event.target.value,
              }))
            }
            required
          />
          <Input
            label="Email"
            type="email"
            value={formateurForm.email}
            onChange={(event) =>
              setFormateurForm((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            required
          />
          <Input
            label="Téléphone"
            value={formateurForm.phone}
            onChange={(event) =>
              setFormateurForm((current) => ({
                ...current,
                phone: event.target.value,
              }))
            }
            required
          />
          <Select
            label="Matière"
            value={formateurForm.subject}
            onChange={(event) =>
              setFormateurForm((current) => ({
                ...current,
                subject: event.target.value,
              }))
            }
          >
            {state.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <Select
            label="Niveau"
            value={formateurForm.level}
            onChange={(event) =>
              setFormateurForm((current) => ({
                ...current,
                level: event.target.value,
              }))
            }
          >
            {state.levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
          <Input
            label="Mot de passe"
            value={formateurForm.password}
            onChange={(event) =>
              setFormateurForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            className="md:col-span-2"
            required
          />
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" variant="accent">
              Créer le compte
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setFormateurModalOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(deleteCandidate)}
        title="Supprimer ce livre ?"
        description="Cette action retirera aussi les demandes liées à ce livre."
        onClose={() => setDeleteCandidate(null)}
      >
        <div className="flex flex-wrap gap-3">
          <Button
            variant="danger"
            onClick={() => {
              deleteBook(deleteCandidate.id)
              setDeleteCandidate(null)
            }}
          >
            Oui, supprimer
          </Button>
          <Button variant="secondary" onClick={() => setDeleteCandidate(null)}>
            Annuler
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default DashboardPage
