/**
 * The Session Engine: owns all live round state and drives the single-page state
 * machine (`phase`). It holds `$state`, runs the turn timer, and delegates every
 * decision to the pure `$lib/game` functions — so voice and text input funnel through
 * the same `submitWord` path and are scored identically. DOM-touching bits (the timer)
 * are guarded so this stays inert during SSR/prerender.
 */

import { browser } from '$app/environment';
import type { GameConfig, Phase, Player, Turn, ValidationResult } from '$lib/game/types.js';
import { DEFAULT_CONFIG, MAX_HISTORY } from '$lib/game/config.js';
import { validateTurn } from '$lib/game/rules.js';
import { scoreTurn, errorPenalty } from '$lib/game/score.js';
import { assignPlayerColor } from '$lib/game/playerColors.js';

/** How long the validation overlay stays on screen after a turn. */
const OVERLAY_MS = 1200;

/** Candidate start letters for a random opening (kept common so the first turn is easy). */
const RANDOM_START_LETTERS = 'abdeghiklmnoprst'.split('');

class GameSession {
	phase = $state<Phase>('home');
	players = $state<Player[]>([]);
	config = $state<GameConfig>({ ...DEFAULT_CONFIG });
	turns = $state<Turn[]>([]);
	currentIndex = $state(0);
	requiredStart = $state('');
	secondsLeft = $state(0);
	/** Latest validation outcome — drives the on-screen feedback overlay. Cleared after OVERLAY_MS. */
	lastResult = $state<ValidationResult | null>(null);

	#nextPlayerId = 1;
	#nextTurnId = 1;
	#turnStart = 0;
	#timer: ReturnType<typeof setInterval> | undefined;
	#overlayTimer: ReturnType<typeof setTimeout> | undefined;

	get currentPlayer(): Player | undefined {
		return this.players[this.currentIndex];
	}

	/** Valid turns, most recent first, capped at MAX_HISTORY — the In-Game word list. */
	get recentTurns(): Turn[] {
		return this.turns
			.filter((t) => t.valid)
			.slice(-MAX_HISTORY)
			.reverse();
	}

	/** Highest-scoring player, or undefined with no players. Ties resolve to the earlier player. */
	get leader(): Player | undefined {
		return this.players.reduce<Player | undefined>(
			(best, p) => (best === undefined || p.score > best.score ? p : best),
			undefined
		);
	}

	/** Whether the leader is uniquely ahead (false = tie for the top score). */
	get hasUniqueLeader(): boolean {
		const top = this.leader?.score;
		if (top === undefined) return false;
		return this.players.filter((p) => p.score === top).length === 1;
	}

	/** Longest valid word played this round, or '' if none. */
	get longestWord(): string {
		return this.turns
			.filter((t) => t.valid)
			.map((t) => t.normalizedWord)
			.reduce((longest, w) => (w.length > longest.length ? w : longest), '');
	}

	/** Normalised valid words already played — the duplicate check reads this. */
	get usedWords(): Set<string> {
		return new Set(this.turns.filter((t) => t.valid).map((t) => t.normalizedWord));
	}

	// --- Lobby ---------------------------------------------------------------

	addPlayer(name: string): void {
		const trimmed = name.trim();
		if (trimmed === '') return;
		const color = assignPlayerColor(this.players.map((p) => p.color));
		this.players.push({ id: `p${this.#nextPlayerId++}`, name: trimmed, score: 0, errors: 0, color });
	}

	removePlayer(id: string): void {
		this.players = this.players.filter((p) => p.id !== id);
	}

	/** Override a player's accent colour (auto-assigned on join, editable in the lobby). */
	setPlayerColor(id: string, color: string): void {
		const player = this.players.find((p) => p.id === id);
		if (player) player.color = color;
	}

	goToLobby(): void {
		this.phase = 'lobby';
	}

	// --- Round lifecycle -----------------------------------------------------

	startGame(): void {
		if (this.players.length < 2) return;
		for (const p of this.players) {
			p.score = 0;
			p.errors = 0;
		}
		this.turns = [];
		this.#nextTurnId = 1;
		this.currentIndex = 0;
		this.requiredStart = this.config.startLetter || this.#randomStartLetter();
		this.lastResult = null;
		this.phase = 'ingame';
		this.#startTurnTimer();
	}

