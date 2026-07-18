import { describe, it, expect } from 'vitest';
import {
	emptyStats,
	playerKey,
	recordRound,
	favoriteLetters,
	topWinners,
	globalFavoriteLetters,
	bestComboOverall,
	STATS_SCHEMA_VERSION,
	type Stats
} from './stats.js';
import type { Player, Turn } from './types.js';

// --- Test fixtures -----------------------------------------------------------

function player(id: string, name: string, score: number): Player {
	return { id, name, score, errors: 0, color: '#000' };
}

let turnId = 1;
function validTurn(playerId: string, word: string): Turn {
	const endLetter = word.at(-1) ?? '';
	return {
		id: turnId++,
		playerId,
		rawInput: word,
		normalizedWord: word,
		requiredStart: word[0] ?? '',
		endLetter,
		valid: true,
		durationMs: 1000,
		breakdown: {
			base: 5,
			lengthBonus: 0,
			rarityBonus: 1,
			tempoBonus: 0,
			comboBonus: 0,
			penalty: 0,
			total: 6
		}
	};
}

function invalidTurn(playerId: string): Turn {
	return {
		id: turnId++,
		playerId,
		rawInput: '',
		normalizedWord: '',
		requiredStart: 'a',
		endLetter: '',
		valid: false,
		reason: 'empty',
		durationMs: 1000,
		breakdown: null
	};
}

// --- emptyStats --------------------------------------------------------------

describe('emptyStats', () => {
	it('is a fresh, versioned, empty aggregate', () => {
		const s = emptyStats();
		expect(s.version).toBe(STATS_SCHEMA_VERSION);
		expect(s.roundsPlayed).toBe(0);
		expect(s.players).toEqual({});
		expect(s.updatedAt).toBeNull();
	});
});

// --- playerKey ---------------------------------------------------------------

describe('playerKey', () => {
	it('normalises case and surrounding/inner whitespace so same-name players merge', () => {
		expect(playerKey('Anna')).toBe(playerKey(' anna '));
		expect(playerKey('Mary  Jane')).toBe('mary jane');
	});
});

// --- recordRound -------------------------------------------------------------

