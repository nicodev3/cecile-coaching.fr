---
name: RE-FLOW
description: Vitalité sans violence — système visuel APA bienveillant (plum, sauge, papier).
colors:
  plum: "#60406A"
  plum-ink: "#4a2d57"
  plum-soft: "#82628c"
  sage: "#c4d6b7"
  paper: "#f7faf6"
  ink: "#111827"
  slate: "#334155"
  secondary-text: "#676767"
  surface-container: "#f5f6f3"
  surface-white: "#ffffff"
  outline: "#858585"
  whatsapp-ink: "#0b6b3a"
typography:
  display:
    fontFamily: "Montserrat, Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Montserrat, Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Montserrat, Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken Grotesk, Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  body-lg:
    fontFamily: "Hanken Grotesk, Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Hanken Grotesk, Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  pill: "9999px"
  xl: "0.75rem"
  card: "1rem"
  chip: "9999px"
spacing:
  gutter: "1.5rem"
  section: "5rem"
  section-sm: "3rem"
  btn-x: "2rem"
  btn-y: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.plum}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    padding: "{spacing.btn-y} {spacing.btn-x}"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.plum-soft}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.pill}"
    padding: "{spacing.btn-y} {spacing.btn-x}"
  button-secondary:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.plum}"
    rounded: "{rounded.pill}"
    padding: "{spacing.btn-y} {spacing.btn-x}"
  card-surface:
    backgroundColor: "{colors.surface-white}"
    textColor: "{colors.slate}"
    rounded: "{rounded.card}"
    padding: "1.25rem"
---

# Design System: RE-FLOW

## Overview

**Creative North Star: "La Force douce"**

Le site RE-FLOW traduit une promesse APA : reprendre le corps sans culture performance. Visuellement, l’autorité vient du **plum** (crédibilité, ancrage) ; la respiration vient de la **sauge** et du **papier** (apaisement, espace). La densité reste aérée : sections longues, tutoiement, peu de kickers décoratifs — le contenu et les CTAs portent la conversion (immersion 4 jours, quiz, puis contact).

L’interface évite le fitness agressif (noir néon, angles durs, typographie condensée « gym »). Elle préfère des **pilules** arrondies, des cartes blanches légères, et une ombre teintée plum plutôt qu’un gris neutre froid.

**Key Characteristics:**

- Palette « force douce » : plum + sauge + papier, contrastes WCAG documentés dans `src/styles/global.css`.
- Typographie : **Montserrat** pour les titres, **Hanken Grotesk** pour le corps (Astro Font / Fontsource).
- CTAs en **pilule** (`rounded-full`) ; champs en **coins doux** (`rounded-xl`).
- Profondeur par **`.soft-glow`** (ombre plum) sur les actions primaires, pas par empilement de gris.
- Motion : reveal au scroll (opacity + translate), hover carte léger (`translateY(-4px)`), respect de `prefers-reduced-motion`.

## Colors

Une palette chaude et végétale : le plum structure l’identité, la sauge signale le secondaire / zones d’accent, le papier et les surfaces blanches accueillent la lecture longue.

### Primary

