import { describe, it, expect } from 'vitest';
import { scoreTurn, errorPenalty, projectedEndLetterScore } from './score.js';
import { DEFAULT_CONFIG, BASE_POINTS, MIN_TURN_SCORE } from './config.js';
import type { GameConfig } from './types.js';

const config: GameConfig = { ...DEFAULT_CONFIG, language: 'de', minLength: 2, turnSeconds: 30 };

describe('scoreTurn', () => {
	it('awards base points for a word answered instantly', () => {
		const b = scoreTurn({
			normalizedWord: 'ei',
			endLetter: 'i',
			durationMs: 0,
			config,
			endLetterUses: 0
		});
		expect(b.base).toBe(BASE_POINTS);
	});

	it('gives a higher rarity bonus for a rare end letter than a common one', () => {
		const rare = scoreTurn({
			normalizedWord: 'smaragdq',
			endLetter: 'q',
			durationMs: 0,
			config,
			endLetterUses: 0
		});
		const common = scoreTurn({
			normalizedWord: 'katze',
			endLetter: 'e',
			durationMs: 0,
			config,
			endLetterUses: 0
		});
		expect(rare.rarityBonus).toBeGreaterThan(common.rarityBonus);
	});

	it('rewards a faster answer with a larger tempo bonus', () => {
		const fast = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 1000,
			config,
			endLetterUses: 0
		});
		const slow = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 29000,
			config,
			endLetterUses: 0
		});
		expect(fast.tempoBonus).toBeGreaterThan(slow.tempoBonus);
	});

	it('applies no repetition malus the first time an end letter is used', () => {
		const b = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 0,
			config,
			endLetterUses: 0
		});
		expect(b.penalty).toBe(0);
	});

	it('grows the repetition malus with each earlier use of the same end letter', () => {
		const once = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 0,
			config,
			endLetterUses: 1
		});
		const thrice = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 0,
			config,
			endLetterUses: 3
		});
		expect(once.penalty).toBeLessThan(0);
		expect(thrice.penalty).toBeLessThan(once.penalty);
		// The malus drags the total down as the letter is repeated.
		expect(thrice.total).toBeLessThan(once.total);
	});

	it('can push a repeated common end letter to a negative total', () => {
		const b = scoreTurn({
			normalizedWord: 'katze',
			endLetter: 'e',
			durationMs: 30000,
			config,
			endLetterUses: 10
		});
		expect(b.total).toBeLessThan(0);
	});

	it('has a total equal to the sum of its parts', () => {
		const b = scoreTurn({
			normalizedWord: 'tigerq',
			endLetter: 'q',
			durationMs: 5000,
			config,
			endLetterUses: 2
		});
		expect(b.total).toBe(b.base + b.rarityBonus + b.tempoBonus + b.penalty);
	});

	it('caps a heavily-penalised turn at MIN_TURN_SCORE', () => {
		const b = scoreTurn({
			normalizedWord: 'katze',
			endLetter: 'e',
			durationMs: 30000,
			config,
			endLetterUses: 20
		});
		expect(b.total).toBe(MIN_TURN_SCORE);
	});

	it('keeps the breakdown summing to total even when the cap kicks in', () => {
		const b = scoreTurn({
			normalizedWord: 'katze',
			endLetter: 'e',
			durationMs: 30000,
			config,
			endLetterUses: 20
		});
		expect(b.total).toBe(b.base + b.rarityBonus + b.tempoBonus + b.penalty);
	});
});

describe('scoreTurn rule toggles', () => {
	it('drops the rarity bonus when the rule is off', () => {
		const b = scoreTurn({
			normalizedWord: 'smaragdq',
			endLetter: 'q',
			durationMs: 0,
			config: { ...config, rarityBonus: false },
			endLetterUses: 0
		});
		expect(b.rarityBonus).toBe(0);
	});

	it('drops the tempo bonus when the rule is off', () => {
		const b = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 0,
			config: { ...config, tempoBonus: false },
			endLetterUses: 0
		});
		expect(b.tempoBonus).toBe(0);
	});

	it('drops the repetition malus when the rule is off', () => {
		const b = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 0,
			config: { ...config, repetitionPenalty: false },
			endLetterUses: 5
		});
		expect(b.penalty).toBe(0);
	});
});

describe('projectedEndLetterScore', () => {
	it('is non-negative for a fresh end letter', () => {
		expect(projectedEndLetterScore('e', 0, config)).toBeGreaterThanOrEqual(0);
	});

	it('goes negative once a common end letter is over-used', () => {
		expect(projectedEndLetterScore('e', 6, config)).toBeLessThan(0);
	});

	it('never drops below the minus-point cap', () => {
		expect(projectedEndLetterScore('e', 50, config)).toBe(MIN_TURN_SCORE);
	});

	it('never penalises when the repetition rule is off', () => {
		const projected = projectedEndLetterScore('e', 50, { ...config, repetitionPenalty: false });
		expect(projected).toBeGreaterThanOrEqual(0);
	});
});

describe('errorPenalty', () => {
	it('is negative', () => {
		expect(errorPenalty()).toBeLessThan(0);
	});
});
