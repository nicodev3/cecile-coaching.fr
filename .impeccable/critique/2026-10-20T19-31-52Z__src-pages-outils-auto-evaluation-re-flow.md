---
target: le quizz
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/nicolasdevaux/dev/sites_github/cecile-coaching.fr/src/pages/outils/auto-evaluation-re-flow"
timestamp: 2026-10-20T19-31-52Z
slug: src-pages-outils-auto-evaluation-re-flow
---
Method: dual-agent (A: 21695a7c-7f09-43e2-994e-c32d601ebdb1 · B: 314eec35-92d8-4038-b5c0-693c2fa208fd)

## Design Health Score

| # | Heuristique | Score | Enjeu |
|---|-------------|-------|-------|
| 1 | Visibilité de l'état | 3 | « Question N sur 12 » et avance auto. Aucun signe que les réponses survivent à un rechargement. |
| 2 | Correspondance au monde réel | 3 | Options concrètes (courses, aspirateur). « 2 minutes chrono », « solution Re-Flow » et l'emoji yoga parlent un autre métier. |
| 3 | Contrôle et liberté | 2 | « Précédent » restaure la réponse. Pas de « Quitter ». Après le profil, plus de retour. Recharger efface les 12 réponses. |
| 4 | Cohérence et standards | 3 | Pilules et tutoiement stables. Trois graphies (Re-flow, Re-Flow, RE-FLOW). H1 en extrabold, hors du titre Montserrat à 500. |
| 5 | Prévention des erreurs | 3 | Une réponse, « Suivant » bloqué, téléphone contrôlé. Rien n'annonce, avant la question 1, que le résultat se paie d'un numéro. |
| 6 | Reconnaissance plutôt que rappel | 3 | Quatre réponses visibles, coche restaurée. Le formulaire ne rappelle pas les réponses. |
| 7 | Flexibilité et efficacité | 2 | Avance au toucher et Entrée. Pas de reprise, pas de sortie. |
| 8 | Esthétique et minimalisme | 3 | Une question, quatre cartes. Les questions 2, 6 et 7 sont des paragraphes. L'intro double la promesse. |
| 9 | Récupération des erreurs | 3 | Soumission vide : messages en français sous chaque champ, focus sur le prénom. |
| 10 | Aide et documentation | 2 | Parenthèses utiles. L'avertissement « pas une évaluation médicale » arrive sur l'écran de résultat, derrière le formulaire. |
| **Total** | | **27/40** | **Acceptable** |

## Verdict de spécificité

