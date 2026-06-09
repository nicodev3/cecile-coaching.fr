const NBSP = '\u00a0';

/**
 * Empêche les signes de ponctuation doubles français de passer seuls à la ligne
 * en les liant au mot qui précède avec une espace insécable.
 */
export function tieFrenchPunctuation(text: string): string {
	return text.replace(/\s+([:;?!])/g, `${NBSP}$1`);
}

export const tieFrenchQuestionMark = tieFrenchPunctuation;
