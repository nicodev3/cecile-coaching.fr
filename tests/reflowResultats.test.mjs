import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

/** Charge le bloc GHL dans un bac à sable sans DOM : seule l’API exposée est testée. */
const html = readFileSync(new URL('../ghl/reflow-resultats.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
const window = {};
const sandbox = { window, document: { getElementById: () => null }, URLSearchParams, URL };
vm.createContext(sandbox);
for (const code of scripts) vm.runInContext(code, sandbox);
const api = window.ReflowResultat;

const query = (answers, extra = '') =>
	'?' + answers.map((a, i) => `q${i + 1}=${a}`).join('&') + extra;

test('le profil transmis prime, quelle que soit sa forme', () => {
	assert.equal(api.parseProfile('Énergie'), 'energie');
	assert.equal(api.parseProfile('Profil ÉQUILIBRE'), 'equilibre');
	assert.equal(api.parseProfile('{{contact.reflow_profil}}'), null);
	assert.equal(api.readInput('?profil=force&q1=A').profile, 'force');
});

test('les réponses sont reconnues en lettre, chiffre ou texte', () => {
	assert.equal(api.parseAnswer(0, 'b'), 1);
	assert.equal(api.parseAnswer(0, '4'), 3);
	assert.equal(api.parseAnswer(1, 'Ce n’est plus comme avant — Moins fluide, je me sens rouillée'), 1);
	assert.equal(api.parseAnswer(7, "J'ai du mal à lui faire confiance"), 2);
	assert.equal(api.parseAnswer(0, '{{contact.q1}}'), null);
	assert.equal(api.parseAnswer(0, 'E'), null);
});

test('sans profil, le barème RE-FLOW est appliqué aux 12 réponses', () => {
	assert.equal(api.readInput(query(Array(12).fill('A'))).profile, 'equilibre');
	assert.equal(api.readInput(query(['B', 'A', 'B', 'D', 'B', 'B', 'B', 'A', 'A', 'B', 'B', 'D'])).profile, 'energie');
	assert.equal(api.readInput(query(['A', 'D', 'D', 'A', 'D', 'D', 'A', 'A', 'A', 'C', 'A', 'B'])).profile, 'force');
	assert.equal(api.readInput(query(['A', 'A', 'A', 'A', 'A', 'A', 'A', 'D', 'D', 'D', 'D', 'C'])).profile, 'reconnexion');
	assert.equal(api.readInput(query(Array(11).fill('A'))).profile, null);
});

test('points d’attention selon les règles de chaque profil', () => {
	const at = (key, q) => api.attentionPoints(key, api.readInput(q).answers).length;
	assert.equal(at('equilibre', '?q1=A&q2=A'), 0);
	assert.equal(at('equilibre', '?q1=B&q2=D'), 2);
	assert.equal(at('energie', '?q1=B&q3=B&q4=A'), 0);
	assert.equal(at('energie', '?q1=C&q3=D&q4=B'), 3);
	assert.equal(at('reconnexion', '?q8=B&q9=B&q10=C'), 1);
	assert.equal(at('reconnexion', '?q8=A&q9=C&q10=D'), 2);
	assert.equal(at('force', '?q2=A&q3=B&q6=B'), 0);
	assert.equal(at('force', '?q2=B&q3=C&q6=D'), 3);
});

test('coordonnées : la config GHL prime sur l’URL, les merge fields vides sont ignorés', () => {
	const input = api.readInput('?first_name=Url&email=a%40b.fr', {
		first_name: 'Marie',
		email: '{{contact.email}}',
	});
	assert.equal(input.lead.first_name, 'Marie');
	assert.equal(input.lead.email, 'a@b.fr');
});

test('chaque profil a 4 mois et 3 séances', () => {
	for (const key of ['equilibre', 'energie', 'reconnexion', 'force']) {
		assert.equal(api.PROFILES[key].plan.months.length, 4);
		assert.equal(api.PROFILES[key].week.sessions.length, 3);
	}
});
