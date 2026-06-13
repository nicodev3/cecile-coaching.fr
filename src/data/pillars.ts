/**
 * Pages piliers SEO (vitrine) — chemins avec slash final pour cohérence sitemap.
 * Source de vérité unique pour la nav, le footer, les hubs et les archives blog.
 */
export type PillarKey = 'apa' | 'maladie-chronique' | 'fatigue';

export interface Pillar {
	key: PillarKey;
	/** URL de la page guide (pilier vitrine) */
	slug: `/${string}/`;
	/** URL de l'archive blog filtrée sur ce pilier */
	archiveSlug: `/blog/${string}/`;
	/** Libellé long pour titres et footer */
	label: string;
	/** Libellé court pour breadcrumbs / tags */
	shortLabel: string;
	/** Tagline (1 phrase) utilisée dans les hubs et cartes */
	tagline: string;
	/** Articles blog mis en avant en tête du pilier (ids sans extension) */
	featuredPostIds?: readonly string[];
}

export const PILLARS_BY_KEY: Record<PillarKey, Pillar> = {
	apa: {
		key: 'apa',
		slug: '/activites-physiques-adaptees/',
		archiveSlug: '/blog/apa/',
		label: 'Activités physiques adaptées',
		shortLabel: 'APA',
		tagline:
			'Comprendre l’APA en ligne, ce qu’elle apporte et pourquoi c’est différent d’un coach sportif classique.',
		featuredPostIds: ['coach-apa'],
	},
	'maladie-chronique': {
		key: 'maladie-chronique',
		slug: '/mouvement-maladie-chronique/',
		archiveSlug: '/blog/maladie-chronique/',
		label: 'Mouvement et maladie chronique',
		shortLabel: 'Maladie chronique',
		tagline:
			'Repères doux pour réinstaller du mouvement à distance quand on vit avec une maladie chronique.',
		featuredPostIds: ['fatiguee-bouger-maladie-chronique', 'sport-adapte'],
	},
	fatigue: {
		key: 'fatigue',
		slug: '/fatigue-chronique-mouvement/',
		archiveSlug: '/blog/fatigue/',
		label: 'Fatigue chronique et mouvement',
		shortLabel: 'Fatigue',
		tagline:
			'Doser le mouvement chez soi quand l’énergie varie, sans culture de la performance.',
		featuredPostIds: ['fatigue-chronique-que-faire', 'syndrome-de-fatigue-chronique'],
	},
};

export const PILLARS: readonly Pillar[] = [
	PILLARS_BY_KEY.apa,
	PILLARS_BY_KEY['maladie-chronique'],
	PILLARS_BY_KEY.fatigue,
];

/** Conservé pour rétro-compatibilité avec d'anciens imports. */
export const PILLAR_BY_KEY = PILLARS_BY_KEY;
