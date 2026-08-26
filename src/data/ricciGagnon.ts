/**
 * Test de Ricci et Gagnon - questionnaire d'auto-évaluation du niveau d'activité physique.
 * D'après J. Ricci et L. Gagnon (Université de Montréal),
 * modifié par F. Laureyns et J.-M. Séné.
 *
 * 9 questions notées de 1 à 5 points -> score de 9 à 45.
 * Module TS pur : importé côté serveur pour le rendu statique des questions
 * (SEO + fallback sans JS) et côté client pour le calcul du score.
 */

export type SectionKey = 'sedentarite' | 'loisir' | 'quotidien';
export type ProfileKey = 'inactif' | 'actif' | 'tres-actif';

export interface Option {
	/** Libellé affiché sur la carte de réponse */
	label: string;
	/** Points attribués (1 à 5) */
	points: number;
}

export interface Question {
	/** Identifiant stable, utilisé comme name= des radios */
	id: string;
	/** Numéro affiché (1 à 9) */
	number: number;
	section: SectionKey;
	label: string;
	/** Précision affichée sous la question */
	hint?: string;
	options: readonly Option[];
}

export interface Section {
	key: SectionKey;
	/** Libellé tel qu'il figure dans le questionnaire original */
	label: string;
	/** Libellé court pour les cartes de sous-score */
	shortLabel: string;
	/** Score maximal de la section */
	maxScore: number;
}

export const SECTIONS: readonly Section[] = [
	{
		key: 'sedentarite',
		label: 'Comportements sédentaires',
		shortLabel: 'Sédentarité',
		maxScore: 5,
	},
	{
		key: 'loisir',
		label: 'Activités physiques de loisir (dont sports)',
		shortLabel: 'Loisir',
		maxScore: 20,
	},
	{
		key: 'quotidien',
		label: 'Activités physiques quotidiennes',
		shortLabel: 'Quotidien',
		maxScore: 20,
	},
];

export const SECTIONS_BY_KEY: Record<SectionKey, Section> = Object.fromEntries(
	SECTIONS.map((s) => [s.key, s]),
) as Record<SectionKey, Section>;

const minutesOptions: readonly Option[] = [
	{ label: 'Moins de 15 min', points: 1 },
	{ label: '16 à 30 min', points: 2 },
	{ label: '31 à 45 min', points: 3 },
	{ label: '46 à 60 min', points: 4 },
	{ label: 'Plus de 60 min', points: 5 },
];

