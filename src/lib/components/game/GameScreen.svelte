<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
	import NextLetterDisplay from './NextLetterDisplay.svelte';
	import Scoreboard from './Scoreboard.svelte';
	import TurnTimer from './TurnTimer.svelte';
	import WordHistory from './WordHistory.svelte';
	import WordInput from './WordInput.svelte';
	import ValidationOverlay from './ValidationOverlay.svelte';
</script>

<ValidationOverlay />

<main class="mx-auto flex max-w-xl flex-col gap-6 px-5 py-8">
	<Scoreboard />

	<div class="flex flex-col items-center gap-3">
		<NextLetterDisplay />
		{#if gameSession.currentPlayer}
			<p class="text-h1 text-slate-200">
				<span class="font-bold text-accent-soft">{gameSession.currentPlayer.name}</span>
				{settings.t('yourTurn')}
			</p>
		{/if}
	</div>

	<TurnTimer />

	<WordInput />

	<WordHistory />
</main>
