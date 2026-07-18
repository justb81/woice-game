<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
</script>

<ul class="flex flex-wrap justify-center gap-2">
	{#each gameSession.players as player, i (player.id)}
		<li
			class="flex items-center gap-2 rounded-control border px-3 py-1.5
				{i === gameSession.currentIndex
				? 'bg-surface-raised text-slate-50'
				: 'border-line bg-surface text-slate-300'}"
			style={i === gameSession.currentIndex
				? `border-color: ${player.color}; box-shadow: 0 0 0 1px ${player.color}`
				: ''}
		>
			<span
				class="size-2.5 rounded-full {i === gameSession.currentIndex ? 'animate-pulse' : ''}"
				style="background-color: {player.color}"
				aria-hidden="true"
			></span>
			<span class="text-label font-medium">{player.name}</span>
			<span class="text-label font-bold tabular-nums" style="color: {player.color}">
				{player.score}<span class="ml-0.5 text-caption font-normal text-slate-500"
					>{settings.t('points')}</span
				>
			</span>
		</li>
	{/each}
</ul>
