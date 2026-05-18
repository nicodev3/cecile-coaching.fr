/** Estime la durée de lecture (mots / minute, arrondi au supérieur). */
export function estimateReadingTime(text: string, wordsPerMinute = 200): number {
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / wordsPerMinute));
}
