/**
 * Long-term player statistics: a pure, framework-free aggregate folded once per
 * completed round. Kept out of the state layer so it's Node-testable and safe to import
 * from both the browser singleton and the prerender pass.
 *
 * The model is deliberately versioned and keyed by a *stable local identity*
 * (`playerKey(name)`) rather than the ephemeral per-session player id (`p1`, `p2`, …),
 * so a returning player accumulates across rounds — and so the shape maps cleanly onto
 * real accounts/leaderboards later (the `key` field is the seam an account id slots into).
 */

import type { Player, Turn } from './types.js';

/** Bump when the persisted shape changes incompatibly; an unknown version resets (see `stats.svelte.ts`). */
export const STATS_SCHEMA_VERSION = 1;

/** A tally of letters → how often they occurred (favorite-letter source). */
export type LetterCounts = Record<string, number>;

export interface PlayerStats {
	/** Stable local identity. v1 = `playerKey(name)`; a future account id slots in here. */
	key: string;
	/** Most recent name seen for this key — what the UI shows. */
	displayName: string;
	roundsPlayed: number;
	/** Rounds this player finished as the sole highest scorer. */
	wins: number;
	/** Rounds this player shared the top score with someone else. */
	ties: number;
	/** Sum of the engine's net round score (already includes error penalties). */
	totalScore: number;
	validWords: number;
	invalidTurns: number;
	/** End letters of this player's valid words — the "favorite letters" tally. */
	endLetterCounts: LetterCounts;
	/** Longest run of consecutive valid turns in any single round. */
	bestCombo: number;
	/** Consecutive rounds won up to and including the latest — resets on a loss or tie. */
	currentWinStreak: number;
	/** Best `currentWinStreak` ever reached. */
	bestWinStreak: number;
}

export interface Stats {
	version: number;
	roundsPlayed: number;
	/** Keyed by `PlayerStats.key`. */
	players: Record<string, PlayerStats>;
	/** ISO timestamp of the last mutation, or null before anything is recorded. Set by the state layer. */
	updatedAt: string | null;
}

/** A completed round's raw data — exactly what the session engine holds when it ends. */
export interface RoundInput {
	players: Player[];
	turns: Turn[];
}

/** A fresh, empty stats aggregate. */
export function emptyStats(): Stats {
	return { version: STATS_SCHEMA_VERSION, roundsPlayed: 0, players: {}, updatedAt: null };
}

/** Normalise a display name into a stable key: trim, lowercase, collapse inner whitespace. */
export function playerKey(name: string): string {
	return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function emptyPlayerStats(key: string, displayName: string): PlayerStats {
	return {
		key,
		displayName,
		roundsPlayed: 0,
		wins: 0,
		ties: 0,
		totalScore: 0,
		validWords: 0,
		invalidTurns: 0,
		endLetterCounts: {},
		bestCombo: 0,
		currentWinStreak: 0,
		bestWinStreak: 0
	};
}

/**
 * The winning player ids for a finished round: the single top scorer, or — on a shared top
 * score — every player tied for it. Mirrors the engine's `leader` / `hasUniqueLeader` rule.
 */
function topScorers(players: Player[]): Set<string> {
	if (players.length === 0) return new Set();
	const top = Math.max(...players.map((p) => p.score));
	return new Set(players.filter((p) => p.score === top).map((p) => p.id));
}

/** Longest run of consecutive valid turns by a given player within one round's turn list. */
function longestComboInRound(turns: Turn[], playerId: string): number {
	let best = 0;
	let run = 0;
	for (const t of turns) {
		if (t.playerId !== playerId) continue;
		if (t.valid) {
			run += 1;
			if (run > best) best = run;
		} else {
			run = 0;
		}
	}
	return best;
}

/**
 * Fold a completed round into the stats aggregate and return a *new* Stats (immutable —
 * `prev` is never mutated). Only players who took part are touched; everyone else is carried
 * over untouched. `updatedAt` is intentionally left as-is so this stays deterministic for
 * tests — the state layer stamps it.
 *
 * Score note: an invalid turn applies a flat penalty that is *not* stored on the Turn
 * (`breakdown` is null), so per-round score comes from `player.score`, which the engine
 * already maintains as the net total — never re-summed from turn breakdowns.
 */
export function recordRound(prev: Stats, { players, turns }: RoundInput): Stats {
	const winners = topScorers(players);
	const soleWinner = winners.size === 1;

	const nextPlayers: Record<string, PlayerStats> = { ...prev.players };

	for (const player of players) {
		const key = playerKey(player.name);
		const base = nextPlayers[key] ?? emptyPlayerStats(key, player.name);

		const playerTurns = turns.filter((t) => t.playerId === player.id);
		const validTurns = playerTurns.filter((t) => t.valid);

		const endLetterCounts: LetterCounts = { ...base.endLetterCounts };
		for (const t of validTurns) {
			if (t.endLetter === '') continue;
			endLetterCounts[t.endLetter] = (endLetterCounts[t.endLetter] ?? 0) + 1;
		}

		const isWinner = winners.has(player.id);
		const won = isWinner && soleWinner;
		const tied = isWinner && !soleWinner;

		const currentWinStreak = won ? base.currentWinStreak + 1 : 0;

		nextPlayers[key] = {
			...base,
			displayName: player.name,
			roundsPlayed: base.roundsPlayed + 1,
			wins: base.wins + (won ? 1 : 0),
			ties: base.ties + (tied ? 1 : 0),
			totalScore: base.totalScore + player.score,
			validWords: base.validWords + validTurns.length,
			invalidTurns: base.invalidTurns + (playerTurns.length - validTurns.length),
			endLetterCounts,
			bestCombo: Math.max(base.bestCombo, longestComboInRound(turns, player.id)),
			currentWinStreak,
			bestWinStreak: Math.max(base.bestWinStreak, currentWinStreak)
		};
	}

	return {
		version: prev.version,
		roundsPlayed: prev.roundsPlayed + 1,
		players: nextPlayers,
		updatedAt: prev.updatedAt
	};
}

/** A player's most-used end letters, most frequent first, capped at `limit`. Ties break alphabetically. */
export function favoriteLetters(
	player: PlayerStats,
	limit = 3
): { letter: string; count: number }[] {
	return Object.entries(player.endLetterCounts)
		.map(([letter, count]) => ({ letter, count }))
		.sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter))
		.slice(0, limit);
}

/** All players ranked by wins (then best streak, then total score), most successful first. */
export function topWinners(stats: Stats, limit = 10): PlayerStats[] {
	return Object.values(stats.players)
		.sort(
			(a, b) => b.wins - a.wins || b.bestWinStreak - a.bestWinStreak || b.totalScore - a.totalScore
		)
		.slice(0, limit);
}

/** End-letter tally summed across every player — the group's collective favorite letters. */
export function globalFavoriteLetters(
	stats: Stats,
	limit = 5
): { letter: string; count: number }[] {
	const totals: LetterCounts = {};
	for (const player of Object.values(stats.players)) {
		for (const [letter, count] of Object.entries(player.endLetterCounts)) {
			totals[letter] = (totals[letter] ?? 0) + count;
		}
	}
	return Object.entries(totals)
		.map(([letter, count]) => ({ letter, count }))
		.sort((a, b) => b.count - a.count || a.letter.localeCompare(b.letter))
		.slice(0, limit);
}

/** The best single-round combo across all players — the headline "streak" for the summary. */
export function bestComboOverall(stats: Stats): number {
	return Object.values(stats.players).reduce((best, p) => Math.max(best, p.bestCombo), 0);
}
