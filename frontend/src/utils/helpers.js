import clsx from 'clsx'
import { subjectThemes } from '../data/mockData'

export const cn = (...inputs) => clsx(inputs)

export const formatDate = (value) =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(value))

export const truncate = (text = '', length = 120) =>
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
  Maternelle:
    'bg-rose-50 text-rose-700 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-400/20',
  'Élémentaire':
    'bg-white/80 text-slate-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10',
  Primaire:
    'bg-white/80 text-slate-700 ring-1 ring-slate-200 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10',
  Collège:
    'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-400/20',
  Lycée:
    'bg-violet-50 text-violet-700 ring-1 ring-violet-100 dark:bg-violet-500/10 dark:text-violet-200 dark:ring-violet-400/20',
  'Formation TND':
    'bg-amber-50 text-amber-800 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-400/20',
  Parents:
    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-400/20',
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
  const text = `Salam, je souhaite commander ou consulter ce manuel : ${title}`

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export const normalizeSearch = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

export const parsePageRanges = (value = '', totalPages) => {
  const parsedTotal = Number(totalPages)
  const maxPage = Number.isFinite(parsedTotal) && parsedTotal > 0 ? parsedTotal : 1000
  const pages = new Set()

  value
    .toString()
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const [startRaw, endRaw] = part.split('-').map((item) => item.trim())
      const start = Number.parseInt(startRaw, 10)
      const end = endRaw ? Number.parseInt(endRaw, 10) : start

      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return
      }

      const first = Math.max(1, Math.min(start, end))
      const last = Math.min(maxPage, Math.max(start, end))

      for (let page = first; page <= last; page += 1) {
        pages.add(page)
      }
    })

  return Array.from(pages).sort((a, b) => a - b)
}

export const isPageAllowed = (book, page) => {
  if (book?.readAccess !== 'pages') {
    return true
  }

  const allowedPages = parsePageRanges(book.allowedPages, book.pages)

  return !allowedPages.length || allowedPages.includes(page)
}

export const pdfAccessLabel = (book) => {
  if (!book?.pdfUrl) {
    return 'À importer'
  }

  if (book.readAccess === 'pages' && book.allowedPages) {
    return `Pages ${book.allowedPages}`
  }

  return 'Complet'
}

export const filterBooks = ({
  books,
  query,
  subject,
  level,
  classLevel,
  audience,
  publisher,
  onlyNew,
}) =>
  books.filter((book) => {
    const chapterText = (book.chapters || [])
      .map((chapter) => `${chapter.title} ${(chapter.resources || []).join(' ')}`)
      .join(' ')
    const competencyText = (book.competencies || []).join(' ')
    const text = normalizeSearch(
      `${book.title} ${book.description} ${book.subject} ${book.level} ${book.classLevel || ''} ${book.audience || ''} ${book.publisher || ''} ${chapterText} ${competencyText}`,
    )
    const normalizedQuery = normalizeSearch(query)
    const matchesQuery = !normalizedQuery || text.includes(normalizedQuery)
    const matchesSubject = !subject || book.subject === subject
    const matchesLevel = !level || book.level === level
    const matchesClass = !classLevel || classLevel === 'Tous' || book.classLevel === classLevel
    const matchesAudience = !audience || book.audience === audience
    const matchesPublisher = !publisher || book.publisher === publisher
    const matchesNew = !onlyNew || book.isNew

    return (
      matchesQuery &&
      matchesSubject &&
      matchesLevel &&
      matchesClass &&
      matchesAudience &&
      matchesPublisher &&
      matchesNew
    )
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
