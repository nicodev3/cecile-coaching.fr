# Pages de résultats du quiz RE-FLOW (GoHighLevel)

`ghl/reflow-resultats.html` remplace le contenu de l’élément **Custom Javascript/HTML**
de la page de résultats du funnel GHL. Il reprend le fonctionnement du bloc précédent
(généré par `ghl/build.mjs`, hors dépôt) et remplace le résultat court par les 4 pages
de résultats : Équilibre, Énergie, Reconnexion, Force.

## Installation dans GHL

1. Ouvrir la page de résultats du funnel, puis l’élément « Custom Javascript/HTML ».
2. Tout sélectionner dans l’éditeur et le remplacer par le contenu de `ghl/reflow-resultats.html`.
3. Enregistrer, publier, puis faire le quiz jusqu’au bout pour vérifier.

## Ce qui est conservé du bloc précédent

- Profil lu dans `localStorage['cecile-reflow-result']` (`{ v: 1, profile }`), sinon `?reflow_profil=`.
- Brouillon `cecile-reflow-quiz` effacé une fois le résultat affiché.
- Umami : `lead_submitted` à l’affichage, `booking_viewed` à la vue du calendrier ;
  Meta : `BookingViewed` (personnalisé).
- Calendrier `dJzUTOt5Rfugql6aVt4K` chargé à l’approche, prérempli avec `first_name`,
  `last_name`, `email`, `phone` s’ils sont dans l’URL ; iframe dans la page (slot) pour `form_embed.js`.
- Message « Ton résultat n’est pas disponible ici » et lien « Refaire le quiz » sans profil.
- Rendu dans un shadow DOM : les styles GHL ne s’appliquent pas au bloc.

## Personnalisation par les réponses

Les réponses viennent, dans cet ordre : de l’URL (`q1`…`q12`, valeurs `A`–`D`, `1`–`4` ou texte),
du résultat enregistré (`answers`), puis du brouillon du quiz
(`{ v: 1, answers: { energie: 2, mouvements: 1, … } }`, index 0–3). Le brouillon est lu avant
d’être effacé. Sans profil enregistré ni `reflow_profil`, le profil est calculé à partir
des 12 réponses avec le barème RE-FLOW (départage Q12 puis Q11).

| Profil | Points d’attention |
| --- | --- |
| Équilibre | Q1 = B/C/D · Q2 = B/C/D |
| Énergie | Q1 = C/D · Q3 = C/D · Q4 = B/C/D |
| Reconnexion | Q8 = B/C/D · Q9 = C/D · Q10 = D |
| Force | Q2 = B/C/D · Q3 = C/D · Q6 = C/D |

Identifiants des questions Q1 → Q12 : `energie`, `mouvements`, `endurance`, `recuperation`,
`travail`, `taches`, `loisirs`, `corps`, `reprise`, `apprehensions`, `besoin`, `projection`.
Si le quiz GHL utilise d’autres identifiants, modifier `QUESTION_IDS` en tête du bloc.

Débogage dans la console de la page :
`ReflowResultat.readInput(location.search, { result: localStorage['cecile-reflow-result'], draft: localStorage['cecile-reflow-quiz'] })`
(à lancer avant l’affichage, le brouillon étant effacé ensuite).

## Textes

Les textes des quatre profils sont dans l’objet `PROFILES` du bloc. Les espaces insécables
avant `; : ! ?` et à l’intérieur des guillemets sont ajoutés automatiquement.

## Vérification

`node --test tests/reflowResultats.test.mjs`

## E-mail de résultat

Le workflow GHL (déclencheur : tag `quiz-reflow`) envoyait `{{contact.resultat_quizz}}`.
Ce champ était rempli par l’ancienne fonction du site et n’est plus mis à jour : il ne faut
plus l’utiliser. Le workflow envoie désormais un e-mail par profil, choisi par une
condition Si/Sinon sur le champ `reflow_profil` (transmis par le formulaire du quiz).

Les 4 e-mails (`ghl/emails/email-<profil>.html`) sont générés depuis les textes de
`ghl/reflow-resultats.html` : après toute modification des textes, lancer
`node ghl/emails/build.mjs` puis recoller les e-mails dans GHL.
Le bouton de réservation préremplit le calendrier avec les merge fields du contact.
Les points d’attention (selon les réponses) sont calculés par la page du quiz
(`ghl/quiz-attention-snippet.js`, à insérer dans `mountLeadForm` juste avant
`url.searchParams.set('reflow_reponses', letters);`) et transmis au formulaire GHL
`qIGELjgbjbIvLCYZpQ5T` par le champ caché `reflow_attention`. L’e-mail affiche
`{{contact.reflow_attention}}` dans le bloc 02 ; vide, il ne se voit pas.
