/**
 * Auto-évaluation Re-flow — questionnaire d'auto-évaluation du
 * déconditionnement physique et de son incidence sur le quotidien,
 * pour les personnes touchées par une maladie chronique.
 *
 * 12 questions, 4 réponses chacune.
 * Les 9 premières sont notées de 0 à 3 points -> score de 0 à 27, exprimé en %.
 * Les 3 dernières (appréhension, besoin, projection) ne sont pas une échelle :
 * elles personnalisent la lecture, sans entrer dans le pourcentage.
 * Ce n'est pas un diagnostic, ni un questionnaire clinique validé.
 * Re-flow n'agit pas sur la maladie ni les symptômes : il agit sur
 * le déconditionnement physique.
 * Module TS pur : importé côté serveur pour le rendu statique des questions
 * (SEO + fallback sans JS) et côté client pour le calcul du score.
 */

export type SectionKey =
	| 'energie'
	| 'mouvements'
	| 'endurance'
	| 'recuperation'
	| 'travail'
	| 'quotidien'
	| 'loisirs'
	| 'corps'
	| 'reprise';
export type ProfileKey = 'limite' | 'significatif' | 'important';
export type Tone = 'low' | 'mid' | 'high';

export interface Option {
	/** Libellé affiché sur la carte de réponse */
	label: string;
	/** Points attribués (0 à 3) */
	points: number;
}

