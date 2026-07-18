/**
 * The Score Engine: turns a valid move into an itemised point breakdown.
 * Every component is transparent (see ScoreBreakdown) so the UI can show *why*
 * a word scored what it did — base + end-letter rarity + tempo − repetition malus.
 */

import type { GameConfig, ScoreBreakdown } from './types.js';
import { BASE_POINTS, ERROR_PENALTY, MAX_TEMPO_BONUS, REPETITION_PENALTY_PER_USE } from './config.js';
import { letterValue } from './letterValues.js';

export interface ScoreTurnInput {
	normalizedWord: string;
	/** Last letter of the word — the rarity bonus is based on this (it's the tactical hand-off). */
	endLetter: string;
	/** How long the player took, in ms. Faster answers earn a larger tempo bonus. */
	durationMs: number;
	config: GameConfig;
	/** How many earlier valid turns this round already ended with this same letter (before this one). */
	endLetterUses: number;
}

/** Score a valid turn. The returned `total` always equals the sum of the other fields. */
export function scoreTurn({
	endLetter,
	durationMs,
	config,
	endLetterUses
}: ScoreTurnInput): ScoreBreakdown {
	const base = BASE_POINTS;
	const rarityBonus = letterValue(endLetter, config.language);

	// Fraction of the turn window still remaining, clamped to [0, 1]. A 0-second
	// window (timer disabled) yields no tempo bonus rather than dividing by zero.
	const windowMs = config.turnSeconds * 1000;
	const remaining = windowMs > 0 ? Math.max(0, 1 - durationMs / windowMs) : 0;
	const tempoBonus = Math.round(remaining * MAX_TEMPO_BONUS);

	// Repetition malus: every earlier use of this end letter this round makes it worth less,
	// eventually pushing the turn's net value negative — the point is to discourage re-using letters.
	const uses = Math.max(0, endLetterUses);
	const penalty = uses > 0 ? -(uses * REPETITION_PENALTY_PER_USE) : 0;
	const total = base + rarityBonus + tempoBonus + penalty;

	return { base, rarityBonus, tempoBonus, penalty, total };
}

/** Negative score delta applied when a player's turn is invalid. */
export function errorPenalty(): number {
	return -ERROR_PENALTY;
}
