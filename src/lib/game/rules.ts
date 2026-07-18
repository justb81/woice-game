/**
 * The Rule Engine: decides whether a spoken/typed word is a legal next move.
 * No dictionary in the MVP — a move is legal if it's non-empty, long enough,
 * starts with the required letter, and hasn't been played this session.
 */

import type { GameConfig, Strictness, ValidationResult } from './types.js';
import { normalizeWord, firstLetter, lastLetter } from './normalize.js';

/** Fold a letter for `locker` matching: umlauts → base vowel, ß → s. */
function fold(letter: string): string {
	const map: Record<string, string> = { ä: 'a', ö: 'o', ü: 'u', ß: 's' };
	return map[letter] ?? letter;
}

/**
 * Do two (already single-letter) values count as the same start letter under the
 * given strictness? `streng` needs an exact match; `standard` lowercases both;
 * `locker` additionally folds umlauts and ß onto their base letters.
 */
export function lettersMatch(a: string, b: string, strictness: Strictness): boolean {
	if (strictness === 'streng') return a === b;
	const x = a.toLowerCase();
	const y = b.toLowerCase();
	if (strictness === 'standard') return x === y;
	return fold(x) === fold(y);
}

export interface ValidateTurnInput {
	raw: string;
	/** Letter this turn must start with. Empty means "anything" (used for a free start word). */
	requiredStart: string;
	/** Normalised words already played this session. */
	usedWords: ReadonlySet<string>;
	config: GameConfig;
}

/**
 * Validate a single move. Checks run in a fixed precedence so the player always
 * gets the most fundamental reason first: empty → too-short → wrong-start → duplicate.
 */
export function validateTurn({
	raw,
	requiredStart,
	usedWords,
	config
}: ValidateTurnInput): ValidationResult {
	const normalizedWord = normalizeWord(raw);

	if (normalizedWord === '') {
		return { valid: false, reason: 'empty', normalizedWord, endLetter: '' };
	}

	if ([...normalizedWord].length < config.minLength) {
		return { valid: false, reason: 'too-short', normalizedWord, endLetter: '' };
	}

	if (
		requiredStart !== '' &&
		!lettersMatch(firstLetter(normalizedWord), requiredStart, config.strictness)
	) {
		return { valid: false, reason: 'wrong-start', normalizedWord, endLetter: '' };
	}

	if (usedWords.has(normalizedWord)) {
		return { valid: false, reason: 'duplicate', normalizedWord, endLetter: '' };
	}

	return { valid: true, normalizedWord, endLetter: lastLetter(normalizedWord) };
}
