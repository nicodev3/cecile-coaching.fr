/**
 * Génère les e-mails de résultat RE-FLOW (un par profil) à partir des textes
 * de ghl/reflow-resultats.html, pour qu’e-mail et page restent identiques.
 *
 *   node ghl/emails/build.mjs
 *
 * Sortie : ghl/emails/email-<profil>.html, à coller dans GHL
 * (action « Envoyer un e-mail », bouton </> du Quick compose).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const here = new URL('./', import.meta.url);
const block = readFileSync(new URL('../reflow-resultats.html', here), 'utf8');

/** Charge le bloc sans DOM : seule l’API exposée (textes, règles) est utilisée. */
export function loadProfiles() {
	const window = {};
	const sandbox = { window, document: { getElementById: () => null }, URLSearchParams, URL };
	vm.createContext(sandbox);
	for (const [, code] of block.matchAll(/<script>([\s\S]*?)<\/script>/g)) vm.runInContext(code, sandbox);
	return window.ReflowResultat.PROFILES;
}

const C = {
	plum: '#60406a',
	plumInk: '#4a2d57',
	plumSoft: '#82628c',
	plumTint: '#f4eef5',
	sage: '#c4d6b7',
	sageSoft: '#e8efe2',
	paper: '#f7faf6',
	slate: '#334155',
	muted: '#5f6470',
	line: '#e4dbe7',
};
const FONT = "Verdana, 'Segoe UI', Tahoma, Geneva, Arial, sans-serif";
const TITLE = "'Montserrat', 'Segoe UI', Verdana, Arial, sans-serif";

/* Les merge fields GHL ({{contact.first_name}}…) restent tels quels dans l’URL. */
const BOOKING_URL =
	'https://api.leadconnectorhq.com/widget/booking/dJzUTOt5Rfugql6aVt4K' +
	'?first_name={{contact.first_name}}&last_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}';

/**
 * Points d’attention personnalisés : texte calculé par la page du quiz et transmis
 * au formulaire GHL (champ caché « reflow_attention »). Vide si aucune règle ne s’applique :
 * le paragraphe n’a alors ni fond ni bordure, il ne se voit pas.
 */
const ATTENTION = `<p style="margin:8px 0 0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.plumInk};font-weight:bold;">{{contact.reflow_attention}}</p>`;

const MONTH_TITLES = ['Mouvement &amp; sécurité', 'Force &amp; progressivité', 'Vitalité &amp; énergie', 'Confiance &amp; autonomie'];
const SESSION_NAMES = ['Pilates', 'Renforcement musculaire', 'Yoga / relaxation'];

/** Échappement + typographie française (espaces insécables). */
const esc = (text) =>
	String(text)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/ ([;!?])/g, '&#8239;$1')
		.replace(/ :/g, '&nbsp;:')
		.replace(/« /g, '«&nbsp;')
		.replace(/ »/g, '&nbsp;»');

const p = (html, style = '') =>
	`<p style="margin:0 0 14px;font-family:${FONT};font-size:15px;line-height:1.65;color:${C.slate};${style}">${html}</p>`;

const eyebrow = (text, color = C.plumSoft) =>
	`<p style="margin:0 0 8px;font-family:${FONT};font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${color};">${text}</p>`;

const h2 = (before, accent) =>
	`<h2 style="margin:0 0 18px;font-family:${TITLE};font-size:22px;line-height:1.25;font-weight:bold;text-transform:uppercase;color:${C.plumInk};">${esc(before)} <span style="color:${C.plumSoft};">${esc(accent)}</span></h2>`;

const highlight = (inner) =>
	`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;"><tr><td style="padding:20px;border:2px solid ${C.plumSoft};border-radius:14px;background:${C.plumTint};text-align:center;">${inner}</td></tr></table>`;

const statement = (text) =>
	`<p style="margin:0;font-family:${TITLE};font-size:18px;line-height:1.35;font-weight:bold;color:${C.plumInk};">${esc(text)}</p>`;

const big = (text, sub) =>
	`<p style="margin:0;font-family:${TITLE};font-size:40px;line-height:1.1;font-weight:bold;color:${C.plum};">${text}</p>` +
	(sub ? `<p style="margin:10px 0 0;font-family:${FONT};font-size:15px;line-height:1.5;color:${C.slate};">${esc(sub)}</p>` : '');

