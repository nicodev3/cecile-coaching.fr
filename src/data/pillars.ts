/** Pages piliers SEO (vitrine) — chemins avec slash final pour cohérence sitemap. */
export const PILLARS = [
	{
		slug: '/activites-physiques-adaptees/',
		label: 'Activités physiques adaptées',
		shortLabel: 'APA',
	},
	{
		slug: '/mouvement-maladie-chronique/',
		label: 'Mouvement et maladie chronique',
		shortLabel: 'Maladie chronique',
	},
	{
		slug: '/fatigue-chronique-mouvement/',
		label: 'Fatigue chronique et mouvement',
		shortLabel: 'Fatigue',
	},
] as const;

export type PillarKey = 'apa' | 'maladie-chronique' | 'fatigue';

export const PILLAR_BY_KEY: Record<
	PillarKey,
	(typeof PILLARS)[number] & { key: PillarKey }
> = {
	apa: { ...PILLARS[0], key: 'apa' },
	'maladie-chronique': { ...PILLARS[1], key: 'maladie-chronique' },
	fatigue: { ...PILLARS[2], key: 'fatigue' },
};