describe('recordRound', () => {
	it('does not mutate the previous stats (immutable)', () => {
		const prev = emptyStats();
		const snapshot = structuredClone(prev);
		recordRound(prev, {
			players: [player('p1', 'Anna', 20), player('p2', 'Bo', 10)],
			turns: [validTurn('p1', 'apfel')]
		});
		expect(prev).toEqual(snapshot);
	});

	it('awards a win to the sole top scorer and advances their win streak', () => {
		const s = recordRound(emptyStats(), {
			players: [player('p1', 'Anna', 20), player('p2', 'Bo', 10)],
			turns: []
		});
		const anna = s.players[playerKey('Anna')];
		const bo = s.players[playerKey('Bo')];
		expect(anna.wins).toBe(1);
		expect(anna.currentWinStreak).toBe(1);
		expect(anna.bestWinStreak).toBe(1);
		expect(bo.wins).toBe(0);
		expect(bo.currentWinStreak).toBe(0);
		expect(s.roundsPlayed).toBe(1);
	});

	it('extends a win streak over consecutive wins', () => {
		let s = recordRound(emptyStats(), {
			players: [player('p1', 'Anna', 20), player('p2', 'Bo', 10)],
			turns: []
		});
		s = recordRound(s, {
			players: [player('p1', 'Anna', 30), player('p2', 'Bo', 10)],
			turns: []
		});
		const anna = s.players[playerKey('Anna')];
		expect(anna.wins).toBe(2);
		expect(anna.currentWinStreak).toBe(2);
		expect(anna.bestWinStreak).toBe(2);
	});

	it('resets the win streak on a loss but keeps the best', () => {
		let s = recordRound(emptyStats(), {
			players: [player('p1', 'Anna', 20), player('p2', 'Bo', 10)],
			turns: []
		});
		s = recordRound(s, {
			players: [player('p1', 'Anna', 5), player('p2', 'Bo', 40)],
			turns: []
		});
		const anna = s.players[playerKey('Anna')];
		expect(anna.currentWinStreak).toBe(0);
		expect(anna.bestWinStreak).toBe(1);
	});

	it('counts a shared top score as a tie, not a win, and resets streaks', () => {
		let s = recordRound(emptyStats(), {
			players: [player('p1', 'Anna', 30), player('p2', 'Bo', 5)],
			turns: []
		});
		s = recordRound(s, {
			players: [player('p1', 'Anna', 20), player('p2', 'Bo', 20)],
			turns: []
		});
		const anna = s.players[playerKey('Anna')];
		const bo = s.players[playerKey('Bo')];
		expect(anna.wins).toBe(1);
		expect(anna.ties).toBe(1);
		expect(anna.currentWinStreak).toBe(0);
		expect(bo.ties).toBe(1);
		expect(bo.wins).toBe(0);
	});

	it('tallies end letters only from a player’s own valid turns', () => {
		const s = recordRound(emptyStats(), {
			players: [player('p1', 'Anna', 20), player('p2', 'Bo', 10)],
			turns: [
				validTurn('p1', 'apfel'), // ends 'l'
				validTurn('p1', 'lampe'), // ends 'e'
				invalidTurn('p1'), // no end letter
				validTurn('p2', 'esel') // Bo's, ends 'l'
			]
		});
		const anna = s.players[playerKey('Anna')];
		expect(anna.endLetterCounts).toEqual({ l: 1, e: 1 });
		expect(anna.validWords).toBe(2);
		expect(anna.invalidTurns).toBe(1);
	});

	it('records the longest in-round combo and keeps the max across rounds', () => {
		let s = recordRound(emptyStats(), {
			players: [player('p1', 'Anna', 20), player('p2', 'Bo', 10)],
			// run of 2, break, run of 1
			turns: [
				validTurn('p1', 'apfel'),
				validTurn('p1', 'lampe'),
				invalidTurn('p1'),
				validTurn('p1', 'esel')
			]
		});
		expect(s.players[playerKey('Anna')].bestCombo).toBe(2);

		// A later, weaker round must not lower the recorded best.
		s = recordRound(s, {
			players: [player('p1', 'Anna', 5), player('p2', 'Bo', 40)],
			turns: [validTurn('p1', 'apfel')]
		});
		expect(s.players[playerKey('Anna')].bestCombo).toBe(2);
	});

	it('sums net player score (penalties already included) into totalScore', () => {
		let s = recordRound(emptyStats(), {
			players: [player('p1', 'Anna', 20), player('p2', 'Bo', 10)],
			turns: []
		});
		s = recordRound(s, {
			// a round where Anna netted negative after penalties
			players: [player('p1', 'Anna', -3), player('p2', 'Bo', 40)],
			turns: []
		});
		expect(s.players[playerKey('Anna')].totalScore).toBe(17);
	});

	it('merges same-name players across rounds by key and updates displayName', () => {
		let s = recordRound(emptyStats(), {
			players: [player('p1', 'Anna', 20), player('p2', 'Bo', 10)],
			turns: []
		});
		s = recordRound(s, {
			// Same player, different casing/whitespace → same key, merges.
			players: [player('p9', 'ANNA', 30), player('p8', 'Cy', 5)],
			turns: []
		});
		const anna = s.players[playerKey(' anna ')];
		expect(Object.keys(s.players)).toHaveLength(3); // anna, bo, cy
		expect(anna.roundsPlayed).toBe(2);
		expect(anna.displayName).toBe('ANNA'); // latest name seen
	});

	it('leaves players who did not take part in a round untouched', () => {
		let s = recordRound(emptyStats(), {
			players: [player('p1', 'Anna', 20), player('p2', 'Bo', 10)],
			turns: []
		});
		const boBefore = s.players[playerKey('Bo')];
		s = recordRound(s, {
			players: [player('p1', 'Anna', 20), player('p3', 'Cy', 10)],
			turns: []
		});
		expect(s.players[playerKey('Bo')]).toEqual(boBefore);
	});
});

// --- derived helpers ---------------------------------------------------------

describe('derived helpers', () => {
	function twoRoundStats(): Stats {
		let s = recordRound(emptyStats(), {
			players: [player('p1', 'Anna', 30), player('p2', 'Bo', 10)],
			turns: [validTurn('p1', 'apfel'), validTurn('p1', 'lampe'), validTurn('p2', 'esel')]
		});
		s = recordRound(s, {
			players: [player('p1', 'Anna', 25), player('p2', 'Bo', 5)],
			turns: [validTurn('p1', 'igel'), validTurn('p2', 'ast')]
		});
		return s;
	}

	it('favoriteLetters ranks a player’s end letters by frequency', () => {
		const s = twoRoundStats();
		const anna = s.players[playerKey('Anna')];
		// Anna's valid words end in: l, e, l → 'l' twice, 'e' once
		const fav = favoriteLetters(anna, 3);
		expect(fav[0]).toEqual({ letter: 'l', count: 2 });
		expect(fav.map((f) => f.letter)).toContain('e');
	});

	it('topWinners ranks players by wins', () => {
		const s = twoRoundStats();
		const ranked = topWinners(s);
		expect(ranked[0].displayName).toBe('Anna');
		expect(ranked[0].wins).toBe(2);
	});

	it('globalFavoriteLetters sums end letters across all players', () => {
		const s = twoRoundStats();
		const global = globalFavoriteLetters(s);
		const l = global.find((g) => g.letter === 'l');
		// Anna: apfel(l), lampe(e), igel(l); Bo: esel(l), ast(t) → 'l' = 3
		expect(l?.count).toBe(3);
	});

	it('bestComboOverall returns the highest single-round combo across players', () => {
		const s = twoRoundStats();
		expect(bestComboOverall(s)).toBe(2); // Anna's apfel→lampe run
	});
});