	/**
	 * The single funnel for both voice and text input. Validates, scores, records the
	 * turn, then advances — or ends the round when a target/error limit is reached.
	 */
	submitWord(raw: string): void {
		if (this.phase !== 'ingame') return;
		const player = this.currentPlayer;
		if (!player) return;

		const durationMs = browser ? Math.round(performance.now() - this.#turnStart) : 0;
		const result = validateTurn({
			raw,
			requiredStart: this.requiredStart,
			usedWords: this.usedWords,
			config: this.config
		});
		this.lastResult = result;
		this.#showOverlay();

		if (result.valid) {
			const breakdown = scoreTurn({
				normalizedWord: result.normalizedWord,
				endLetter: result.endLetter,
				durationMs,
				config: this.config,
				comboCount: this.#currentCombo(player.id)
			});
			player.score += breakdown.total;
			this.turns.push({
				id: this.#nextTurnId++,
				playerId: player.id,
				rawInput: raw,
				normalizedWord: result.normalizedWord,
				requiredStart: this.requiredStart,
				endLetter: result.endLetter,
				valid: true,
				durationMs,
				breakdown
			});
			// The chain continues from this word's end letter.
			this.requiredStart = result.endLetter;
		} else {
			player.score += errorPenalty();
			player.errors += 1;
			this.turns.push({
				id: this.#nextTurnId++,
				playerId: player.id,
				rawInput: raw,
				normalizedWord: result.normalizedWord,
				requiredStart: this.requiredStart,
				endLetter: '',
				valid: false,
				reason: result.reason,
				durationMs,
				breakdown: null
			});
			// requiredStart stays: the next player still owes the same letter.
		}

		if (this.#checkEndConditions()) return;
		this.#advanceTurn();
	}

	reset(): void {
		this.#clearTimer();
		this.#clearOverlay();
		this.phase = 'lobby';
		this.turns = [];
		this.lastResult = null;
		this.secondsLeft = 0;
		for (const p of this.players) {
			p.score = 0;
			p.errors = 0;
		}
	}

	backHome(): void {
		this.#clearTimer();
		this.#clearOverlay();
		this.phase = 'home';
	}

	// --- Internals -----------------------------------------------------------

	/** Consecutive valid turns most recently made by this player (before the current one). */
	#currentCombo(playerId: string): number {
		let combo = 0;
		for (let i = this.turns.length - 1; i >= 0; i--) {
			const t = this.turns[i];
			if (t.playerId !== playerId) continue;
			if (t.valid) combo++;
			else break;
		}
		return combo;
	}

	#randomStartLetter(): string {
		const i = browser ? Math.floor(Math.random() * RANDOM_START_LETTERS.length) : 0;
		return RANDOM_START_LETTERS[i];
	}

	#advanceTurn(): void {
		this.currentIndex = (this.currentIndex + 1) % this.players.length;
		this.#startTurnTimer();
	}

	/** True (and transitions to summary) when a target score or error limit is hit. */
	#checkEndConditions(): boolean {
		const done = this.players.some(
			(p) => p.score >= this.config.targetScore || p.errors >= this.config.errorLimit
		);
		if (done) {
			this.#clearTimer();
			this.phase = 'summary';
		}
		return done;
	}

	#startTurnTimer(): void {
		this.secondsLeft = this.config.turnSeconds;
		if (!browser) return;
		this.#turnStart = performance.now();
		this.#clearTimer();
		if (this.config.turnSeconds <= 0) return; // timer disabled
		this.#timer = setInterval(() => {
			this.secondsLeft -= 1;
			if (this.secondsLeft <= 0) {
				// Timed out: counts as an (empty) invalid turn via the normal funnel.
				this.submitWord('');
			}
		}, 1000);
	}

	#clearTimer(): void {
		if (this.#timer !== undefined) {
			clearInterval(this.#timer);
			this.#timer = undefined;
		}
	}

	#showOverlay(): void {
		if (!browser) return;
		this.#clearOverlay();
		this.#overlayTimer = setTimeout(() => {
			this.lastResult = null;
		}, OVERLAY_MS);
	}

	#clearOverlay(): void {
		if (this.#overlayTimer !== undefined) {
			clearTimeout(this.#overlayTimer);
			this.#overlayTimer = undefined;
		}
	}
}

/** App-wide game session singleton. */
export const gameSession = new GameSession();
