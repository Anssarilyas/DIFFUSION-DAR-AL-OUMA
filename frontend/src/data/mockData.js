export const subjectThemes = {
  Math: {
    gradient: 'from-sky-500 via-blue-500 to-indigo-500',
    soft: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200',
    border: 'border-sky-200/70 dark:border-sky-400/20',
    accent: 'text-sky-500',
    glow: 'shadow-[0_24px_60px_-34px_rgba(14,165,233,0.9)]',
  },
  PC: {
    gradient: 'from-orange-500 via-red-500 to-rose-500',
    soft: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200',
    border: 'border-orange-200/70 dark:border-orange-400/20',
    accent: 'text-orange-500',
    glow: 'shadow-[0_24px_60px_-34px_rgba(249,115,22,0.95)]',
  },
  SVT: {
    gradient: 'from-emerald-500 via-green-500 to-lime-500',
    soft: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
    border: 'border-emerald-200/70 dark:border-emerald-400/20',
    accent: 'text-emerald-500',
    glow: 'shadow-[0_24px_60px_-34px_rgba(16,185,129,0.95)]',
  },
  Français: {
    gradient: 'from-pink-500 via-rose-500 to-fuchsia-500',
    soft: 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-200',
    border: 'border-pink-200/70 dark:border-pink-400/20',
    accent: 'text-pink-500',
    glow: 'shadow-[0_24px_60px_-34px_rgba(236,72,153,0.95)]',
  },
  English: {
    gradient: 'from-cyan-500 via-sky-500 to-teal-500',
    soft: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-200',
    border: 'border-cyan-200/70 dark:border-cyan-400/20',
    accent: 'text-cyan-500',
    glow: 'shadow-[0_24px_60px_-34px_rgba(6,182,212,0.95)]',
  },
  Arabic: {
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    soft: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
    border: 'border-amber-200/70 dark:border-amber-400/20',
    accent: 'text-amber-500',
    glow: 'shadow-[0_24px_60px_-34px_rgba(245,158,11,0.95)]',
  },
  default: {
    gradient: 'from-slate-500 via-slate-600 to-slate-700',
    soft: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200',
    border: 'border-slate-200/70 dark:border-slate-400/20',
    accent: 'text-slate-500',
    glow: 'shadow-[0_24px_60px_-34px_rgba(71,85,105,0.95)]',
  },
}

export const levelOptions = ['Primaire', 'Collège', 'Lycée']
export const seedCategories = ['Math', 'PC', 'SVT', 'Français', 'English', 'Arabic']

export const seedUsers = [
  {
    id: 'user-admin',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@ktoba.ma',
    phone: '+212600000001',
    password: '123456789',
    role: 'admin',
    isSuperAdmin: true,
    subject: null,
    level: null,
    createdAt: '2026-01-08T08:30:00.000Z',
  },
  {
    id: 'user-formateur-math',
    firstName: 'Ilyas',
    lastName: 'Math',
    email: 'ilyas@ktoba.ma',
    phone: '+212600000010',
    password: 'teacher123',
    role: 'formateur',
    subject: 'Math',
    level: 'Lycée',
    createdAt: '2026-01-11T10:30:00.000Z',
  },
  {
    id: 'user-formateur-svt',
    firstName: 'Oussama',
    lastName: 'SVT',
    email: 'oussama@ktoba.ma',
    phone: '+212600000011',
    password: 'teacher123',
    role: 'formateur',
    subject: 'SVT',
    level: 'Collège',
    createdAt: '2026-01-15T11:30:00.000Z',
  },
  {
    id: 'user-student-1',
    firstName: 'Imane',
    lastName: 'Alaoui',
    email: 'user@ktoba.ma',
    phone: '+212600000100',
    password: 'student123',
    role: 'utilisateur',
    subject: null,
    level: 'Lycée',
    createdAt: '2026-02-02T09:00:00.000Z',
  },
  {
    id: 'user-parent-1',
    firstName: 'Khalid',
    lastName: 'Mansouri',
    email: 'parent@ktoba.ma',
    phone: '+212600000101',
    password: 'student123',
    role: 'utilisateur',
    subject: null,
    level: 'Collège',
    createdAt: '2026-02-14T13:30:00.000Z',
  },
]

