import assert from 'node:assert/strict';
import test from 'node:test';
import { QUESTIONS, scoreQuiz } from '../src/data/reflow.ts';
import {
	buildReflowBookingUrl,
	escapeHtml,
	formatQuizLeadEmailHtml,
	formatQuizProfileHtml,
	formatQuizResultPlain,
} from '../src/utils/reflowQuizEmailHtml.ts';

const answers = (letters) =>
	[...letters].map((letter, index) => ({
		id: QUESTIONS[index].id,
		optionIndex: 'ABCD'.indexOf(letter),
	}));

test('escapeHtml neutralise les balises', () => {
	assert.equal(escapeHtml('<script>"&"</script>'), '&lt;script&gt;&quot;&amp;&quot;&lt;/script&gt;');
});

test('formatQuizProfileHtml structure le profil Équilibre', () => {
	const result = scoreQuiz(answers('AAAAAAAAAAAA'));
	assert.equal(result.profile.key, 'equilibre');
	const html = formatQuizProfileHtml(result);
	assert.match(html, /Ton profil RE-FLOW/);
	assert.match(html, /Équilibre/);
	assert.match(html, /Ta priorité aujourd’hui/);
	assert.match(html, /Ton petit pas du jour/);
	assert.doesNotMatch(html, /<script/);
});

test('formatQuizResultPlain reste lisible dans les notes CRM', () => {
	const result = scoreQuiz(answers('BBBBBBBBBBBB'));
	const plain = formatQuizResultPlain(result);
	assert.match(plain, /^Ton profil RE-FLOW : Énergie/m);
	assert.match(plain, /Ta priorité aujourd’hui/);
});

test('formatQuizLeadEmailHtml inclut intro et CTA bilan', () => {
	const result = scoreQuiz(answers('AAAAAAAAAAAA'));
	const bookingUrl = buildReflowBookingUrl({
		firstName: 'Marie',
		lastName: 'Dupont',
		email: 'marie@example.fr',
		phone: '+33612345678',
	});
	const html = formatQuizLeadEmailHtml({
		firstName: 'Marie',
		profileHtml: formatQuizProfileHtml(result),
		bookingUrl,
	});
	assert.match(html, /Bonjour Marie/);
	assert.match(html, /Réserver mon bilan/);
	assert.match(html, /bgcolor="#60406A"/);
	assert.match(html, /margin:0 auto/);
	assert.match(html, /text-align:center/);
	assert.match(html, /line-height:48px/);
	assert.match(html, /height:48px/);
	assert.ok(html.includes(bookingUrl.replace(/&/g, '&amp;')));
	assert.doesNotMatch(html, new RegExp(`>${bookingUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<`));
});
