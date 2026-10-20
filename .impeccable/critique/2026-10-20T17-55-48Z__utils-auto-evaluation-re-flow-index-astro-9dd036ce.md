---
target: quiz auto-evaluation
total_score: 32
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
target_identity: "file:C:\\Users\\ndeva\\dev\\personnel\\cecile-coaching.fr\\src\\pages\\outils\\auto-evaluation-re-flow\\index.astro"
target_fingerprint: "sha256:c8c3c75c6bd7ee8434d712a7facac4ea8b4d61fc4dc21ea653fdcde5960fcf9c"
target_path: "C:\\Users\\ndeva\\dev\\personnel\\cecile-coaching.fr\\src\\pages\\outils\\auto-evaluation-re-flow\\index.astro"
timestamp: 2026-10-20T17-55-48Z
slug: utils-auto-evaluation-re-flow-index-astro-9dd036ce
---
Method: dual-agent (A: [Critique Assessment A quiz](706bf331-b663-4b21-ac0a-0a25877739ae) · B: [Critique Assessment B quiz](059a88db-f776-4949-aa9f-1ae009a37ee0))

## Design Health Score

| # | Heuristique | Score | Problème clé |
|---|-------------|-------|--------------|
| 1 | Visibilité du statut système | 4 | Progression « Question N/12 », barre, aria-live — solide |
| 2 | Correspondance système / monde réel | 4 | Vocabulaire quotidien, profils humains, tutoiement |
| 3 | Contrôle et liberté | 2 | Auto-avance ~450 ms ; pas de pause/reprise ; gate après effort |
| 4 | Cohérence et standards | 4 | Une question / écran, pattern radio stable |
| 5 | Prévention des erreurs | 3 | Lead validé ; pas d’avertissement abandon mi-parcours |
| 6 | Reconnaissance plutôt que mémorisation | 4 | Options toujours visibles |
| 7 | Souplesse et efficience | 3 | Auto-avance aide les pressées, pénalise hésitation/fatigue |
| 8 | Esthétique et minimalisme | 3 | Calme mais questions longues + hauteur grille fixe |
| 9 | Récupération d’erreurs | 3 | Erreurs lead claires ; peu de feedback sur changement de réponse |
| 10 | Aide et documentation | 2 | Disclaimer médical seulement en bas de résultat |
| **Total** | | **32/40** | **Bon — contenu fort, friction conversion et a11y DOM** |

## Design Specificity Verdict

**Verdict : contenu très RE-FLOW / APA ; coquille quiz interchangeable.**

Les 12 questions et profils dans `reflow.ts` sont un actif différenciant (fatigue, peur de mal faire, récupération). L’intro (portrait Cécile, gratuit, ~2 min) et le funnel épuré (footer compact, pas de WhatsApp) servent bien l’entrée produit co-primaire.

Le **shell** (cartes, tokens sage/plum, tuiles radio) reste un funnel type. Le **résultat à l’écran** n’expose qu’une fraction du riche contenu profil — la promesse repose surtout sur l’email et la réservation, ce qui fragilise la couche Persuade post-quiz.

**Scan déterministe :** 0 finding sur `index.astro`, `ReflowAssessment.astro`, `reflow.ts` (regex source uniquement — **sous-comptage** pour contraste, texte tiny, nested-cards DOM). Scan URL Puppeteer en timeout. Overlay live : « No detector issues found. » **Preuve a11y (B + A) :** ~148 nœuds texte masqués mais présents dans l’arbre (questions futures, gate, 4 profils, succès) — risque spoil/bruit AT ; à traiter comme issue produit, pas comme faux positif détecteur.

## Overall Impression

Le quiz fait bien son job de **qualification empathique** ; le frein principal est la **dernière mile** : gate lead (téléphone obligatoire) + résultat pauvre vs contenu profil déjà codé. C’est là que l’on perd les personnes les plus fatiguées — exactement la cible.

## What's Working

1. **Questionnaire** — échelle A→D, copy concret, aligné maladie chronique / déconditionnement sans ton fitness.
2. **Progression** — libellés de section, barre, « Plus que X questions », annonces live.
3. **Intro** — ancrage coach APA, un CTA, promesse temps/gratuité, ambiance apaisante.

## Priority Issues

### [P0] Résultat à l’écran trop maigre vs `PROFILES`
- **Pourquoi :** après 12 réponses + lead, une ligne + réservation ne justifie pas l’effort ; email tardif = sentiment d’incomplétude.
- **Fix :** afficher intro profil, guidance, petit pas depuis `reflow.ts` ; email en complément.
- **Commande :** `/impeccable clarify` + `/impeccable layout`

### [P0] Téléphone obligatoire au gate
- **Pourquoi :** rupture de confiance pour persona anxieuse ; « profil prêt » puis PII = pression.
- **Fix :** téléphone optionnel ou différé ; micro-copy usage/fréquence/désinscription ; alternative « recevoir le bilan par email seulement ».
- **Commande :** `/impeccable harden` + `/impeccable clarify`

### [P1] Promesse « 2 minutes » vs charge cognitive réelle
- **Pourquoi :** 12 items denses ; pression inutile sur cerveau fatigué.
- **Fix :** « ~5 min » ou « 12 questions, à ton rythme » ; retirer « chrono » si non mesuré.
- **Commande :** `/impeccable clarify`

### [P1] Copy succès « Regarde tes e-mails » avant preuve
- **Pourquoi :** confusion si l’email n’est pas instantané (dev ou GHL).
- **Fix :** état « envoi en cours » + résumé visible immédiatement ; email comme rappel.
- **Commande :** `/impeccable polish`

### [P2] Fuite a11y — contenu futur dans le DOM
- **Pourquoi :** gate, profils et résultat lisibles par AT avant interaction ; spoilers et bruit.
- **Fix :** `hidden`/`inert`/`aria-hidden` sur conteneurs ; ne rendre les étapes qu’au fil de l’eau si faisable.
- **Commande :** `/impeccable harden`

### [P2] Auto-avance sans signal ni préférence
- **Pourquoi :** perte de contrôle (dyslexie, anxiété, relecture).
- **Fix :** indicateur « passage automatique » + respect `prefers-reduced-motion` ; bouton Suivant par défaut sur reduced-motion.
- **Commande :** `/impeccable adapt`

## Persona Red Flags

**Jordan (privacy / lead gen)** : téléphone requis ; teaser profil avant consentement complet ; pas de parcours « lire sans réserver ».

**Casey (fatigue cognitive)** : pas de sauvegarde ; « 2 minutes » incite à se précipiter ; 12 blocs longs.

**Riley (anxiété / peur mal faire)** : échelle ressentie comme jugement ; disclaimer tardif ; CTA appel immédiat sans temps de digestion.

## Minor Observations

- Emoji 🧘‍♀️ intro (`aria-hidden` OK mais générique wellness).
- « quizz » vs « quiz » (×2).
- `TunnelCtaLink` importé non utilisé.
- Iframe calendrier : grand `min-h` avant chargement.
- Casse marque Re-flow / RE-FLOW mixte.
- Kicker uppercase progression (`tracking-widest`) — proche eyebrow ; à surveiller.

## Questions to Consider

- Pourquoi ne pas afficher le bilan riche déjà dans `reflow.ts` ?
- Le téléphone obligatoire améliore-t-il les RDV ou filtre-t-il les profils les plus fragiles ?
- L’auto-avance est-elle testée avec des utilisatrices réellement fatiguées ?
- Que voit-on entre « Regarde tes e-mails » et la réception si GHL tarde ?
