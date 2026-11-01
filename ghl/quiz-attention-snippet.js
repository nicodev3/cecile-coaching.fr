		/* RE-FLOW — points d’attention transmis au formulaire GHL (champ caché reflow_attention).
		   Mêmes règles que la page de résultats (ghl/reflow-resultats.html). */
		var ATTENTION_RULES = {
			equilibre: [
				['energie', [1, 2, 3], 'Ton énergie peut varier. Prévois une pratique modulable plutôt qu’un programme rigide.'],
				['mouvements', [1, 2, 3], 'L’aisance de certains mouvements mérite aussi d’être prise en compte dans le choix des exercices.'],
			],
			energie: [
				['energie', [2, 3], 'Ton énergie semble occuper une place importante dans ton quotidien. La priorité est de comprendre ce qui est réaliste pour toi aujourd’hui.'],
				['endurance', [2, 3], 'Les efforts prolongés semblent difficiles. Il est important de faire le point sur tes possibilités avant de définir une progression.'],
				['recuperation', [1, 2, 3], 'La récupération mérite une attention particulière dans l’organisation de tes activités.'],
			],
			reconnexion: [
				['corps', [1, 2, 3], 'Le rapport à tes sensations corporelles semble être un point important de ton parcours.'],
				['reprise', [2, 3], 'L’appréhension de la reprise mérite d’être prise en compte dans le choix des premières étapes.'],
				['apprehensions', [3], 'Il sera important de vérifier que les exercices sont adaptés à ta situation.'],
			],
			force: [
				['mouvements', [1, 2, 3], 'Certains mouvements te demandent davantage d’efforts ou d’adaptations. Le choix des exercices doit en tenir compte.'],
				['endurance', [2, 3], 'L’endurance est également un point à explorer avant de fixer des objectifs de progression.'],
				['taches', [2, 3], 'Les difficultés dans les tâches quotidiennes doivent être prises en compte dans la définition de tes priorités.'],
			],
		};
		function reflowAttention(profileKey, byId) {
			var texts = (ATTENTION_RULES[profileKey] || [])
				.filter(function (rule) {
					return rule[1].indexOf(byId[rule[0]]) !== -1;
				})
				.map(function (rule) {
					return rule[2];
				});
			if (!texts.length) return '';
			return (texts.length > 1 ? 'Tes points d’attention : ' : 'Ton point d’attention : ') + texts.join(' ');
		}
		url.searchParams.set('reflow_attention', reflowAttention(profile.key, byId));
