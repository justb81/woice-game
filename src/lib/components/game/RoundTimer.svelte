<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';

	const total = $derived(gameSession.config.roundSeconds);
	const fraction = $derived(total > 0 ? Math.max(0, gameSession.roundSecondsLeft / total) : 0);
	const low = $derived(gameSession.roundSecondsLeft <= 10);

	// mm:ss for the round-level countdown (rounds can run for minutes).
	const label = $derived.by(() => {
		const s = Math.max(0, gameSession.roundSecondsLeft);
		const m = Math.floor(s / 60);
		return `${m}:${String(s % 60).padStart(2, '0')}`;
	});
</script>

{#if total > 0}
	<div class="flex flex-col gap-1.5">
		<div class="flex items-center justify-between text-caption text-slate-400">
			<span>{settings.t('roundTimeLimit')}</span>
			<span class="tabular-nums {low ? 'font-bold text-danger' : ''}">{label}</span>
		</div>
		<div class="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
			<div
				class="h-full rounded-full transition-[width] duration-1000 ease-linear {low
					? 'bg-danger'
					: 'bg-accent-soft'}"
				style="width: {fraction * 100}%"
			></div>
		</div>
	</div>
{/if}