export const seedBooks = [
  {
    id: 'book-math-1',
    title: 'Math Premium Terminale',
    description:
      'Un support clair et visuel pour consolider l’algèbre, l’analyse et les suites, avec exercices guidés et corrigés progressifs pour la préparation bac.',
    imageUrl:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    subject: 'Math',
    level: 'Lycée',
    createdBy: 'user-formateur-math',
    featured: true,
    createdAt: '2026-02-16T12:00:00.000Z',
  },
  {
    id: 'book-pc-1',
    title: 'Physique Chimie Express',
    description:
      'Leçons structurées, expériences commentées et fiches de méthode pour maîtriser les lois fondamentales, les schémas et les applications numériques.',
    imageUrl:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    subject: 'PC',
    level: 'Lycée',
    createdBy: 'user-admin',
    featured: true,
    createdAt: '2026-02-21T09:00:00.000Z',
  },
  {
    id: 'book-svt-1',
    title: 'SVT Focus Collège',
    description:
      'Biologie, géologie et écologie dans un format synthétique, avec schémas annotés, mots-clés et mini-évaluations adaptées au cycle collège.',
    imageUrl:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    subject: 'SVT',
    level: 'Collège',
    createdBy: 'user-formateur-svt',
    featured: true,
    createdAt: '2026-02-23T16:00:00.000Z',
  },
  {
    id: 'book-fr-1',
    title: 'Français Lecture Active',
    description:
      'Analyse de textes, grammaire utile et production écrite dans un guide élégant pensé pour renforcer compréhension, style et méthodologie.',
    imageUrl:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: null,
    subject: 'Français',
    level: 'Collège',
    createdBy: 'user-admin',
    featured: false,
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'book-eng-1',
    title: 'English Smart Skills',
    description:
      'Vocabulary boosters, reading drills and speaking prompts designed to make English practice more fluent, modern and confidence-building.',
    imageUrl:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    subject: 'English',
    level: 'Primaire',
    createdBy: 'user-admin',
    featured: false,
    createdAt: '2026-03-04T08:00:00.000Z',
  },
  {
    id: 'book-ar-1',
    title: 'العربية في البيت والمدرسة',
    description:
      'كتاب متدرج يركز على القراءة والفهم والتراكيب الأساسية مع تمارين مناسبة للأطفال وأولياء الأمور.',
    imageUrl:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: null,
    subject: 'Arabic',
    level: 'Primaire',
    createdBy: 'user-admin',
    featured: false,
    createdAt: '2026-03-09T14:30:00.000Z',
  },
  {
    id: 'book-math-2',
    title: 'Révisions Maths Collège',
    description:
      'Problèmes corrigés, résumés chapitre par chapitre et astuces rapides pour retrouver les automatismes avant contrôle ou examen.',
    imageUrl:
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    subject: 'Math',
    level: 'Collège',
    createdBy: 'user-formateur-math',
    featured: false,
    createdAt: '2026-03-12T17:00:00.000Z',
  },
  {
    id: 'book-svt-2',
    title: 'SVT Bac Mission',
    description:
      'Approche bac orientée vers les notions essentielles, les cartes mentales, les schémas et les questions de synthèse à fort rendement.',
    imageUrl:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    subject: 'SVT',
    level: 'Lycée',
    createdBy: 'user-formateur-svt',
    featured: false,
    createdAt: '2026-03-18T12:45:00.000Z',
  },
]

export const seedRequests = [
  {
    id: 'request-1',
    userId: 'user-student-1',
    bookId: 'book-math-1',
    subject: 'Math',
    message: 'Je souhaite une réunion rapide pour comprendre le programme et la disponibilité.',
    status: 'pending',
    createdAt: '2026-04-11T11:30:00.000Z',
  },
  {
    id: 'request-2',
    userId: 'user-parent-1',
    bookId: 'book-svt-1',
    subject: 'SVT',
    message: 'Pouvez-vous confirmer si ce livre est adapté au niveau 3AC ?',
    status: 'confirmed',
    createdAt: '2026-04-09T09:15:00.000Z',
  },
  {
    id: 'request-3',
    userId: 'user-student-1',
    bookId: 'book-fr-1',
    subject: 'Français',
    message: 'Je veux réserver une réunion samedi pour voir les options PDF et livraison.',
    status: 'refused',
    createdAt: '2026-04-03T13:00:00.000Z',
  },
]

export const seedState = {
  theme: 'light',
  token: null,
  currentUserId: null,
  users: seedUsers,
  books: seedBooks,
  requests: seedRequests,
  categories: seedCategories,
  levels: levelOptions,
}
