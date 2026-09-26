/**
 * Normalise un numéro français vers le format E.164 (+33XXXXXXXXX).
 * Accepte 06…, 0033…, +33…, et un 0 national après l’indicatif (+33 06…).
 */
export function normalizeFrenchPhone(input: string): string | null {
	const compact = input.trim().replace(/[\s.\-()]/g, '');
	if (!compact) return null;

	let national = '';
	if (compact.startsWith('+33')) national = compact.slice(3);
	else if (compact.startsWith('0033')) national = compact.slice(4);
	else if (compact.startsWith('0')) national = compact.slice(1);
	else return null;

	if (national.startsWith('0')) national = national.slice(1);
	if (!/^[1-9]\d{8}$/.test(national)) return null;
	return `+33${national}`;
}
