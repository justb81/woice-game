<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
	import LanguageToggle from './LanguageToggle.svelte';

	let newName = $state('');

	// The engine treats `turnSeconds === 0` as "no timer". The checkbox flips between 0 and
	// the last non-zero value so unchecking then re-checking restores the player's number.
	let timeLimitOn = $state(gameSession.config.turnSeconds > 0);
	let lastSeconds = $state(
		gameSession.config.turnSeconds > 0 ? gameSession.config.turnSeconds : 30
	);

	function addPlayer() {
		gameSession.addPlayer(newName);
		newName = '';
	}

	function toggleTimeLimit(on: boolean) {
		timeLimitOn = on;
		if (on) {
			gameSession.config.turnSeconds = lastSeconds;
		} else {
			lastSeconds = gameSession.config.turnSeconds || lastSeconds;
			gameSession.config.turnSeconds = 0;
		}
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
					class="flex items-center gap-3 rounded-control border border-line bg-surface px-3 py-2"
					style="border-left: 4px solid {player.color}"
				>
					<label
						class="relative size-6 shrink-0 cursor-pointer overflow-hidden rounded-full ring-1 ring-line-strong"
						style="background-color: {player.color}"
						title={settings.t('playerColor')}
					>
						<input
							type="color"
							value={player.color}
							onchange={(e) => gameSession.setPlayerColor(player.id, e.currentTarget.value)}
							aria-label={settings.t('playerColor')}
							class="absolute inset-0 size-full cursor-pointer opacity-0"
						/>
					</label>
					<span class="flex-1 text-body text-slate-100">{player.name}</span>
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

		<div class="flex flex-col gap-2">
			<label class="flex items-center gap-2.5">
				<input
					type="checkbox"
					checked={timeLimitOn}
					onchange={(e) => toggleTimeLimit(e.currentTarget.checked)}
					class="size-4 rounded border-line bg-surface text-accent-strong focus:ring-accent"
				/>
				<span class="text-label text-slate-300">{settings.t('timeLimit')}</span>
			</label>

			<div class="grid grid-cols-2 gap-4">
				<label class="flex flex-col gap-1.5">
					<span class="text-label text-slate-400">{settings.t('turnSeconds')}</span>
					<input
						type="number"
						min="5"
						max="120"
						disabled={!timeLimitOn}
						bind:value={gameSession.config.turnSeconds}
						class="rounded-control border border-line bg-surface px-3 py-2 text-body text-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
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
