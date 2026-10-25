import { QUIZ_URL } from '../utils/tunnelUrl';

/**
 * Outils interactifs (auto-évaluations), hébergés dans le funnel GoHighLevel.
 * Source de vérité unique pour la nav, le footer et le hub /outils/.
 */
export type ToolKey = 'reflow';

export interface Tool {
	key: ToolKey;
	/** URL absolue de l’outil */
	slug: string;
	/** Libellé long pour titres, nav et footer */
	label: string;
	/** Libellé court pour breadcrumbs / cartes */
	shortLabel: string;
	/** Tagline (1 phrase) utilisée dans les cartes du hub */
	tagline: string;
	/** Durée indicative annoncée sur la carte */
	duration: string;
	/** Un outil non disponible s’affiche en « bientôt » sans lien */
	available: boolean;
}

export const TOOLS_BY_KEY: Record<ToolKey, Tool> = {
	reflow: {
		key: 'reflow',
		slug: QUIZ_URL,
		label: 'Auto-évaluation Re-flow',
		shortLabel: 'Quiz : évalue tes capacités physiques en 12 questions',
		tagline:
			'Découvre ce dont tu as (vraiment) besoin pour retrouver de l\'énergie',
		duration: '2 minutes',
		available: true,
	},
};

export const TOOLS: readonly Tool[] = [TOOLS_BY_KEY.reflow];
