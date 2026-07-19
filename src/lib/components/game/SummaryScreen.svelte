<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
	import { LONGEST_WORD_BONUS_PER_LETTER } from '$lib/game/config.js';
	import LanguageToggle from './LanguageToggle.svelte';

	// Players ranked by score, highest first.
	const ranked = $derived([...gameSession.players].sort((a, b) => b.score - a.score));

	// All valid words of the round, in play order, with the player who said each — the per-word recap.
	const scoredTurns = $derived(
		gameSession.turns
			.filter((t) => t.valid)
			.map((t) => ({
				turn: t,
				player: gameSession.players.find((p) => p.id === t.playerId)
			}))
	);

	// The longest word's owner and the end-of-round bonus it earned (1 point per letter).
	const longest = $derived.by(() => {
		const t = gameSession.longestWordTurn;
		if (!t) return null;
		const player = gameSession.players.find((p) => p.id === t.playerId);
		return {
			word: t.normalizedWord,
			player,
			bonus: [...t.normalizedWord].length * LONGEST_WORD_BONUS_PER_LETTER
		};
	});
</script>

<main class="relative mx-auto flex max-w-lg flex-col gap-8 px-5 py-12 text-center">
	<div class="absolute top-5 right-5 text-left">
		<LanguageToggle />
	</div>

	<h1 class="text-display font-bold text-slate-50">{settings.t('summaryTitle')}</h1>

	<div class="flex flex-col gap-1">
		<span class="text-caption tracking-widest text-slate-500 uppercase">
			{gameSession.hasUniqueLeader ? settings.t('winner') : settings.t('tie')}
		</span>
		<span
			class="text-4xl font-black"
			style={gameSession.hasUniqueLeader ? `color: ${gameSession.leader?.color}` : ''}
		>
			{gameSession.hasUniqueLeader ? (gameSession.leader?.name ?? '') : '🤝'}
		</span>
	</div>

	<ol class="flex flex-col gap-2 text-left">
		{#each ranked as player, i (player.id)}
			<li
				class="flex items-center justify-between rounded-control border bg-surface px-4 py-3"
				style="border-left: 4px solid {player.color}"
			>
				<span class="flex items-center gap-3">
					<span class="text-label font-bold text-slate-500 tabular-nums">{i + 1}</span>
					<span
						class="size-2.5 rounded-full"
						style="background-color: {player.color}"
						aria-hidden="true"
					></span>
					<span class="text-body font-medium text-slate-100">{player.name}</span>
				</span>
				<span class="text-h2 font-bold tabular-nums" style="color: {player.color}">
					{player.score}
					<span class="text-caption font-normal text-slate-500">{settings.t('points')}</span>
				</span>
			</li>
		{/each}
	</ol>

	{#if longest}
		<p class="text-body text-slate-400">
			{settings.t('longestWord')}:
			<span class="font-semibold text-slate-100 capitalize">{longest.word}</span>
			{#if longest.player}
				<span class="text-caption text-slate-500">
					· {settings.t('longestWordBonus')} +{longest.bonus} → {longest.player.name}
				</span>
			{/if}
		</p>
	{/if}

	{#if scoredTurns.length > 0}
		<section class="flex flex-col gap-2 text-left">
			<h2 class="text-label font-semibold tracking-wide text-slate-400 uppercase">
				{settings.t('history')}
			</h2>
			<ul class="flex flex-col gap-1.5">
				{#each scoredTurns as { turn, player } (turn.id)}
					<li class="flex items-center justify-between rounded-control bg-surface px-3 py-2">
						<span class="flex items-center gap-2.5">
							<span
								class="size-2 rounded-full"
								style="background-color: {player?.color ?? '#64748b'}"
								aria-hidden="true"
							></span>
							<span class="text-body text-slate-100 capitalize">{turn.normalizedWord}</span>
							{#if player}
								<span class="text-caption text-slate-500">{player.name}</span>
							{/if}
						</span>
						<span
							class="text-body font-semibold tabular-nums {(turn.breakdown?.total ?? 0) < 0
								? 'text-danger'
								: 'text-slate-300'}"
						>
							{(turn.breakdown?.total ?? 0) >= 0 ? '+' : ''}{turn.breakdown?.total ?? 0}
						</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<div class="flex flex-wrap justify-center gap-3">
		<button
			type="button"
			onclick={() => gameSession.startGame()}
			class="rounded-panel bg-accent-strong px-6 py-3 text-h1 font-semibold text-white hover:bg-accent"
		>
			{settings.t('playAgain')}
		</button>
		<button
			type="button"
			onclick={() => gameSession.goToStats()}
			class="rounded-panel border border-line px-6 py-3 text-h1 font-medium text-slate-200 hover:bg-surface-raised"
		>
			{settings.t('viewStats')}
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
