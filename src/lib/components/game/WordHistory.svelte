<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';

	function playerName(id: string): string {
		return gameSession.players.find((p) => p.id === id)?.name ?? '';
	}
</script>

<section class="flex flex-col gap-2">
	<h2 class="text-label tracking-wide text-slate-500 uppercase">{settings.t('history')}</h2>
	{#if gameSession.recentTurns.length === 0}
		<p class="text-caption text-slate-600">—</p>
	{:else}
		<ul class="flex flex-col gap-1.5">
			{#each gameSession.recentTurns as turn (turn.id)}
				<li class="flex items-center justify-between rounded-control bg-surface px-3 py-1.5">
					<span class="text-body text-slate-100">
						<span class="font-semibold capitalize">{turn.normalizedWord}</span>
						<span class="ml-2 text-caption text-slate-500">{playerName(turn.playerId)}</span>
					</span>
					<span class="text-label font-bold text-success tabular-nums">
						+{turn.breakdown?.total ?? 0}
					</span>
				</li>
			{/each}
		</ul>
	{/if}
</section>
