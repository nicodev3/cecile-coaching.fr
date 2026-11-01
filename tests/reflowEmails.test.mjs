import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { loadProfiles, renderEmail } from '../ghl/emails/build.mjs';

const profiles = loadProfiles();

test('un e-mail par profil, à jour avec les textes de la page de résultats', () => {
	for (const key of ['equilibre', 'energie', 'reconnexion', 'force']) {
		const html = renderEmail(key, profiles[key]);
		const committed = readFileSync(new URL(`../ghl/emails/email-${key}.html`, import.meta.url), 'utf8');
		assert.equal(committed, html, `relancer node ghl/emails/build.mjs (${key})`);
		assert.match(html, /Bloc 04/);
		assert.match(html, /widget\/booking\/dJzUTOt5Rfugql6aVt4K\?first_name=\{\{contact\.first_name\}\}/);
		assert.doesNotMatch(html, /<script|<style/);
	}
});
