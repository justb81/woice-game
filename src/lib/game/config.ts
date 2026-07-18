/** Central tuning knobs for the game. Kept in one place so balancing is a single edit. */

import type { GameConfig } from './types.js';

/** Fixed points every valid word earns before bonuses. */
export const BASE_POINTS = 5;

/** How many of the most recent turns the In-Game history shows. */
export const MAX_HISTORY = 10;

/** Points added per letter beyond `minLength`. */
export const LENGTH_BONUS_PER_LETTER = 1;

/** Largest combo streak that still increases the combo bonus. */
export const COMBO_CAP = 5;

/** Points per combo step (multiplied by the capped streak). */
export const COMBO_STEP = 2;

/** Maximum tempo bonus, awarded for an instant answer; scales to 0 as the timer runs out. */
export const MAX_TEMPO_BONUS = 5;

/** Points lost on an invalid turn. */
export const ERROR_PENALTY = 3;

/** Sensible defaults for a fresh lobby. */
export const DEFAULT_CONFIG: GameConfig = {
	language: 'en',
	strictness: 'standard',
	minLength: 2,
	turnSeconds: 30,
	targetScore: 100,
	errorLimit: 3,
	startLetter: ''
};
