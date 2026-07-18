import { describe, it, expect } from 'vitest';
import { lettersMatch, validateTurn } from './rules.js';
import { DEFAULT_CONFIG } from './config.js';
import type { GameConfig } from './types.js';

const config: GameConfig = { ...DEFAULT_CONFIG, language: 'de', minLength: 3 };
const noWords = new Set<string>();

describe('validateTurn', () => {
	it('accepts a valid word and returns its end letter as the next required start', () => {
		const result = validateTurn({ raw: 'Tiger', requiredStart: 't', usedWords: noWords, config });
		expect(result.valid).toBe(true);
		expect(result.normalizedWord).toBe('tiger');
		expect(result.endLetter).toBe('r');
	});

	it('accepts any first word when requiredStart is empty', () => {
		const result = validateTurn({ raw: 'Apfel', requiredStart: '', usedWords: noWords, config });
		expect(result.valid).toBe(true);
	});

	it('rejects a word with the wrong start letter', () => {
		const result = validateTurn({ raw: 'Katze', requiredStart: 't', usedWords: noWords, config });
		expect(result.valid).toBe(false);
		expect(result.reason).toBe('wrong-start');
	});

	it('rejects a word shorter than minLength', () => {
		const result = validateTurn({ raw: 'To', requiredStart: 't', usedWords: noWords, config });
		expect(result.valid).toBe(false);
		expect(result.reason).toBe('too-short');
	});

	it('rejects a duplicate word already played this session', () => {
		const used = new Set(['tiger']);
		const result = validateTurn({ raw: 'Tiger', requiredStart: 't', usedWords: used, config });
		expect(result.valid).toBe(false);
		expect(result.reason).toBe('duplicate');
	});

	it('reports empty before any other reason', () => {
		const result = validateTurn({ raw: '   ', requiredStart: 't', usedWords: noWords, config });
		expect(result.reason).toBe('empty');
	});

	it('reports too-short before wrong-start', () => {
		// 'ab' is both too short and wrong start (needs 't') — too-short wins.
		const result = validateTurn({ raw: 'ab', requiredStart: 't', usedWords: noWords, config });
		expect(result.reason).toBe('too-short');
	});

	it('reports wrong-start before duplicate', () => {
		// 'katze' is already used AND has the wrong start — wrong-start wins.
		const used = new Set(['katze']);
		const result = validateTurn({ raw: 'Katze', requiredStart: 't', usedWords: used, config });
		expect(result.reason).toBe('wrong-start');
	});
});

describe('lettersMatch', () => {
	it('is case-insensitive', () => {
		expect(lettersMatch('A', 'a')).toBe(true);
	});

	it('folds umlauts to their base vowel and ß to s', () => {
		expect(lettersMatch('ä', 'a')).toBe(true);
		expect(lettersMatch('ü', 'u')).toBe(true);
		expect(lettersMatch('ß', 's')).toBe(true);
	});

	it('still rejects genuinely different letters', () => {
		expect(lettersMatch('a', 'b')).toBe(false);
	});
});
