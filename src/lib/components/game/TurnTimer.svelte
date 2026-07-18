<script lang="ts">
	import { gameSession } from '$lib/state/game.svelte.js';

	const total = $derived(gameSession.config.turnSeconds);
	const fraction = $derived(total > 0 ? Math.max(0, gameSession.secondsLeft / total) : 0);
	const low = $derived(gameSession.secondsLeft <= 5);
</script>

{#if total > 0}
	<div class="flex flex-col gap-1.5">
		<div class="flex items-center justify-between text-caption text-slate-400">
			<span class="tabular-nums {low ? 'font-bold text-danger' : ''}">
				{gameSession.secondsLeft}s
			</span>
		</div>
		<div class="h-2 w-full overflow-hidden rounded-full bg-surface-raised">
			<div
				class="h-full rounded-full transition-[width] duration-1000 ease-linear {low
					? 'bg-danger'
					: 'bg-accent'}"
				style="width: {fraction * 100}%"
			></div>
		</div>
	</div>
{/if}
