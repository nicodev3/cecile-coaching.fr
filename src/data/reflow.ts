/**
 * Auto-évaluation Re-flow — questionnaire d'auto-évaluation du
 * déconditionnement physique et de son incidence sur le quotidien,
 * pour les personnes touchées par une maladie chronique.
 *
 * 10 questions notées de 0 à 4 points -> score de 0 à 40, exprimé en %.
 * Ce n'est pas un diagnostic, ni un questionnaire clinique validé.
 * Re-flow n'agit pas sur la maladie ni les symptômes : il agit sur
 * le déconditionnement physique.
 * Module TS pur : importé côté serveur pour le rendu statique des questions
 * (SEO + fallback sans JS) et côté client pour le calcul du score.
 */

export type SectionKey = 'endurance' | 'capacites' | 'quotidien' | 'reprise';
export type ProfileKey = 'limite' | 'significatif' | 'important';
export type Tone = 'low' | 'mid' | 'high';

export interface Option {
	/** Libellé affiché sur la carte de réponse */
	label: string;
	/** Points attribués (0 à 4) */
	points: number;
}

export interface Question {
	/** Identifiant stable, utilisé comme name= des radios */
	id: string;
	/** Numéro affiché (1 à 10) */
	number: number;
	section: SectionKey;
	label: string;
	/** Précision affichée sous la question */
	hint?: string;
	options: readonly Option[];
}

export interface SectionLevel {
	/** Ratio maximal (score / maxScore) couvert par ce niveau, inclus */
	upTo: number;
	/** Ce que ce niveau veut dire, en clair */
	label: string;
	/** Teinte : high = déconditionnement plutôt limité, low = important */
	tone: Tone;
}

export interface Section {
	key: SectionKey;
	label: string;
	shortLabel: string;
	maxScore: number;
	caption: string;
	levels: readonly SectionLevel[];
	/** Paragraphe visible selon la dimension dominante */
	resultCopy: string;
	/** Phrase dans la zone floutée */
	advice: string;
	/** Transition vers Re-flow, dans le bloc de réservation */
	transitionCopy: string;
}

export const SCALE: readonly Option[] = [
	{ label: 'Pas du tout', points: 0 },
	{ label: 'Un peu', points: 1 },
	{ label: 'Modérément', points: 2 },
	{ label: 'Beaucoup', points: 3 },
	{ label: 'Énormément', points: 4 },
];

const IMPACT_LEVELS: readonly SectionLevel[] = [
	{ upTo: 0.33, label: 'Déconditionnement plutôt limité', tone: 'high' },
	{ upTo: 0.66, label: 'Déconditionnement significatif', tone: 'mid' },
	{ upTo: 1, label: 'Déconditionnement important', tone: 'low' },
];

