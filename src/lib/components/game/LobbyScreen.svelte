<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
	import { strictnessMessageKey } from '$lib/i18n/messages.js';
	import type { Strictness } from '$lib/game/types.js';
	import LanguageToggle from './LanguageToggle.svelte';

	let newName = $state('');
	const strictnessOptions: Strictness[] = ['locker', 'standard', 'streng'];

	function addPlayer() {
		gameSession.addPlayer(newName);
		newName = '';
	}
</script>

<main class="mx-auto flex max-w-2xl flex-col gap-8 px-5 py-10">
	<header class="flex items-center justify-between">
		<h1 class="text-display font-bold text-slate-50">{settings.t('lobbyTitle')}</h1>
		<LanguageToggle />
	</header>

	<!-- Players -->
	<section class="flex flex-col gap-3">
		<h2 class="text-h2 font-semibold text-slate-200">{settings.t('players')}</h2>
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={newName}
				onkeydown={(e) => e.key === 'Enter' && addPlayer()}
				placeholder={settings.t('playerNamePlaceholder')}
				class="flex-1 rounded-control border border-line bg-surface px-3 py-2 text-body text-slate-100 placeholder:text-slate-500"
			/>
			<button
				type="button"
				onclick={addPlayer}
				class="rounded-control bg-accent-strong px-4 py-2 text-label font-medium text-white hover:bg-accent"
			>
				{settings.t('addPlayer')}
			</button>
		</div>
		<ul class="flex flex-col gap-2">
			{#each gameSession.players as player (player.id)}
				<li
					class="flex items-center justify-between rounded-control border border-line bg-surface px-3 py-2"
				>
					<span class="text-body text-slate-100">{player.name}</span>
					<button
						type="button"
						onclick={() => gameSession.removePlayer(player.id)}
						class="text-label text-danger hover:text-danger-strong"
					>
						{settings.t('remove')}
					</button>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Settings -->
	<section class="flex flex-col gap-4">
		<h2 class="text-h2 font-semibold text-slate-200">{settings.t('settings')}</h2>

		<div class="flex flex-col gap-1.5">
			<span class="text-label text-slate-400">{settings.t('strictness')}</span>
			<div class="inline-flex rounded-control border border-line">
				{#each strictnessOptions as option (option)}
					<button
						type="button"
						onclick={() => (gameSession.config.strictness = option)}
						aria-pressed={gameSession.config.strictness === option}
						class="px-3 py-1.5 text-label font-medium first:rounded-l-control last:rounded-r-control
							{gameSession.config.strictness === option
							? 'bg-accent-strong text-white'
							: 'text-slate-300 hover:bg-surface-raised'}"
					>
						{settings.t(strictnessMessageKey[option])}
					</button>
				{/each}
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<label class="flex flex-col gap-1.5">
				<span class="text-label text-slate-400">{settings.t('turnSeconds')}</span>
				<input
					type="number"
					min="5"
					max="120"
					bind:value={gameSession.config.turnSeconds}
					class="rounded-control border border-line bg-surface px-3 py-2 text-body text-slate-100"
				/>
			</label>
			<label class="flex flex-col gap-1.5">
				<span class="text-label text-slate-400">{settings.t('minLength')}</span>
				<input
					type="number"
					min="1"
					max="10"
					bind:value={gameSession.config.minLength}
					class="rounded-control border border-line bg-surface px-3 py-2 text-body text-slate-100"
				/>
			</label>
		</div>

		<label class="flex flex-col gap-1.5">
			<span class="text-label text-slate-400">{settings.t('startLetter')}</span>
			<input
				type="text"
				maxlength="1"
				bind:value={gameSession.config.startLetter}
				placeholder={settings.t('startLetterRandom')}
				class="w-24 rounded-control border border-line bg-surface px-3 py-2 text-center text-body text-slate-100 uppercase placeholder:text-slate-500 placeholder:normal-case"
			/>
		</label>
	</section>

	<!-- Start -->
	<div class="flex flex-col gap-2">
		<button
			type="button"
			disabled={gameSession.players.length < 2}
			onclick={() => gameSession.startGame()}
			class="rounded-panel bg-accent-strong px-6 py-3 text-h1 font-semibold text-white transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
		>
			{settings.t('startGame')}
		</button>
		{#if gameSession.players.length < 2}
			<p class="text-center text-caption text-slate-500">{settings.t('needTwoPlayers')}</p>
		{/if}
	</div>
</main>
