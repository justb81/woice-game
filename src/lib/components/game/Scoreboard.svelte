<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
</script>

<ul class="flex flex-wrap justify-center gap-2">
	{#each gameSession.players as player, i (player.id)}
		<li
			class="flex items-center gap-2 rounded-control border px-3 py-1.5
				{i === gameSession.currentIndex
				? 'border-accent bg-accent-strong/20 text-slate-50'
				: 'border-line bg-surface text-slate-300'}"
		>
			{#if i === gameSession.currentIndex}
				<span class="size-2 rounded-full bg-accent-soft" aria-hidden="true"></span>
			{/if}
			<span class="text-label font-medium">{player.name}</span>
			<span class="text-label font-bold text-accent-soft tabular-nums">
				{player.score}<span class="ml-0.5 text-caption font-normal text-slate-500"
					>{settings.t('points')}</span
				>
			</span>
		</li>
	{/each}
</ul>