const bullets = (items, dot = C.plumSoft) =>
	`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 4px;">` +
	items
		.map(
			(t) =>
				`<tr><td width="20" valign="top" style="padding:0 0 8px;font-family:${FONT};font-size:15px;line-height:1.6;color:${dot};">&#9679;</td>` +
				`<td valign="top" style="padding:0 0 8px;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.slate};">${esc(t)}</td></tr>`,
		)
		.join('') +
	`</table>`;

const numbered = (rows) =>
	`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px;">` +
	rows
		.map(
			(html, i) =>
				`<tr><td width="40" valign="top" style="padding:0 0 12px;"><div style="width:28px;height:28px;line-height:28px;border-radius:14px;background:${C.plum};color:#ffffff;text-align:center;font-family:${FONT};font-size:13px;font-weight:bold;">${i + 1}</div></td>` +
				`<td valign="top" style="padding:3px 0 12px;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.slate};">${html}</td></tr>`,
		)
		.join('') +
	`</table>`;

const card = (inner) =>
	`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;"><tr><td style="padding:28px 24px;border:1px solid ${C.line};border-radius:20px;background:#ffffff;">${inner}</td></tr></table>`;

function renderParas(paras) {
	return paras
		.map((item) => {
			if (typeof item === 'string') return p(esc(item));
			if (item.key)
				return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px;"><tr><td style="padding:14px 16px;border-radius:12px;background:${C.sageSoft};text-align:center;font-family:${TITLE};font-size:16px;line-height:1.45;font-weight:bold;color:${C.plumInk};">${esc(item.key)}</td></tr></table>`;
			if (item.cycle) return numbered(item.cycle.map((s) => `<strong style="color:${C.plumInk};">${esc(s)}</strong>`));
			return '';
		})
		.join('');
}

