import {
  Bookmark,
  Camera,
  ChevronLeft,
  Download,
  FileText,
  Maximize2,
  Minus,
  PanelLeftClose,
  Plus,
  Printer,
  Search,
  Share2,
  Upload,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge, Button } from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import { normalizeSearch, parsePageRanges } from '../utils/helpers'

const readFileAsObjectUrl = (file) => URL.createObjectURL(file)

function ManualReaderPage() {
  const { bookId } = useParams()
  const { state, notify } = useAppContext()
  const inputRef = useRef(null)
  const iframeRef = useRef(null)
  const [activeTab, setActiveTab] = useState('summary')
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [manualSearch, setManualSearch] = useState('')
  const [localPdf, setLocalPdf] = useState(null)
  const [localPdfName, setLocalPdfName] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const book = state.books.find((item) => item.id === bookId)
  const pdfUrl = localPdf || book?.pdfUrl || ''
  const allowedPages =
    book?.readAccess === 'pages' ? parsePageRanges(book.allowedPages, book.pages) : []
  const restrictedPages = book?.readAccess === 'pages' && allowedPages.length > 0
  const firstReadablePage = restrictedPages ? allowedPages[0] : 1
  const lastReadablePage = restrictedPages
    ? allowedPages[allowedPages.length - 1]
    : book?.pages || 999
  const clampedPage = Math.max(1, Math.min(page, book?.pages || page))
  const activePage =
    restrictedPages && !allowedPages.includes(clampedPage)
      ? firstReadablePage
      : clampedPage

  useEffect(() => {
    return () => {
      if (localPdf) {
        URL.revokeObjectURL(localPdf)
      }
    }
  }, [localPdf])

  const pdfWithPage = useMemo(() => {
    if (!pdfUrl) {
      return ''
    }

    const separator = pdfUrl.includes('#') ? '&' : '#'
    const readerOptions = restrictedPages
      ? `toolbar=0&navpanes=0&page=${activePage}&zoom=${zoom}`
      : `page=${activePage}&zoom=${zoom}`

    return `${pdfUrl}${separator}${readerOptions}`
  }, [activePage, pdfUrl, restrictedPages, zoom])

  const chapterMatches = useMemo(() => {
    const chapters = book?.chapters || []
    const query = normalizeSearch(manualSearch)

    if (!query) {
      return chapters
    }

    return chapters.filter((chapter) => {
      const resources = (chapter.resources || []).join(' ')
      return normalizeSearch(`${chapter.title} ${resources}`).includes(query)
    })
  }, [book, manualSearch])

  const goToPage = (targetPage) => {
    const parsedPage = Number.parseInt(targetPage, 10)

    if (!Number.isFinite(parsedPage)) {
      return
    }

    const nextPage = Math.max(1, Math.min(parsedPage, book?.pages || parsedPage))

    if (restrictedPages && !allowedPages.includes(nextPage)) {
      notify({
        title: 'Page non autorisée',
        message: `Lecture limitée aux pages ${book.allowedPages}.`,
        tone: 'error',
      })
      return
    }

    setPage(nextPage)
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
          <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white">
            Manuel introuvable
          </h1>
          <Link to="/books" className="mt-6 inline-block">
            <Button variant="accent">Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handlePdfUpload = (event) => {
    const [file] = event.target.files || []

    if (!file) {
      return
    }

    if (localPdf) {
      URL.revokeObjectURL(localPdf)
    }

    setLocalPdf(readFileAsObjectUrl(file))
    setLocalPdfName(file.name)
    setPage(firstReadablePage)
    notify({
      title: 'PDF chargé',
      message: `${file.name} est affiché dans le lecteur.`,
      tone: 'success',
    })
  }

  const copyReaderLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    notify({
      title: 'Lien copié',
      message: 'Le lien du manuel est prêt à être partagé.',
      tone: 'success',
    })
  }

  const openFullscreen = () => {
    iframeRef.current?.requestFullscreen?.()
  }

  const printManual = () => {
    if (restrictedPages) {
      notify({
        title: 'Impression limitée',
        message:
          "Le téléchargement et l'impression sont désactivés pour cette sélection de pages.",
        tone: 'error',
      })
      return
    }

    iframeRef.current?.contentWindow?.print?.()
  }

  return (
    <div className="bg-slate-100 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-82px)] max-w-[1600px] flex-col lg:flex-row">
        {sidebarOpen ? (
          <aside className="w-full border-r border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 lg:w-[360px]">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10">
              <div className="flex">
                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={`px-5 py-4 text-lg font-bold ${
                    activeTab === 'summary'
                      ? 'text-pink-600'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Sommaire
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('resources')}
                  className={`px-5 py-4 text-lg font-bold ${
                    activeTab === 'resources'
                      ? 'text-pink-600'
                      : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Enrichissements
                </button>
              </div>
              <button
                type="button"
                title="Fermer le panneau"
                aria-label="Fermer le panneau"
                onClick={() => setSidebarOpen(false)}
                className="mr-3 rounded-full bg-indigo-600 p-2 text-white shadow-lg"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <h1 className="font-display text-xl font-bold text-slate-950 dark:text-white">
                  {book.title}
                </h1>
                <button
                  type="button"
                  className="mt-3 flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-200"
                >
                  <FileText size={16} />
                  Voir les informations d’accessibilité
                </button>
              </div>

              <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-white/10">
                <button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-bold text-white">
                  Vue page
                </button>
                <button className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200">
                  Vue web
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Aller à la page :
                </span>
                <input
                  type="number"
                  min={firstReadablePage}
                  max={lastReadablePage}
                  value={activePage}
                  onChange={(event) => goToPage(event.target.value)}
                  className="h-11 w-20 rounded-xl border border-slate-200 bg-white text-center text-sm font-bold text-indigo-700 outline-none dark:border-white/10 dark:bg-white/5"
                />
                <span className="text-sm font-bold text-slate-500">
                  / {book.pages || 1}
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                {restrictedPages
                  ? `Pages autorisées : ${book.allowedPages}`
                  : 'Lecture du PDF complet'}
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 dark:border-indigo-400/20 dark:bg-indigo-500/10">
                <Search size={18} className="text-indigo-600" />
                <input
                  value={manualSearch}
                  onChange={(event) => setManualSearch(event.target.value)}
                  placeholder="Rechercher dans ce manuel"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-indigo-400 dark:text-white"
                />
              </label>

              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={handlePdfUpload}
              />
              <Button
                variant="secondary"
                icon={Upload}
                className="w-full rounded-xl"
                onClick={() => inputRef.current?.click()}
              >
                Importer un PDF manuel
              </Button>
              {localPdfName ? (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  PDF local : {localPdfName}
                </p>
              ) : null}

              <div className="rounded-xl bg-indigo-50 py-3 pl-4 text-base font-bold text-indigo-950 dark:bg-indigo-500/10 dark:text-indigo-100">
                Mon manuel
              </div>

              <div className="space-y-2">
                {chapterMatches.map((chapter) => (
                  <button
                    key={`${chapter.title}-${chapter.page}`}
                    type="button"
                    onClick={() => goToPage(chapter.page)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      activePage === chapter.page &&
                      (!restrictedPages || allowedPages.includes(chapter.page))
                        ? 'border-indigo-300 bg-indigo-50 dark:border-indigo-400/30 dark:bg-indigo-500/10'
                        : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                    } ${
                      restrictedPages && !allowedPages.includes(chapter.page)
                        ? 'opacity-50'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">
                          {chapter.title}
                        </p>
                        {activeTab === 'resources' ? (
                          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {(chapter.resources || []).join(' · ')}
                          </p>
                        ) : null}
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        page {chapter.page}
                      </span>
                    </div>
                    {activePage === chapter.page ? (
                      <Badge className="mt-3 bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-100">
                        sélection
                      </Badge>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        ) : (
          <button
            type="button"
            title="Ouvrir le panneau"
            aria-label="Ouvrir le panneau"
            onClick={() => setSidebarOpen(true)}
            className="fixed left-4 top-28 z-30 rounded-full bg-indigo-600 p-3 text-white shadow-lg"
          >
            <PanelLeftClose size={20} />
          </button>
        )}

        <main className="relative flex min-h-[720px] flex-1 justify-center overflow-hidden bg-slate-200 px-4 py-6 dark:bg-slate-900 lg:px-10">
          <div className="w-full max-w-4xl">
            {pdfWithPage ? (
              <iframe
                ref={iframeRef}
                title={book.title}
                src={pdfWithPage}
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                className="mx-auto h-[78vh] min-h-[640px] w-full rounded-sm border-0 bg-white shadow-2xl"
              />
            ) : (
              <div className="flex h-[78vh] min-h-[640px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center shadow-sm dark:border-white/10 dark:bg-white/5">
                <FileText className="text-pink-500" size={42} />
                <h2 className="mt-5 font-display text-2xl font-bold text-slate-950 dark:text-white">
                  Aucun PDF associé
                </h2>
                <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">
                  Importez un manuel PDF depuis votre ordinateur pour l’afficher ici.
                </p>
                <Button
                  variant="accent"
                  icon={Upload}
                  className="mt-6"
                  onClick={() => inputRef.current?.click()}
                >
                  Choisir un PDF
                </Button>
              </div>
            )}
          </div>

          <div className="absolute bottom-8 right-6 grid gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-slate-950">
            <button
              type="button"
              title="Plein écran"
              onClick={openFullscreen}
              className="rounded-lg p-2 text-indigo-950 hover:bg-indigo-50 dark:text-white dark:hover:bg-white/10"
            >
              <Maximize2 size={20} />
            </button>
            <button
              type="button"
              title="Zoom avant"
              onClick={() => setZoom((current) => Math.min(current + 10, 160))}
              className="rounded-lg p-2 text-indigo-950 hover:bg-indigo-50 dark:text-white dark:hover:bg-white/10"
            >
              <Plus size={20} />
            </button>
            <button
              type="button"
              title="Zoom arrière"
              onClick={() => setZoom((current) => Math.max(current - 10, 60))}
              className="rounded-lg p-2 text-indigo-950 hover:bg-indigo-50 dark:text-white dark:hover:bg-white/10"
            >
              <Minus size={20} />
            </button>
          </div>
        </main>

        <aside className="flex border-l border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950 lg:w-[78px] lg:flex-col">
          {restrictedPages ? (
            <button
              type="button"
              title="Téléchargement désactivé"
              aria-label="Téléchargement désactivé"
              onClick={() =>
                notify({
                  title: 'Téléchargement limité',
                  message: `Lecture limitée aux pages ${book.allowedPages}.`,
                  tone: 'error',
                })
              }
              className="flex flex-1 items-center justify-center p-4 text-slate-400 transition hover:bg-slate-50 dark:text-slate-500 dark:hover:bg-white/10 lg:flex-none"
            >
              <Download size={22} />
            </button>
          ) : (
            <a
              href={pdfUrl || '#'}
              download
              title="Télécharger"
              aria-label="Télécharger"
              className="flex flex-1 items-center justify-center p-4 text-indigo-950 transition hover:bg-pink-50 hover:text-pink-600 dark:text-white dark:hover:bg-white/10 lg:flex-none"
            >
              <Download size={22} />
            </a>
          )}
          <button
            type="button"
            title="Partager"
            aria-label="Partager"
            onClick={copyReaderLink}
            className="flex flex-1 items-center justify-center p-4 text-indigo-950 transition hover:bg-pink-50 hover:text-pink-600 dark:text-white dark:hover:bg-white/10 lg:flex-none"
          >
            <Share2 size={22} />
          </button>
          <button
            type="button"
            title="Capture écran"
            aria-label="Capture écran"
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center p-4 text-indigo-950 transition hover:bg-pink-50 hover:text-pink-600 dark:text-white dark:hover:bg-white/10 lg:flex-none"
          >
            <Camera size={22} />
          </button>
          <button
            type="button"
            title="Ajouter aux favoris"
            aria-label="Ajouter aux favoris"
            onClick={copyReaderLink}
            className="flex flex-1 items-center justify-center p-4 text-indigo-950 transition hover:bg-pink-50 hover:text-pink-600 dark:text-white dark:hover:bg-white/10 lg:flex-none"
          >
            <Bookmark size={22} />
          </button>
          <button
            type="button"
            title="Imprimer"
            aria-label="Imprimer"
            onClick={printManual}
            className="flex flex-1 items-center justify-center p-4 text-indigo-950 transition hover:bg-pink-50 hover:text-pink-600 dark:text-white dark:hover:bg-white/10 lg:flex-none"
          >
            <Printer size={22} />
          </button>
        </aside>
      </div>
    </div>
  )
}

export default ManualReaderPage