export const SECTIONS: readonly Section[] = [
	{
		key: 'endurance',
		label: 'Endurance / Effort',
		shortLabel: 'Endurance / Effort',
		maxScore: 12,
		caption: 'Le coût de l’effort et l’endurance dans tes journées',
		levels: IMPACT_LEVELS,
		resultCopy:
			'C’est surtout du côté de l’endurance et du coût de l’effort que le déconditionnement apparaît le plus nettement. Des efforts autrefois ordinaires peuvent aujourd’hui demander davantage, et l’essoufflement arrive plus tôt.',
		advice:
			'Reconstruire l’endurance à partir de ce que ton corps tolère aujourd’hui, par petites doses répétables, est souvent plus utile que d’essayer d’en faire davantage d’un coup.',
		transitionCopy:
			'Ton résultat montre surtout comment ton endurance et le coût de l’effort pèsent aujourd’hui sur ton quotidien. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de reconstruire progressivement ton endurance, à partir de ce que ton corps peut faire maintenant.',
	},
	{
		key: 'capacites',
		label: 'Capacités / Mouvement',
		shortLabel: 'Capacités / Mouvement',
		maxScore: 8,
		caption: 'La force, la mobilité et le volume d’activités physiques',
		levels: IMPACT_LEVELS,
		resultCopy:
			'C’est surtout autour des capacités physiques et du mouvement que le déconditionnement se fait sentir. Force, mobilité ou volume d’activité ont pu baisser, et il n’est pas toujours simple de savoir par où les solliciter à nouveau.',
		advice:
			'Retrouver de la force et de la mobilité, à partir de ton niveau actuel et sans viser « comme avant », permet souvent de réélargir ce que le corps peut faire.',
		transitionCopy:
			'Ton résultat montre surtout comment tes capacités physiques et ton mouvement se sont réduits. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à retrouver progressivement de la force, de la mobilité et du volume d’activité, à ton rythme.',
	},
	{
		key: 'quotidien',
		label: 'Quotidien / Gestes',
		shortLabel: 'Quotidien / Gestes',
		maxScore: 12,
		caption: 'L’incidence du déconditionnement sur les gestes du quotidien',
		levels: IMPACT_LEVELS,
		resultCopy:
			'C’est surtout du côté du quotidien que le déconditionnement se fait sentir. Les gestes ordinaires — se déplacer, porter, tenir une journée — peuvent demander plus d’effort physique qu’avant, et limiter ce que tu arrives à faire.',
		advice:
			'Rendre les gestes du quotidien un peu moins coûteux est souvent le premier levier concret : c’est là que la condition physique retrouvée se remarque le plus.',
		transitionCopy:
			'Ton résultat montre surtout comment le déconditionnement pèse aujourd’hui sur tes gestes du quotidien. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à retrouver une condition physique qui rende ces gestes moins coûteux.',
	},
	{
		key: 'reprise',
		label: 'Reprise / Confiance',
		shortLabel: 'Reprise / Confiance',
		maxScore: 8,
		caption: 'Le rythme, le point de départ et la projection dans le mouvement',
		levels: IMPACT_LEVELS,
		resultCopy:
			'C’est surtout autour de la reprise et de la confiance dans le mouvement que le déconditionnement se fait sentir. Savoir à quel rythme bouger, et se projeter à partir de là où tu en es, n’est pas toujours évident.',
		advice:
			'Trouver un point de départ et un rythme soutenable, plutôt qu’un retour à « comme avant », ouvre souvent davantage de possibilités pour reprendre.',
		transitionCopy:
			'Ton résultat montre surtout à quel point il peut être difficile de reprendre le mouvement et de s’y projeter. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à trouver un point de départ et un rythme soutenable, à partir de ta condition actuelle.',
	},
];

export const SECTIONS_BY_KEY: Record<SectionKey, Section> = Object.fromEntries(
	SECTIONS.map((s) => [s.key, s]),
) as Record<SectionKey, Section>;

