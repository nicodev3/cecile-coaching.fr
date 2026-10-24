import type { ScoredQuiz } from '../data/reflow';

/** Widget GoHighLevel — même base que `ReflowAssessment.astro`. */
export const REFLOW_BOOKING_WIDGET_URL =
	'https://api.leadconnectorhq.com/widget/booking/dJzUTOt5Rfugql6aVt4K';

const COLORS = {
	plum: '#60406A',
	plumInk: '#4a2d57',
	slate: '#334155',
	secondary: '#676767',
	paper: '#f7faf6',
	surface: '#ffffff',
	sage: '#c4d6b7',
	outline: '#e5e7eb',
} as const;

const FONT =
	"'Segoe UI', Tahoma, Geneva, Verdana, Arial, Helvetica, sans-serif";

export function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

const p = (text: string, style: string) =>
	`<p style="margin:0 0 14px;font-family:${FONT};font-size:16px;line-height:1.625;color:${COLORS.slate};${style}">${escapeHtml(text)}</p>`;

const sectionTitle = (text: string) =>
	`<h2 style="margin:28px 0 10px;font-family:${FONT};font-size:13px;font-weight:600;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.plumInk};">${escapeHtml(text)}</h2>`;

/** Texte brut pour notes CRM et alternative plain-text. */
export function formatQuizResultPlain(result: ScoredQuiz): string {
	const profile = result.profile;
	return [
		`Ton profil RE-FLOW : ${profile.label}`,
		profile.summary,
		'',
		...profile.intro,
		'',
		'Ta priorité aujourd’hui',
		profile.priority,
		...profile.guidance,
		'',
		'C’est justement l’approche de RE-FLOW',
		...profile.approach,
		'',
		'Ton petit pas du jour',
		...profile.smallStep,
		'',
		profile.invitation,
	].join('\n');
}

/**
 * Fragment HTML injecté dans le champ custom GoHighLevel (`GHL_RESULT_FIELD_ID`).
 * Le template GHL doit l’insérer tel quel (bloc HTML / merge sans ré-échappement).
 */
export function formatQuizProfileHtml(result: ScoredQuiz): string {
	const profile = result.profile;
	const parts: string[] = [];

	parts.push(
		`<div style="max-width:560px;font-family:${FONT};color:${COLORS.slate};">`,
		`<p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:${COLORS.plumInk};">Ton profil RE-FLOW</p>`,
		`<p style="margin:0 0 16px;font-family:${FONT};font-size:24px;font-weight:600;line-height:1.2;color:${COLORS.plum};">${escapeHtml(profile.label)}</p>`,
		`<p style="margin:0 0 20px;font-family:${FONT};font-size:18px;font-weight:600;line-height:1.45;color:${COLORS.plum};">${escapeHtml(profile.summary)}</p>`,
	);

	for (const line of profile.intro) parts.push(p(line, ''));

	parts.push(sectionTitle('Ta priorité aujourd’hui'));
	parts.push(p(profile.priority, 'font-weight:600;color:' + COLORS.plumInk + ';'));
	for (const line of profile.guidance) parts.push(p(line, ''));

	parts.push(sectionTitle('C’est justement l’approche de RE-FLOW'));
	for (const line of profile.approach) parts.push(p(line, ''));

	parts.push(sectionTitle('Ton petit pas du jour'));
	for (const line of profile.smallStep) {
		const quoted = line.startsWith('«') && line.endsWith('»');
		parts.push(
			p(
				line,
				quoted
					? 'margin-left:12px;padding-left:12px;border-left:3px solid ' +
							COLORS.sage +
							';font-style:italic;color:' +
							COLORS.plumInk +
							';'
					: '',
			),
		);
	}

	parts.push(
		`<p style="margin:24px 0 0;font-family:${FONT};font-size:17px;font-weight:600;line-height:1.45;color:${COLORS.plum};">${escapeHtml(profile.invitation)}</p>`,
		'</div>',
	);

	return parts.join('');
}

