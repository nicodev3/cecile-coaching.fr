/**
 * Pistes d’articles pour le maillage SEO (blog → piliers → tunnel).
 * À décliner en fichiers dans `src/content/blog/` au fil des publications.
 */
export type EditorialPillar = 'apa' | 'maladie-chronique' | 'fatigue';

export type EditorialSuggestion = {
	title: string;
	pillar: EditorialPillar;
	note?: string;
};

export const editorialSuggestions: EditorialSuggestion[] = [
	{
		title: 'Reprendre le sport après une longue période sans bouger : par où commencer ?',
		pillar: 'maladie-chronique',
		note: 'Intention douce, pas de prescription médicale.',
	},
	{
		title: '« Mauvais jour » : une séance de 10 minutes peut-elle suffire ?',
		pillar: 'fatigue',
	},
	{
		title: 'APA et douleur chronique : adapter sans aggraver',
		pillar: 'apa',
	},
	{
		title: 'Fatigue chronique : comment parler d’effort sans culture de la performance',
		pillar: 'fatigue',
	},
	{
		title: 'Déconditionnement physique et maladie chronique : ce que dit le mouvement',
		pillar: 'maladie-chronique',
	},
	{
		title: 'Respiration, ancrage et retour au corps : compléments au mouvement adapté',
		pillar: 'apa',
	},
	{
		title: 'Accompagnement en ligne et APA : ce qu’il est raisonnable d’attendre',
		pillar: 'apa',
	},
	{
		title: 'Routine du matin très courte quand l’énergie est capricieuse',
		pillar: 'fatigue',
	},
];
