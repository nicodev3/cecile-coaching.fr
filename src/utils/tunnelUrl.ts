/** Origine du tunnel GoHighLevel (sans slash final dans les calculs d’URL). */
export const TUNNEL_ORIGIN = 'https://cecile-coaching.fr';
export const TUNNEL_ENTRY_PATH = '/';

const UTM_SOURCE = 'cecilecoaching.fr';
const UTM_MEDIUM = 'referral';

/**
 * URL d’entrée du tunnel avec UTM pour l’attribution côté GHL.
 * @param campaign identifiant court (ex. hero, final-cta, pillar-apa)
 */
export function tunnelEntryUrl(campaign: string, path = TUNNEL_ENTRY_PATH): string {
	const base = new URL(path, `${TUNNEL_ORIGIN}/`);
	base.searchParams.set('utm_source', UTM_SOURCE);
	base.searchParams.set('utm_medium', UTM_MEDIUM);
	base.searchParams.set('utm_campaign', campaign);
	return base.toString();
}
