/**
 * Chemin du Markdown généré au build pour une URL de page.
 * `/` → `/home.md`, `/blog/coach-apa/` → `/blog/coach-apa.md`.
 * Retourne null pour les fichiers statiques (images, CSS, API).
 */
export function markdownAssetPath(pathname) {
	let path = pathname;
	try {
		path = decodeURIComponent(pathname);
	} catch {
		return null;
	}
	if (path.includes('..')) return null;

	const lower = path.toLowerCase();
	if (lower.startsWith('/_astro/') || lower.startsWith('/fonts/') || lower.startsWith('/api/')) {
		return null;
	}
	if (/\.[a-z0-9]+$/i.test(path) && !lower.endsWith('.html')) return null;

	path = path.replace(/\/index\.html$/i, '/').replace(/\.html$/i, '');
	if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
	if (path === '' || path === '/') return '/home.md';
	return `${path}.md`;
}
