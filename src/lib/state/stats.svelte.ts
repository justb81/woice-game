/**
 * Persistent player-stats singleton: long-term wins, favorite letters and streaks,
 * folded once per completed round and stored in localStorage so they survive reloads.
 * All browser access is guarded so this stays inert during SSR/prerender (same pattern as
 * `settings.svelte.ts`); the aggregation itself is the pure `$lib/game/stats` engine.
 */

import { browser } from '$app/environment';
import {
	emptyStats,
	recordRound,
	STATS_SCHEMA_VERSION,
	type RoundInput,
	type Stats
} from '$lib/game/stats.js';

const STORAGE_KEY = 'woice.stats';

/** Load persisted stats, or a fresh aggregate off-browser / on corrupt or outdated data. */
function load(): Stats {
	if (!browser) return emptyStats();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return emptyStats();
		const parsed = JSON.parse(raw) as Stats;
		// A version bump means the old shape can't be trusted — start clean.
		if (parsed?.version !== STATS_SCHEMA_VERSION) return emptyStats();
		return parsed;
	} catch {
		return emptyStats();
	}
}

class StatsStore {
	data = $state<Stats>(load());

	/** Fold a finished round into the aggregate, stamp it, and persist. */
	recordRound(round: RoundInput): void {
		this.data = {
			...recordRound(this.data, round),
			updatedAt: browser ? new Date().toISOString() : null
		};
		this.#persist();
	}

	/** Wipe all persisted stats (the reset action in Settings). */
	reset(): void {
		this.data = emptyStats();
		this.#persist();
	}

	#persist(): void {
		if (!browser) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
		} catch {
			// Storage full or unavailable (private mode): stats are best-effort, so ignore.
		}
	}
}

/** App-wide persistent stats singleton. */
export const stats = new StatsStore();
