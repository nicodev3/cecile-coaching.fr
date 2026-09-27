/**
 * Répond à POST /api/reflow-lead pendant `astro dev` seulement.
 * En production, la route reste la fonction Cloudflare Pages.
 */
function readBody(req) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		req.on('data', (chunk) => chunks.push(chunk));
		req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
		req.on('error', reject);
	});
}

export function reflowLeadDevPlugin() {
	return {
		name: 'reflow-lead-dev',
		apply: 'serve',
		configureServer(server) {
			const handle = async (req, res, next) => {
				const path = req.url?.split('?')[0];
				if (path !== '/api/reflow-lead' && path !== '/api/reflow-lead/') return next();
				if (req.method !== 'POST') return next();

				try {
					const raw = await readBody(req);
					const { previewReflowLead } = await server.ssrLoadModule('/src/dev/reflowLeadPreview.ts');
					const outcome = previewReflowLead(raw);
					if (outcome.log) console.info(`\n${outcome.log}\n`);
					res.statusCode = outcome.status;
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					res.setHeader('Cache-Control', 'no-store');
					res.end(JSON.stringify(outcome.body));
				} catch (error) {
					console.error('[reflow-lead] aperçu local impossible', error);
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					res.end(JSON.stringify({ ok: false, error: 'unavailable' }));
				}
			};
			// Avant le contrôle trailingSlash d’Astro, qui répond 404 sur l’URL sans slash.
			server.middlewares.stack.unshift({ route: '', handle });
		},
	};
}
