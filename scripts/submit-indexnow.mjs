#!/usr/bin/env node
/**
 * Soumet les URLs du sitemap à IndexNow (Bing, Yandex, etc.) après le build.
 * Clé hébergée sur https://cecilecoaching.fr/{INDEXNOW_KEY}.txt
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const SITE_HOST = 'cecilecoaching.fr';
const SITE_ORIGIN = `https://${SITE_HOST}`;
const INDEXNOW_KEY = 'v8bhbwjyb5vzavsuduxyte81t2pvv2q1';
const KEY_LOCATION = `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`;

function extractLocs(xml) {
	const locs = [];
	const re = /<loc>([^<]+)<\/loc>/g;
	let match = re.exec(xml);
	while (match) {
		locs.push(match[1].trim());
		match = re.exec(xml);
	}
	return locs;
}

function readSitemapFile(path) {
	if (!existsSync(path)) return [];
	return extractLocs(readFileSync(path, 'utf8'));
}

function resolveSitemapPath(loc) {
	if (loc.startsWith(SITE_ORIGIN)) {
		return join(DIST, loc.slice(SITE_ORIGIN.length + 1));
	}
	if (loc.startsWith('/')) {
		return join(DIST, loc.slice(1));
	}
	return join(DIST, loc);
}

function collectSitemapUrls() {
	if (!existsSync(DIST)) {
		console.warn('[indexnow] dist/ introuvable — lancez astro build avant.');
		return [];
	}

	const urls = new Set();
	const indexPath = join(DIST, 'sitemap-index.xml');

	if (existsSync(indexPath)) {
		for (const loc of readSitemapFile(indexPath)) {
			if (!loc.endsWith('.xml')) continue;
			for (const pageUrl of readSitemapFile(resolveSitemapPath(loc))) {
				urls.add(pageUrl);
			}
		}
	}

	for (const file of readdirSync(DIST)) {
		if (!file.startsWith('sitemap') || !file.endsWith('.xml') || file === 'sitemap-index.xml') {
			continue;
		}
		for (const pageUrl of readSitemapFile(join(DIST, file))) {
			urls.add(pageUrl);
		}
	}

	return [...urls].filter((url) => url.startsWith(SITE_ORIGIN));
}

async function submitIndexNow(urlList) {
	const response = await fetch('https://api.indexnow.org/indexnow', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
		body: JSON.stringify({
			host: SITE_HOST,
			key: INDEXNOW_KEY,
			keyLocation: KEY_LOCATION,
			urlList,
		}),
	});

	if (response.ok || response.status === 202) {
		console.log(`[indexnow] ${urlList.length} URL(s) soumise(s) (HTTP ${response.status})`);
		return;
	}

	const body = await response.text();
	console.warn(`[indexnow] Échec HTTP ${response.status}: ${body}`);
}

const urlList = collectSitemapUrls();

if (urlList.length === 0) {
	console.warn('[indexnow] Aucune URL à soumettre.');
	process.exit(0);
}

try {
	await submitIndexNow(urlList);
} catch (error) {
	const message = error instanceof Error ? error.message : String(error);
	console.warn(`[indexnow] Erreur réseau (build non bloqué) : ${message}`);
}
