/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react'
import { apiClient } from '../api/client'
import { seedState } from '../data/mockData'
import { createId, statsFromState } from '../utils/helpers'

const AppContext = createContext(null)
const STORAGE_KEY = 'ktoba-state-v2'
const TOKEN_KEY = 'ktoba-token'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

const mergeCollectionById = (storedItems = [], seedItems = []) => {
  const storedIds = new Set(storedItems.map((item) => item.id))

  return [
    ...seedItems.filter((item) => !storedIds.has(item.id)),
    ...storedItems,
  ]
}

const mergeList = (storedItems = [], seedItems = []) =>
  Array.from(new Set([...seedItems, ...storedItems].filter(Boolean)))

const mergeStoredState = (storedState = {}) => ({
  ...seedState,
  ...storedState,
  users: mergeCollectionById(storedState.users, seedState.users),
  books: mergeCollectionById(storedState.books, seedState.books),
  requests: storedState.requests || seedState.requests,
  categories: mergeList(storedState.categories, seedState.categories),
  levels: mergeList(storedState.levels, seedState.levels),
})

const loadState = () => {
  if (typeof window === 'undefined') {
    return seedState
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return seedState
  }

  try {
    return mergeStoredState(JSON.parse(raw))
  } catch {
    return seedState
  }
}

