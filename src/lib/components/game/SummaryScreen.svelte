<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';

	// Players ranked by score, highest first.
	const ranked = $derived([...gameSession.players].sort((a, b) => b.score - a.score));
</script>

<main class="mx-auto flex max-w-lg flex-col gap-8 px-5 py-12 text-center">
	<h1 class="text-display font-bold text-slate-50">{settings.t('summaryTitle')}</h1>

	<div class="flex flex-col gap-1">
		<span class="text-caption tracking-widest text-slate-500 uppercase">
			{gameSession.hasUniqueLeader ? settings.t('winner') : settings.t('tie')}
		</span>
		<span class="text-4xl font-black text-accent-soft">
			{gameSession.hasUniqueLeader ? (gameSession.leader?.name ?? '') : '🤝'}
		</span>
	</div>

	<ol class="flex flex-col gap-2 text-left">
		{#each ranked as player, i (player.id)}
			<li
				class="flex items-center justify-between rounded-control border px-4 py-3
					{i === 0 ? 'border-accent bg-accent-strong/15' : 'border-line bg-surface'}"
			>
				<span class="flex items-center gap-3">
					<span class="text-label font-bold text-slate-500 tabular-nums">{i + 1}</span>
					<span class="text-body font-medium text-slate-100">{player.name}</span>
				</span>
				<span class="text-h2 font-bold text-accent-soft tabular-nums">
					{player.score}
					<span class="text-caption font-normal text-slate-500">{settings.t('points')}</span>
				</span>
			</li>
		{/each}
	</ol>

	{#if gameSession.longestWord}
		<p class="text-body text-slate-400">
			{settings.t('longestWord')}:
			<span class="font-semibold text-slate-100 capitalize">{gameSession.longestWord}</span>
		</p>
	{/if}

	<div class="flex justify-center gap-3">
		<button
			type="button"
			onclick={() => gameSession.startGame()}
			class="rounded-panel bg-accent-strong px-6 py-3 text-h1 font-semibold text-white hover:bg-accent"
		>
			{settings.t('playAgain')}
		</button>
		<button
			type="button"
			onclick={() => gameSession.backHome()}
			class="rounded-panel border border-line px-6 py-3 text-h1 font-medium text-slate-200 hover:bg-surface-raised"
		>
			{settings.t('backHome')}
		</button>
	</div>
</main>