export interface Question {
	/** Identifiant stable, utilisé comme name= des radios */
	id: string;
	/** Numéro affiché (1 à 12) */
	number: number;
	/** Thème affiché dans la progression */
	progressLabel: string;
	/**
	 * Dimension notée. Absente pour les questions qui ne mesurent pas
	 * le déconditionnement (appréhension, besoin, projection).
	 */
	section?: SectionKey;
	label: string;
	/** Titre dans le résultat, pour les questions hors score */
	resultTitle?: string;
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

/** Quatre réponses : 0 % , 33 % , 67 % , 100 % de la dimension. */
const answerLevels = (
	preserved: string,
	mild: string,
	marked: string,
	severe: string,
): readonly SectionLevel[] => [
	{ upTo: 0, label: preserved, tone: 'high' },
	{ upTo: 0.33, label: mild, tone: 'mid' },
	{ upTo: 0.67, label: marked, tone: 'low' },
	{ upTo: 1, label: severe, tone: 'low' },
];

export const SECTIONS: readonly Section[] = [
	{
		key: 'energie',
		label: 'Ton énergie',
		shortLabel: 'Énergie',
		maxScore: 3,
		caption: 'Ton niveau d’énergie au quotidien',
		levels: answerLevels(
			'Énergie globalement suffisante',
			'Énergie variable',
			'Fatigue fréquente, énergie à économiser',
			'Fatigue très présente, quotidien très sédentaire',
		),
		resultCopy:
			'C’est surtout du côté de l’énergie que le déconditionnement se fait sentir. La fatigue prend de la place, et les journées se construisent souvent en économisant ce qu’il reste.',
		advice:
			'Repartir de l’énergie réellement disponible, plutôt que de celle que tu aimerais avoir, permet souvent de bouger sans creuser la fatigue.',
		transitionCopy:
			'Ton résultat montre surtout comment ton énergie pèse aujourd’hui sur tes journées. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à retrouver un mouvement compatible avec l’énergie que tu as vraiment.',
	},
	{
		key: 'mouvements',
		label: 'Tes mouvements',
		shortLabel: 'Mouvements',
		maxScore: 3,
		caption: 'L’aisance dans les gestes du quotidien',
		levels: answerLevels(
			'Mouvements sans restriction',
			'Mouvements moins fluides',
			'Certains mouvements limités',
			'Force insuffisante pour bouger',
		),
		resultCopy:
			'C’est surtout autour des mouvements que le déconditionnement se fait sentir. Se lever, fléchir, lever les bras ou marcher peut demander plus d’attention, et certains gestes sont devenus moins fluides, voire évités.',
		advice:
			'Remobiliser les gestes du quotidien, à partir de ce que tu peux faire sans forcer, est souvent le premier pas pour retrouver de l’aisance.',
		transitionCopy:
			'Ton résultat montre surtout comment tes mouvements se sont restreints. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à retrouver des gestes plus fluides, à partir de là où tu en es.',
	},
	{
		key: 'endurance',
		label: 'Ton endurance',
		shortLabel: 'Endurance',
		maxScore: 3,
		caption: 'La capacité à tenir un effort courant',
		levels: answerLevels(
			'Effort prolongé possible',
			'Vitesse à réduire',
			'Effort souvent interrompu',
			'Effort prolongé impossible',
		),
		resultCopy:
			'C’est surtout du côté de l’endurance que le déconditionnement apparaît. Un effort courant — escaliers, marche, pédalage — peut obliger à ralentir, à t’arrêter, ou être devenu trop difficile à tenir.',
		advice:
			'Reconstruire l’endurance par de courts efforts répétés, à une intensité que tu peux tenir, est souvent plus utile que de chercher à aller plus loin d’un coup.',
		transitionCopy:
			'Ton résultat montre surtout comment ton endurance limite les efforts courants. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de reconstruire progressivement ta capacité à tenir un effort, à ton rythme.',
	},
	{
		key: 'recuperation',
		label: 'Ta récupération',
		shortLabel: 'Récupération',
		maxScore: 3,
		caption: 'Le temps nécessaire pour récupérer après un effort',
		levels: answerLevels(
			'Récupération rapide',
			'Pause plus longue qu’avant',
			'Repos le reste de la journée',
			'Plusieurs jours pour récupérer',
		),
		resultCopy:
			'C’est surtout la récupération qui marque le déconditionnement. Après un effort un peu plus intense, le corps a besoin de davantage de temps — parfois le reste de la journée, parfois plusieurs jours — avant de pouvoir enchaîner.',
		advice:
			'Choisir des efforts dont tu peux récupérer, plutôt que des efforts dont tu mets plusieurs jours à revenir, permet souvent de progresser sans t’épuiser.',
		transitionCopy:
			'Ton résultat montre surtout le temps dont ton corps a besoin pour récupérer. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à trouver un effort dont la récupération reste compatible avec tes journées.',
	},
	{
		key: 'travail',
		label: 'Impact sur le travail',
		shortLabel: 'Travail',
		maxScore: 3,
		caption: 'L’incidence de ta condition physique sur l’activité professionnelle',
		levels: answerLevels(
			'Sans incidence sur le travail',
			'Efficacité parfois réduite',
			'Poste ou temps de travail aménagé',
			'Travail devenu impossible',
		),
		resultCopy:
			'C’est surtout sur le travail que le déconditionnement se voit. Ta condition physique peut réduire ton efficacité, avoir imposé un aménagement, ou rendre l’activité professionnelle difficile, voire impossible.',
		advice:
			'Tenir compte de ce que le travail demande déjà au corps évite souvent d’ajouter un effort qui n’a plus de place dans la journée.',
		transitionCopy:
			'Ton résultat montre surtout comment ta condition physique pèse sur ton activité professionnelle. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à reconstruire une condition physique compatible avec ce que tes journées de travail exigent déjà.',
	},
	{
		key: 'quotidien',
		label: 'Tâches du quotidien',
		shortLabel: 'Quotidien',
		maxScore: 3,
		caption: 'Courses, ménage, jardinage, bricolage',
		levels: answerLevels(
			'Tâches faites sans y penser',
			'Tâches plus coûteuses qu’avant',
			'Aide parfois nécessaire',
			'Tâches devenues impossibles',
		),
		resultCopy:
			'C’est surtout sur les tâches du quotidien que le déconditionnement se fait sentir. Courses, ménage ou bricolage peuvent demander plus d’effort, de l’aide, ou être devenus trop difficiles à faire seule.',
		advice:
			'Rendre quelques tâches du quotidien un peu moins coûteuses est souvent le premier signe qu’une condition physique se reconstruit.',
		transitionCopy:
			'Ton résultat montre surtout comment tes capacités physiques pèsent sur les tâches du quotidien. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à retrouver assez d’aisance pour ces gestes, à partir de là où tu en es.',
	},
	{
		key: 'loisirs',
		label: 'Loisirs et vie sociale',
		shortLabel: 'Loisirs',
		maxScore: 3,
		caption: 'Sport, sorties, balades, temps en famille',
		levels: answerLevels(
			'Loisirs non freinés',
			'Tu suis moins facilement',
			'Activités adaptées ou reportées',
			'Activités souvent abandonnées',
		),
		resultCopy:
			'C’est surtout sur les loisirs et la vie sociale que le déconditionnement se voit. Tu peux avoir du mal à suivre, devoir adapter ou reporter, ou renoncer à des activités que tu aimes.',
		advice:
			'Garder une place, même petite, pour une activité qui te tient à cœur évite souvent de te sentir à l’écart.',
		transitionCopy:
			'Ton résultat montre surtout comment ta condition physique pèse sur tes loisirs et ta vie sociale. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à retrouver une condition compatible avec ce que tu as envie de continuer à vivre.',
	},
	{
		key: 'corps',
		label: 'Ton rapport au corps',
		shortLabel: 'Corps',
		maxScore: 3,
		caption: 'L’aisance, les sensations et la confiance',
		levels: answerLevels(
			'Plutôt à l’aise',
			'Sensations parfois difficiles à lire',
			'Confiance difficile',
			'Repères perdus',
		),
		resultCopy:
			'C’est surtout le rapport à ton corps qui marque le déconditionnement. Les signaux peuvent être difficiles à lire, la confiance fragile, ou les repères perdus.',
		advice:
			'Réapprendre à sentir ce que le corps tolère, sans le forcer, ouvre souvent une reprise plus sûre.',
		transitionCopy:
			'Ton résultat montre surtout à quel point le lien avec ton corps s’est distendu. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à retrouver des repères et de la confiance, à partir de tes sensations actuelles.',
	},
	{
		key: 'reprise',
		label: 'Reprise de l’activité',
		shortLabel: 'Reprise',
		maxScore: 3,
		caption: 'Où tu en es quand tu penses à reprendre',
		levels: answerLevels(
			'Prête et plutôt confiante',
			'Envie, sans savoir par où commencer',
			'Envie, avec la peur d’en faire trop',
			'Reprise très inquiétante',
		),
		resultCopy:
			'C’est surtout l’idée de reprendre une activité physique qui pèse. L’envie peut être là, sans point de départ clair, avec la peur d’en faire trop, ou avec beaucoup d’inquiétude.',
		advice:
			'Un point de départ très simple, dont tu sais à l’avance jusqu’où aller, rend souvent la reprise moins inquiétante.',
		transitionCopy:
			'Ton résultat montre surtout où tu en es face à la reprise. L’objectif de Re-flow n’est pas d’agir sur la maladie : c’est de t’aider à trouver un premier pas qui reste soutenable.',
	},
];

export const SECTIONS_BY_KEY: Record<SectionKey, Section> = Object.fromEntries(
	SECTIONS.map((s) => [s.key, s]),
) as Record<SectionKey, Section>;

const CHOICES = (a: string, b: string, c: string, d: string): readonly Option[] => [
	{ label: a, points: 0 },
	{ label: b, points: 1 },
	{ label: c, points: 2 },
	{ label: d, points: 3 },
];

export const QUESTIONS: readonly Question[] = [
	{
		id: 'energie',
		number: 1,
		progressLabel: 'Ton énergie',
		section: 'energie',
		label: 'Comment décrirais-tu ton niveau d’énergie au quotidien ?',
		options: CHOICES(
			'J’ai globalement assez d’énergie et je peux faire ce que je veux',
			'Mon énergie est très variable, il y a des jours avec et des jours sans',
			'Je me sens souvent fatiguée et je dois économiser mon énergie',
			'Ma fatigue prend une grande place dans mon quotidien et me rend très sédentaire',
		),
	},
	{
		id: 'mouvements',
		number: 2,
		progressLabel: 'Tes mouvements',
		section: 'mouvements',
		label:
			'Comment décrirais-tu tes gestes du quotidien (se lever, fléchir les jambes, lever les bras, monter les genoux, s’accroupir, marcher…) ?',
		options: CHOICES(
			'Je bouge avec aisance sans restriction de mobilité, ni douleur',
			'Je bouge mais je sens que ce n’est plus comme avant, mes mouvements sont moins fluides, je me sens rouillée',
			'Je limite certains mouvements par manque d’énergie, appréhension ou inconfort',
			'Je n’ai plus la force de bouger',
		),
	},
	{
		id: 'endurance',
		number: 3,
		progressLabel: 'Ton endurance',
		section: 'endurance',
		label:
			'Rencontres-tu des difficultés à maintenir un effort courant (monter les escaliers, marcher, pédaler…) pendant plusieurs minutes ?',
		options: CHOICES(
			'Je peux fournir un effort prolongé sans problème',
			'Je peux marcher ou pédaler pendant plusieurs minutes mais je suis obligée de diminuer la vitesse',
			'Quand je fournis un effort prolongé, je dois m’arrêter à plusieurs reprises parce que je n’ai plus de force ou pour reprendre mon souffle',
			'Il m’est devenu impossible de fournir un effort prolongé',
		),
	},
	{
		id: 'recuperation',
		number: 4,
		progressLabel: 'Ta récupération',
		section: 'recuperation',
		label:
			'Comment te sens-tu après avoir fourni un effort physique un peu plus intense que d’habitude ? (marcher longtemps, monter plusieurs étages, porter une charge lourde…)',
		options: CHOICES(
			'Je peux enchaîner très rapidement avec une autre activité',
			'J’ai besoin d’un temps de pause plus long qu’avant pour récupérer',
			'Je me repose le reste de la journée',
			'Il me faut plusieurs jours pour récupérer',
		),
	},
	{
		id: 'travail',
		number: 5,
		progressLabel: 'Impact sur le travail',
		section: 'travail',
		label:
			'Aujourd’hui, dans quelle mesure ta condition physique influence-t-elle ton activité professionnelle ?',
		options: CHOICES(
			'Ma condition physique n’a aucune incidence sur mon activité professionnelle',
			'Il arrive que ma condition physique me rende moins efficace dans mon travail',
			'J’ai été contrainte d’aménager mon poste de travail ou mon temps de travail, voire de changer d’emploi',
			'Ma condition physique ne me permet plus de travailler',
		),
	},
	{
		id: 'taches',
		number: 6,
		progressLabel: 'Impact sur les tâches du quotidien',
		section: 'quotidien',
		label:
			'Actuellement, en quoi tes capacités physiques influencent-elles tes activités du quotidien ? (courses, ménage, jardinage, bricolage…)',
		options: CHOICES(
			'J’effectue les tâches du quotidien sans y penser',
			'Les tâches courantes me demandent plus d’efforts qu’avant (les sacs de courses me semblent plus lourds, je mets plus de temps à passer l’aspirateur…)',
			'Il m’arrive de demander de l’aide pour certaines tâches, je me sens de moins en moins autonome',
			'Faire les courses ou le ménage est devenu impossible pour moi, je suis dépendante de quelqu’un d’autre pour qu’elles soient faites',
		),
	},
	{
		id: 'loisirs',
		number: 7,
		progressLabel: 'Impact sur les loisirs et la vie sociale',
		section: 'loisirs',
		label:
			'Aujourd’hui, dans quelle mesure ta condition physique influence-t-elle tes activités de loisirs ? (activités sportives, associatives, sorties entre amis, balades en famille, jeu avec les enfants…)',
		options: CHOICES(
			'Ma condition physique actuelle ne me freine pas dans mes activités de loisir',
			'Je ne me prive d’aucune de mes activités de loisir ou sorties entre amis ou en famille, mais j’ai du mal à suivre, je me sens à la traîne',
			'Je suis contrainte d’adapter mes activités habituelles de loisir à ma condition physique ou de les reporter',
			'Je dois souvent renoncer à des activités que j’affectionne par manque de force ou d’énergie et je me sens à l’écart',
		),
	},
	{
		id: 'corps',
		number: 8,
		progressLabel: 'Comment tu te sens dans ton corps',
		section: 'corps',
		label: 'Aujourd’hui, quel est ton rapport avec ton corps ?',
		options: CHOICES(
			'Je me sens plutôt à l’aise dans mon corps',
			'J’ai parfois du mal à percevoir les signaux qu’il m’envoie, à identifier mes sensations',
			'J’ai du mal à lui faire confiance',
			'J’ai l’impression d’avoir perdu mes repères',
		),
	},
	{
		id: 'reprise',
		number: 9,
		progressLabel: 'Reprise de l’activité physique',
		section: 'reprise',
		label: 'Quand tu penses à reprendre une activité physique, quelle phase te correspond le mieux ?',
		options: CHOICES(
			'Je me sens prête à essayer et plutôt confiante',
			'J’en ai envie mais je ne sais pas par où commencer',
			'J’en ai envie mais j’ai peur d’en faire trop ou de mal faire',
			'L’idée de reprendre une activité physique m’inquiète beaucoup',
		),
	},
	{
		id: 'apprehensions',
		number: 10,
		progressLabel: 'Tes appréhensions',
		resultTitle: 'Ce qui te ferait le plus hésiter',
		label: 'Qu’est-ce qui te ferait le plus hésiter à reprendre une activité physique ?',
		options: CHOICES(
			'Ne pas réussir à tenir dans la durée',
			'Aggraver ma fatigue, mes douleurs ou dépasser mes limites',
			'Ne pas être assez forte ou en forme et ne pas être capable de suivre',
			'Faire des exercices qui ne seraient pas adaptés à ma situation',
		),
	},
	{
		id: 'besoin',
		number: 11,
		progressLabel: 'Ton besoin d’accompagnement',
		resultTitle: 'Ce dont tu as le plus besoin',
		label: 'De quoi as-tu le plus besoin pour réussir à reprendre une activité physique ?',
		options: CHOICES(
			'Un programme simple que je peux suivre à mon rythme',
			'D’une pratique modulable selon mon niveau d’énergie',
			'Être guidée pour savoir jusqu’où je peux aller',
			'D’un accompagnement global pour retrouver progressivement confiance',
		),
	},
	{
		id: 'projection',
		number: 12,
		progressLabel: 'Et si tu te projetais un peu…',
		resultTitle: 'Dans 4 mois, tu aimerais pouvoir dire',
		label: 'Dans 4 mois, qu’aimerais-tu pouvoir dire ?',
		options: CHOICES(
			'« Je bouge régulièrement sans que cela devienne une contrainte »',
			'« Je me sens plus forte et plus capable physiquement »',
			'« J’ai retrouvé confiance dans mon corps »',
			'« Je me sens mieux dans mon corps et dans ma tête »',
		),
	},
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
export const SCORED_QUESTIONS = QUESTIONS.filter((question) => question.section);
export const MIN_SCORE = 0;
export const MAX_SCORE = SCORED_QUESTIONS.reduce(
	(sum, question) => sum + Math.max(...question.options.map((option) => option.points)),
	0,
);
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
		max: 20,
		range: '0 à 20 %',
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
		min: 21,
		max: 60,
		range: '21 à 60 %',
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
		min: 61,
		max: PERCENT_MAX,
		range: '61 à 100 %',
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
	if (percent <= 20) return PROFILES_BY_KEY.limite;
	if (percent <= 60) return PROFILES_BY_KEY.significatif;
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
	section: SectionKey | null;
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
 * Recalcule le résultat à partir des 12 réponses.
 * Seules les questions rattachées à une dimension entrent dans le pourcentage.
 * En cas d'égalité de ratio, la première dimension de SECTIONS l'emporte,
 * comme le parcours affiché dans le navigateur.
 * Retourne null si les réponses sont incomplètes ou incohérentes.
 */
export function scoreQuiz(raw: readonly SubmittedAnswer[]): ScoredQuiz | null {
	if (raw.length !== QUESTIONS.length) return null;

	const pointsById = new Map<string, number>();
	for (const item of raw) {
		if (!item || typeof item.id !== 'string') return null;
		if (!Number.isInteger(item.points) || item.points < 0 || item.points > 3) return null;
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
		if (question.section) {
			totalScore += points;
			sectionScores.set(question.section, (sectionScores.get(question.section) ?? 0) + points);
		}
		answers.push({
			id: question.id,
			number: question.number,
			label: question.label,
			points,
			optionLabel: option.label,
			section: question.section ?? null,
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
