---
target: le quiz (re-run)
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/nicolasdevaux/dev/sites_github/cecile-coaching.fr/src/pages/outils/auto-evaluation-re-flow"
timestamp: 2026-10-20T20-04-37Z
slug: src-pages-outils-auto-evaluation-re-flow
---
Method: dual-agent (A: 0654d59f-96ca-48dd-9e80-923ba29aa556 · B: 6dbdb04e-1434-411d-9ce6-e1ef200b1fbb)

## Design Health Score

| # | Heuristique | Score | Enjeu |
|---|-------------|-------|-------|
| 1 | Visibilité de l'état | 3 | Barre, section, aria-live, reprise brouillon. Pas d'indication tôt sur les 12 étapes ; auto-avance masque parfois « Suivant ». |
| 2 | Adéquation au monde réel | 4 | Langage vécu, APA, consentement explicite. |
| 3 | Contrôle et liberté | 3 | Précédent, localStorage, « Revenir à l'accueil ». Résultat complet toujours derrière le gate. |
| 4 | Cohérence et standards | 3 | Cartes homogènes. Q1/Q4/Q8–12 longues vs Q2–7 court+détail. Re-flow / Re-Flow / RE-FLOW. |
| 5 | Prévention des erreurs | 3 | Honeypot, validation lead, une réponse avant avance. |
| 6 | Reconnaissance plutôt que rappel | 3 | Une question visible, teaser au gate. Grille empilée = scroll inutile. |
| 7 | Flexibilité et efficacité | 2 | 12 clics, auto-avance utile au doigt, reprise = gain. |
| 8 | Esthétique et minimalisme | 3 | Intro plus quiet. Vide sous « Précédent » (hauteur = question la plus haute). Gate : 4 champs d'un coup. |
| 9 | Récupération après erreur | 3 | Brouillon, message réseau lead, gate restauré si quiz complet. |
| 10 | Aide et documentation | 2 | Disclaimer médical sur l'écran résultat seulement ; pas de « pourquoi le téléphone ? » |
| **Total** | | **29/40** | **Acceptable (proche Good)** |

## Verdict de spécificité

**Évaluation design.** Partiellement ancré RE-FLOW (~60 %). Le tutoiement, le portrait APA, les 12 questions et les profils ne sont pas interchangeables avec un quiz fitness. La grammaire visuelle (cartes radio, barre, gate lead) reste générique. Les passes récentes renforcent le produit : intro quiet, label + détail gris sur Q2–7, reprise localStorage. Il manque encore : options homogènes sur tout le questionnaire, hauteur de grille par question, narration du gate alignée avec « profil prêt ».

**Scan déterministe.** `impeccable detect` sur la page et `ReflowAssessment.astro` : exit 0, JSON `[]`. Dans le navigateur : « No anti-patterns found. » Aucun finding que la revue ait manqué.

**Calques visuels.** Injection `detect.js` (port 8400) réussie ; console propre ; serveur arrêté avec `--keep-inject`.

## Impression générale

**+2 points vs la critique du 20/10 (27 → 29/40).** Le milieu du parcours et la reprise sont nettement meilleurs pour une visiteuse fatiguée. Le pic-fin (gate après « Ton profil est prêt ! ») et la grille CSS qui réserve la hauteur de la question la plus longue restent les freins principaux. Le téléphone obligatoire n'a pas bougé (choix produit).

## Ce qui fonctionne

- Intro quiet + CTA « Commencer le quiz » : crédible, sans chrono ni emoji.
- Label court + détail gris (Q2–7) : scan plus rapide ; lead CRM via `optionAnswerLabel`.
- Brouillon + « Tu reprends là où tu t'étais arrêtée » + sorties accueil + politique en nouvel onglet.

## Problèmes prioritaires

### [P1] Vallée émotionnelle au gate
**Pourquoi.** « Ton profil est prêt ! » puis mur prénom, nom, email, téléphone. Rupture après 12 questions.
**Fix.** Séquencer : teaser profil → une phrase sur l'envoi du bilan par email → champs ; micro-copy sous le téléphone (sans le rendre optionnel si contrainte métier).
**Commande.** `/impeccable clarify` + `/impeccable layout`

### [P1] Vide vertical sous la navigation (ex. Q6)
**Pourquoi.** Les 12 questions partagent la hauteur de la plus longue ; scroll sans gain pour Léa.
**Fix.** Hauteur = question courante ou min-height dynamique.
**Commande.** `/impeccable layout`

### [P2] Pattern options inégal
**Pourquoi.** Q1, Q4, Q8–12 sans `detail` ; charge cognitive inégale.
**Fix.** Étendre label+détail ou raccourcir le reste.
**Commande.** `/impeccable distill`

### [P2] « 2 minutes pas plus » vs 12 questions + gate
**Pourquoi.** Jordan qui lit tout ressent un décalage promesse / durée.
**Fix.** « Environ 5 minutes » ou « 12 questions courtes » en gardant « 100 % gratuit ».
**Commande.** `/impeccable clarify`

### [P3] Disclaimer médical tardif
**Pourquoi.** Outil « capacités physiques » sans encart avant engagement.
**Fix.** Encart discret sous le CTA intro ou pied du quiz.
**Commande.** `/impeccable clarify` ou `/impeccable onboard`

## Charge cognitive

3 échecs sur 8 : chunking partiel, hiérarchie des cartes, gate qui empile profil + 4 champs + case. Les 12 questions restent à 4 options. En baisse vs avant grâce aux détails sur la moitié du questionnaire.

## Parcours émotionnel

Intro rassurante. Q6–7 = miroir fort. Gate = pic d'anticipation puis vallée (formulaire). Téléphone inchangé = mur d'énergie pour Léa après investissement.

## Signaux personas

**Jordan.** Deux paragraphes intro redondants ; « prêt » vs formulaire ambigu.

**Sam.** Clavier OK ; auto-avance 450 ms peut couper la lecture ; consentement long dans un label.

**Casey.** Reprise localStorage = gros plus ; gate = scroll pouce.

**Léa.** Q1 encore longue ; vide sous Précédent ; gate tel après effort émotionnel.

## Observations mineures

- Graphies Re-flow / Re-Flow / RE-FLOW.
- « Plus que N questions » seulement sur les 3 dernières.
- Teaser profil au gate bien calibré vs formulaire administratif.

## Questions à considérer

- Si le profil est prêt, que devrait voir Léa sans téléphone ?
- Fusionner 2–3 questions pour tenir la promesse temps ?
- La grille à hauteur fixe vaut-elle le scroll fantôme ?
