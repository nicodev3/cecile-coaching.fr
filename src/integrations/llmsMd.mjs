import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	fileToUrlPath,
	generateLlmsFullTxtContent,
	generateLlmsTxtContent,
	generateMarkdownFile,
	processHtmlFile,
} from 'astro-llms-md';

const SITE_URL = 'https://cecilecoaching.fr';
const SITE_NAME = 'RE-FLOW';
const SITE_DESCRIPTION =
	'Coaching sportif adapté en visio pour femmes vivant avec une maladie ou une fatigue chronique, partout en France.';

const SKIP_DIRS = new Set(['_astro', 'node_modules']);
const SKIP_FILES = new Set(['404.html']);
const SKIP_PATHS = ['/merci-rendez-vous'];

function collectHtml(dir, out = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (!SKIP_DIRS.has(entry.name)) collectHtml(full, out);
		} else if (entry.isFile() && entry.name.endsWith('.html') && !SKIP_FILES.has(entry.name)) {
			out.push(full);
		}
	}
	return out;
}

function isSkipped(urlPath) {
	return SKIP_PATHS.some((prefix) => urlPath === prefix || urlPath.startsWith(`${prefix}/`));
}

/**
 * astro-llms-md cherche les HTML avec un glob Windows (`dist\**\*.html`).
 * `glob` traite `\` comme un échappement et ne trouve aucune page.
 * On réutilise sa conversion HTML → Markdown, avec une lecture de dossier classique.
 */
export default function llmsMd() {
	return {
		name: 'llms-md',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				const clientDir = fileURLToPath(dir);
				const pages = [];

				for (const file of collectHtml(clientDir)) {
					const urlPath = fileToUrlPath(file, clientDir);
					if (isSkipped(urlPath)) continue;
					const pageData = await processHtmlFile(file);
					if (!pageData.title) {
						logger.warn(`Pas de titre pour ${urlPath}, page ignorée.`);
						continue;
					}
					pages.push({
						urlPath,
						filePath: file,
						source: 'prerendered',
						...pageData,
					});
				}

				pages.sort((a, b) => {
					if (a.urlPath === '/') return -1;
					if (b.urlPath === '/') return 1;
					return a.urlPath.localeCompare(b.urlPath, 'fr');
				});

				const write = (relPath, content) => {
					const fullPath = path.join(clientDir, relPath);
					fs.mkdirSync(path.dirname(fullPath), { recursive: true });
					fs.writeFileSync(fullPath, content, 'utf8');
				};

				for (const page of pages) {
					const mdRelative = page.urlPath === '/' ? 'home' : page.urlPath.replace(/^\//, '');
					write(`${mdRelative}.md`, generateMarkdownFile(page, SITE_URL));
				}

				write(
					'llms.txt',
					generateLlmsTxtContent(pages, SITE_URL, SITE_NAME, SITE_DESCRIPTION, true),
				);
				write('llms-full.txt', generateLlmsFullTxtContent(pages, SITE_URL, SITE_NAME));
				logger.info(`${pages.length} pages Markdown pour les moteurs génératifs.`);
			},
		},
	};
}
