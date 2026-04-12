const NBSP = '\u00a0';

/**
 * Empêche le point d’interrogation de passer seul à la ligne en liant le « ? »
 * au mot qui le précède (espace insécable, usage courant en typographie française).
 */
export function tieFrenchQuestionMark(text: string): string {
	return text.replace(/\s+(\?)/g, `${NBSP}$1`);
}
