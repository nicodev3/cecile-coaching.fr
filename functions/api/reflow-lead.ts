/**
 * POST /api/reflow-lead
 *
 * Secrets Cloudflare Pages : GHL_PRIVATE_TOKEN, GHL_LOCATION_ID, GHL_RESULT_FIELD_ID.
 * Le mail vers Cécile est un workflow GoHighLevel déclenché par le tag `quiz-reflow`.
 * Les tags sont appliqués via POST /contacts/:id/tags (pas dans l’upsert) pour
 * déclencher correctement « Tag Added », y compris après un nouveau test.
 */
import { scoreQuiz, type SubmittedAnswer } from '../../src/data/reflow';
import { normalizeFrenchPhone } from '../../src/utils/frenchPhone';

interface LeadEnv {
	GHL_PRIVATE_TOKEN?: string;
	GHL_LOCATION_ID?: string;
	GHL_RESULT_FIELD_ID?: string;
}

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const SOURCE = 'Auto-évaluation RE-FLOW';
const TRIGGER_TAG = 'quiz-reflow';
// Un nouveau résultat remplace les anciens profils et dimensions dans le CRM.
const QUIZ_TAGS = [
	TRIGGER_TAG,
	'quiz-reconnexion',
	'quiz-energie',
	'quiz-force',
	'quiz-equilibre',
	'quiz-limite',
	'quiz-significatif',
	'quiz-important',
	'quiz-mouvements',
	'quiz-endurance',
	'quiz-recuperation',
	'quiz-travail',
	'quiz-quotidien',
	'quiz-loisirs',
	'quiz-corps',
	'quiz-reprise',
];
const MAX_BODY = 20_000;
/** Pause courte entre retrait et réapplication du tag déclencheur. */
const TAG_RETRIGGER_MS = 400;

const json = (status: number, error?: 'invalid' | 'unavailable', detail?: string) =>
	new Response(
		JSON.stringify(error ? { ok: false, error, ...(detail ? { detail } : {}) } : { ok: true }),
		{
			status,
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
				'Cache-Control': 'no-store',
			},
		},
	);

