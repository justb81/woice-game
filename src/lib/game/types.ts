/**
 * Shared type surface for Woice's game logic. Pure declarations only — no runtime
 * behaviour lives here so this module is safe to import from both the browser state
 * layer and the Node test runner.
 */

/** UI + word-model language. The letter-value model and speech recogniser both key off this. */
export type Language = 'de' | 'en';

/** Which screen the single-page state machine is showing. */
export type Phase = 'home' | 'lobby' | 'ingame' | 'summary' | 'stats';

export interface Player {
	id: string;
	name: string;
	score: number;
	/** Invalid turns this player has made — tracked for stats only; no longer ends the round. */
	errors: number;
	/** Player accent colour (hex). Auto-assigned on join, editable in the lobby. */
	color: string;
}

export interface GameConfig {
	language: Language;
	/** Minimum letters a word must have to count. */
	minLength: number;
	/** Length of a player's turn window in seconds. `0` disables the per-turn timer. */
	turnSeconds: number;
	/** Length of the whole round in seconds. `0` disables the round timer. */
	roundSeconds: number;
	/** Round ends once any player reaches this score. */
	targetScore: number;
	/** Normalised letter the very first turn must start with. */
	startLetter: string;
}

/** Why a turn was rejected. Ordered by the precedence `validateTurn` checks them in. */
export type ValidationError = 'empty' | 'too-short' | 'wrong-start' | 'duplicate';

export interface ValidationResult {
	valid: boolean;
	reason?: ValidationError;
	/** The cleaned-up word (lowercased, first token, punctuation stripped). */
	normalizedWord: string;
	/** Last letter of the accepted word — the required start for the next turn. Empty if invalid. */
	endLetter: string;
}

/** Itemised points for a single valid turn; `total` is the sum of every field. */
export interface ScoreBreakdown {
	base: number;
	rarityBonus: number;
	tempoBonus: number;
	/** Repetition malus for frequently-used end letters (and any other deductions). Zero or negative. */
	penalty: number;
	total: number;
}

export interface Turn {
	id: number;
	playerId: string;
	/** Exactly what the player said/typed, before normalisation. */
	rawInput: string;
	normalizedWord: string;
	requiredStart: string;
	endLetter: string;
	valid: boolean;
	reason?: ValidationError;
	durationMs: number;
	/** Points for this turn, or `null` for an invalid turn. */
	breakdown: ScoreBreakdown | null;
}