**Évaluation design.** À moitié écrit pour RE-FLOW, à moitié quiz bien-être interchangeable. La palette, le tutoiement, le portrait de Cécile et les 12 questions (fatigue, courses, « peur d'en faire trop ») sont ancrés. La structure est un moule de quiz à lead : carte centrée, photo ronde, emoji, promesse « 2 minutes », quatre cartes Likert, puis « Ton profil est prêt ! » et un mur de coordonnées. Les noms de profils pourraient habiller n'importe quelle marque wellness. L'emoji, le chrono et la pose athlétique contredisent « vitalité sans violence ». Le texte riche des profils (priorité, guidance, petit pas) n'arrive jamais à l'écran.

**Scan déterministe.** `impeccable detect` sur `src/pages/outils/auto-evaluation-re-flow/index.astro` et `src/components/ReflowAssessment.astro` : exit 0, JSON `[]`, 0 règle. Le détecteur dans la page confirme « No anti-patterns found » sur l'intro et sur la question 1 (count 0). Il n'a rien vu que la revue ait manqué. Les problèmes sont de parcours et de promesse, pas d'anti-patterns de markup.

**Calques visuels.** L'injection de `detect.js` (port 8400) a réussi. La console dit « No anti-patterns found ». Aucun badge ni contour : il n'y a rien à surligner. Le serveur live a été arrêté avec `--keep-inject`.

## Impression générale

Le quizz se lit question par question, dans la voix de Cécile. Il trahit ensuite sa promesse : après 12 réponses, « Ton profil est prêt » n'ouvre qu'un formulaire, et les actions du profil ne s'affichent pas. La plus grande occasion est de montrer le profil entier avant toute coordonnée.

## Ce qui fonctionne

- Les cartes de réponse sont nettes : anneau plum, pastille, texte en semibold. La question 2 se distingue sans ambiguïté.
- Le vocabulaire est le sien : énergie variable, escaliers, courses, « j'ai peur d'en faire trop ». Le tutoiement tient jusqu'à « Recevoir mon bilan ».
- La progression est lisible (numéro, section, barre) et « Précédent » conserve la coche. Les erreurs du formulaire sont en français, sous le champ, sans vider la page.

## Problèmes prioritaires

### [P1] Le profil promis est une amorce, le paiement est le téléphone
**Pourquoi.** L'intro dit « découvre ton profil et les actions à mener ». L'écran suivant dit « Ton profil est prêt ! » puis « Pour obtenir tes résultats, renseigne tes coordonnées ». Quatre champs et une case de recontact commercial. Même l'écran d'après n'affiche pas les actions : une phrase, puis la réservation d'un bilan. Pour une visiteuse fatiguée, c'est le piège que « entrée sans risque » interdit.
**Fix.** Montrer le profil entier (phrase, priorité, petit pas) avant toute coordonnée. Réserver le téléphone à un bilan optionnel, avec une phrase du type « aucun engagement, tu peux t'arrêter ici ».
**Commande.** `/impeccable clarify`

### [P1] Pas de sortie, et les 12 réponses meurent
**Pourquoi.** Aucun « Quitter ». Pas de retour au site. « Précédent » est mort à la question 1. « Politique de confidentialité » quitte la page ; au retour, le quizz recommence à zéro. Après « Découvrir mon profil », impossible de corriger une réponse.
**Fix.** « Arrêter et revenir à l'accueil » à chaque question, « Revenir aux questions » sur le formulaire, confidentialité dans un nouvel onglet, réponses gardées dans le navigateur jusqu'à l'envoi.
**Commande.** `/impeccable harden`

### [P1] Les questions du milieu sont des murs de texte
**Pourquoi.** La question 6 empile libellé, parenthèse et quatre options dont une fait trois lignes sur téléphone. La question 7 empile quatre cartes de 94 à 116 px. Quatre choix, mais chaque choix est un paragraphe à comparer.
**Fix.** Une ligne par option, l'exemple en seconde ligne grise.
**Commande.** `/impeccable distill`

### [P2] Le ton d'entrée est un chrono sportif
**Pourquoi.** « 2 minutes chrono — 100 % gratuit », emoji yoga, portrait en tenue de sport. Le public a peur d'en faire trop. Le chrono dit le contraire.
**Fix.** Retirer le chrono et l'emoji. « Environ 2 minutes, tu peux t'arrêter », et une ligne APA sous le portrait.
**Commande.** `/impeccable quieter`

### [P2] « Précédent » flotte dans un vide, et la case est trop petite
**Pourquoi.** Les 12 questions partagent la hauteur de la plus longue (environ 634 px). Sur un viewport court, « Précédent » est coupé. La case de consentement fait 16×16 px.
**Fix.** Hauteur = question courante, barre d'actions collée en bas, case d'au moins 44 px.
**Commande.** `/impeccable layout`

## Charge cognitive

5 échecs sur 8 : charge haute. Tenu : focus unique, groupement, mémoire pendant les questions. En échec : le formulaire impose 5 décisions d'un coup ; l'écran « Ton profil est prêt » fête un résultat que le gris secondaire demande encore de payer ; profil, identité, téléphone et consentement arrivent ensemble ; les actions promises ne sont jamais montrées. Les 12 questions restent à 4 options. Le seul point au-dessus de 4 est l'écran lead.

## Parcours émotionnel

Le début est tiède, puis le chrono met une montre. Le milieu descend : questions 5 à 7 jusqu'à « Je n'ai plus la force de bouger », sans phrase de répit, et l'avance automatique pousse en moins d'une demi-seconde. Le pic attendu est le profil. Le pic réel est une amorce, puis la facture. L'avertissement médical arrive après le mur, trop tard pour rassurer au moment du numéro.

## Signaux personas

**Jordan (première fois).** « Commencer le quizz » est clair. Ensuite « 2 minutes chrono », douze questions lourdes, puis « Ton profil est prêt » sans dire ce que « Reconnexion » change, ni pourquoi le téléphone est obligatoire. Elle s'arrête sur « Recevoir mon bilan ».

**Sam (clavier, lecteur d'écran).** Vrais boutons radio, légende qui prend le focus, erreurs associées aux champs. La région live dit seulement « Question N sur 12 », pas le texte. Case de 16 px. Honeypot « Ne pas remplir » dans le DOM.

**Casey (mobile, une main).** Le bouton de départ (56 px) et les cartes sont atteignables. « Précédent » est coupé sur un viewport court. Le téléphone se tape. Quitter ou recharger perd tout.

**Léa (fatiguée, maladie chronique).** Le chrono met la pression. Les questions 4 à 7 font cocher la dépendance et l'écart, sans une phrase qui dit que c'est assez. La question 9 la reconnaît (« peur d'en faire trop »), puis l'écran suivant demande un rappel « au sujet de la solution ».

## Observations mineures

- « quizz » avec deux z dans le bouton et l'intro.
- Re-flow, Re-Flow et RE-FLOW coexistent.
- Placeholders « Marie », « Dupont », « marie@email.com ».
- Astérisque obligatoire en gris secondaire.
- « Plus que N questions » n'apparaît qu'à trois questions de la fin.
- « Suivant » est caché au premier toucher et visible au retour arrière.
- Le disclaimer médical est la dernière ligne de l'écran de résultat.

## Questions à considérer

- Si le profil complet s'affichait avant tout champ, que resterait-il à demander, et serait-ce encore un téléphone obligatoire ?
- À quoi ressemble ce quizz si on retire le chrono, l'emoji yoga et le mot « solution » ?
- Que se passe-t-il si Léa ferme le téléphone à la question 6 et veut reprendre demain ?
