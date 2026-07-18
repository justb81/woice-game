/**
 * Per-language letter-rarity model. A word's end letter drives its rarity bonus:
 * common end letters are worth little, awkward ones (q, x, y, ß …) a lot, nudging
 * players toward tactical hand-offs. Values are rough frequency inverses, not
 * calibrated data yet (see docs/design.md → "Seltenheitsmodell für Buchstaben").
 */

import type { Language } from './types.js';

/** Fallback value for any letter not in a language's table (e.g. accented letters from ASR). */
export const DEFAULT_LETTER_VALUE = 3;

/**
 * Lower = more common (cheaper), higher = rarer (more points). Only letters that
 * deviate from the default are listed; everything else resolves to DEFAULT_LETTER_VALUE.
 */
export const LETTER_VALUES: Record<Language, Record<string, number>> = {
	de: {
		e: 1,
		n: 1,
		s: 1,
		r: 1,
		t: 1,
		i: 1,
		a: 2,
		d: 2,
		h: 2,
		u: 2,
		l: 2,
		g: 2,
		o: 3,
		m: 3,
		b: 4,
		f: 4,
		k: 4,
		w: 4,
		z: 5,
		p: 5,
		v: 6,
		j: 8,
		ä: 6,
		ö: 7,
		ü: 7,
		y: 8,
		x: 9,
		q: 10,
		ß: 10
	},
	en: {
		e: 1,
		t: 1,
		a: 1,
		o: 1,
		n: 1,
		s: 1,
		r: 2,
		i: 2,
		l: 2,
		d: 2,
		h: 3,
		c: 3,
		u: 3,
		m: 3,
		p: 4,
		g: 4,
		w: 4,
		y: 4,
		b: 5,
		f: 5,
		v: 6,
		k: 6,
		j: 8,
		x: 8,
		q: 9,
		z: 9
	}
};

/** Rarity value of a letter in the given language; case-insensitive, with a safe fallback. */
export function letterValue(letter: string, language: Language): number {
	return LETTER_VALUES[language][letter.toLowerCase()] ?? DEFAULT_LETTER_VALUE;
}
