# Benul IA — Site vitrine

Site de Benul IA, consultant en transformation IA (Ethan Ben Amram).
Deploye sur Cloudflare Pages avec domaine custom benul-ia.fr.

## Stack

- HTML/CSS/JS statique (pas de framework, pas de build)
- GSAP + ScrollTrigger pour les animations
- Google Fonts : DM Sans + DM Serif Display
- Cloudflare Pages (hebergement)
- Cloudflare Functions (chatbot API)

## Structure du projet

```
Formations/
├── index.html          # Page d'accueil (hero, video HeyGen, philosophie, stats, AI Act)
├── methode.html        # Page methode (4 etapes, avant/apres)
├── offres.html         # Page "Ce qu'on fait" (situations client, process, FAQ)
├── contact.html        # Page contact (formulaire, infos)
├── chatbot.js          # Widget chatbot (bulle en bas a droite)
├── functions/
│   └── api/
│       └── chat.js     # Cloudflare Function — proxy API Claude (Anthropic)
├── deploy.sh           # Script de deploiement Cloudflare Pages
├── CLAUDE.md           # Ce fichier
└── .gitignore
```

### Fichiers a ignorer (pas dans le site)

- `site-formations-ia.html` — ancienne version one-page, plus utilisee
- `realisations.html` — page supprimee (pas assez de contenu reel)
- `Formations_IA_Recap_Strategie.pdf` — document interne, pas public
- `formation-sites-mariage.docx` — document client, pas public
- `.wrangler/` — config locale Wrangler

## Design

- Palette : creme (#FAFAF8), beige chaud (#F5F0EB), terracotta (#C45D3E), noir (#1A1A1A)
- Typo : DM Serif Display (titres), DM Sans (corps)
- Ambiance : premium, clean, lumineux — pas de vibe "dev/tech"
- Animations : GSAP ScrollTrigger, typewriter effect sur le hero
- Responsive : breakpoint principal a 900px

## Pages

### index.html (Accueil)
- Hero avec typewriter effect : "On ne forme pas a des outils. On integre l'IA dans votre quotidien."
- Section video HeyGen (placeholder — a remplacer par la vraie video)
- Philosophie (3 piliers : autonomie, comprendre avant de construire, livrer du concret)
- Section "Pourquoi les formations IA echouent" avec stats sourcees
- Banniere AI Act (Article 4, obligations 2026)
- CTA final

### methode.html (Methode)
- 4 etapes : Audit & Diagnostic → Formation par metier → Production & Livrables → Suivi & Evolution
- Section avant/apres Benul IA
- Animations slide left/right alternees

### offres.html (Ce qu'on fait)
- Structure par SITUATIONS CLIENT (pas par packages/pricing)
- 3 situations : formation sur-mesure, creation de site, audit + outils IA
- Chaque situation = panneau gauche (le probleme) + panneau droit (ce qu'on fait)
- Section process en 4 etapes (bande sombre)
- AI Act + FAQ + CTA

### contact.html
- Layout split-screen : panneau sombre (infos) + panneau clair (formulaire)
- Email : contact@benul-ia.fr
- Tel : 06 79 97 90 26
- Formulaire avec chips d'interet cliquables
- Animation de succes (pas de backend pour l'instant — a brancher)

## Chatbot

Widget chatbot en bas a droite (chatbot.js), connecte a l'API Anthropic via Cloudflare Functions (functions/api/chat.js).

Variable d'environnement requise :
```
ANTHROPIC_API_KEY=sk-ant-...
```

Configurer dans le dashboard Cloudflare :
Workers & Pages > benul-ia > Settings > Environment variables

## Deploiement

### Premiere fois
```bash
cd ~/Desktop/Formations
npx wrangler login
npx wrangler pages project create benul-ia --production-branch main
```

### Deployer
```bash
# Methode simple : deployer le dossier courant
# (exclure manuellement les fichiers non-site)
mkdir -p dist
cp index.html methode.html offres.html contact.html chatbot.js dist/
cp -r functions dist/
npx wrangler pages deploy ./dist --project-name benul-ia
```

### Domaine custom
Domaine : benul-ia.fr (achete sur Cloudflare Registrar)
Configurer dans : Workers & Pages > benul-ia > Custom domains > Add domain

## Git

Repo : https://github.com/Benibox/formations-ia.git
Branche : main

### Workflow
```bash
git add index.html methode.html offres.html contact.html chatbot.js functions/ CLAUDE.md .gitignore deploy.sh
git commit -m "description du changement"
git push origin main
```

## A faire

- [ ] Remplacer le placeholder video par la vraie video HeyGen
- [ ] Brancher le formulaire de contact (backend ou service tiers type Formspree)
- [ ] Configurer ANTHROPIC_API_KEY dans Cloudflare pour le chatbot
- [ ] Connecter le domaine benul-ia.fr au projet Pages
- [ ] Ajouter les accents francais dans les textes (actuellement sans accents)
- [ ] Ajouter un favicon
- [ ] Mettre a jour le system prompt du chatbot (actuellement il parle de "formations" generiques, pas du vrai positionnement Benul IA)

## Principes de contenu

- ZERO stat inventee. Tout chiffre doit etre source.
- Pas de faux temoignages. Pas de "15 entreprises accompagnees" quand il y en a une.
- Le ton est direct, honnete, professionnel mais accessible.
- On ne vend pas du reve — on explique clairement ce qu'on fait et comment.
