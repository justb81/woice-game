<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
	import { stats } from '$lib/state/stats.svelte.js';
	import { topWinners, globalFavoriteLetters, bestComboOverall } from '$lib/game/stats.js';

	const data = $derived(stats.data);
	const ranked = $derived(topWinners(data));
	const favorites = $derived(globalFavoriteLetters(data));
	const bestCombo = $derived(bestComboOverall(data));
	const hasData = $derived(data.roundsPlayed > 0);
</script>

<main class="mx-auto flex max-w-lg flex-col gap-8 px-5 py-12">
	<h1 class="text-center text-display font-bold text-slate-50">{settings.t('statsTitle')}</h1>

	{#if hasData}
		<!-- Headline numbers -->
		<div class="grid grid-cols-2 gap-3">
			<div
				class="flex flex-col items-center gap-1 rounded-control border border-line bg-surface px-4 py-4"
			>
				<span class="text-4xl font-black text-slate-50 tabular-nums">{data.roundsPlayed}</span>
				<span class="text-caption tracking-wide text-slate-500 uppercase">
					{settings.t('roundsPlayed')}
				</span>
			</div>
			<div
				class="flex flex-col items-center gap-1 rounded-control border border-line bg-surface px-4 py-4"
			>
				<span class="text-4xl font-black text-slate-50 tabular-nums">{bestCombo}</span>
				<span class="text-caption tracking-wide text-slate-500 uppercase">
					{settings.t('bestCombo')}
				</span>
			</div>
		</div>

		<!-- Favorite letters -->
		{#if favorites.length > 0}
			<section class="flex flex-col gap-3">
				<h2 class="text-h2 font-semibold text-slate-200">{settings.t('favoriteLetters')}</h2>
				<ul class="flex flex-wrap gap-2">
					{#each favorites as fav (fav.letter)}
						<li
							class="flex items-center gap-2 rounded-control border border-line bg-surface px-3 py-1.5"
						>
							<span class="text-h2 font-black text-accent-soft uppercase">{fav.letter}</span>
							<span class="text-label text-slate-400 tabular-nums">×{fav.count}</span>
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		<!-- Per-player leaderboard -->
		<section class="flex flex-col gap-3">
			<h2 class="text-h2 font-semibold text-slate-200">{settings.t('wins')}</h2>
			<ol class="flex flex-col gap-2">
				{#each ranked as player, i (player.key)}
					<li
						class="flex items-center justify-between rounded-control border border-line bg-surface px-4 py-3"
					>
						<span class="flex items-center gap-3">
							<span class="text-label font-bold text-slate-500 tabular-nums">{i + 1}</span>
							<span class="text-body font-medium text-slate-100">{player.displayName}</span>
						</span>
						<span class="flex items-center gap-4">
							<span class="flex flex-col items-end">
								<span class="text-h2 font-bold text-slate-50 tabular-nums">{player.wins}</span>
								<span class="text-caption text-slate-500">{settings.t('wins')}</span>
							</span>
							<span class="flex flex-col items-end">
								<span class="text-h2 font-bold text-slate-300 tabular-nums">
									{player.bestWinStreak}
								</span>
								<span class="text-caption text-slate-500">{settings.t('bestStreak')}</span>
							</span>
						</span>
					</li>
				{/each}
			</ol>
		</section>
	{:else}
		<p class="text-center text-body text-slate-400">{settings.t('statsEmpty')}</p>
	{/if}

	<div class="flex justify-center">
		<button
			type="button"
			onclick={() => gameSession.backHome()}
			class="rounded-panel border border-line px-6 py-3 text-h1 font-medium text-slate-200 hover:bg-surface-raised"
		>
			{settings.t('backHome')}
		</button>
	</div>
</main>
