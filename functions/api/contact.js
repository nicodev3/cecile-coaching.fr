import client from '../../src/data/client.json';

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';
const MAX_BODY = 16_000;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_PHONE = 40;
const MAX_MESSAGE = 5_000;

/**
 * Reçoit le formulaire de contact et transmet le message à Cécile via Brevo.
 * Le secret BREVO_API_KEY est stocké dans l'environnement Cloudflare Pages.
 *
 * @param {{ request: Request, env: Record<string, string | undefined> }} context
 */
export async function onRequestPost({ request, env }) {
	if (!isSameSite(request)) return redirectToContact(request, '0');

	const contentLength = Number(request.headers.get('content-length') || 0);
	if (contentLength > MAX_BODY) return redirectToContact(request, '0');

	let form;
	try {
		form = await request.formData();
	} catch {
		return redirectToContact(request, '0');
	}

	// Honeypot : les robots reçoivent une réponse positive sans envoi d'e-mail.
	if (String(form.get('_gotcha') ?? '').trim() !== '') {
		return redirectToContact(request, '1');
	}

	const name = clean(form.get('name'), MAX_NAME);
	const email = clean(form.get('email'), MAX_EMAIL).toLowerCase();
	const phone = clean(form.get('phone'), MAX_PHONE);
	const message = cleanMessage(form.get('message'), MAX_MESSAGE);

	if (!name || !email || !message || !isEmail(email)) {
		return redirectToContact(request, '0');
	}

	const apiKey = env.BREVO_API_KEY?.trim();
	const recipient = client.business?.email?.trim();
	const senderEmail = senderFromSite(client.seo?.baseUrl);
	if (!apiKey || !recipient || !senderEmail || !isEmail(recipient)) {
		console.error(JSON.stringify({ event: 'contact_config_error' }));
		return redirectToContact(request, '0');
	}

	const siteName = client.seo?.siteName?.trim() || senderEmail;
	let response;
	try {
		response = await fetch(BREVO_ENDPOINT, {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'api-key': apiKey,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				sender: {
					name: client.business?.fullName?.trim() || siteName,
					email: senderEmail,
				},
				to: [{
					email: recipient,
					name: client.business?.fullName?.trim() || recipient,
				}],
				replyTo: { email, name },
				subject: `Message depuis le site — ${siteName}`.slice(0, 200),
				textContent: [
					`Nom : ${name}`,
					`E-mail : ${email}`,
					phone ? `Téléphone : ${phone}` : null,
					'',
					message,
				]
					.filter((line) => line !== null)
					.join('\n'),
			}),
		});
	} catch (error) {
		console.error(JSON.stringify({
			event: 'contact_brevo_unreachable',
			message: error instanceof Error ? error.message : 'unknown',
		}));
		return redirectToContact(request, '0');
	}

	if (!response.ok) {
		console.error(JSON.stringify({
			event: 'contact_brevo_rejected',
			status: response.status,
		}));
		return redirectToContact(request, '0');
	}

	console.log(JSON.stringify({ event: 'contact_sent' }));
	return redirectToContact(request, '1');
}

/**
 * @param {Request} request
 */
function isSameSite(request) {
	const expected = new URL(request.url).origin;
	const origin = request.headers.get('Origin');
	if (origin) return origin === expected;

	const referer = request.headers.get('Referer');
	if (!referer) return false;
	try {
		return new URL(referer).origin === expected;
	} catch {
		return false;
	}
}

/**
 * @param {Request} request
 * @param {'0' | '1'} sent
 */
function redirectToContact(request, sent) {
	const url = new URL('/contact/', request.url);
	url.searchParams.set('sent', sent);
	return Response.redirect(url.toString(), 303);
}

/**
 * @param {FormDataEntryValue | null} value
 * @param {number} max
 */
function clean(value, max) {
	return String(value ?? '')
		.replace(/[\u0000-\u001F\u007F]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, max);
}

/**
 * @param {FormDataEntryValue | null} value
 * @param {number} max
 */
function cleanMessage(value, max) {
	return String(value ?? '')
		.replace(/\r\n?/g, '\n')
		.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
		.trim()
		.slice(0, max);
}

/**
 * @param {string} value
 */
function isEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * @param {string | undefined} baseUrl
 */
function senderFromSite(baseUrl) {
	if (!baseUrl) return '';
	try {
		return `formulaire@${new URL(baseUrl).hostname}`;
	} catch {
		return '';
	}
}
