/**
 * The Score Engine: turns a valid move into an itemised point breakdown.
 * Every component is transparent (see ScoreBreakdown) so the UI can show *why*
 * a word scored what it did — base + length + end-letter rarity + tempo + combo.
 */

import type { GameConfig, ScoreBreakdown } from './types.js';
import {
	BASE_POINTS,
	COMBO_CAP,
	COMBO_STEP,
	ERROR_PENALTY,
	LENGTH_BONUS_PER_LETTER,
	MAX_TEMPO_BONUS
} from './config.js';
import { letterValue } from './letterValues.js';

export interface ScoreTurnInput {
	normalizedWord: string;
	/** Last letter of the word — the rarity bonus is based on this (it's the tactical hand-off). */
	endLetter: string;
	/** How long the player took, in ms. Faster answers earn a larger tempo bonus. */
	durationMs: number;
	config: GameConfig;
	/** Consecutive valid turns by this player, before this one. */
	comboCount: number;
}

/** Score a valid turn. The returned `total` always equals the sum of the other fields. */
export function scoreTurn({
	normalizedWord,
	endLetter,
	durationMs,
	config,
	comboCount
}: ScoreTurnInput): ScoreBreakdown {
	const length = [...normalizedWord].length;

	const base = BASE_POINTS;
	const lengthBonus = Math.max(0, length - config.minLength) * LENGTH_BONUS_PER_LETTER;
	const rarityBonus = letterValue(endLetter, config.language);

	// Fraction of the turn window still remaining, clamped to [0, 1]. A 0-second
	// window (timer disabled) yields no tempo bonus rather than dividing by zero.
	const windowMs = config.turnSeconds * 1000;
	const remaining = windowMs > 0 ? Math.max(0, 1 - durationMs / windowMs) : 0;
	const tempoBonus = Math.round(remaining * MAX_TEMPO_BONUS);

	const comboBonus = Math.min(comboCount, COMBO_CAP) * COMBO_STEP;

	const penalty = 0;
	const total = base + lengthBonus + rarityBonus + tempoBonus + comboBonus + penalty;

	return { base, lengthBonus, rarityBonus, tempoBonus, comboBonus, penalty, total };
}

/** Negative score delta applied when a player's turn is invalid. */
export function errorPenalty(): number {
	return -ERROR_PENALTY;
}