const buildMeetingSession = (request, currentState) => {
  const book = currentState.books.find((item) => item.id === request.bookId)
  const assignedFormateur = currentState.users.find(
    (user) => user.role === 'formateur' && user.subject === request.subject,
  )
  const startsAt =
    request.meetingStartsAt ||
    new Date(Date.now() + 45 * 60 * 1000).toISOString()

  return {
    meetingRoomId: request.meetingRoomId || createId('room'),
    meetingTitle:
      request.meetingTitle ||
      `Réunion ${request.subject} • ${book?.title || 'Livre scolaire'}`,
    meetingStartsAt: startsAt,
    meetingDurationMinutes: request.meetingDurationMinutes || 30,
    meetingHostId: request.meetingHostId || assignedFormateur?.id || 'user-admin',
    meetingLinkPath: request.meetingLinkPath || `/meeting-room/${request.id}`,
    meetingProvider: 'internal',
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState)
  const [toasts, setToasts] = useState([])
  const [loading, setLoading] = useState(false)
  const booted = useRef(false)

  const notify = (toast) => {
    const id = createId('toast')
    const nextToast = { id, tone: 'info', ...toast }

    setToasts((current) => [...current, nextToast])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 3800)
  }

  useEffect(() => {
    document.body.classList.toggle('dark', state.theme === 'dark')
  }, [state.theme])

  useEffect(() => {
    if (!USE_MOCK_API) {
      return
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

      if (state.token) {
        window.localStorage.setItem(TOKEN_KEY, state.token)
      } else {
        window.localStorage.removeItem(TOKEN_KEY)
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
      console.warn('Le stockage local est insuffisant pour conserver cet état.')
    }
  }, [state])

  const hydrateFromApi = useEffectEvent(async () => {
    setLoading(true)

    try {
      const [booksResponse, statsResponse] = await Promise.all([
        apiClient.get('/books'),
        apiClient.get('/admin/stats'),
      ])

      startTransition(() => {
        setState((current) => ({
          ...current,
          books: booksResponse.data.books || booksResponse.data,
          stats: statsResponse.data,
        }))
      })
    } catch {
      notify({
        title: 'Mode demo actif',
        message:
          'L’API Laravel ne répond pas encore. Les données locales restent actives.',
      })
    } finally {
      setLoading(false)
    }
  })

  useEffect(() => {
    if (booted.current || USE_MOCK_API) {
      return
    }

    booted.current = true
    hydrateFromApi()
  }, [])

  const setStateAndNotify = (updater, toast) => {
    setState((current) =>
      typeof updater === 'function' ? updater(current) : { ...current, ...updater },
    )

    if (toast) {
      notify(toast)
    }
  }

  const currentUser =
    state.users.find((user) => user.id === state.currentUserId) || null
  const stats = statsFromState(state)

  const login = async ({ email, password }) => {
    setLoading(true)

    try {
      if (!USE_MOCK_API) {
        const { data } = await apiClient.post('/login', { email, password })
        setState((current) => ({
          ...current,
          currentUserId: data.user.id,
          token: data.token,
        }))
        notify({
          title: 'Connexion réussie',
          message: `Bienvenue ${data.user.firstName}.`,
          tone: 'success',
        })
        return data.user
      }

      const user = state.users.find(
        (candidate) =>
          candidate.email.toLowerCase() === email.toLowerCase() &&
          candidate.password === password,
      )

      if (!user) {
        throw new Error('Email ou mot de passe invalide.')
      }

      const token = `demo-token-${user.id}`

      setState((current) => ({
        ...current,
        currentUserId: user.id,
        token,
      }))

      notify({
        title: 'Connexion réussie',
        message: `Bienvenue ${user.firstName}.`,
        tone: 'success',
      })

      return user
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)

    try {
      const emailExists = state.users.some(
        (user) => user.email.toLowerCase() === payload.email.toLowerCase(),
      )

      if (emailExists) {
        throw new Error('Cet email existe déjà.')
      }

      const user = {
        id: createId('user'),
        role: 'utilisateur',
        subject: null,
        level: payload.level,
        createdAt: new Date().toISOString(),
        ...payload,
      }

      setState((current) => ({
        ...current,
        users: [user, ...current.users],
        currentUserId: user.id,
        token: `demo-token-${user.id}`,
      }))

      notify({
        title: 'Compte créé',
        message: 'Ton espace utilisateur est prêt.',
        tone: 'success',
      })

      return user
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setState((current) => ({
      ...current,
      currentUserId: null,
      token: null,
    }))
    notify({
      title: 'Déconnexion',
      message: 'La session a été fermée proprement.',
    })
  }

  const saveBook = (payload) => {
    const book = {
      id: payload.id || createId('book'),
      createdAt: payload.createdAt || new Date().toISOString(),
      createdBy: currentUser?.id || 'user-admin',
      featured: payload.featured || false,
      ...payload,
    }

    setStateAndNotify(
      (current) => {
        const exists = current.books.some((item) => item.id === book.id)
        const books = exists
          ? current.books.map((item) => (item.id === book.id ? book : item))
          : [book, ...current.books]

        const categories = current.categories.includes(book.subject)
          ? current.categories
          : [...current.categories, book.subject]

        const levels = current.levels.includes(book.level)
          ? current.levels
          : [...current.levels, book.level]

        return { ...current, books, categories, levels }
      },
      {
        title: payload.id ? 'Livre modifié' : 'Livre ajouté',
        message: `${book.title} est maintenant disponible sur la plateforme.`,
        tone: 'success',
      },
    )
  }

  const deleteBook = (bookId) => {
    setStateAndNotify(
      (current) => ({
        ...current,
        books: current.books.filter((book) => book.id !== bookId),
        requests: current.requests.filter((request) => request.bookId !== bookId),
      }),
      {
        title: 'Livre supprimé',
        message: 'Le catalogue a été mis à jour.',
      },
    )
  }

  const submitMeetingRequest = (payload) => {
    if (!currentUser) {
      throw new Error('Connexion requise pour envoyer une demande.')
    }

    const request = {
      id: createId('request'),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...payload,
    }

    setStateAndNotify(
      (current) => ({
        ...current,
        requests: [request, ...current.requests],
      }),
      {
        title: 'Demande envoyée',
        message: 'Elle est en attente de validation admin.',
        tone: 'success',
      },
    )
  }

  const updateRequestStatus = (requestId, status) => {
    setStateAndNotify(
      (current) => {
        const requests = current.requests.map((request) => {
          if (request.id !== requestId) {
            return request
          }

          if (status === 'confirmed') {
            return {
              ...request,
              status,
              ...buildMeetingSession(request, current),
            }
          }

          return {
            ...request,
            status,
            meetingRoomId: null,
            meetingTitle: null,
            meetingStartsAt: null,
            meetingDurationMinutes: null,
            meetingHostId: null,
            meetingLinkPath: null,
            meetingProvider: null,
          }
        })

        return { ...current, requests }
      },
      {
        title:
          status === 'confirmed' ? 'Demande confirmée' : 'Demande refusée',
        message:
          status === 'confirmed'
            ? "La salle de réunion interne est maintenant prête."
            : `Le statut a été mis à jour vers ${status}.`,
      },
    )
  }

  const saveUser = (payload) => {
    setStateAndNotify(
      (current) => ({
        ...current,
        users: current.users.map((user) =>
          user.id === payload.id ? { ...user, ...payload } : user,
        ),
      }),
      {
        title: 'Utilisateur mis à jour',
        message: 'Les permissions et informations ont été sauvegardées.',
      },
    )
  }

  const createUser = (payload) => {
    const emailExists = state.users.some(
      (user) => user.email.toLowerCase() === payload.email.toLowerCase(),
    )

    if (emailExists) {
      throw new Error('Cet email existe déjà.')
    }

    const user = {
      id: createId('user'),
      createdAt: new Date().toISOString(),
      isSuperAdmin: payload.role === 'admin' ? Boolean(payload.isSuperAdmin) : false,
      ...payload,
    }

    setStateAndNotify(
      (current) => ({
        ...current,
        users: [user, ...current.users],
      }),
      {
        title: 'Compte créé',
        message: `${user.firstName} ${user.lastName} a été ajouté.`,
        tone: 'success',
      },
    )

    return user
  }

  const deleteUser = (userId) => {
    setStateAndNotify(
      (current) => ({
        ...current,
        users: current.users.filter((user) => user.id !== userId),
        requests: current.requests.filter((request) => request.userId !== userId),
        currentUserId:
          current.currentUserId === userId ? null : current.currentUserId,
      }),
      {
        title: 'Utilisateur supprimé',
        message: 'Le compte et ses demandes liées ont été retirés.',
      },
    )
  }

  const addCategory = (name) => {
    if (!name.trim()) {
      return
    }

    setStateAndNotify(
      (current) => ({
        ...current,
        categories: Array.from(new Set([...current.categories, name.trim()])),
      }),
      {
        title: 'Catégorie ajoutée',
        message: `${name.trim()} est disponible dans les filtres.`,
        tone: 'success',
      },
    )
  }

  const removeCategory = (name) => {
    setStateAndNotify(
      (current) => ({
        ...current,
        categories: current.categories.filter((category) => category !== name),
      }),
      {
        title: 'Catégorie retirée',
        message: `${name} a été retirée de la configuration.`,
      },
    )
  }

  const addLevel = (name) => {
    if (!name.trim()) {
      return
    }

    setStateAndNotify(
      (current) => ({
        ...current,
        levels: Array.from(new Set([...current.levels, name.trim()])),
      }),
      {
        title: 'Niveau ajouté',
        message: `${name.trim()} est disponible dans les filtres.`,
      },
    )
  }

  const removeLevel = (name) => {
    setStateAndNotify(
      (current) => ({
        ...current,
        levels: current.levels.filter((level) => level !== name),
      }),
      {
        title: 'Niveau retiré',
        message: `${name} a été retiré de la configuration.`,
      },
    )
  }

  const updateProfile = (payload) => {
    if (!currentUser) {
      return
    }

    saveUser({ ...payload, id: currentUser.id })
  }

  const toggleTheme = () => {
    setState((current) => ({
      ...current,
      theme: current.theme === 'dark' ? 'light' : 'dark',
    }))
  }

  const value = {
    state,
    currentUser,
    stats,
    loading,
    toasts,
    notify,
    login,
    register,
    logout,
    saveBook,
    deleteBook,
    submitMeetingRequest,
    updateRequestStatus,
    saveUser,
    createUser,
    deleteUser,
    addCategory,
    removeCategory,
    addLevel,
    removeLevel,
    updateProfile,
    toggleTheme,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}
