# Questionnaire Re-flow

Le barème et les textes des quatre profils sont dans `src/data/reflow.ts`.
Les réponses envoyées contiennent l’identifiant de question et `optionIndex`
(A = 0, B = 1, C = 2, D = 3). Les 12 réponses sont obligatoires.
Le même calcul est utilisé dans le navigateur, l’aperçu local et la fonction Pages.

Les maximums calculés depuis le barème sont Reconnexion 22, Énergie 23,
Force 22, Équilibre 23. Les ratios sont comparés par produits croisés,
sans arrondi. En cas d’égalité, les points de la réponse à Q12 départagent
les profils ex æquo, puis ceux de Q11. Si cela ne suffit pas, l’ordre stable
Reconnexion, Énergie, Force, Équilibre s’applique. Q12-D favorise ainsi
Reconnexion (2 points) puis Énergie (1 point), uniquement s’ils sont ex æquo.
Les scores restent internes et ne figurent ni sur le résultat ni dans le
champ GoHighLevel destiné au mail.

## Vérification

Avec Node 24 : `node --test tests/reflow.test.mjs`.
Les tests comprennent 20 parcours fictifs, la normalisation, le départage
par Q12 et Q11, le repli stable et le rejet des réponses incohérentes.
Build : `npm run build`. Vérification Astro : `npm exec astro check`.

Simulation de 100 000 réponses uniformément aléatoires (générateur LCG,
graine 321, multiplicateur 1664525, incrément 1013904223, modulo 2^32) :

| Profil | Résultats |
| --- | ---: |
| Reconnexion | 32 124 |
| Énergie | 40 095 |
| Force | 20 551 |
| Équilibre | 7 230 |

Cette simulation ne représente pas une population réelle. Le barème fourni
est conservé ; la fréquence du profil Équilibre sera à observer sur des
réponses représentatives.

## GoHighLevel

Les secrets existants restent `GHL_PRIVATE_TOKEN`, `GHL_LOCATION_ID` et
`GHL_RESULT_FIELD_ID`. Le prénom, le nom, l’email et le téléphone sont obligatoires pour l’upsert.
Le téléphone français est normalisé au format E.164. Après validation, le
widget de réservation GoHighLevel est chargé dans une iframe, préremplie
avec ces quatre coordonnées. Refaire le test supprime le widget précédent.
Le champ résultat reçoit un texte court pour le mail : le profil, une phrase,
la priorité et le petit pas. Il ne contient ni score, ni réponses, ni lien vers
le programme. Une note interne conserve le détail du profil et les 12 réponses.

À chaque questionnaire, les anciens tags de profil/dimension du quiz sont
retirés, puis `quiz-reflow` et un seul des tags `quiz-reconnexion`,
`quiz-energie`, `quiz-force`, `quiz-equilibre` sont appliqués.
Un échec de suppression des tags empêche de déclencher un résultat ambigu.

Le code ne contient pas d’envoi direct d’email. Le workflow existant sur
`quiz-reflow` notifie Cécile. **Pour tenir la promesse de réception du résultat,
vérifier/configurer dans GoHighLevel un email à la participante utilisant le
champ `GHL_RESULT_FIELD_ID`, et adapter les éventuelles conditions sur les
anciens tags.** Aucun workflow distant n’a été modifié par ce changement.

`astro dev` utilise un aperçu local : aucune écriture GoHighLevel et aucun
email. Redémarrer le serveur de développement après cette migration si son
module serveur conserve l’ancien format de réponses en cache.

## Funnel Umami

Le script Umami est déjà chargé par `BaseHead.astro`. Le quiz envoie les
événements suivants, dans cet ordre pour un parcours réussi :

| Étape | Événement | Déclenchement |
| --- | --- | --- |
| Début | `quiz_started` | Première réponse du questionnaire |
| Questions | `quiz_question_01_answered` à `quiz_question_12_answered` | Première réponse à chaque question pendant ce passage |
| Formulaire affiché | `quiz_completed` | Les 12 réponses sont validées et le formulaire de coordonnées apparaît |
| Envoi tenté | `quiz_lead_attempted` | Formulaire valide, juste avant l’appel API |
| Résultat affiché | `lead_submitted` | Appel API réussi et résultat affiché |

Les événements de diagnostic `quiz_lead_invalid` et `quiz_lead_failed`
indiquent respectivement un formulaire invalide (y compris un rejet 400 de
l’API) et une erreur d’envoi. Ils ne sont pas des étapes du funnel principal.
Modifier une réponse déjà donnée ou revenir en arrière ne répète pas le jalon
de cette question. « Refaire le test » ouvre un nouveau passage et réactive
les jalons. Aucun choix, score ou coordonnée personnelle n’est envoyé à Umami.

Après déploiement, dans le site concerné sur Umami, ouvrir **Insights > Funnel**,
créer un funnel, puis ajouter des étapes de type **Triggered event** avec les
noms exacts ci-dessus. Pour une vue rapide : `quiz_started`,
`quiz_question_04_answered`, `quiz_question_08_answered`,
`quiz_question_12_answered`, `quiz_completed`, `quiz_lead_attempted`,
`lead_submitted`. Pour repérer précisément la question où l’on perd des
participants, créer aussi un funnel avec `quiz_started`, les douze événements
de questions dans l’ordre, puis `quiz_completed` et `lead_submitted`. Régler
la fenêtre entre étapes à 60 minutes pour commencer ; l’ajuster si le quiz est
souvent interrompu puis repris plus tard. Sélectionner une période commençant
après le déploiement : les nouveaux jalons ne sont pas rétroactifs.

Contrôler dans **Events** qu’un parcours de test produit chaque événement une
fois et dans le bon ordre. Le funnel compte les visiteurs qui atteignent les
étapes dans l’ordre ; les événements de diagnostic se consultent séparément
dans **Events**. L’affichage du widget de réservation envoie `booking_viewed`,
sans confirmer qu’un créneau a été pris. La confirmation est mesurée sur
`/merci-rendez-vous/` via `booking_confirmed` (et l’événement Meta `Schedule`).
Configurer dans GoHighLevel la redirection après réservation vers
`https://cecilecoaching.fr/merci-rendez-vous/`.

## Meta Pixel

Le script Meta Pixel est chargé en production par `BaseHead.astro` lorsque
`META_PIXEL_ID` est renseigné dans `src/config/analytics.ts`. Un `PageView`
est envoyé automatiquement sur chaque page. Le quiz envoie en plus :

| Étape | Événement Meta | Type |
| --- | --- | --- |
| Quiz visible | `ViewContent` | Standard |
| Première réponse | `QuizStarted` | Custom |
| Formulaire affiché | `QuizCompleted` | Custom |
| Lead envoyé | `Lead` | Standard |
| Calendrier visible | `BookingViewed` | Custom |
| Réservation confirmée (`/merci-rendez-vous/`) | `Schedule` | Standard |

Les paramètres `content_name=quiz_reflow` et `content_category=quiz`
accompagnent ces événements. Aucune coordonnée personnelle n’est envoyée au
Pixel. Pour les campagnes Meta, configurer la conversion principale sur
`Lead`, et `Schedule` uniquement comme conversion de rendez-vous confirmé.
Vérifier avec l’extension Meta Pixel Helper après déploiement.
