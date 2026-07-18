/** Central tuning knobs for the game. Kept in one place so balancing is a single edit. */

import type { GameConfig } from './types.js';

/** Fixed points every valid word earns before bonuses. */
export const BASE_POINTS = 5;

/** How many of the most recent turns the In-Game history shows. */
export const MAX_HISTORY = 10;

/** Points the round's longest word earns its player, per letter, once at round end. */
export const LONGEST_WORD_BONUS_PER_LETTER = 1;

/**
 * Repetition malus per *earlier* use of the same end letter this round. The more often an end
 * letter has already been played, the smaller (and eventually negative) the turn's net value.
 */
export const REPETITION_PENALTY_PER_USE = 2;

/** Maximum tempo bonus, awarded for an instant answer; scales to 0 as the timer runs out. */
export const MAX_TEMPO_BONUS = 5;

/** Points lost on an invalid turn. */
export const ERROR_PENALTY = 3;

/** Sensible defaults for a fresh lobby. */
export const DEFAULT_CONFIG: GameConfig = {
	language: 'en',
	minLength: 2,
	turnSeconds: 30,
	roundSeconds: 0,
	targetScore: 100,
	startLetter: ''
};
