<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
	import { speechInput } from '$lib/state/speech.svelte.js';

	let word = $state('');

	function submit() {
		const value = word.trim();
		if (value === '') return;
		gameSession.submitWord(value);
		word = '';
	}

	function toggleListening() {
		if (speechInput.listening) {
			speechInput.stop();
			return;
		}
		speechInput.start((transcript) => {
			gameSession.submitWord(transcript);
		});
	}
</script>

<div class="flex flex-col gap-2">
	<div class="flex gap-2">
		<input
			type="text"
			bind:value={word}
			onkeydown={(e) => e.key === 'Enter' && submit()}
			placeholder={settings.t('wordPlaceholder')}
			autocomplete="off"
			autocapitalize="off"
			class="flex-1 rounded-control border border-line bg-surface px-4 py-3 text-h1 text-slate-100 placeholder:text-slate-500"
		/>
		<button
			type="button"
			onclick={submit}
			class="rounded-control bg-accent-strong px-5 py-3 text-label font-semibold text-white hover:bg-accent"
		>
			{settings.t('submit')}
		</button>
	</div>

	{#if speechInput.supported}
		<button
			type="button"
			onclick={toggleListening}
			aria-pressed={speechInput.listening}
			class="flex items-center justify-center gap-2 rounded-control border py-3 text-label font-medium transition
				{speechInput.listening
				? 'border-danger bg-danger/15 text-danger'
				: 'border-line text-slate-200 hover:bg-surface-raised'}"
		>
			<span
				class="size-2.5 rounded-full {speechInput.listening
					? 'animate-pulse bg-danger'
					: 'bg-accent-soft'}"
			></span>
			{speechInput.listening ? settings.t('listening') : settings.t('listen')}
		</button>
		{#if speechInput.interim}
			<p class="text-center text-caption text-slate-500">{speechInput.interim}</p>
		{/if}
	{/if}
</div>
