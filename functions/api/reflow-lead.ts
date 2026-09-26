/**
 * POST /api/reflow-lead
 *
 * Secrets Cloudflare Pages : GHL_PRIVATE_TOKEN, GHL_LOCATION_ID, GHL_RESULT_FIELD_ID.
 * Le mail vers Cécile est un workflow GoHighLevel déclenché par le tag `quiz-reflow`.
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
const MAX_BODY = 20_000;

const json = (status: number, error?: 'invalid' | 'unavailable') =>
	new Response(JSON.stringify(error ? { ok: false, error } : { ok: true }), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-store',
		},
	});

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
		const record = item as { id?: unknown; points?: unknown };
		if (typeof record.id !== 'string' || typeof record.points !== 'number') return null;
		answers.push({ id: record.id, points: record.points });
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
		return host === 'cecilecoaching.fr' || host.endsWith('.cecilecoaching.fr') || host.endsWith('.pages.dev');
	} catch {
		return false;
	}
};

const formatQuizResult = (
	result: NonNullable<ReturnType<typeof scoreQuiz>>,
): string => {
	const lines = [
		`Score : ${result.percent} %`,
		`Profil : ${result.profile.label}`,
		`Dimension dominante : ${result.dominant.label}`,
		'',
		'Dimensions',
		...result.dimensions.map(
			(dimension) =>
				`- ${dimension.label} : ${dimension.percent} % (${dimension.score}/${dimension.maxScore}) — ${dimension.levelLabel}`,
		),
		'',
		'Réponses',
		...result.answers.map(
			(answer) => `${answer.number}. ${answer.label} : ${answer.optionLabel} (${answer.points})`,
		),
	];
	return lines.join('\n');
};

const ghlFetch = (token: string, path: string, body: unknown) =>
	fetch(`${GHL_BASE}${path}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			Version: GHL_VERSION,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	});

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
	const tags = ['quiz-reflow', `quiz-${result.profile.key}`, `quiz-${result.dominant.key}`];
	const fieldRef = resultFieldId.trim();
	const customField = fieldRef.includes('.')
		? { key: fieldRef, field_value: quizText }
		: fieldRef.includes('_')
			? { key: `contact.${fieldRef}`, field_value: quizText }
			: { id: fieldRef, field_value: quizText };

	let contactId = '';
	try {
		const upsert = await ghlFetch(token, '/contacts/upsert', {
			locationId,
			firstName,
			lastName,
			email,
			phone,
			source: SOURCE,
			tags,
			customFields: [customField],
		});
		if (!upsert.ok) {
			console.error('reflow-lead: upsert refusé', upsert.status);
			return json(502, 'unavailable');
		}
		const created = (await upsert.json()) as { contact?: { id?: string } };
		contactId = created.contact?.id ?? '';
	} catch (error) {
		console.error('reflow-lead: upsert impossible', error);
		return json(502, 'unavailable');
	}

	if (!contactId) {
		console.error('reflow-lead: contact sans identifiant');
		return json(502, 'unavailable');
	}

	try {
		const note = await ghlFetch(token, `/contacts/${contactId}/notes`, { body: quizText });
		if (!note.ok) {
			console.error('reflow-lead: note refusée', note.status);
			return json(502, 'unavailable');
		}
	} catch (error) {
		console.error('reflow-lead: note impossible', error);
		return json(502, 'unavailable');
	}

	return json(200);
};
