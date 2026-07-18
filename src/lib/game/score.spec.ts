import { describe, it, expect } from 'vitest';
import { scoreTurn, errorPenalty } from './score.js';
import { DEFAULT_CONFIG, BASE_POINTS } from './config.js';
import type { GameConfig } from './types.js';

const config: GameConfig = { ...DEFAULT_CONFIG, language: 'de', minLength: 2, turnSeconds: 30 };

describe('scoreTurn', () => {
	it('awards base points for a minimal-length word answered instantly', () => {
		const b = scoreTurn({
			normalizedWord: 'ei',
			endLetter: 'i',
			durationMs: 0,
			config,
			comboCount: 0
		});
		expect(b.base).toBe(BASE_POINTS);
		expect(b.lengthBonus).toBe(0);
	});

	it('grows the length bonus with longer words', () => {
		const short = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 0,
			config,
			comboCount: 0
		});
		const long = scoreTurn({
			normalizedWord: 'tigerkatze',
			endLetter: 'e',
			durationMs: 0,
			config,
			comboCount: 0
		});
		expect(long.lengthBonus).toBeGreaterThan(short.lengthBonus);
	});

	it('gives a higher rarity bonus for a rare end letter than a common one', () => {
		const rare = scoreTurn({
			normalizedWord: 'smaragdq',
			endLetter: 'q',
			durationMs: 0,
			config,
			comboCount: 0
		});
		const common = scoreTurn({
			normalizedWord: 'katze',
			endLetter: 'e',
			durationMs: 0,
			config,
			comboCount: 0
		});
		expect(rare.rarityBonus).toBeGreaterThan(common.rarityBonus);
	});

	it('rewards a faster answer with a larger tempo bonus', () => {
		const fast = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 1000,
			config,
			comboCount: 0
		});
		const slow = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 29000,
			config,
			comboCount: 0
		});
		expect(fast.tempoBonus).toBeGreaterThan(slow.tempoBonus);
	});

	it('increases the combo bonus with the streak but caps it', () => {
		const two = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 0,
			config,
			comboCount: 2
		});
		const many = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 0,
			config,
			comboCount: 3
		});
		const wayOver = scoreTurn({
			normalizedWord: 'tier',
			endLetter: 'r',
			durationMs: 0,
			config,
			comboCount: 99
		});
		expect(many.comboBonus).toBeGreaterThan(two.comboBonus);
		expect(wayOver.comboBonus).toBe(
			scoreTurn({
				normalizedWord: 'tier',
				endLetter: 'r',
				durationMs: 0,
				config,
				comboCount: 5
			}).comboBonus
		);
	});

	it('has a total equal to the sum of its parts', () => {
		const b = scoreTurn({
			normalizedWord: 'tigerq',
			endLetter: 'q',
			durationMs: 5000,
			config,
			comboCount: 2
		});
		expect(b.total).toBe(
			b.base + b.lengthBonus + b.rarityBonus + b.tempoBonus + b.comboBonus + b.penalty
		);
	});
});

describe('errorPenalty', () => {
	it('is negative', () => {
		expect(errorPenalty()).toBeLessThan(0);
	});
});