- **Plum profond** (#60406A) : titres, logo RE-FLOW, boutons primaires, liens actifs navigation.
- **Encre plum** (#4a2d57) : texte accent sur fonds clairs ou sauge (≥ AA).
- **Plum adouci** (#82628c) : hover bouton primaire, accents discrets (`--on-surface-accent`).

### Secondary

- **Sauge respirante** (#c4d6b7) : badges, fonds de chips blog, halos décoratifs hero, surfaces `--surface-container-high`.
- **Sauge profonde** (#b5c9a7) : `--surface-container-highest`, hover filtres blog.

### Neutral

- **Papier** (#f7faf6) : fond de page (`--background`, `--surface`).
- **Coquille** (#f5f6f3) : sections alternées, champs (`--surface-container-low`).
- **Blanc carte** (#ffffff) : cartes contact, surfaces `--surface-container-lowest`.
- **Encre** (#111827) : texte principal (`--on-surface`).
- **Ardoise corps** (#334155) : paragraphes longs piliers / légal (`--on-surface-body`).
- **Gris secondaire** (#676767) : métadonnées, placeholders (`--secondary`).
- **Contour** (#858585) : bordures champs (`--outline`).

### Tertiary (canal)

- **WhatsApp encré** (#0b6b3a) : boutons et liens WhatsApp (AA sur blanc).
- **États** : erreur `#ba1a1a`, succès `#047857` — réservés formulaires et retours utilisateur.

### Named Rules

**The Rare Plum Rule.** Le plum plein est réservé aux titres, navigation active et CTAs primaires. Les grands aplats plum sur toute une section fatiguent une audience déjà en surcharge — préférer papier + touches sauge.

**The AA Ink Rule.** Ne jamais utiliser `--plum-soft` ou `--sage` seuls pour du texte long sur papier ; suivre les commentaires de contraste dans `global.css`.

## Typography

**Display Font:** Montserrat (Segoe UI, Tahoma, Geneva, Verdana, sans-serif)

**Body Font:** Hanken Grotesk (Segoe UI, Tahoma, Geneva, Verdana, sans-serif)

**Character:** Titres calmes et géométriques (tracking légèrement serré), corps lisible et moderne sans être « startup tech ». `text-wrap: balance` sur les titres, `pretty` sur le corps.

### Hierarchy

- **Display** (500, clamp 2.25–3rem, lh 1.15) : H1 hero et accroches programme.
- **Headline** (500, clamp 1.875–3rem, lh 1.2) : H2 de section (`text-3xl sm:text-5xl` fréquent).
- **Title** (600, 1.25rem) : H3 cartes, sous-blocs.
- **Body** (400, 1rem, lh ~1.625) : texte courant ; viser ~65ch sur colonnes étroites.
- **Body large** (400, 1.125rem) : lead hero, intro sections.
- **Label** (600, 0.875rem, tracking élargi) : chips blog uppercase, micro-badges.

### Named Rules

**The Title Font Rule.** Tous les `h1–h6` utilisent `--font-title` (Montserrat) à weight 500 par défaut ; le gras sémantique reste dans le corps (strong) plutôt que des titres ultra-bold.

## Layout

- **Conteneur** : `max-width: 75rem` (`--max-width-container`), centré, gouttières `1.5rem` (`--spacing-gutter`) avec `px-4 sm:px-6 lg:px-8` ou `sm:px-10` selon sections.
- **Sections** : rythme vertical `5rem` (`--spacing-section`) ou `3rem` (`--spacing-section-sm`) sur mobile.
- **Grilles** : hero 1→2 colonnes (`md:grid-cols-2`) ; contact formulaire + aside ; blog et piliers en grilles responsives.
- **Header sticky** : `h-16` mobile, plus haut desktop (`lg:py-6`) ; `scroll-padding-top` 5rem / 7rem pour ancres.
- **Densité** : marketing Persuade — blocs aérés, une idée par section, pas de sidebar dense.

## Elevation & Depth

Hybride **tonal + ombre plum** : la plupart des surfaces sont plates (papier, coquille) ; la profondeur apparaît sur les **actions** et certaines cartes via `--box-shadow` (teinté rgba plum) et `.soft-glow` / `.card-shadow`.

Les cartes `.bento-card` gagnent un léger lift au hover (`translateY(-4px)`) sans ombre supplémentaire obligatoire. Header : `shadow-sm` + `backdrop-blur` en desktop.

### Shadow Vocabulary

- **Soft glow** (`--box-shadow`: 0 2px 6px rgba(96,64,106,25%), 0 8px 24px rgba(96,64,106,33%), 0 16px 32px rgba(96,64,106,33%)) : CTA primaire hero, éléments à mettre en avant.
- **Card rest** (`shadow-sm` + `ring-1 ring-black/5`) : cartes contact, témoignages — discret, structure sans drama.

### Named Rules

**The Plum Shadow Rule.** Les ombres portent une teinte plum, jamais un gris pur `#000` opaque — cela maintient la chaleur du système.

**The Flat Section Rule.** Fonds de section alternent papier / coquille / sauge léger ; éviter d’empiler soft-glow sur chaque carte d’une même grille.

## Shapes

- **Boutons & CTAs** : pilules (`rounded-full`, 9999px) — signature RE-FLOW, friendly et non sport « hard ».
- **Champs & mobile nav** : `rounded-xl` (12px) pour saisie et liens drawer.
- **Cartes** : `rounded-2xl` (16px) pour blocs contact, WhatsApp, témoignages.
- **Icônes** : cercles `rounded-full` sur fond blanc ou plum/8 pour pictos Lucide.
- **Décoration** : blobs circulaires flous (hero sage/plum) — ambiance, jamais motif répétitif agressif.

## Components

### Buttons

- **Shape:** Pilule (`rounded-full`).
- **Primary:** Fond plum, texte blanc, padding typique `px-8 py-4`, `.soft-glow` sur CTA hero ; hover → `--primary-container` (plum-soft).
- **Secondary / outline:** Bordure `2px` plum à 40 % opacité, fond blanc, texte plum ; hover fond coquille.
- **Focus:** `focus-visible:outline-2 outline-offset-2/4` en plum (ou token on-primary selon contexte).
- **WhatsApp:** Classes `.whatsapp-btn` / `.whatsapp-btn-outline` — vert encré dédié, hors palette plum mais cohérent canal.

### Chips

- **Style:** Pilule, fond sauge ou `--primary-container`, texte plum-ink ou blanc selon variante (filtres blog).
- **State:** Actif = container primaire ; inactif = secondary-container + hover sauge plus foncée.

### Cards / Containers

- **Corner Style:** 16px (`rounded-2xl`) pour cartes riches ; parfois 12px pour items compacts.
- **Background:** Blanc ou coquille ; sections contact sur `--surface-container-low`.
- **Shadow Strategy:** `shadow-sm` + ring léger au repos ; bento hover lift optionnel.
- **Internal Padding:** `p-5` à `p-6` courant.

### Inputs / Fields

- **Style:** `rounded-xl`, bordure `--outline`, fond coquille, padding `px-4 py-3.5`.
- **Focus:** Bordure plum + ring `3px` plum à 12 % opacité.
- **Placeholder:** Couleur `--secondary`.

### Navigation

- **Desktop:** Liens `text-base`, inactif gris secondaire → hover plum ; actif plum semibold, non cliquable (`pointer-events-none`).
- **Mobile:** Drawer, liens `min-h-11`, `rounded-xl`, actif fond sauge translucide.
- **Brand:** Wordmark « RE-FLOW » `text-2xl` plum, pas de logo image obligatoire dans le système.

### Reveal sections

- **Signature:** Sections marketing avec `data-reveal` — opacity 0 + translateY, transition 700ms ; sections déjà visibles révélées immédiatement (layout accueil).

## Do's and Don'ts

### Do:

- **Do** utiliser `--font-title` pour tout titre et `--font-body` pour UI + paragraphes.
- **Do** réserver `.soft-glow` aux CTAs primaires ou à un seul élément focal par viewport.
- **Do** garder les CTAs immersion et quiz visuellement distincts (plein vs outline) comme sur le hero.
- **Do** respecter `prefers-reduced-motion` (transitions désactivées ou simplifiées).

### Don't:

- **Don't** introduire une palette fitness (noir/orange néon, italiques condensées agressives).
- **Don't** remplacer les pilules par des boutons carrés sans décision produit explicite.
- **Don't** utiliser du texte gris clair arbitraire sous le seuil `--secondary` sur papier.
- **Don't** empiler plus de trois niveaux d’ombre sur une même zone.