export const QUESTIONS: readonly Question[] = [
	{
		id: 'assise',
		number: 1,
		section: 'sedentarite',
		label: 'Combien de temps passez-vous en position assise par jour ?',
		hint: 'Loisirs, télé, ordinateur, travail, etc.',
		options: [
			{ label: '+ de 5 h', points: 1 },
			{ label: '4 à 5 h', points: 2 },
			{ label: '3 à 4 h', points: 3 },
			{ label: '2 à 3 h', points: 4 },
			{ label: 'Moins de 2 h', points: 5 },
		],
	},
	{
		id: 'pratique',
		number: 2,
		section: 'loisir',
		label: 'Pratiquez-vous régulièrement une ou des activités physiques ?',
		options: [
			{ label: 'Non', points: 1 },
			{ label: 'Oui', points: 5 },
		],
	},
	{
		id: 'frequence',
		number: 3,
		section: 'loisir',
		label: 'À quelle fréquence pratiquez-vous l’ensemble de ces activités ?',
		options: [
			{ label: '1 à 2 fois / mois', points: 1 },
			{ label: '1 fois / semaine', points: 2 },
			{ label: '2 fois / semaine', points: 3 },
			{ label: '3 fois / semaine', points: 4 },
			{ label: '4 fois / semaine', points: 5 },
		],
	},
	{
		id: 'duree',
		number: 4,
		section: 'loisir',
		label: 'Combien de minutes consacrez-vous en moyenne à chaque séance d’activité physique ?',
		options: minutesOptions,
	},
	{
		id: 'effort',
		number: 5,
		section: 'loisir',
		label: 'Habituellement, comment percevez-vous votre effort ?',
		hint: 'Le chiffre 1 représente un effort très facile, et le 5 un effort difficile.',
		options: [
			{ label: '1 — très facile', points: 1 },
			{ label: '2 — facile', points: 2 },
			{ label: '3 — modéré', points: 3 },
			{ label: '4 — soutenu', points: 4 },
			{ label: '5 — difficile', points: 5 },
		],
	},
	{
		id: 'travail',
		number: 6,
		section: 'quotidien',
		label: 'Quelle intensité d’activité physique votre travail requiert-il ?',
		options: [
			{ label: 'Légère', points: 1 },
			{ label: 'Modérée', points: 2 },
			{ label: 'Moyenne', points: 3 },
			{ label: 'Intense', points: 4 },
			{ label: 'Très intense', points: 5 },
		],
	},
	{
		id: 'travaux',
		number: 7,
		section: 'quotidien',
		label:
			'En dehors de votre travail régulier, combien d’heures consacrez-vous par semaine aux travaux légers ?',
		hint: 'Bricolage, jardinage, ménage, etc.',
		options: [
			{ label: 'Moins de 2 h', points: 1 },
			{ label: '3 à 4 h', points: 2 },
			{ label: '5 à 6 h', points: 3 },
			{ label: '7 à 9 h', points: 4 },
			{ label: 'Plus de 10 h', points: 5 },
		],
	},
	{
		id: 'marche',
		number: 8,
		section: 'quotidien',
		label: 'Combien de minutes par jour consacrez-vous à la marche ?',
		options: minutesOptions,
	},
	{
		id: 'etages',
		number: 9,
		section: 'quotidien',
		label: 'Combien d’étages, en moyenne, montez-vous à pied chaque jour ?',
		options: [
			{ label: 'Moins de 2', points: 1 },
			{ label: '3 à 5', points: 2 },
			{ label: '6 à 10', points: 3 },
			{ label: '11 à 15', points: 4 },
			{ label: 'Plus de 16', points: 5 },
		],
	},
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
export const MIN_SCORE = TOTAL_QUESTIONS;
export const MAX_SCORE = TOTAL_QUESTIONS * 5;

/**
 * Si la réponse à la question 2 est « Non », les questions 3, 4 et 5 n'ont pas de sens :
 * elles sont sautées et comptées 1 point chacune (score minimal de la section loisir).
 */
export const SKIP_TRIGGER_QUESTION_ID = 'pratique';
export const SKIP_TRIGGER_POINTS = 1;
export const SKIPPED_QUESTION_IDS: readonly string[] = ['frequence', 'duree', 'effort'];

export interface Profile {
	key: ProfileKey;
	label: string;
	/** Bornes incluses */
	min: number;
	max: number;
	/** Bornes formatées pour l'affichage */
	range: string;
	summary: string;
	advice: readonly string[];
}

export const PROFILES: readonly Profile[] = [
	{
		key: 'inactif',
		label: 'Inactif',
		min: MIN_SCORE,
		max: 17,
		range: 'moins de 18',
		summary:
			'Ton quotidien laisse aujourd’hui peu de place au mouvement, et la position assise y occupe une grande part.',
		advice: [
			'Ce score n’est pas un verdict et encore moins un reproche. Il décrit une période, pas une personne — et beaucoup de choses peuvent l’expliquer : une maladie chronique, une fatigue installée, des douleurs, un traitement, un travail assis, ou simplement une longue traversée difficile.',
			'Ce qui fait bouger ce chiffre, ce ne sont pas les grandes résolutions, mais les tout petits gestes répétés : quelques minutes de marche, se lever plus souvent, monter un étage à pied, une mobilisation douce le matin. Ce sont eux qui changent le quotidien, pas les séances héroïques.',
			'Si l’idée de « faire du sport » te semble hors de portée en ce moment, c’est une information utile, pas un échec. Commencer là où tu es reste la seule façon de commencer.',
		],
	},
	{
		key: 'actif',
		label: 'Actif',
		min: 18,
		max: 35,
		range: 'entre 18 et 35',
		summary:
			'Le mouvement fait déjà partie de ton quotidien, avec une base sur laquelle tu peux t’appuyer.',
		advice: [
			'Tu as une activité régulière ou un quotidien suffisamment actif pour entretenir ta condition physique. C’est une base solide, surtout si ton énergie varie d’un jour à l’autre.',
			'À ce niveau, l’enjeu n’est plus d’en faire davantage mais de tenir dans la durée : de la régularité plutôt que de l’intensité, des versions allégées pour les jours difficiles, et de la variété — endurance douce, renforcement, mobilité.',
			'Regarde tes trois sous-scores : c’est souvent le déséquilibre entre eux qui est le plus parlant. Beaucoup de séances mais un quotidien très assis, ou l’inverse, n’appellent pas les mêmes ajustements.',
		],
	},
	{
		key: 'tres-actif',
		label: 'Très actif',
		min: 36,
		max: MAX_SCORE,
		range: 'plus de 35',
		summary:
			'Ton niveau d’activité physique est élevé, à la fois dans tes séances et dans ta vie de tous les jours.',
		advice: [
			'Ton quotidien et ta pratique sont largement actifs. À ce niveau, la question utile n’est plus la quantité mais la récupération : sommeil, jours de repos, intensité réellement soutenable sur plusieurs mois.',
			'Si tu vis avec une maladie chronique ou une fatigue fluctuante, un score élevé mérite d’être relu avec attention. Maintenir un rythme soutenu malgré les signaux du corps expose au surmenage et, parfois, au malaise post-effort.',
			'Un bon repère : es-tu capable de lever le pied un jour donné sans culpabilité ? Si la réponse est non, c’est souvent là que se joue la suite, bien plus que dans le nombre de séances.',
		],
	},
];

export const PROFILES_BY_KEY: Record<ProfileKey, Profile> = Object.fromEntries(
	PROFILES.map((p) => [p.key, p]),
) as Record<ProfileKey, Profile>;

/** Barème officiel : moins de 18 = inactif, 18 à 35 = actif, plus de 35 = très actif. */
export function scoreToProfile(score: number): Profile {
	if (score < 18) return PROFILES_BY_KEY.inactif;
	if (score <= 35) return PROFILES_BY_KEY.actif;
	return PROFILES_BY_KEY['tres-actif'];
}
