import clsx from 'clsx'
import { subjectThemes } from '../data/mockData'

export const cn = (...inputs) => clsx(inputs)

export const formatDate = (value) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value))

export const truncate = (text, length = 120) =>
  text.length > length ? `${text.slice(0, length).trim()}...` : text

export const createId = (prefix) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`

export const getSubjectTheme = (subject) =>
  subjectThemes[subject] || subjectThemes.default

export const roleLabel = {
  admin: 'Admin',
  formateur: 'Formateur',
  utilisateur: 'Utilisateur',
}

export const levelTone = {
  Primaire:
    'bg-white/80 text-slate-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10',
  'Collège':
    'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-400/20',
  'Lycée':
    'bg-violet-50 text-violet-700 ring-1 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-400/20',
}

export const requestTone = {
  pending:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200',
  confirmed:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200',
  refused: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
}

export const whatsappLink = (title) => {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || '212603385513'
  const text = `Salam, bghit ncommander had lktab: ${title}`

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export const filterBooks = ({ books, query, subject, level }) =>
  books.filter((book) => {
    const text = `${book.title} ${book.description} ${book.subject} ${book.level}`
      .toLowerCase()
      .normalize('NFD')
    const normalizedQuery = query.toLowerCase().normalize('NFD')
    const matchesQuery = !normalizedQuery || text.includes(normalizedQuery)
    const matchesSubject = !subject || book.subject === subject
    const matchesLevel = !level || book.level === level

    return matchesQuery && matchesSubject && matchesLevel
  })

export const statsFromState = (state) => {
  const totalUsers = state.users.length
  const totalBooks = state.books.length
  const totalRequests = state.requests.length
  const pendingRequests = state.requests.filter(
    (request) => request.status === 'pending',
  ).length

  return {
    totalUsers,
    totalBooks,
    totalRequests,
    pendingRequests,
  }
}