const cleanName = (value: unknown): string | null => {
	if (typeof value !== 'string') return null;
	const name = value.trim().replace(/\s+/g, ' ');
	if (name.length < 1 || name.length > 80) return null;
	if (!/^[\p{L}\p{M}][\p{L}\p{M}\s'’.-]*$/u.test(name)) return null;
	return name;
};

const cleanEmail = (value: unknown): string | null => {
	if (typeof value !== 'string') return null;
	const email = value.trim().toLowerCase();
	if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
	return email;
};

const readAnswers = (value: unknown): SubmittedAnswer[] | null => {
	if (!Array.isArray(value)) return null;
	const answers: SubmittedAnswer[] = [];
	for (const item of value) {
		if (!item || typeof item !== 'object') return null;
		const record = item as { id?: unknown; optionIndex?: unknown };
		if (typeof record.id !== 'string' || typeof record.optionIndex !== 'number') return null;
		answers.push({ id: record.id, optionIndex: record.optionIndex });
	}
	return answers;
};

const isAllowedOrigin = (request: Request): boolean => {
	const origin = request.headers.get('Origin');
	if (!origin) return false;
	try {
		const url = new URL(origin);
		const host = url.hostname;
		if (host === 'localhost' || host === '127.0.0.1') return true;
		if (url.protocol !== 'https:') return false;
		return (
			host === 'cecilecoaching.fr' ||
			host.endsWith('.cecilecoaching.fr') ||
			host.endsWith('.pages.dev')
		);
	} catch {
		return false;
	}
};

const formatQuizResult = (result: NonNullable<ReturnType<typeof scoreQuiz>>): string => {
	// Ce champ peut servir au mail de résultat : il ne contient aucun score.
	const profile = result.profile;
	const lines = [
		`Ton profil Re-flow : ${profile.label}`,
		profile.summary,
		'',
		...profile.intro,
		'',
		'Ta priorité aujourd’hui',
		profile.priority,
		...profile.guidance,
		'',
		'C’est justement l’approche de Re-flow',
		...profile.approach,
		'',
		'Ton petit pas du jour',
		...profile.smallStep,
		'',
		profile.invitation,
		'Découvrir Re-flow : https://cecilecoaching.fr/#programme',
		'',
		'16 semaines · 3 séances par semaine',
		'Pilates · Yoga · Renforcement musculaire · Relaxation',
		'',
		'Ce questionnaire est un outil d’orientation et de réflexion. Il ne constitue pas une évaluation médicale et ne remplace pas l’avis d’un professionnel de santé.',
	];
	return lines.join('\n');
};

const ghlFetch = (token: string, path: string, body: unknown, method: 'POST' | 'DELETE' = 'POST') =>
	fetch(`${GHL_BASE}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${token.trim()}`,
			Version: GHL_VERSION,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

const quizCustomField = (fieldRef: string, value: string) => {
	const ref = fieldRef.trim().replace(/^contact\./, '');
	const looksLikeId = /^[A-Za-z0-9]{15,}$/.test(ref) && !ref.includes('_');
	if (looksLikeId) return { id: ref, fieldValue: value };
	return { key: ref, fieldValue: value };
};

const readUpstreamError = async (response: Response) => {
	const text = await response.text();
	return text.replace(/\s+/g, ' ').slice(0, 180);
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retire le tag déclencheur s’il est déjà présent, puis réapplique tous les tags
 * via l’endpoint dédié — seul moyen fiable de déclencher un workflow « Tag Added ».
 */
const applyQuizTags = async (
	token: string,
	contactId: string,
	tags: string[],
): Promise<Response | null> => {
	try {
		const removed = await ghlFetch(
			token,
			`/contacts/${contactId}/tags`,
			{ tags: QUIZ_TAGS },
			'DELETE',
		);
		if (!removed.ok && removed.status !== 404) {
			const detail = await readUpstreamError(removed);
			console.error('reflow-lead: retrait tag refusé', removed.status, detail);
			return null;
		}
	} catch (error) {
		console.error('reflow-lead: retrait tag impossible', error);
		return null;
	}

	await wait(TAG_RETRIGGER_MS);

	try {
		return await ghlFetch(token, `/contacts/${contactId}/tags`, { tags });
	} catch (error) {
		console.error('reflow-lead: ajout tags impossible', error);
		return null;
	}
};

export const onRequestPost = async (context: {
	request: Request;
	env: LeadEnv;
}): Promise<Response> => {
	const { request, env } = context;
	if (!isAllowedOrigin(request)) return json(403, 'unavailable');

	const token = env.GHL_PRIVATE_TOKEN;
	const locationId = env.GHL_LOCATION_ID;
	const resultFieldId = env.GHL_RESULT_FIELD_ID;
	if (!token || !locationId || !resultFieldId) {
		console.error('reflow-lead: secrets GoHighLevel manquants');
		return json(500, 'unavailable');
	}

	let payload: unknown;
	try {
		const raw = await request.text();
		if (raw.length > MAX_BODY) return json(413, 'invalid');
		payload = JSON.parse(raw);
	} catch {
		return json(400, 'invalid');
	}

	if (!payload || typeof payload !== 'object') return json(400, 'invalid');
	const body = payload as Record<string, unknown>;
	if (typeof body.company === 'string' && body.company.trim() !== '') return json(400, 'invalid');

	const firstName = cleanName(body.firstName);
	const lastName = cleanName(body.lastName);
	const email = cleanEmail(body.email);
	const phone = typeof body.phone === 'string' ? normalizeFrenchPhone(body.phone) : null;
	const answers = readAnswers(body.answers);
	if (!firstName || !lastName || !email || !phone || body.consent !== true || !answers) {
		return json(400, 'invalid');
	}

	const result = scoreQuiz(answers);
	if (!result) return json(400, 'invalid');

	const quizText = formatQuizResult(result);
	const tags = [TRIGGER_TAG, `quiz-${result.profile.key}`];

	let contactId = '';
	try {
		// Sans tags ici : l’upsert ne déclenche pas de façon fiable les workflows « Tag Added ».
		const upsert = await ghlFetch(token, '/contacts/upsert', {
			locationId: locationId.trim(),
			firstName,
			lastName,
			email,
			phone,
			source: SOURCE,
			customFields: [quizCustomField(resultFieldId, quizText)],
		});
		if (!upsert.ok) {
			const detail = await readUpstreamError(upsert);
			console.error('reflow-lead: upsert refusé', upsert.status, detail);
			return json(500, 'unavailable', detail);
		}
		const created = (await upsert.json()) as { contact?: { id?: string } } | null;
		contactId = created?.contact?.id ?? '';
	} catch (error) {
		console.error('reflow-lead: upsert impossible', error);
		return json(500, 'unavailable');
	}

	if (!contactId) {
		console.error('reflow-lead: contact sans identifiant');
		return json(500, 'unavailable');
	}

	const tagged = await applyQuizTags(token, contactId, tags);
	if (!tagged || !tagged.ok) {
		const detail = tagged ? await readUpstreamError(tagged) : undefined;
		if (tagged) console.error('reflow-lead: ajout tags refusé', tagged.status, detail);
		return json(500, 'unavailable', detail);
	}

	try {
		const note = await ghlFetch(token, `/contacts/${contactId}/notes`, {
			body: [
				quizText,
				'',
				'Réponses au questionnaire',
				...result.answers.map(
					(answer) => `${answer.number}. ${answer.label} : ${answer.optionLabel}`,
				),
			].join('\n'),
		});
		if (!note.ok) {
			const detail = await readUpstreamError(note);
			console.error('reflow-lead: note refusée', note.status, detail);
		}
	} catch (error) {
		console.error('reflow-lead: note impossible', error);
	}

	return json(200);
};