export const QUESTIONS: readonly Question[] = [
	{
		id: 'fatigue-effort',
		number: 1,
		section: 'endurance',
		label: 'Je suis rapidement fatiguée dès que je fais un effort physique.',
		options: SCALE,
	},
	{
		id: 'efforts-courants',
		number: 2,
		section: 'endurance',
		label:
			'Des efforts courants (marcher, monter des escaliers, porter un sac de courses) me demandent plus d\'efforts qu\'avant.',
		options: SCALE,
	},
	{
		id: 'recuperation-effort',
		number: 3,
		section: 'endurance',
		label: 'Après un effort physique, j’ai besoin de plus de temps qu’avant pour récupérer.',
		options: SCALE,
	},
	{
		id: 'perte-capacites',
		number: 4,
		section: 'capacites',
		label: 'J’ai l’impression d’avoir perdu de la force, de l’endurance ou de la mobilité.',
		options: SCALE,
	},
	{
		id: 'activites-reduites',
		number: 5,
		section: 'capacites',
		label: 'J’ai réduit ou arrêté des activités que je faisais avant (sport, jouer avec mes enfants, balades, etc.).',
		options: SCALE,
	},
	{
		id: 'taches-quotidien',
		number: 6,
		section: 'quotidien',
		label:
			'Certaines tâches du quotidien (ménage, courses, jardinage, travail etc.) me demandent plus d’efforts.',
		options: SCALE,
	},
	{
		id: 'etat-physique-limite',
		number: 7,
		section: 'quotidien',
		label: 'Mon état physique actuel limite ce que je peux faire dans une journée.',
		options: SCALE,
	},
	{
		id: 'adapter-quotidien',
		number: 8,
		section: 'quotidien',
		label:
			'Je dois adapter, reporter ou simplifier des activités du quotidien à cause de mon niveau d\'énergie actuel.',
		options: SCALE,
	},
	{
		id: 'rythme-reprise',
		number: 9,
		section: 'reprise',
		label: 'J’ai du mal à savoir à quel rythme reprendre une activité physique sans en faire trop.',
		options: SCALE,
	},
	{
		id: 'confiance-reprise',
		number: 10,
		section: 'reprise',
		label: 'J’ai du mal à me projeter dans une reprise du mouvement à partir de mes capacités actuelles.',
		options: SCALE,
	},
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
export const MIN_SCORE = 0;
export const MAX_SCORE = TOTAL_QUESTIONS * 4;
export const PERCENT_MAX = 100;

/**
 * Conservés pour que le script de navigation existant reste un no-op
 * (plus de questions sautées dans cette auto-évaluation).
 */
export const SKIP_TRIGGER_QUESTION_ID = '';
export const SKIP_TRIGGER_POINTS = 0;
export const SKIPPED_QUESTION_IDS: readonly string[] = [];

export interface Profile {
	key: ProfileKey;
	label: string;
	/** Bornes incluses, en pourcentage arrondi */
	min: number;
	max: number;
	range: string;
	summary: string;
	advice: readonly string[];
	tone: Tone;
}

export const PROFILES: readonly Profile[] = [
	{
		key: 'limite',
		label: 'Plutôt limité',
		min: 0,
		max: 33,
		range: '0 à 33 %',
		tone: 'high',
		summary:
			'Aujourd’hui, ta condition physique semble encore assez préservée. Le déconditionnement, s’il est présent, a une incidence plutôt limitée sur ton quotidien.',
		advice: [
			'Ce résultat n’est pas un verdict. Il décrit une période, et il peut évoluer d’une semaine à l’autre. Même un déconditionnement plutôt limité mérite d’être regardé avec attention : c’est souvent là qu’on peut préserver ce qui fonctionne déjà.',
			'L’auto-évaluation sert à repérer où ta condition physique pèse le plus en ce moment, pas à te situer sur une échelle de « réussite ».',
		],
	},
	{
		key: 'significatif',
		label: 'Significatif',
		min: 34,
		max: 66,
		range: '34 à 66 %',
		tone: 'mid',
		summary:
			'Ta condition physique semble aujourd’hui marquée par un déconditionnement significatif, avec une incidence réelle sur plusieurs aspects de ton quotidien.',
		advice: [
			'Ce n’est ni une fatalité ni une note. C’est un éclairage sur les domaines où ta condition physique semble aujourd’hui peser le plus. Beaucoup de femmes dans cette situation cherchent simplement un cadre plus adapté, pas un effort supplémentaire.',
			'Ce pourcentage ne mesure pas la gravité d’une maladie. Il dit seulement à quel point le déconditionnement physique influence actuellement ton quotidien.',
		],
	},
	{
		key: 'important',
		label: 'Important',
		min: 67,
		max: PERCENT_MAX,
		range: '67 à 100 %',
		tone: 'low',
		summary:
			'Le déconditionnement physique semble aujourd’hui important, et pèse nettement sur ce que tu peux faire au quotidien.',
		advice: [
			'Ce résultat ne dit pas qui tu es, ni ce que tu « devrais » faire. Il dit surtout que ta condition physique actuelle rend le quotidien plus coûteux. Être accompagnée pour la reconstruire progressivement n’est pas un aveu de faiblesse : c’est une façon de prendre soin de toi.',
			'Les seuils utilisés ici sont propres à l’expérience Re-flow. Ils ne correspondent à aucun seuil clinique validé.',
		],
	},
];

export const PROFILES_BY_KEY: Record<ProfileKey, Profile> = Object.fromEntries(
	PROFILES.map((p) => [p.key, p]),
) as Record<ProfileKey, Profile>;

export function toPercent(score: number, max = MAX_SCORE): number {
	if (max <= 0) return 0;
	return Math.round((score / max) * 100);
}

/** Paliers propres à Re-flow, appliqués au pourcentage arrondi. */
export function scoreToProfile(percent: number): Profile {
	if (percent <= 33) return PROFILES_BY_KEY.limite;
	if (percent <= 66) return PROFILES_BY_KEY.significatif;
	return PROFILES_BY_KEY.important;
}

export interface SubmittedAnswer {
	id: string;
	points: number;
}

export interface DimensionScore {
	key: SectionKey;
	label: string;
	score: number;
	maxScore: number;
	percent: number;
	levelLabel: string;
}

export interface ScoredAnswer {
	id: string;
	number: number;
	label: string;
	points: number;
	optionLabel: string;
	section: SectionKey;
}

export interface ScoredQuiz {
	totalScore: number;
	percent: number;
	profile: Profile;
	dimensions: readonly DimensionScore[];
	dominant: Section;
	answers: readonly ScoredAnswer[];
}

/**
 * Recalcule le résultat à partir des 10 réponses.
 * En cas d'égalité de ratio, la première dimension de SECTIONS l'emporte,
 * comme le parcours affiché dans le navigateur.
 * Retourne null si les réponses sont incomplètes ou incohérentes.
 */
export function scoreQuiz(raw: readonly SubmittedAnswer[]): ScoredQuiz | null {
	if (raw.length !== QUESTIONS.length) return null;

	const pointsById = new Map<string, number>();
	for (const item of raw) {
		if (!item || typeof item.id !== 'string') return null;
		if (!Number.isInteger(item.points) || item.points < 0 || item.points > 4) return null;
		if (pointsById.has(item.id)) return null;
		pointsById.set(item.id, item.points);
	}

	let totalScore = 0;
	const sectionScores = new Map<SectionKey, number>();
	const answers: ScoredAnswer[] = [];

	for (const question of QUESTIONS) {
		const points = pointsById.get(question.id);
		if (points === undefined) return null;
		const option = question.options.find((entry) => entry.points === points);
		if (!option) return null;
		totalScore += points;
		sectionScores.set(question.section, (sectionScores.get(question.section) ?? 0) + points);
		answers.push({
			id: question.id,
			number: question.number,
			label: question.label,
			points,
			optionLabel: option.label,
			section: question.section,
		});
	}

	const percent = toPercent(totalScore);
	const profile = scoreToProfile(percent);
	let dominant: Section = SECTIONS[0];
	let dominantRatio = -1;

	const dimensions: DimensionScore[] = SECTIONS.map((section) => {
		const score = sectionScores.get(section.key) ?? 0;
		const ratio = section.maxScore > 0 ? score / section.maxScore : 0;
		if (ratio > dominantRatio) {
			dominantRatio = ratio;
			dominant = section;
		}
		const sectionPercent = Math.round(Math.min(1, Math.max(0, ratio)) * 100);
		const levelRatio = sectionPercent / 100;
		const level =
			section.levels.find((entry) => levelRatio <= entry.upTo) ??
			section.levels[section.levels.length - 1];
		return {
			key: section.key,
			label: section.label,
			score,
			maxScore: section.maxScore,
			percent: sectionPercent,
			levelLabel: level.label,
		};
	});

	return { totalScore, percent, profile, dimensions, dominant, answers };
}
