const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')

const docsOutputPath = path.join(
  __dirname,
  'Guide_Utilisateur_DIFFUSION_DAR_AL_OUMA.pdf',
)
const publicDownloadsDir = path.join(
  __dirname,
  '..',
  'frontend',
  'public',
  'downloads',
)
const publicOutputPath = path.join(
  publicDownloadsDir,
  'Guide_Utilisateur_DIFFUSION_DAR_AL_OUMA.pdf',
)

fs.mkdirSync(publicDownloadsDir, { recursive: true })

const colors = {
  ink: '#14213D',
  soft: '#5B6B83',
  accent: '#2563EB',
  warm: '#F59E0B',
  line: '#D6DFEB',
  panel: '#F8FAFC',
}

function buildPdf(outputPath) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 48,
    info: {
      Title: 'Guide Utilisateur - DIFFUSION DAR AL OUMA',
      Author: 'OpenAI Codex',
      Subject: 'Guide detaille d utilisation de la plateforme',
    },
  })

  doc.pipe(fs.createWriteStream(outputPath))

  function sectionTitle(text) {
    doc
      .moveDown(0.25)
      .font('Helvetica-Bold')
      .fontSize(17)
      .fillColor(colors.ink)
      .text(text)

    doc
      .moveDown(0.2)
      .strokeColor(colors.line)
      .lineWidth(1)
      .moveTo(doc.x, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown(0.6)
  }

  function paragraph(text) {
    doc
      .font('Helvetica')
      .fontSize(10.8)
      .fillColor(colors.ink)
      .text(text, {
        align: 'left',
        lineGap: 4,
      })
      .moveDown(0.5)
  }

  function bullet(text) {
    doc
      .font('Helvetica-Bold')
      .fontSize(10.8)
      .fillColor(colors.accent)
      .text('-', { continued: true })
      .fillColor(colors.ink)
      .font('Helvetica')
      .text(` ${text}`, {
        indent: 10,
        lineGap: 4,
      })
      .moveDown(0.3)
  }

  function infoBox(label, text, height = 64) {
    const startY = doc.y
    const boxX = 48
    const boxWidth = 499

    doc
      .roundedRect(boxX, startY, boxWidth, height, 12)
      .fillAndStroke(colors.panel, colors.line)

    doc
      .fillColor(colors.warm)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(label.toUpperCase(), boxX + 14, startY + 10)

    doc
      .fillColor(colors.ink)
      .font('Helvetica')
      .fontSize(10.2)
      .text(text, boxX + 14, startY + 24, {
        width: boxWidth - 28,
        lineGap: 3,
      })

    doc.moveDown(height / 15.5)
  }

  doc.rect(0, 0, 595, 842).fill('#FFFFFF')

  doc
    .roundedRect(48, 46, 499, 140, 22)
    .fillAndStroke('#EEF4FF', colors.line)

  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .fillColor(colors.ink)
    .text('DIFFUSION DAR AL OUMA', 72, 76)

  doc
    .font('Helvetica')
    .fontSize(14.5)
    .fillColor(colors.soft)
    .text(
      'Guide utilisateur detaille de la plateforme de gestion et de partage des livres scolaires',
      72,
      114,
      {
        width: 420,
        lineGap: 4,
      },
    )

  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .fillColor(colors.accent)
    .text('Version francaise - edition complete', 72, 158)

  doc.moveDown(7.2)

  sectionTitle('1. Objectif de la plateforme')
  paragraph(
    'DIFFUSION DAR AL OUMA est une plateforme moderne qui permet de centraliser la consultation, la presentation et la gestion des livres scolaires. Elle aide les administrateurs a organiser le catalogue, les formateurs a suivre les livres de leur matiere et les utilisateurs a trouver rapidement le bon ouvrage.',
  )
  bullet('Trouver un livre par matiere, niveau ou mot cle.')
  bullet('Lire un PDF lorsqu il est disponible.')
  bullet('Commander un livre via WhatsApp en un clic.')
  bullet('Envoyer une demande de reunion pour poser une question ou demander un rendez-vous.')
  bullet('Donner a chaque role un espace clair et simple a utiliser.')

  infoBox(
    'Acces',
    'Le site fonctionne sur ordinateur, tablette et telephone. Chaque utilisateur se connecte avec son email et son mot de passe afin d acceder a son espace personnel.',
  )

  sectionTitle('2. Les profils disponibles')
  paragraph(
    'La plateforme se base sur trois profils principaux. Chaque profil a des permissions differentes afin de garantir une utilisation securisee et bien organisee.',
  )
  bullet('Super Admin : gestion complete de la plateforme.')
  bullet('Formateur : suivi des livres et demandes relies a sa matiere.')
  bullet('Utilisateur : consultation, lecture, commande et demandes de reunion.')

  sectionTitle('3. Navigation generale')
  bullet('Accueil : vue d ensemble du site avec recherche, categories, livres mis en avant et statistiques.')
  bullet('Livres : catalogue general avec recherche et filtres.')
  bullet('Details du livre : description complete, couverture, PDF et commande.')
  bullet('Reunions : suivi des demandes envoyees et de leur statut.')
  bullet('Dashboard : espace prive adapte au role connecte.')

  sectionTitle('4. Connexion et creation de compte')
  paragraph(
    'Un nouvel utilisateur peut creer un compte en renseignant son prenom, son nom, son email, son numero de telephone et son mot de passe. Une fois connecte, il accede a son tableau de bord personnel.',
  )
  bullet('Le mot de passe doit etre suffisamment fort.')
  bullet('Chaque email doit etre unique.')
  bullet('Le tableau de bord change selon le role connecte.')
  bullet('Le Super Admin conserve la gestion complete des comptes formateurs.')

  doc.addPage()

  sectionTitle('5. Espace Super Admin')
  paragraph(
    'Le Super Admin est le responsable principal de la plateforme. Il controle le catalogue, les comptes, les categories, les niveaux et le suivi global des demandes. Son interface lui permet d agir rapidement et de garder une vue claire sur toute l activite du site.',
  )
  bullet('Ajouter, modifier et supprimer les livres du catalogue.')
  bullet('Importer la couverture du livre a partir d un fichier image.')
  bullet('Associer chaque livre a une matiere et a un niveau.')
  bullet('Creer les comptes des formateurs.')
  bullet('Modifier les roles et les informations des utilisateurs.')
  bullet('Confirmer ou refuser les demandes de reunion.')
  bullet('Consulter les statistiques globales : nombre de livres, utilisateurs, demandes et demandes en attente.')
  bullet('Gerer les categories et les niveaux scolaires visibles dans les filtres.')

  infoBox(
    'Conseil admin',
    'Le Super Admin doit verifier la qualite des couvertures, la coherence des niveaux scolaires et la precision des descriptions avant de publier un livre dans le catalogue.',
    74,
  )

  sectionTitle('6. Gestion des comptes formateurs')
  paragraph(
    'Le site contient une zone speciale dans le dashboard admin pour gerer les comptes formateurs. Cette zone a ete pensee pour que le Super Admin reste le seul responsable de la creation, de la mise a jour et de l organisation de ces comptes.',
  )
  bullet('Creer un nouveau formateur avec prenom, nom, email, telephone et mot de passe.')
  bullet('Assigner une matiere au formateur.')
  bullet('Associer si besoin un niveau principal.')
  bullet('Modifier plus tard la matiere ou le role depuis la liste des utilisateurs.')
  bullet('Supprimer un compte s il n est plus necessaire.')

  sectionTitle('7. Espace Formateur')
  paragraph(
    'Le formateur dispose d un espace plus simple que celui du Super Admin. Il ne voit que les livres de sa matiere et les demandes de reunion associees a cette matiere.',
  )
  bullet('Visualiser uniquement les livres relies a sa matiere.')
  bullet('Consulter les demandes de reunion concernant son domaine.')
  bullet('Suivre les besoins et questions des utilisateurs.')
  bullet('Ne pas acceder aux reglages globaux ni a la gestion complete des comptes.')

  doc.addPage()

  sectionTitle('8. Espace Utilisateur')
  paragraph(
    'L utilisateur final peut etre un eleve, un parent ou toute autre personne souhaitant consulter les livres scolaires disponibles. Son parcours a ete optimise pour etre simple, rapide et rassurant.',
  )
  bullet('Parcourir les livres par matiere et niveau.')
  bullet('Utiliser la barre de recherche pour trouver un titre ou une categorie.')
  bullet('Ouvrir la fiche detaillee de chaque livre.')
  bullet('Lire le PDF dans un nouvel onglet si disponible.')
  bullet('Commander le livre via WhatsApp avec un message deja prepare.')
  bullet('Envoyer une demande de reunion pour poser une question ou demander plus d informations.')

  sectionTitle('9. Fiche detaillee du livre')
  paragraph(
    'La fiche detaillee est la page la plus importante pour l utilisateur. Elle rassemble toutes les informations utiles avant une lecture, une commande ou une demande de reunion.',
  )
  bullet('Couverture du livre.')
  bullet('Titre du livre.')
  bullet('Description detaillee.')
  bullet('Matiere et niveau scolaire.')
  bullet('Bouton "Lire PDF".')
  bullet('Bouton "Commander via WhatsApp".')
  bullet('Formulaire "Demande reunion".')

  infoBox(
    'Lecture PDF',
    'Lorsque le PDF existe, il s ouvre dans un nouvel onglet. Si aucun PDF n est disponible, le message "PDF غير متوفر حاليا" apparait clairement sur la fiche.',
    76,
  )

  sectionTitle('10. Demandes de reunion')
  paragraph(
    'La demande de reunion permet a l utilisateur d envoyer un message a propos d un livre. Cette demande garde un statut qui aide le Super Admin et les formateurs a suivre son avancement.',
  )
  bullet('Pending : la demande attend encore une decision.')
  bullet('Confirmed : la demande a ete acceptee.')
  bullet('Refused : la demande a ete refusee.')
  bullet('Le Super Admin peut confirmer ou refuser rapidement depuis son dashboard.')
  bullet('Le formateur peut consulter les demandes liees a sa propre matiere.')

  sectionTitle('11. Commande via WhatsApp')
  paragraph(
    'Le bouton de commande ouvre automatiquement WhatsApp avec un message pre-rempli contenant le titre du livre. Cela simplifie la communication et reduit le temps de saisie pour l utilisateur.',
  )
  bullet('Le titre du livre est ajoute automatiquement dans le message.')
  bullet('Le numero WhatsApp de la plateforme est deja configure.')
  bullet('La commande peut se faire depuis mobile ou ordinateur selon les outils disponibles.')

  doc.addPage()

  sectionTitle('12. Recherche, filtres et experience utilisateur')
  paragraph(
    'Le site propose une experience de recherche moderne afin d aider l utilisateur a trouver rapidement le bon livre sans se perdre dans un catalogue trop long.',
  )
  bullet('Recherche par titre, description, matiere ou niveau.')
  bullet('Filtre par matiere.')
  bullet('Filtre par niveau.')
  bullet('Cartes visuelles avec couleurs par matiere.')
  bullet('Design responsive pour mobile et desktop.')
  bullet('Mode clair et mode sombre.')
  bullet('Animations douces pour une navigation plus agreable.')

  sectionTitle('13. Bonnes pratiques de publication')
  paragraph(
    'Afin de garder une plateforme propre et professionnelle, certaines bonnes pratiques sont recommandees au moment d ajouter ou modifier un livre.',
  )
  bullet('Utiliser un titre simple et facilement comprenable.')
  bullet('Rediger une description utile, concrete et sans ambiguite.')
  bullet('Choisir la bonne matiere et le bon niveau.')
  bullet('Importer une image nette et lisible comme couverture.')
  bullet('Verifier le lien ou le fichier PDF avant publication.')
  bullet('Mettre a jour les informations si le contenu du livre change.')

  sectionTitle('14. Bonnes pratiques pour les comptes formateurs')
  bullet('Attribuer une seule matiere principale par formateur si possible.')
  bullet('Verrouiller les acces sensibles au niveau du Super Admin.')
  bullet('Supprimer ou desactiver les comptes qui ne sont plus utilises.')
  bullet('Garder des informations de contact a jour.')

  sectionTitle('15. Questions frequentes')
  bullet('Je ne vois pas le PDF : cela signifie qu il n est pas encore disponible pour ce livre.')
  bullet('Je ne peux pas acceder au dashboard admin : votre role ne vous donne probablement pas cette permission.')
  bullet('Je ne vois pas certains livres en tant que formateur : seuls les livres de votre matiere sont visibles.')
  bullet('Je veux poser une question : utilisez la demande de reunion depuis la fiche du livre.')

  sectionTitle('16. Conclusion')
  paragraph(
    'DIFFUSION DAR AL OUMA a ete pensee pour offrir une gestion moderne, rapide et professionnelle des livres scolaires. Grace a une separation claire des roles, chaque personne comprend son espace et peut agir efficacement sans complexite inutile.',
  )
  paragraph(
    'Ce guide peut etre partage avec toute personne devant apprendre a utiliser le site : administration, formateurs, eleves et parents.',
  )

  doc
    .font('Helvetica-Oblique')
    .fontSize(9)
    .fillColor(colors.soft)
    .text(
      'Document genere automatiquement pour la plateforme DIFFUSION DAR AL OUMA.',
      48,
      790,
      { align: 'center', width: 499 },
    )

  doc.end()
}

buildPdf(docsOutputPath)
buildPdf(publicOutputPath)

console.log(`PDF generated: ${docsOutputPath}`)
console.log(`PDF copied for website download: ${publicOutputPath}`)
