import assert from 'node:assert/strict';
import test from 'node:test';
import { MAX_SCORES, QUESTIONS, scoreQuiz } from '../src/data/reflow.ts';

const answers = (letters) =>
	[...letters].map((letter, index) => ({
		id: QUESTIONS[index].id,
		optionIndex: 'ABCD'.indexOf(letter),
	}));

const scenarios = [
	['Routine sereine', 'AAAAAAAAAAAA', 'equilibre'],
	['Variabilité partout', 'BBBBBBBBBBBB', 'energie'],
	['Difficultés multiples', 'CCCCCCCCCCCC', 'reconnexion'],
	['Fort impact partout', 'DDDDDDDDDDDD', 'reconnexion'],
	['Énergie variable', 'BABBBABAAABA', 'energie'],
	['Fatigue et récupération', 'CACCDDBAABBD', 'energie'],
	['Fatigue avec confiance', 'DABCBBBAABBA', 'energie'],
	['Besoin de doser', 'BACCBABAABBA', 'energie'],
	['Force à reconstruire', 'BDDBDDCAACCB', 'force'],
	['Endurance diminuée', 'ABDBCCAAACAB', 'force'],
	['Gestes difficiles', 'ADBACBCAACCB', 'force'],
	['Autonomie réduite', 'ACDACDCAACCB', 'force'],
	['Confiance fragile', 'BABABACDDDCC', 'reconnexion'],
	['Peur de reprendre', 'AABABABCDDDC', 'reconnexion'],
	['Repères corporels perdus', 'BAAABACDCDDC', 'reconnexion'],
	['Reprise accompagnée', 'ABBABACBCDDC', 'reconnexion'],
	['Bien-être et régularité', 'AAAAAAABAAAA', 'equilibre'],
	['Mouvement sans contrainte', 'AABAAAAAACAA', 'equilibre'],
	['Équilibre avec fatigue', 'BAABAAAAAAAA', 'equilibre'],
	['Quotidien préservé', 'AAAAABAAAAAA', 'equilibre'],
];
for (const [name, letters, profile] of scenarios) {
	test(name, () => assert.equal(scoreQuiz(answers(letters)).profile.key, profile));
}

test('Les maximums correspondent au barème fourni', () => {
	assert.deepEqual(MAX_SCORES, { reconnexion: 22, energie: 23, force: 22, equilibre: 23 });
	assert.deepEqual(scoreQuiz(answers('DDDDDDDDDDDD')).scores, {
		reconnexion: 20,
		energie: 16,
		force: 15,
		equilibre: 0,
	});
	assert.equal(scoreQuiz(answers('AAAAAAAAAAAA')).percentages.equilibre, 100);
});

test('Le ratio normalisé prime sur les points bruts', () => {
	const result = scoreQuiz(answers('ABBDBDBDAACC'));
	assert.equal(result.scores.energie, result.scores.force);
	assert.equal(result.percentages.force, 50);
	assert.ok(result.percentages.energie < 50);
	assert.equal(result.profile.key, 'force');
});

test('Q12 départage les seuls profils ex æquo', () => {
	const result = scoreQuiz(answers('AACADABBDCCC'));
	assert.equal(result.percentages.reconnexion, result.percentages.force);
	assert.equal(result.profile.key, 'reconnexion');
	assert.equal(scoreQuiz(answers('DCCBCCAACDCB')).profile.key, 'force');
});

test('Q11 départage lorsque Q12 désigne un profil hors égalité', () => {
	const result = scoreQuiz(answers('ABAABBDAABBC'));
	assert.equal(result.percentages.energie, result.percentages.equilibre);
	assert.equal(result.profile.key, 'energie');
});

test('Un dernier repli stable résout les égalités persistantes', () => {
	const result = scoreQuiz(answers('DAABADCAAADB'));
	assert.equal(result.percentages.energie, result.percentages.equilibre);
	assert.equal(result.profile.key, 'energie');
});

test('L’ordre des réponses reçues ne change pas le résultat', () => {
	const raw = answers('ACDACDCAACCB');
	assert.deepEqual(scoreQuiz([...raw].reverse()), scoreQuiz(raw));
});

test('Les réponses incomplètes, dupliquées ou falsifiées sont refusées', () => {
	const raw = answers('AAAAAAAAAAAA');
	for (const invalid of [
		[],
		raw.slice(1),
		[...raw, raw[0]],
		[raw[1], ...raw.slice(1)],
		[{ id: 'inconnu', optionIndex: 0 }, ...raw.slice(1)],
		...[undefined, null, -1, 4, 1.5, NaN, '1'].map((optionIndex) => [
			{ id: raw[0].id, optionIndex },
			...raw.slice(1),
		]),
	])
		assert.equal(scoreQuiz(invalid), null);
});