export interface ReflowBookingLead {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
}

export function buildReflowBookingUrl(lead: ReflowBookingLead): string {
	const url = new URL(REFLOW_BOOKING_WIDGET_URL);
	url.searchParams.set('first_name', lead.firstName);
	url.searchParams.set('last_name', lead.lastName);
	url.searchParams.set('email', lead.email);
	url.searchParams.set('phone', lead.phone);
	return url.toString();
}

const MEDICAL_DISCLAIMER =
	'Ce questionnaire est un outil d’orientation et de réflexion. Il ne constitue pas une évaluation médicale et ne remplace pas l’avis d’un professionnel de santé.';

/** Bouton : hauteur = line-height pour centrer le texte, tableau pour centrer le bloc. */
export function formatQuizBookingButtonHtml(bookingUrl: string): string {
	const href = escapeHtml(bookingUrl);
	return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;margin:24px 0;">
<tr>
<td align="center" style="text-align:center;width:100%;">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
<tr>
<td align="center" bgcolor="${COLORS.plum}" height="48" style="background-color:${COLORS.plum};border-radius:9999px;height:48px;padding:0;vertical-align:middle;">
<a href="${href}" target="_blank" rel="noopener noreferrer" style="background-color:${COLORS.plum};border-radius:9999px;color:#ffffff;display:block;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:600;height:48px;line-height:48px;padding:0 28px;text-align:center;text-decoration:none;">Réserver mon bilan</a>
</td>
</tr>
</table>
</td>
</tr>
</table>`;
}

/**
 * Fragment HTML (pas de document complet) : GHL l’injecte dans son propre
 * `<p>{{contact.resultat_quizz}}</p>`. Un doctype/html/body ferait fuiter
 * le texte « Bonjour » hors de la carte.
 */
export function formatQuizLeadEmailHtml(options: {
	firstName: string;
	profileHtml: string;
	bookingUrl: string;
}): string {
	const { firstName, profileHtml, bookingUrl } = options;
	const hello = escapeHtml(firstName);

	return `<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%;background-color:${COLORS.paper};">
<tr><td align="center" style="padding:24px 16px;background-color:${COLORS.paper};">
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;width:100%;background-color:${COLORS.surface};border-radius:16px;border:1px solid ${COLORS.outline};">
<tr><td style="padding:28px 24px 8px;font-family:${FONT};">
<p style="margin:0 0 16px;font-size:16px;line-height:1.625;color:${COLORS.slate};">Bonjour ${hello},</p>
<p style="margin:0 0 24px;font-size:16px;line-height:1.625;color:${COLORS.slate};">Merci d’avoir pris ce temps pour faire le point. Voici ton profil&nbsp;:</p>
</td></tr>
<tr><td style="padding:8px 24px 24px;border-top:4px solid ${COLORS.sage};">
${profileHtml}
</td></tr>
<tr><td align="center" style="padding:8px 24px 28px;font-family:${FONT};text-align:left;">
<p style="margin:0 0 8px;font-size:16px;line-height:1.625;color:${COLORS.slate};text-align:left;">Si tu veux le relire ensemble, je t’offre un bilan sans engagement. On regarde ton profil, ton prochain pas, et si l’accompagnement te correspond.</p>
${formatQuizBookingButtonHtml(bookingUrl)}
<p style="margin:0 0 20px;font-size:14px;line-height:1.5;color:${COLORS.secondary};text-align:left;">${escapeHtml(MEDICAL_DISCLAIMER)}</p>
<p style="margin:0;font-size:16px;line-height:1.625;color:${COLORS.slate};">À très vite,<br><strong style="color:${COLORS.plum};">Cécile</strong></p>
</td></tr>
</table>
<p style="margin:16px 0 0;max-width:600px;font-family:${FONT};font-size:12px;line-height:1.5;color:${COLORS.secondary};text-align:center;">RE-FLOW · Vitalité sans violence</p>
</td></tr></table>`;
}
