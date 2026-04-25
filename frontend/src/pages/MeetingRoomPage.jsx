import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Clock3,
  Copy,
  Mic,
  MicOff,
  MonitorPlay,
  PhoneOff,
  ShieldCheck,
  Sparkles,
  Users2,
  Video,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, EmptyState, SectionHeading } from '../components/ui/index.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import {
  cn,
  formatDate,
  getSubjectTheme,
  requestTone,
  roleLabel,
} from '../utils/helpers'

function MeetingRoomPage() {
  const { requestId } = useParams()
  const navigate = useNavigate()
  const { state, currentUser, notify } = useAppContext()
  const videoRef = useRef(null)
  const screenVideoRef = useRef(null)
  const streamRef = useRef(null)
  const screenStreamRef = useRef(null)
  const captureCanvasRef = useRef(null)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [permissionState, setPermissionState] = useState('idle')
  const [lastCaptureUrl, setLastCaptureUrl] = useState(null)

  const meetingRequest = state.requests.find((request) => request.id === requestId)
  const book = state.books.find((item) => item.id === meetingRequest?.bookId)
  const requester = state.users.find((item) => item.id === meetingRequest?.userId)
  const host =
    state.users.find(
      (item) =>
        item.role === 'formateur' && item.subject === meetingRequest?.subject,
    ) ||
    state.users.find((item) => item.role === 'admin')
  const theme = getSubjectTheme(meetingRequest?.subject)

  const canAccessMeeting =
    currentUser &&
    meetingRequest &&
    (currentUser.role === 'admin' ||
      currentUser.id === meetingRequest.userId ||
      (currentUser.role === 'formateur' &&
        currentUser.subject === meetingRequest.subject))

  const participants = !meetingRequest
    ? []
    : [requester, host, state.users.find((item) => item.role === 'admin')]
        .filter(Boolean)
        .filter(
          (participant, index, array) =>
            array.findIndex((item) => item.id === participant.id) === index,
        )

  const stopScreenShare = () => {
    screenStreamRef.current?.getTracks().forEach((track) => track.stop())
    screenStreamRef.current = null
    setIsScreenSharing(false)
  }

  useEffect(() => {
    if (!canAccessMeeting || meetingRequest?.status !== 'confirmed') {
      return undefined
    }

    let cancelled = false

    const startPreview = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setPermissionState('unsupported')
        return
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })

        if (cancelled) {
          mediaStream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = mediaStream
        setPermissionState('granted')

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch {
        setPermissionState('denied')
      }
    }

    startPreview()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [canAccessMeeting, meetingRequest?.status])

  useEffect(() => {
    if (!videoRef.current || !streamRef.current) {
      return
    }

    videoRef.current.srcObject = streamRef.current
  }, [permissionState])

  useEffect(() => {
    if (!screenVideoRef.current || !screenStreamRef.current) {
      return
    }

    screenVideoRef.current.srcObject = screenStreamRef.current
  }, [isScreenSharing])

  useEffect(() => {
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = isMicOn
    })
  }, [isMicOn])

  useEffect(() => {
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOn
    })
  }, [isCameraOn])

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      screenStreamRef.current?.getTracks().forEach((track) => track.stop())

      if (lastCaptureUrl) {
        window.URL.revokeObjectURL(lastCaptureUrl)
      }
    }
  }, [lastCaptureUrl])

  if (!meetingRequest) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <EmptyState
          title="Reunion introuvable"
          description="Cette demande n'existe plus ou n'est pas encore disponible."
          action={
            <Link to="/requests">
              <Button variant="secondary">Retour aux demandes</Button>
            </Link>
          }
        />
      </div>
    )
  }

  if (!canAccessMeeting) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <EmptyState
          title="Acces non autorise"
          description="Cette salle est reservee a l'admin, au formateur concerne et a l'utilisateur ayant cree la demande."
          action={
            <Link to="/requests">
              <Button variant="secondary">Retour aux demandes</Button>
            </Link>
          }
        />
      </div>
    )
  }

  if (meetingRequest.status !== 'confirmed') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <EmptyState
          title="Reunion pas encore ouverte"
          description="La salle de reunion s'active uniquement apres confirmation par l'administration."
          action={
            <Link to="/requests">
              <Button variant="secondary">Voir le statut</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const meetingRoomId = meetingRequest.meetingRoomId || `room-${meetingRequest.id}`
  const meetingTitle =
    meetingRequest.meetingTitle ||
    `Reunion ${meetingRequest.subject} • ${book?.title || 'Support scolaire'}`
  const meetingStartsAt =
    meetingRequest.meetingStartsAt || meetingRequest.createdAt

  const handleCopyInvite = async () => {
    const meetingUrl = `${window.location.origin}/meeting-room/${meetingRequest.id}`

    try {
      await navigator.clipboard.writeText(meetingUrl)
      notify({
        title: 'Lien copie',
        message: 'Le lien de la reunion a ete copie dans le presse-papiers.',
        tone: 'success',
      })
    } catch {
      notify({
        title: 'Copie impossible',
        message: "Le navigateur n'a pas autorise la copie du lien.",
        tone: 'error',
      })
    }
  }

  const handleLeave = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    screenStreamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    screenStreamRef.current = null
    navigate('/requests')
  }

  const handleShareScreen = async () => {
    if (isScreenSharing) {
      stopScreenShare()
      notify({
        title: "Partage d'ecran arrete",
        message: "Ton ecran n'est plus diffuse dans la salle.",
      })
      return
    }

    if (!navigator.mediaDevices?.getDisplayMedia) {
      notify({
        title: 'Partage indisponible',
        message: "Ce navigateur ne prend pas en charge le partage d'ecran.",
        tone: 'error',
      })
      return
    }

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      })

      screenStreamRef.current = displayStream
      setIsScreenSharing(true)

      const [screenTrack] = displayStream.getVideoTracks()

      if (screenTrack) {
        screenTrack.onended = () => {
          stopScreenShare()
          notify({
            title: "Partage d'ecran termine",
            message: "Le partage s'est ferme depuis le navigateur.",
          })
        }
      }

      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = displayStream
      }

      notify({
        title: 'Ecran partage',
        message: "Les participants peuvent maintenant voir ton ecran dans la reunion.",
        tone: 'success',
      })
    } catch {
      notify({
        title: 'Partage annule',
        message: "Aucun ecran n'a ete partage.",
        tone: 'error',
      })
    }
  }

  const handleScreenshot = async () => {
    const source =
      isScreenSharing && screenVideoRef.current?.readyState >= 2
        ? screenVideoRef.current
        : videoRef.current?.readyState >= 2
          ? videoRef.current
          : null

    if (!source) {
      notify({
        title: 'Capture impossible',
        message: "Active la camera ou partage l'ecran avant de prendre un screenshot.",
        tone: 'error',
      })
      return
    }

    const canvas = captureCanvasRef.current || document.createElement('canvas')
    captureCanvasRef.current = canvas
    canvas.width = source.videoWidth || 1280
    canvas.height = source.videoHeight || 720

    const context = canvas.getContext('2d')

    if (!context) {
      notify({
        title: 'Capture impossible',
        message: "Le navigateur n'autorise pas la generation de l'image.",
        tone: 'error',
      })
      return
    }

    context.drawImage(source, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png', 1)
    })

    if (!blob) {
      notify({
        title: 'Capture impossible',
        message: "Le screenshot n'a pas pu etre exporte.",
        tone: 'error',
      })
      return
    }

    if (lastCaptureUrl) {
      window.URL.revokeObjectURL(lastCaptureUrl)
    }

    const url = window.URL.createObjectURL(blob)
    setLastCaptureUrl(url)

    const link = document.createElement('a')
    link.href = url
    link.download = `reunion-${meetingRequest.id}-${Date.now()}.png`
    link.click()

    notify({
      title: 'Screenshot capture',
      message: 'Le screenshot a ete telecharge en PNG.',
      tone: 'success',
    })
  }

  return (
    <div className="relative overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={cn(
            'absolute left-0 top-0 h-72 w-72 rounded-full bg-gradient-to-br blur-3xl opacity-20',
            theme.gradient,
          )}
        />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-gradient-to-br from-slate-200 to-white blur-3xl opacity-60 dark:from-slate-800 dark:to-slate-900 dark:opacity-40" />
      </div>

      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Reunion integree"
          title={meetingTitle}
          description="Une salle d'appel directement dans la plateforme, pensee pour confirmer les details du livre, du PDF et de la disponibilite."
          action={
            <div className="flex flex-wrap gap-3">
              <Link to="/requests">
                <Button variant="secondary" icon={ArrowLeft}>
                  Retour
                </Button>
              </Link>
              <Button variant="ghost" icon={Copy} onClick={handleCopyInvite}>
                Copier le lien
              </Button>
            </div>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[1.8fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel overflow-hidden rounded-[34px] border border-white/40 p-5 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)] dark:border-white/10"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={requestTone.confirmed}>confirmed</Badge>
                <Badge className={theme.soft}>{meetingRequest.subject}</Badge>
                <Badge className="bg-white/80 text-slate-700 dark:bg-white/10 dark:text-slate-200">
                  Salle #{meetingRoomId.slice(-8)}
                </Badge>
              </div>
              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                <ShieldCheck className="mr-2 inline-block" size={14} />
                Appel securise dans le site
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.3fr_0.85fr]">
              <div className="relative overflow-hidden rounded-[30px] bg-slate-950">
                {permissionState === 'granted' ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={cn(
                      'h-[380px] w-full object-cover transition duration-300',
                      !isCameraOn && 'opacity-20',
                    )}
                  />
                ) : (
                  <div className="flex h-[380px] items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_rgba(15,23,42,0.96))] p-8 text-center">
                    <div className="max-w-sm space-y-3">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <Video className="text-white" size={28} />
                      </div>
                      <h3 className="font-display text-2xl font-semibold text-white">
                        {permissionState === 'denied'
                          ? 'Camera non autorisee'
                          : permissionState === 'unsupported'
                            ? 'Navigateur limite'
                            : 'Preparation de la salle'}
                      </h3>
                      <p className="text-sm leading-7 text-slate-300">
                        {permissionState === 'denied'
                          ? "Autorise camera et micro pour voir ton apercu video dans la reunion."
                          : permissionState === 'unsupported'
                            ? "Ce navigateur ne permet pas l'apercu video. La salle reste accessible."
                            : "Connexion des appareils audio et video en cours pour demarrer l'appel."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent px-5 py-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                      Vue locale
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                      En ligne
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                      {isCameraOn ? 'Camera active' : 'Camera coupee'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {participants.map((participant, index) => (
                  <div
                    key={participant.id}
                    className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5"
                  >
                    <div
                      className={cn(
                        'absolute inset-x-0 top-0 h-1 bg-gradient-to-r',
                        theme.gradient,
                      )}
                    />
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white',
                            theme.gradient,
                          )}
                        >
                          {participant.firstName?.[0]}
                          {participant.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">
                            {participant.firstName} {participant.lastName}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {participant.id === host?.id
                              ? 'Hote de reunion'
                              : participant.id === requester?.id
                                ? 'Demandeur'
                                : roleLabel[participant.role]}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                        {index === 0 ? 'Actif' : 'Connecte'}
                      </span>
                    </div>
                    <div className="mt-5 rounded-[24px] bg-slate-950/95 p-5 text-white">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        Participant
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-300">
                        Salle prete pour echanger sur le livre, les modalites de commande et la lecture du PDF.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button
                variant={isMicOn ? 'secondary' : 'danger'}
                icon={isMicOn ? Mic : MicOff}
                onClick={() => setIsMicOn((current) => !current)}
              >
                {isMicOn ? 'Couper le micro' : 'Activer le micro'}
              </Button>
              <Button
                variant={isCameraOn ? 'secondary' : 'danger'}
                icon={isCameraOn ? Camera : CameraOff}
                onClick={() => setIsCameraOn((current) => !current)}
              >
                {isCameraOn ? 'Couper camera' : 'Activer camera'}
              </Button>
              <Button
                variant={isScreenSharing ? 'accent' : 'ghost'}
                icon={MonitorPlay}
                onClick={handleShareScreen}
              >
                {isScreenSharing ? "Arreter l'ecran" : "Partager l'ecran"}
              </Button>
              <Button variant="secondary" icon={Camera} onClick={handleScreenshot}>
                Screenshot
              </Button>
              <Button variant="danger" icon={PhoneOff} onClick={handleLeave}>
                Quitter la reunion
              </Button>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-5"
          >
            {isScreenSharing ? (
              <div className="glass-panel overflow-hidden rounded-[32px] border border-white/40 dark:border-white/10">
                <div className="flex items-center justify-between px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
                    Ecran partage
                  </p>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
                    Live
                  </span>
                </div>
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-56 w-full bg-slate-950 object-cover"
                />
              </div>
            ) : null}

            {lastCaptureUrl ? (
              <div className="glass-panel overflow-hidden rounded-[32px] border border-white/40 dark:border-white/10">
                <div className="flex items-center justify-between px-6 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
                    Dernier screenshot
                  </p>
                  <a
                    href={lastCaptureUrl}
                    download={`reunion-${meetingRequest.id}-capture.png`}
                    className="text-sm font-semibold text-sky-500"
                  >
                    Telecharger
                  </a>
                </div>
                <img
                  src={lastCaptureUrl}
                  alt="Dernier screenshot de la reunion"
                  className="h-48 w-full object-cover"
                />
              </div>
            ) : null}

            <div className="glass-panel rounded-[32px] p-6">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white',
                    theme.gradient,
                  )}
                >
                  <Sparkles size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-sky-500">
                    Session live
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
                    Details de la reunion
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-[24px] border border-slate-200/80 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Livre concerne
                  </p>
                  <p className="mt-2 font-semibold text-slate-950 dark:text-white">
                    {book?.title || 'Livre indisponible'}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {book?.description ||
                      "Le livre lie n'est plus visible, mais la reunion reste accessible."}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-[24px] bg-slate-950 px-4 py-4 text-white">
                    <Clock3 className="mb-2 text-sky-300" size={18} />
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Demarrage
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {formatDate(meetingStartsAt)}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-white/80 px-4 py-4 text-slate-900 ring-1 ring-slate-200 dark:bg-white/5 dark:text-white dark:ring-white/10">
                    <Users2 className="mb-2 text-sky-500" size={18} />
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Participants
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {participants.length} personnes attendues
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-4 dark:border-white/15 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Message initial
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {meetingRequest.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-[32px] p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-500">
                Reunion style Teams
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-slate-950 dark:text-white">
                Appel integre a la plateforme
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Cette version permet maintenant de partager lecran et de prendre des screenshots directement depuis le site.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  )
}

export default MeetingRoomPage
