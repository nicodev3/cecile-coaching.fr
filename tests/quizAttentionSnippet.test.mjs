import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const IDS = ['energie', 'mouvements', 'endurance', 'recuperation', 'travail', 'taches', 'loisirs', 'corps', 'reprise', 'apprehensions', 'besoin', 'projection'];

const window = {};
const ctx = vm.createContext({ window, document: { getElementById: () => null }, URLSearchParams, URL });
for (const [, code] of read('../ghl/reflow-resultats.html').matchAll(/<script>([\s\S]*?)<\/script>/g)) vm.runInContext(code, ctx);
const page = window.ReflowResultat;

/* Le snippet s’exécute comme dans la page du quiz : url, profile et byId existent déjà. */
function snippet(profileKey, byId) {
	const url = new URL('https://example.test/');
	vm.runInNewContext(read('../ghl/quiz-attention-snippet.js'), { url, profile: { key: profileKey }, byId });
	return url.searchParams.get('reflow_attention');
}

test('le quiz transmet les mêmes points d’attention que la page de résultats', () => {
	for (const key of ['equilibre', 'energie', 'reconnexion', 'force']) {
		for (let n = 0; n < 4 ** 8; n++) {
			const answers = IDS.map((_, i) => (i < 8 ? Math.floor(n / 4 ** i) % 4 : 0));
			const relevant = [0, 1, 2, 3, 5, 7, 8, 9];
			const full = IDS.map((_, i) => (relevant.includes(i) ? answers[relevant.indexOf(i)] : 0));
			const byId = Object.fromEntries(IDS.map((id, i) => [id, full[i]]));
			const expected = page.attentionPoints(key, full);
			const got = snippet(key, byId);
			const prefix = expected.length > 1 ? 'Tes points d’attention : ' : 'Ton point d’attention : ';
			assert.equal(got, expected.length ? prefix + expected.join(' ') : '');
		}
	}
});
