/**
 * Word normalisation shared by rules and scoring. Deliberately Unicode-aware:
 * German umlauts (äöü) and ß are legal first/last letters, so they must survive
 * normalisation — only surrounding punctuation, digits and extra tokens are dropped.
 */

/**
 * Clean a raw transcript/typed string into a comparable word:
 * take the first whitespace-separated token, lowercase it, and strip anything
 * that isn't a letter (keeping Unicode letters like ä, ö, ü, ß, é, ñ …).
 */
export function normalizeWord(raw: string): string {
	const firstToken = raw.trim().split(/\s+/)[0] ?? '';
	// \p{L} keeps letters from any script; everything else (punctuation, digits) goes.
	return firstToken.toLowerCase().replace(/[^\p{L}]/gu, '');
}

/** First letter of a normalised word, or '' when empty. Uses the array spread so
 *  multi-code-unit letters are handled as single characters. */
export function firstLetter(word: string): string {
	return [...word][0] ?? '';
}

/** Last letter of a normalised word, or '' when empty. */
export function lastLetter(word: string): string {
	const letters = [...word];
	return letters[letters.length - 1] ?? '';
}