export function renderEmail(key, profile) {
	const pr = profile;
	const steps = pr.priority.steps.length
		? numbered(pr.priority.steps.map(([title, text]) => `<strong style="color:${C.plumInk};">${esc(title)}</strong>${text ? `<br>${esc(text)}` : ''}`))
		: '';

	const months = pr.plan.months
		.map(
			(m, i) =>
				`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px;"><tr><td style="padding:20px;border:1px solid ${C.line};border-radius:16px;background:#ffffff;">` +
				eyebrow(`Mois ${i + 1}`) +
				`<p style="margin:0 0 10px;font-family:${TITLE};font-size:17px;font-weight:bold;color:${C.plumInk};">${MONTH_TITLES[i]}</p>` +
				p(esc(m.intro)) +
				bullets(m.items) +
				`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:14px 16px;border-radius:12px;background:${C.sageSoft};">` +
				eyebrow('&#10003; Ton bénéfice au quotidien', C.plum) +
				`<p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.plumInk};">${esc(m.benefit)}</p>` +
				`</td></tr></table></td></tr></table>`,
		)
		.join('');

	const sessions = pr.week.sessions
		.map(
			(text, i) =>
				`<tr><td style="padding:0 0 10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:16px 18px;border:1px solid ${C.line};border-radius:14px;">` +
				eyebrow(`Séance ${i + 1} · 30 min`) +
				`<p style="margin:0 0 6px;font-family:${TITLE};font-size:17px;font-weight:bold;color:${C.plumInk};">${SESSION_NAMES[i]}</p>` +
				`<p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.6;color:${C.slate};">${esc(text)}</p>` +
				`</td></tr></table></td></tr>`,
		)
		.join('');

	const ctaItems = [
		'Le bilan sur tes capacités physiques basé sur tes réponses',
		'Ce qu’il faut faire en priorité pour améliorer ton niveau de forme',
		'Ton plan d’action',
		'Une réponse claire : est-ce que je peux t’aider, et comment, grâce à mon programme RE-FLOW, sans pression',
	];

	const body =
		/* En-tête */
		`<tr><td style="padding:8px 4px 24px;text-align:center;">` +
		`<p style="margin:0 0 22px;font-family:${TITLE};font-size:14px;font-weight:bold;letter-spacing:3px;color:${C.plum};">RE-FLOW</p>` +
		p(`Bonjour {{contact.first_name}},`, 'text-align:center;') +
		p(esc('Merci d’avoir répondu au quiz ! Voici ton résultat et ton plan pour avancer.'), 'text-align:center;') +
		eyebrow(esc(`Profil ${pr.label}`)) +
		`<h1 style="margin:0 0 14px;font-family:${TITLE};font-size:26px;line-height:1.2;font-weight:bold;text-transform:uppercase;color:${C.plumInk};">${esc(pr.title)}</h1>` +
		`<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td style="padding:12px 18px;border:1px solid ${C.line};border-radius:18px;background:#ffffff;font-family:${FONT};font-size:14px;line-height:1.5;font-weight:bold;color:${C.plumInk};text-align:center;">${esc('Objectif : ' + pr.goal)}</td></tr></table>` +
		`</td></tr>` +
		/* Bloc 01 */
		`<tr><td>` +
		card(eyebrow('Bloc 01') + h2('Ton bilan', 'physique') + highlight(statement(pr.bilan.title)) + renderParas(pr.bilan.paras)) +
		/* Bloc 02 */
		card(eyebrow('Bloc 02') + h2('Ta', 'priorité') + highlight(statement(pr.priority.title)) + renderParas(pr.priority.paras) + steps + ATTENTION) +
		/* Bloc 03 */
		card(eyebrow('Bloc 03') + h2('Ton plan', 'd’action') + highlight(big('4 MOIS', pr.plan.sub)) + months) +
		/* Bloc 04 */
		card(
			eyebrow('Bloc 04') +
				h2('Ta semaine', 'type') +
				highlight(big('3 × 30 MIN', `par semaine. Pas plus ! Des séances modulables qui s’adaptent ${pr.week.fit}.`)) +
				`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${sessions}</table>`,
		) +
		`</td></tr>` +
		/* Appel bilan */
		`<tr><td style="padding:28px 24px;border-radius:20px;background:${C.plumInk};text-align:center;">` +
		eyebrow('Appel bilan offert', C.sage) +
		`<p style="margin:0 0 14px;font-family:${TITLE};font-size:22px;line-height:1.25;font-weight:bold;text-transform:uppercase;color:#ffffff;">30 minutes <span style="color:${C.sage};">pour analyser tes résultats</span></p>` +
		`<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.6;color:#f1eaf3;">${esc('Ce plan te donne une direction. Mais chaque corps est différent, chaque histoire aussi, et c’est là que tout se joue. Réserve ton appel bilan offert :')}</p>` +
		`<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 0 20px;text-align:left;">` +
		ctaItems
			.map(
				(t) =>
					`<tr><td width="26" valign="top" style="padding:0 0 8px;font-family:${FONT};font-size:15px;line-height:1.5;color:${C.sage};">&#10003;</td><td valign="top" style="padding:0 0 8px;font-family:${FONT};font-size:14px;line-height:1.5;color:#ffffff;">${esc(t)}</td></tr>`,
			)
			.join('') +
		`</table>` +
		`<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td style="border-radius:999px;background:#ffffff;">` +
		`<a href="${BOOKING_URL}" target="_blank" style="display:inline-block;padding:15px 30px;font-family:${FONT};font-size:15px;font-weight:bold;color:${C.plumInk};text-decoration:none;border-radius:999px;">Réserver mon appel bilan</a>` +
		`</td></tr></table>` +
		`</td></tr>` +
		/* Pied */
		`<tr><td style="padding:24px 8px 0;text-align:center;">` +
		p(esc('À très vite,') + '<br><strong style="color:' + C.plumInk + ';">Cécile</strong>', 'text-align:center;') +
		`<p style="margin:0;font-family:${FONT};font-size:12px;line-height:1.5;color:${C.muted};">${esc('Ce questionnaire est un outil d’orientation et de réflexion. Il ne constitue pas une évaluation médicale et ne remplace pas l’avis d’un professionnel de santé.')}</p>` +
		`</td></tr>`;

	return (
		`<!-- E-mail résultat RE-FLOW — profil ${pr.label} — généré par ghl/emails/build.mjs -->\n` +
		`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};"><tr><td align="center" style="padding:24px 12px;">` +
		`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">${body}</table>` +
		`</td></tr></table>\n`
	);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const profiles = loadProfiles();
	for (const key of Object.keys(profiles)) {
		const file = new URL(`email-${key}.html`, here);
		writeFileSync(file, renderEmail(key, profiles[key]));
		console.log('écrit', file.pathname);
	}
}
