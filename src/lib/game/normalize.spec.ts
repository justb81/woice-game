import { describe, it, expect } from 'vitest';
import { normalizeWord, firstLetter, lastLetter } from './normalize.js';

describe('normalizeWord', () => {
	it('lowercases and trims surrounding whitespace', () => {
		expect(normalizeWord('  Tiger ')).toBe('tiger');
	});

	it('keeps only the first token of a multi-word transcript', () => {
		expect(normalizeWord('roter Apfel')).toBe('roter');
	});

	it('strips trailing punctuation and digits', () => {
		expect(normalizeWord('Haus!123')).toBe('haus');
	});

	it('preserves German umlauts and ß', () => {
		expect(normalizeWord('Größe')).toBe('größe');
	});

	it('returns empty string for whitespace-only input', () => {
		expect(normalizeWord('   ')).toBe('');
	});
});

describe('firstLetter / lastLetter', () => {
	it('reads the first and last letter of a word', () => {
		expect(firstLetter('tiger')).toBe('t');
		expect(lastLetter('tiger')).toBe('r');
	});

	it('treats ß as the last letter when a word ends in it', () => {
		expect(lastLetter('fluß')).toBe('ß');
	});

	it('keeps the umlaut as the terminal letter', () => {
		expect(lastLetter('größe')).toBe('e');
		expect(firstLetter('öl')).toBe('ö');
	});

	it('returns empty string for an empty word', () => {
		expect(firstLetter('')).toBe('');
		expect(lastLetter('')).toBe('');
	});
});
