# Pages de résultats du quiz RE-FLOW (GoHighLevel)

Le fichier `ghl/reflow-resultats.html` est un bloc autonome (HTML, CSS, JS) à coller
dans un élément **Code personnalisé** de la page de résultats du funnel GHL
(`https://cecile-coaching.fr/quiz` → étape « Résultats »). Il n’est pas servi par le site Astro.

Une seule page GHL suffit : le bloc affiche le bon profil parmi Équilibre, Énergie,
Reconnexion et Force, les points d’attention correspondant aux réponses, puis l’appel
bilan offert avec le calendrier `dJzUTOt5Rfugql6aVt4K` prérempli.

## Données attendues

Le bloc lit les données dans cet ordre :

1. `window.REFLOW_RESULT`, en tête du bloc, pour les merge fields GHL ;
2. les paramètres de l’URL de la page ;
3. à défaut de profil, le barème RE-FLOW appliqué aux 12 réponses (Q12 puis Q11 départagent).

| Paramètre | Valeurs acceptées |
| --- | --- |
| `profil` | `equilibre`, `energie`, `reconnexion`, `force` (majuscules, accents et « Profil … » tolérés) |
| `q1` … `q12` | `A`–`D`, `1`–`4`, ou le texte de la réponse |
| `first_name`, `last_name`, `email`, `phone` | préremplissage du calendrier (le prénom s’affiche aussi en tête) |

Un merge field non remplacé (`{{contact.…}}`) est ignoré. Sans profil ni 12 réponses,
la page affiche un message neutre et le calendrier.

Exemple : `…/resultats?profil=energie&q1=C&q3=D&q4=B&first_name=Marie&email=marie%40exemple.fr`

## Points d’attention

| Profil | Règles |
| --- | --- |
| Équilibre | Q1 = B/C/D · Q2 = B/C/D |
| Énergie | Q1 = C/D · Q3 = C/D · Q4 = B/C/D |
| Reconnexion | Q8 = B/C/D · Q9 = C/D · Q10 = D |
| Force | Q2 = B/C/D · Q3 = C/D · Q6 = C/D |

Le bloc n’apparaît que si au moins une règle s’applique (titre au pluriel s’il y en a plusieurs).

## Brancher le quiz GHL

Deux montages possibles, selon ce que le quiz sait transmettre :

- **Redirection par résultat** : dans les réglages de résultats du quiz, rediriger chaque
  résultat vers la page de résultats avec `?profil=<clé>` et, si GHL le permet, les réponses
  `q1…q12` et les coordonnées en paramètres.
- **Champs du contact** : si les réponses sont enregistrées dans des champs personnalisés,
  remplir `window.REFLOW_RESULT` en tête du bloc avec les merge fields
  (`profil: '{{contact.reflow_profil}}'`, `answers: { q1: '{{contact.reflow_q1}}', … }`).

Pour vérifier dans la console du navigateur :
`ReflowResultat.readInput(location.search, window.REFLOW_RESULT)`.

## Textes

Les textes des quatre profils sont dans l’objet `PROFILES` du bloc. Les espaces insécables
avant `; : ! ?` et à l’intérieur des guillemets sont ajoutés automatiquement à l’affichage.

## Vérification

`node --test tests/reflowResultats.test.mjs`
