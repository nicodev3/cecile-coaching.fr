/**
 * Outils interactifs (auto-évaluations) - chemins avec slash final pour cohérence sitemap.
 * Source de vérité unique pour la nav, le footer et le hub /outils/.
 */
export type ToolKey = 'reflow';

export interface Tool {
	key: ToolKey;
	/** URL de la page outil */
	slug: `/outils/${string}/`;
	/** Libellé long pour titres, nav et footer */
	label: string;
	/** Libellé court pour breadcrumbs / cartes */
	shortLabel: string;
	/** Tagline (1 phrase) utilisée dans les cartes du hub */
	tagline: string;
	/** Durée indicative annoncée sur la carte */
	duration: string;
	/** Un outil non disponible s'affiche en « bientôt » sans lien */
	available: boolean;
}

export const TOOLS_BY_KEY: Record<ToolKey, Tool> = {
	reflow: {
		key: 'reflow',
		slug: '/outils/auto-evaluation-re-flow/',
		label: 'Auto-évaluation Re-flow',
		shortLabel: 'Re-flow',
		tagline:
			'10 questions pour situer ton déconditionnement physique et son incidence sur le quotidien.',
		duration: '2 minutes',
		available: true,
	},
};

export const TOOLS: readonly Tool[] = [TOOLS_BY_KEY.reflow];
