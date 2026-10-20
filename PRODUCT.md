# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Audience visée (confirmée)** : **femmes** en France qui :

- ont ou ont eu une **maladie chronique** ;
- vivent un **déconditionnement physique** ;
- ressentent de la **fatigue** ;
- ou vivent des **douleurs** qui limitent le mouvement.

Le site et RE-FLOW s’adressent à elles en priorité ; le copy peut nommer ces quatre dimensions sans les réduire à une seule pathologie.

**Situation typique** : fatigue cognitive, peur de « trop en faire », perte de confiance dans le corps, besoin d’un cadre APA doux et progressif, souvent après un parcours médical ou une pause longue.

**Job to be done** : reprendre une relation au corps sans culture performance, comprendre si l’accompagnement en ligne convient, puis s’engager à son rythme.

## Product Purpose

**RE-FLOW** est le programme de coaching en **Activité Physique Adaptée (APA)** proposé par **Cécile Cichosz**, coach sportive diplômée d’État (BPJEPS) et certifiée APA, en **100 % en ligne** (visio + ressources à domicile).

Le site **cecilecoaching.fr** (marque **RE-FLOW**) sert à :

1. Expliquer la méthode (déconditionnement, progression, cadre APA).
2. Faire tester l’offre sans friction (**immersion gratuite 4 jours** via tunnel externe).
3. Permettre une auto-qualification légère (**quiz / auto-évaluation**).
4. Convertir vers contact (formulaire, WhatsApp, échange) quand la personne a besoin d’humain avant de s’engager.

**Succès produit (marketing)** : une visiteuse comprend en quelques secondes l’entrée sans risque (immersion ou quiz), perçoit la crédibilité APA, et passe à l’action sans surcharge cognitive.

## Positioning

Ce que les voisins ne peuvent pas copier tels quels :

- Un **programme APA structuré 4 mois** (48 séances guidées, suivi hebdomadaire en visio) pensé pour **maladie chronique / fatigue**, pas du coaching fitness générique.
- Le récit **« sortir du cercle vicieux du déconditionnement »** et l’ancrage **RE-FLOW** (reconnexion corporelle sans violence).
- **Cécile Cichosz** comme visage, certification APA, preuves terrain (témoignages, contenus pédagogiques piliers + blog).

## Operating Context

- **Langue** : français (tutoiement sur le site vitrine).
- **Canal principal post-clic** : tunnel sur `cecile-coaching.fr` (GoHighLevel) avec UTM depuis le site (`src/utils/tunnelUrl.ts`).
- **Canaux secondaires** : WhatsApp, formulaire contact (`/api/contact`), email coach.
- **Hébergement** : site statique Astro, déploiement Cloudflare Pages ; domaine canonique **https://cecilecoaching.fr** (sans tiret).
- **SEO / contenu** : piliers (`src/data/pillars.ts`), articles blog (`src/content/blog/`), outil auto-évaluation (`/outils/auto-evaluation-re-flow/`).

## Capabilities and Constraints

**Confirmé**

- Site vitrine multi-pages (accueil, programme, à propos, contact, outils, blog, pages piliers SEO).
- **Entrées produit co-primaires** (décision init du 2026-10-20) : **immersion gratuite 4 jours** + **auto-évaluation (quiz)** ; contact/WhatsApp en secondaire mais indispensable.
- **Tarif** : **sur devis / échange uniquement** — pas de prix public sur le site.
- Données légales coach dans `src/consts.ts` (SIRET, adresse, APE).
- Analytics / events (ex. Umami) sur les CTAs tunnel et quiz.

**Contraintes techniques**

- Ne pas dupliquer secrets dans le dépôt ; formulaire contact selon stack Nicodev.
- Trailing slash obligatoire sur les routes Astro.

**Non décidé / à ne pas inventer**

- Fourchette tarifaire publique (explicitement exclue pour l’instant).
- Claims chiffrés de résultats santé non présents dans les sources du repo.

## Brand Commitments

- **Nom programme** : RE-FLOW.
- **Nom personne** : Cécile Cichosz (Cécile Cichosz coaching / cecilecoaching.fr).
- **Ton** : bienveillant, concret, APA, anti-performance, tutoiement.
- **Tagline footer** (existant) : « Vitalité sans violence » — ne pas contredire sans accord.
- **Instagram** : `@cecile.c.oaching` (lien dans `src/consts.ts`).

## Evidence on Hand

| Type | Où |
|------|-----|
| Copy programme, durée, modalités | `src/components/WhatYouGet.astro`, `Pricing.astro`, pages piliers |
| Portrait / hero coach | `src/assets/`, `AboutCoach.astro` |
| Témoignages | `src/components/Testimonials.astro` |
| Articles & guides SEO | `src/content/blog/`, piliers |
| Mentions légales, confidentialité | pages dédiées |
| Auto-évaluation | `src/pages/outils/auto-evaluation-re-flow/` |

**Absences à respecter** : pas de logos clients enterprise, pas de garanties médicales, pas de prix catalogue tant que la politique « sur demande » tient.

## Product Principles

1. **Douceur avant intensité** — toute promesse doit rester compatible fatigue / maladie chronique.
2. **Une entrée sans risque** — immersion 4 jours et quiz sont des rampes, pas des pièges commerciaux.
3. **Clarté APA** — distinguer coach APA, kiné, coach sportif ; ne pas mélanger les rôles.
4. **Humain quand c’est flou** — tarif, éligibilité, peur : orienter vers échange confidentiel plutôt que friction.
5. **Vérité du 100 % en ligne** — ne pas laisser témoignages ou copy suggérer un produit domicile si l’offre vendue est visio.

## Accessibility & Inclusion

- Public souvent en **fatigue cognitive** : hiérarchie claire, peu de choix simultanés, langage plain.
- Site déjà partiellement sensible au **mouvement réduit** (`prefers-reduced-motion`, `motion-reduce:`).
- Objectif : maintenir **WCAG AA** sur textes et contrôles (voir audits `better-accessibility` / `/impeccable audit`).
