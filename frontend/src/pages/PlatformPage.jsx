import { motion } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  Layers3,
  MonitorPlay,
  PlayCircle,
  ShieldCheck,
  Users2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Button, SectionHeading } from '../components/ui/index.jsx'
import { platformSpaces, platformVideos } from '../data/mockData'

const spaceIcons = {
  eleve: BookOpen,
  enseignant: GraduationCap,
  parent: Users2,
  formation: MonitorPlay,
  'inclusion-tnd': HeartHandshake,
  'administration-editeur': BarChart3,
}

function PlatformPage() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <section className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-200">
              Plateforme éditoriale numérique
            </Badge>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-slate-950 dark:text-white sm:text-5xl">
              Un écosystème complet autour du manuel scolaire.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
              Chaque espace répond à un usage précis : apprendre, enseigner,
              accompagner, former, inclure et piloter les contenus éditoriaux.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/books">
                <Button variant="accent" icon={BookOpen}>
                  Voir les manuels
                </Button>
              </Link>
              <Link to="/dashboard/admin">
                <Button variant="secondary" icon={ShieldCheck}>
                  Administration
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {platformSpaces.map((space) => {
              const Icon = spaceIcons[space.id] || Layers3

              return (
                <a
                  key={space.id}
                  href={`#${space.id}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-pink-200 hover:bg-pink-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <Icon className="text-pink-600" size={22} />
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                    Espace {space.number}
                  </p>
                  <h2 className="mt-2 font-display text-lg font-semibold text-slate-950 dark:text-white">
                    {space.title}
                  </h2>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Cartographie"
          title="Les 6 espaces de la plateforme"
          description="L’arborescence relie les publics, les ressources, la formation et le pilotage éditorial."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {platformSpaces.map((space, index) => {
            const Icon = spaceIcons[space.id] || Layers3

            return (
              <motion.article
                id={space.id}
                key={space.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: index * 0.04 }}
                className="scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-600 text-white">
                    <Icon size={22} />
                  </div>
                  <div>
                    <Badge className="bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-white/10 dark:text-slate-200 dark:ring-white/10">
                      {space.number}
                    </Badge>
                    <h2 className="mt-3 font-display text-2xl font-bold text-slate-950 dark:text-white">
                      {space.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {space.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {space.items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                    >
                      <CheckCircle2 className="shrink-0 text-emerald-500" size={17} />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Vidéos"
            title="Ressources vidéo intégrées"
            description="Les deux vidéos sont accessibles directement depuis la plateforme."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {platformVideos.map((video) => (
              <article
                key={video.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
              >
                <div className="aspect-video bg-slate-950">
                  <iframe
                    className="h-full w-full"
                    src={video.embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <PlayCircle className="text-pink-600" size={22} />
                    <h3 className="mt-3 font-display text-xl font-semibold text-slate-950 dark:text-white">
                      {video.title}
                    </h3>
                  </div>
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary">Ouvrir YouTube</Button>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default PlatformPage
