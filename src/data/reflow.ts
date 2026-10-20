/** Questionnaire d’orientation Re-flow : 12 questions, 4 profils, scores internes. */
export const PROFILE_KEYS = ['reconnexion', 'energie', 'force', 'equilibre'] as const;
export type ProfileKey = (typeof PROFILE_KEYS)[number];
export type ProfilePoints = Readonly<Record<ProfileKey, number>>;

export interface Option {
	label: string;
	/** Exemple ou précision, affiché sous le libellé court. */
	detail?: string;
}
export interface Question {
	id: string;
	number: number;
	progressLabel: string;
	label: string;
	hint?: string;
	options: readonly Option[];
}

type ChoiceInput = string | Option;

const CHOICES = (...items: [ChoiceInput, ChoiceInput, ChoiceInput, ChoiceInput]): readonly Option[] =>
	items.map((item) => (typeof item === 'string' ? { label: item } : item));

/** Libellé transmis avec le lead : la précision reste lisible hors de l’écran. */
export const optionAnswerLabel = (option: Option) =>
	option.detail ? `${option.label} — ${option.detail}` : option.label;

export const QUESTIONS: readonly Question[] = [
	{
		id: 'energie',
		number: 1,
		progressLabel: 'Ton énergie',
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
		label: 'Comment décrirais-tu tes gestes du quotidien (se lever, s’accroupir, marcher…) ?',
		options: CHOICES(
			{ label: 'Je bouge avec aisance', detail: 'Sans restriction, ni douleur' },
			{ label: 'Ce n’est plus comme avant', detail: 'Moins fluide, je me sens rouillée' },
			{ label: 'Je limite certains mouvements', detail: 'Manque d’énergie, appréhension ou inconfort' },
			'Je n’ai plus la force de bouger',
		),
	},
	{
		id: 'endurance',
		number: 3,
		progressLabel: 'Ton endurance',
		label:
			'Rencontres-tu des difficultés à maintenir un effort courant (monter les escaliers, marcher, pédaler…) pendant plusieurs minutes ?',
		options: CHOICES(
			'Je tiens un effort prolongé sans problème',
			{ label: 'Je tiens, mais je ralentis', detail: 'Plusieurs minutes, à vitesse réduite' },
			{ label: 'Je dois m’arrêter plusieurs fois', detail: 'Plus de force, ou pour reprendre mon souffle' },
			'Un effort prolongé m’est devenu impossible',
		),
	},
	{
		id: 'recuperation',
		number: 4,
		progressLabel: 'Ta récupération',
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
		label:
			'Aujourd’hui, dans quelle mesure ta condition physique influence-t-elle ton activité professionnelle ?',
		options: CHOICES(
			'Aucune incidence sur mon travail',
			'Parfois moins efficace au travail',
			{ label: 'J’ai dû aménager mon travail', detail: 'Poste, temps, voire un autre emploi' },
			'Je ne peux plus travailler',
		),
	},
	{
		id: 'taches',
		number: 6,
		progressLabel: 'Impact sur les tâches du quotidien',
		label: 'Aujourd’hui, comment te débrouilles-tu avec les tâches du quotidien (courses, ménage, jardinage…) ?',
		options: CHOICES(
			'Je les fais sans y penser',
			{ label: 'Elles me demandent plus d’effort qu’avant', detail: 'Courses plus lourdes, plus de temps pour passer l’aspirateur' },
			{ label: 'Je demande parfois de l’aide', detail: 'Je me sens de moins en moins autonome' },
			{ label: 'Je n’y arrive plus seule', detail: 'Je dépends de quelqu’un pour les courses ou le ménage' },
		),
	},
	{
		id: 'loisirs',
		number: 7,
		progressLabel: 'Impact sur les loisirs et la vie sociale',
		label: 'Ta condition physique freine-t-elle tes loisirs (sport, sorties, balades, enfants…) ?',
		options: CHOICES(
			'Non, elle ne me freine pas',
			{ label: 'Je continue, mais je suis à la traîne', detail: 'J’ai du mal à suivre amis et famille' },
			{ label: 'J’adapte ou je reporte', detail: 'Mes activités habituelles ne passent plus telles quelles' },
			{ label: 'Je renonce souvent', detail: 'Plus assez de force, je me sens à l’écart' },
		),
	},
	{
		id: 'corps',
		number: 8,
		progressLabel: 'Comment tu te sens dans ton corps',
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
		label:
			'Quand tu penses à reprendre une activité physique, quelle phase te correspond le mieux ?',
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

const points = (
	reconnexion: number,
	energie: number,
	force: number,
	equilibre: number,
): ProfilePoints => ({ reconnexion, energie, force, equilibre });

/** Barème fourni, dans l’ordre A / B / C / D. Aucune réponse n’est une note globale. */
export const SCORING: Readonly<Record<string, readonly ProfilePoints[]>> = {
	energie: [points(0, 0, 0, 2), points(1, 3, 0, 0), points(1, 3, 1, 0), points(2, 3, 1, 0)],
	mouvements: [points(0, 0, 0, 2), points(1, 0, 2, 0), points(2, 1, 1, 0), points(1, 0, 3, 0)],
	endurance: [points(0, 0, 0, 2), points(0, 1, 2, 0), points(0, 2, 2, 0), points(0, 2, 3, 0)],
	recuperation: [points(0, 0, 0, 2), points(0, 2, 0, 0), points(0, 3, 0, 0), points(1, 3, 1, 0)],
	travail: [points(0, 0, 0, 2), points(0, 1, 1, 0), points(0, 1, 2, 0), points(0, 2, 3, 0)],
	taches: [points(0, 0, 0, 2), points(0, 1, 1, 0), points(0, 1, 2, 0), points(0, 2, 3, 0)],
	loisirs: [points(0, 0, 0, 2), points(0, 2, 1, 0), points(1, 1, 1, 0), points(2, 2, 1, 0)],
	corps: [points(0, 0, 0, 2), points(2, 0, 0, 0), points(3, 0, 0, 0), points(3, 0, 0, 0)],
	reprise: [points(0, 0, 0, 2), points(2, 0, 0, 0), points(3, 0, 0, 0), points(3, 1, 0, 0)],
	apprehensions: [points(0, 2, 0, 0), points(0, 3, 0, 0), points(0, 0, 3, 0), points(3, 0, 0, 0)],
	besoin: [points(0, 0, 0, 2), points(0, 3, 0, 0), points(2, 0, 1, 0), points(3, 0, 0, 0)],
	projection: [points(0, 0, 0, 3), points(0, 0, 3, 0), points(3, 0, 0, 0), points(2, 1, 0, 0)],
};

/** Calculés depuis le barème pour éviter toute dérive des dénominateurs. */
export const MAX_SCORES = Object.fromEntries(
	PROFILE_KEYS.map((key) => [
		key,
		QUESTIONS.reduce((sum, q) => sum + Math.max(...SCORING[q.id].map((p) => p[key])), 0),
	]),
) as Record<ProfileKey, number>;

export interface SubmittedAnswer {
	id: string;
	/** Position de la réponse : A = 0, B = 1, C = 2, D = 3. */
	optionIndex: number;
}

export interface ScoredQuiz {
	profile: Profile;
	scores: Record<ProfileKey, number>;
	percentages: Record<ProfileKey, number>;
	answers: Array<SubmittedAnswer & { number: number; label: string; optionLabel: string }>;
}

/**
 * Compare les ratios exacts (produits croisés), sans arrondi avant classement.
 * Une égalité est départagée par les points de Q12, puis ceux de Q11,
 * uniquement parmi les profils encore ex æquo. Ultime repli : ordre PROFILE_KEYS.
 */
export function scoreQuiz(raw: readonly SubmittedAnswer[]): ScoredQuiz | null {
	if (!Array.isArray(raw) || raw.length !== TOTAL_QUESTIONS) return null;
	const byId = new Map<string, number>();
	for (const answer of raw) {
		if (!answer || typeof answer.id !== 'string' || byId.has(answer.id)) return null;
		if (!Number.isInteger(answer.optionIndex) || answer.optionIndex < 0 || answer.optionIndex > 3)
			return null;
		byId.set(answer.id, answer.optionIndex);
	}
	const scores: Record<ProfileKey, number> = { reconnexion: 0, energie: 0, force: 0, equilibre: 0 };
	const answers: ScoredQuiz['answers'] = [];
	for (const q of QUESTIONS) {
		const optionIndex = byId.get(q.id);
		if (optionIndex === undefined) return null;
		for (const key of PROFILE_KEYS) scores[key] += SCORING[q.id][optionIndex][key];
		answers.push({
			id: q.id,
			optionIndex,
			number: q.number,
			label: q.label,
			optionLabel: optionAnswerLabel(q.options[optionIndex]),
		});
	}
	const ranked = [...PROFILE_KEYS].sort((a, b) => {
		const difference = scores[b] * MAX_SCORES[a] - scores[a] * MAX_SCORES[b];
		if (difference !== 0) return difference;
		for (const id of ['projection', 'besoin']) {
			const selected = SCORING[id][byId.get(id)!];
			if (selected[b] !== selected[a]) return selected[b] - selected[a];
		}
		return PROFILE_KEYS.indexOf(a) - PROFILE_KEYS.indexOf(b);
	});
	const percentages = Object.fromEntries(
		PROFILE_KEYS.map((key) => [key, (scores[key] / MAX_SCORES[key]) * 100]),
	) as Record<ProfileKey, number>;
	return { profile: PROFILES.find((p) => p.key === ranked[0])!, scores, percentages, answers };
}

export interface Profile {
	key: ProfileKey;
	label: string;
	description: string;
	summary: string;
	intro: readonly string[];
	priority: string;
	guidance: readonly string[];
	approach: readonly string[];
	smallStep: readonly string[];
	invitation: string;
}

export const PROFILES: readonly Profile[] = [
	{
		key: 'reconnexion',
		label: 'Reconnexion',
		description: 'Retrouver confiance dans son corps, ses sensations et ses capacités.',
		summary:
			'Tu as besoin de retrouver confiance dans ton corps avant de chercher à aller plus loin.',
		intro: [
			'Aujourd’hui, tu as peut-être l’impression d’avoir perdu certains de tes repères.',
			'Tu ne sais plus toujours quand bouger, quand ralentir ou jusqu’où aller. Certains mouvements te demandent davantage d’attention et l’idée de reprendre une activité physique peut susciter de l’appréhension.',
			'Et quand on ne fait plus vraiment confiance à son corps, on peut progressivement réduire ses activités… et perdre encore un peu plus confiance en ses capacités.',
		],
		priority: 'Retrouver progressivement des repères et de la sécurité dans le mouvement.',
		guidance: [
			'Il ne s’agit pas de faire toujours plus.',
			'Il s’agit d’apprendre à écouter ton corps, reconnaître ses signaux, respecter ses limites et redécouvrir petit à petit ce dont tu es capable.',
		],
		approach: [
			'Pendant 16 semaines, tu es accompagnée à travers une combinaison de Pilates, yoga, renforcement musculaire et relaxation, avec des séances pensées pour s’adapter à tes capacités et à ton énergie.',
			'Pas de performance. Pas de pression. Une progression à ton rythme.',
		],
		smallStep: [
			'Prends 5 minutes pour bouger doucement, sans objectif de performance.',
			'Observe simplement :',
			'Qu’est-ce qui est facile aujourd’hui ?',
			'Qu’est-ce qui demande davantage d’effort ?',
			'Comment est-ce que je me sens après ?',
		],
		invitation: 'Tu as envie de retrouver confiance dans ton corps ?',
	},
	{
		key: 'energie',
		label: 'Énergie',
		description: 'Apprendre à bouger en respectant son niveau d’énergie et sa récupération.',
		summary:
			'Ton principal enjeu est de retrouver une activité physique qui respecte ton énergie.',
		intro: [
			'Tu sais peut-être que bouger pourrait te faire du bien… mais ton énergie n’est pas toujours prévisible.',
			'Certains jours, tu as envie et tu peux en faire davantage. D’autres jours, ton corps t’impose de ralentir.',
			'Et lorsque l’on ne sait pas comment adapter son activité, on peut facilement tomber dans le « trop » puis devoir récupérer longtemps… ou finir par ne plus bouger du tout.',
		],
		priority: 'Apprendre à bouger avec ton énergie plutôt que contre elle.',
		guidance: [
			'L’objectif n’est pas d’en faire toujours plus.',
			'C’est de trouver ce que tu peux faire aujourd’hui, en tenant compte de ton état du moment, puis de construire progressivement à partir de là.',
		],
		approach: [
			'Les séances sont conçues pour être progressives et modulables, afin de te permettre d’adapter l’intensité à ton niveau d’énergie.',
			'Pilates, yoga, renforcement musculaire et relaxation te permettent de remettre progressivement du mouvement dans ton quotidien sans faire de la performance ton objectif.',
		],
		smallStep: [
			'Avant une activité physique, ne te demande pas :',
			'« Combien dois-je faire ? »',
			'Demande-toi plutôt :',
			'« Quel niveau d’effort est réaliste pour moi aujourd’hui ? »',
		],
		invitation: 'Tu aimerais apprendre à bouger sans épuiser ton énergie ?',
	},
	{
		key: 'force',
		label: 'Force',
		description:
			'Reconstruire progressivement ses capacités physiques et se sentir à nouveau capable.',
		summary:
			'Tu as envie de retrouver des capacités physiques et de te sentir à nouveau capable.',
		intro: [
			'Ta condition physique a peut-être changé au fil du temps.',
			'Certains efforts sont devenus plus difficiles, ton endurance a diminué ou tu as l’impression d’avoir perdu de la force.',
			'Et lorsque le corps ne suit plus comme avant, cela peut aussi affecter la confiance que l’on a en ses propres capacités.',
		],
		priority: 'Reconstruire progressivement ta force et tes capacités physiques.',
		guidance: [
			'Pas besoin de repartir là où tu en étais avant.',
			'Ton point de départ actuel est le bon point de départ.',
			'L’objectif est de progresser étape par étape, sans brûler les étapes ni chercher à reproduire immédiatement ce que tu faisais auparavant.',
		],
		approach: [
			'Le programme associe renforcement musculaire, Pilates, yoga et relaxation pour reconstruire progressivement les capacités physiques tout en respectant ta situation actuelle.',
			'Tu avances à ton niveau, puis tu progresses à partir de celui-ci.',
		],
		smallStep: [
			'Choisis un mouvement simple que tu peux réaliser confortablement.',
			'Fais 5 répétitions lentes.',
			'Puis demande-toi :',
			'« Est-ce que je me sens capable d’en faire davantage aujourd’hui… ou est-ce suffisant ? »',
			'L’objectif n’est pas de te tester. C’est de commencer à observer tes capacités.',
		],
		invitation: 'Tu as envie de te sentir à nouveau forte et capable ?',
	},
	{
		key: 'equilibre',
		label: 'Équilibre',
		description:
			'Retrouver une activité physique qui apporte à la fois mouvement, bien-être et équilibre.',
		summary:
			'Pour toi, bouger ne doit pas seulement faire du bien à ton corps. Cela doit aussi te faire du bien à toi.',
		intro: [
			'Tu as peut-être envie de retrouver davantage de mouvement dans ton quotidien, mais sans que cela devienne une nouvelle contrainte.',
			'Tu recherches quelque chose qui te permette à la fois de bouger, de prendre soin de ton corps, de respirer, de relâcher les tensions et de retrouver un peu de sérénité.',
		],
		priority: 'Réconcilier mouvement et bien-être.',
		guidance: [
			'L’activité physique ne devrait pas être une obligation supplémentaire à ajouter à ton quotidien.',
			'Elle peut devenir un rendez-vous avec toi-même.',
			'Un moment pour bouger, respirer, te reconnecter à tes sensations et prendre soin de toi.',
		],
		approach: [
			'Re-flow associe Pilates, yoga, renforcement musculaire et relaxation dans une progression simple, sécurisante et adaptée.',
			'L’objectif : retrouver un corps en mouvement sans oublier la personne qui l’habite.',
		],
		smallStep: [
			'Prends 5 minutes pour bouger doucement, en portant simplement ton attention sur ta respiration.',
			'Aucun objectif de performance.',
			'Juste quelques minutes pour toi.',
		],
		invitation: 'Tu as envie de retrouver cet équilibre ?',
	},
];
