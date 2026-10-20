---
target: page d'accueil
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\ndeva\\dev\\personnel\\cecile-coaching.fr\\src\\pages\\index.astro"
target_fingerprint: "sha256:665cb1fbf6e19bb3b3254b0ba0b6efe21f41051bc292bbcfedb0ce6e480e2e5f"
target_path: "C:\\Users\\ndeva\\dev\\personnel\\cecile-coaching.fr\\src\\pages\\index.astro"
timestamp: 2026-10-20T17-31-49Z
slug: src-pages-index-astro
closed: true
---
Method: dual-agent (A: f91046c4-3f32-4bfa-bd1a-e5b9e69202b6 · B: 7370225f-feaf-4d86-8752-e25bf7f22a68)

## Design Health Score

| # | Heuristique | Score | Problème clé |
|---|-------------|-------|--------------|
| 1 | Visibilité du statut système | 3 | Téléphone « Chargement… » ; sections `opacity-0` jusqu’au scroll |
| 2 | Correspondance système / monde réel | 4 | Tutoiement, APA, fatigue, visio — langage audience |
| 3 | Contrôle et liberté | 3 | Tunnel en nouvel onglet ; menu mobile OK |
| 4 | Cohérence et standards | 2 | « Commencer » vs « Immersion gratuite (4 jours) » |
| 5 | Prévention des erreurs | 3 | Formulaire : champs requis, honeypot |
| 6 | Reconnaissance plutôt que mémorisation | 3 | Page longue (~12 sections), ancres présentes |
| 7 | Flexibilité et efficacité | n/a | Landing Persuade — pas attendu |
| 8 | Esthétique et design minimaliste | 2 | Hero surchargé ; WhatsApp partout |
| 9 | Récupération d’erreurs | 3 | `#form-error` + mailto |
| 10 | Aide et documentation | n/a | FAQ intégrée suffit pour une landing |
| **Total** | | **23/32** | **Correct — frictions de conversion** |

## Design Specificity Verdict

**Verdict : plutôt auteur pour RE-FLOW / APA, avec une couche « template bien-être » encore interchangeable.**

Le contenu (cercle vicieux du déconditionnement, pathologies, visio, 4 mois, mockups séance) ancre fortement le produit. En revanche, `TrustStrip` (« Cadre sécurisant », « Approche progressive ») et la multiplication des motifs détectés (eyebrow hero, kickers au-dessus des H2, tuiles icône + H4) rapprochent visuellement d’un landing coaching générique. Dissonance : témoignages évoquant parfois le domicile alors que l’offre est « 100 % en ligne ».

**Scan déterministe :** fichiers `.astro` homepage = 0 finding. Scan URL rendu = **13 warnings** + **4 advisory** (hero-eyebrow-chip, 4× icon-tile-stack, 4× kicker-above-heading, 4× nested-cards, placeholders formulaire 3,4:1). Le détecteur confirme des patterns « category SaaS/wellness » que la revue design avait notés sur TrustStrip et la structure des sections — sans invalider le fond éditorial APA.

**Overlays navigateur :** injection réussie (onglet **[Human]**). Six overlays visibles en haut de page (eyebrow hero, tuiles icône, kicker « Guide recommandé »). Aligné partiellement avec le scan URL complet (nested-cards et kickers bas de page hors viewport initial).

## Overall Impression

RE-FLOW parle clairement à son audience et le récit « sortir de l’engrenage » est le vrai différenciateur. Le frein n°1 n’est pas la crédibilité du métier, c’est la **multiplication des chemins d’action** (immersion, quiz, WhatsApp, contact, tarif) qui fatigue une visiteuse déjà en surcharge cognitive — exactement le profil cible.

## What's Working

1. **ProblemSection** — cercle vicieux nommé, boucle visuelle, ancrage RE-FLOW vs coach fitness générique.
2. **WhatYouGet** — mockups séance / visio / bonus audio matérialisent l’offre en ligne.
3. **ContactForm** — « Échange confidentiel », SLA 24–48 h, WhatsApp en canal secondaire structuré.

## Priority Issues

### [P0] Fragmentation de l’action primaire
- **Pourquoi :** Jordan et Riley hésitent ou partent en nouvel onglet sans filet ; incompatible avec une audience fatigue / maladie chronique.
- **Fix :** Une primary unique above the fold (immersion 4 jours) ; harmoniser header « Commencer » avec le libellé hero ; WhatsApp et quiz en secondaires visuellement atténués.
- **Commande :** `/impeccable clarify`

### [P1] Tarif opaque au mauvais moment
- **Pourquoi :** « Tarif sur demande » crée une vallée émotionnelle avant contact.
- **Fix :** Fourchette ou ancres de valeur (4 mois, 48 séances) avant « sur devis » ; rappeler l’échange sans engagement.
- **Commande :** `/impeccable distill`

### [P1] Surcharge cognitive du hero « Nouvelle ici ? »
- **Pourquoi :** 2 CTA + 4 liens SEO en concurrence directe (>4 options au premier écran).
- **Fix :** Un lien guide ou bloc repliable ; renvoyer le SEO profond vers `FeaturedBlogGuide` / piliers.
- **Commande :** `/impeccable distill`

### [P2] Trust strip générique + signaux slop détectés
- **Pourquoi :** Affaiblit la spécificité juste après le hero ; kickers/eyebrow/icon-tiles signalés par le détecteur sur la page rendue.
- **Fix :** Preuves APA chiffrées ou certification ; réduire kickers redondants si le H2 suffit.
- **Commande :** `/impeccable bolder`

### [P3] Ordre peak-end (FinalCTA → FAQ 9 items → Contact)
- **Pourquoi :** Le dernier geste mémorable devrait être contact ou CTA final, pas une longue FAQ.
- **Fix :** Monter FAQ avant FinalCTA ou raccourcir à 3 questions + lien pilier.
- **Commande :** `/impeccable layout`

## Persona Red Flags

**Jordan (first-timer) :** « Commencer » (header) ≠ « Immersion gratuite (4 jours) » (hero) — même destination ? Tunnel en nouvel onglet = perte du fil avec Cécile.

**Casey (mobile) :** FAB WhatsApp recouvre le bas de page ; long scroll jusqu’au formulaire sans repère sticky « Me contacter ».

**Riley (stress / fatigue cognitive) :** « Tarif sur demande » + trop de canaux (WhatsApp vs `#contact` vs tel vs formulaire) = paralysie ; téléphone « Chargement… » = micro-stress.

## Minor Observations

- Double point dans `StepsTimeline` (« capacités physiques. . »).
- Témoignages pré-visio / domicile vs promesse 100 % en ligne.
- Sections `data-reveal` + `opacity-0` : risque contenu invisible si JS lent.
- Placeholders formulaire en 3,4:1 (advisory détecteur) — à corriger si on touche le formulaire.
- `side-tab` dans `BlogPost.astro` (hors homepage).

## Questions to Consider

- Si l’immersion 4 jours est l’entrée produit, pourquoi le header ne promet-il pas explicitement « 4 jours gratuits » ?
- La homepage doit-elle servir Persuade (une décision) et SEO profond (plusieurs liens hero) sur le même premier écran ?
- Les témoignages domicile renforcent-ils la confiance pour du 100 % en ligne ou créent-ils un doute sur l’achat ?
