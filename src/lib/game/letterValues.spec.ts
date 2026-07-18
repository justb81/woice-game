import { describe, it, expect } from 'vitest';
import { letterValue, DEFAULT_LETTER_VALUE } from './letterValues.js';

describe('letterValue', () => {
	it('scores rare letters higher than common ones (de)', () => {
		expect(letterValue('q', 'de')).toBeGreaterThan(letterValue('e', 'de'));
		expect(letterValue('x', 'de')).toBeGreaterThan(letterValue('n', 'de'));
	});

	it('scores rare letters higher than common ones (en)', () => {
		expect(letterValue('z', 'en')).toBeGreaterThan(letterValue('e', 'en'));
		expect(letterValue('q', 'en')).toBeGreaterThan(letterValue('a', 'en'));
	});

	it('is case-insensitive', () => {
		expect(letterValue('Q', 'de')).toBe(letterValue('q', 'de'));
	});

	it('gives German umlauts and ß a defined, above-average value', () => {
		expect(letterValue('ß', 'de')).toBeGreaterThan(DEFAULT_LETTER_VALUE);
		expect(letterValue('ü', 'de')).toBeGreaterThan(DEFAULT_LETTER_VALUE);
	});

	it('falls back to the default for letters absent from the table', () => {
		// 'é' is not modelled in either language.
		expect(letterValue('é', 'en')).toBe(DEFAULT_LETTER_VALUE);
	});

	it('weights the same letter differently across languages where the model differs', () => {
		// 'a' is a common vowel in English (1) but slightly rarer as a German ending (2).
		expect(letterValue('a', 'en')).not.toBe(letterValue('a', 'de'));
	});
});
