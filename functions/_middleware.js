import { markdownAssetPath } from './markdownAssetPath.mjs';

/**
 * Accept: text/markdown → le .md du build, avec Content-Type: text/markdown.
 * Un navigateur (Accept: text/html) reçoit toujours le HTML.
 */
export async function onRequest(context) {
	const accept = context.request.headers.get('accept') ?? '';
	if (!accept.toLowerCase().includes('text/markdown')) {
		return context.next();
	}

	const { pathname } = new URL(context.request.url);
	const assetPath = markdownAssetPath(pathname);
	if (!assetPath) return context.next();

	const assetUrl = new URL(assetPath, context.request.url);
	const assetResponse = await context.env.ASSETS.fetch(new Request(assetUrl));
	if (!assetResponse.ok) return context.next();

	const headers = new Headers(assetResponse.headers);
	headers.set('content-type', 'text/markdown; charset=utf-8');
	const vary = headers.get('vary');
	headers.set('vary', vary ? `${vary}, Accept` : 'Accept');

	return new Response(assetResponse.body, {
		status: assetResponse.status,
		headers,
	});
}
