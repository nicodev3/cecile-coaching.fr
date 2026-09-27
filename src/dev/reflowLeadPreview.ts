/**
 * Aperçu local de POST /api/reflow-lead.
 * Utilisé uniquement par le serveur `astro dev` : aucune écriture GoHighLevel.
 * La validation reprend celle de functions/api/reflow-lead.ts.
 */
import { scoreQuiz, type SubmittedAnswer } from '../data/reflow';
import { normalizeFrenchPhone } from '../utils/frenchPhone';

export interface LeadPreview {
	status: number;
	body: { ok: boolean; error?: 'invalid' };
	log?: string;
}

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

export function previewReflowLead(raw: string): LeadPreview {
	if (raw.length > 20_000) return { status: 413, body: { ok: false, error: 'invalid' } };

	let payload: unknown;
	try {
		payload = JSON.parse(raw);
	} catch {
		return { status: 400, body: { ok: false, error: 'invalid' } };
	}

	if (!payload || typeof payload !== 'object')
		return { status: 400, body: { ok: false, error: 'invalid' } };
	const body = payload as Record<string, unknown>;
	if (typeof body.company === 'string' && body.company.trim() !== '') {
		return { status: 400, body: { ok: false, error: 'invalid' } };
	}

	const firstName = cleanName(body.firstName);
	const lastName = cleanName(body.lastName);
	const email = cleanEmail(body.email);
	const phone = typeof body.phone === 'string' ? normalizeFrenchPhone(body.phone) : null;
	const answers = readAnswers(body.answers);
	if (!firstName || !lastName || !email || !phone || body.consent !== true || !answers) {
		return { status: 400, body: { ok: false, error: 'invalid' } };
	}

	const result = scoreQuiz(answers);
	if (!result) return { status: 400, body: { ok: false, error: 'invalid' } };

	const log = [
		'[reflow-lead] aperçu local — rien n’est envoyé à GoHighLevel',
		`${firstName} ${lastName} <${email}> ${phone}`,
		`Profil : ${result.profile.label}`,
		...result.answers.map((answer) => `${answer.number}. ${answer.optionLabel}`),
	].join('\n');

	return { status: 200, body: { ok: true }, log };
}
