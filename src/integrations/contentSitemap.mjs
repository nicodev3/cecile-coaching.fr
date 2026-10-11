import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sitemap from '@astrojs/sitemap';

/** Reuse the editorial dates rendered from the content collection.
 * Never use build dates or filesystem timestamps as content modification dates.
 */
export default function contentSitemap() {
	const dates = new Map();
	return [
		{
			name: 'sitemap-content-dates',
			hooks: {
				'astro:build:done': async ({ dir }) => {
					dates.clear();
					const root = fileURLToPath(dir);
					async function collect(directory) {
						for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
							const filename = path.join(directory, entry.name);
							if (entry.isDirectory()) {
								if (entry.name !== '_astro') await collect(filename);
							} else if (entry.name.endsWith('.html')) {
								const html = await fs.readFile(filename, 'utf8');
								for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
									const schema = JSON.parse(match[1]);
									const nodes = Array.isArray(schema) ? schema : (schema['@graph'] ?? [schema]);
									for (const node of nodes) {
										if (node['@type'] !== 'BlogPosting') continue;
										const date = new Date(node.dateModified ?? node.datePublished);
										if (Number.isNaN(date.getTime())) throw new Error(`Invalid editorial date in ${filename}`);
										const relative = path.relative(root, filename).split(path.sep).join('/');
										const pathname = `/${relative.replace(/index\.html$/, '').replace(/\.html$/, '/')}`;
										dates.set(pathname, date.toISOString());
									}
								}
							}
						}
					}
					await collect(root);
				},
			},
		},
		sitemap({
			filter: (page) => !page.startsWith('https://cecilecoaching.fr/merci-rendez-vous'),
			serialize: (item) => {
				const lastmod = dates.get(new URL(item.url).pathname);
				return lastmod ? { ...item, lastmod } : item;
			},
		}),
	];
}
