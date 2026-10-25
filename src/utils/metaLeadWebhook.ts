/**
 * Données envoyées au webhook GoHighLevel qui relaie le Lead vers la Meta Conversion API.
 * Les cookies `_fbp` / `_fbc`, l’IP et le navigateur aident Meta à rattacher le lead à la pub.
 */
export type MetaLeadWebhookPayload = {
	event_name: 'Lead';
	event_id: string;
	event_time: number;
	action_source: 'website';
	event_source_url: string;
	content_name: string;
	content_category: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	quiz_profile: string;
	client_ip_address: string;
	client_user_agent: string;
	fbp: string;
	fbc: string;
};

export type MetaLeadInput = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	profileKey: string;
	eventId: string;
	/** Millisecondes, comme Date.now(). */
	now: number;
};

const readCookie = (header: string | null, name: string): string => {
	if (!header) return '';
	for (const part of header.split(';')) {
		const index = part.indexOf('=');
		if (index === -1) continue;
		if (part.slice(0, index).trim() === name) return decodeURIComponent(part.slice(index + 1).trim());
	}
	return '';
};

/** Page d’origine du formulaire, lue dans l’en-tête Referer envoyé par le navigateur. */
const readSourceUrl = (request: Request): URL | null => {
	const referer = request.headers.get('Referer');
	if (!referer) return null;
	try {
		return new URL(referer);
	} catch {
		return null;
	}
};

export const buildMetaLeadWebhookPayload = (
	request: Request,
	lead: MetaLeadInput,
): MetaLeadWebhookPayload => {
	const cookies = request.headers.get('Cookie');
	const source = readSourceUrl(request);
	// Sans cookie `_fbc` (pixel bloqué), le fbclid de l’URL suffit à reconstruire la valeur attendue par Meta.
	const fbclid = source?.searchParams.get('fbclid') ?? '';
	const fbc = readCookie(cookies, '_fbc') || (fbclid ? `fb.1.${lead.now}.${fbclid}` : '');

	return {
		event_name: 'Lead',
		event_id: lead.eventId,
		event_time: Math.floor(lead.now / 1000),
		action_source: 'website',
		event_source_url: source ? `${source.origin}${source.pathname}` : '',
		content_name: 'quiz_reflow',
		content_category: 'quiz',
		first_name: lead.firstName,
		last_name: lead.lastName,
		email: lead.email,
		phone: lead.phone,
		quiz_profile: lead.profileKey,
		client_ip_address: request.headers.get('CF-Connecting-IP') ?? '',
		client_user_agent: request.headers.get('User-Agent') ?? '',
		fbp: readCookie(cookies, '_fbp'),
		fbc,
	};
};
