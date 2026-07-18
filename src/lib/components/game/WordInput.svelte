<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
	import { speechInput } from '$lib/state/speech.svelte.js';

	let word = $state('');
	// Voice is the primary input; the text field is revealed on demand. When speech isn't
	// supported at all we fall straight through to text so play is never blocked.
	let manualText = $state(false);
	const showText = $derived(manualText || !speechInput.supported);

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

<div class="flex flex-col items-center gap-4">
	{#if speechInput.supported}
		<button
			type="button"
			onclick={toggleListening}
			aria-pressed={speechInput.listening}
			aria-label={speechInput.listening ? settings.t('listening') : settings.t('listen')}
			class="group flex size-40 flex-col items-center justify-center gap-2 rounded-full text-white shadow-lg transition active:scale-95
				{speechInput.listening
				? 'animate-pulse bg-danger shadow-danger/30'
				: 'bg-accent-strong shadow-accent/30 hover:bg-accent'}"
		>
			<svg
				class="size-12"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
				<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
				<line x1="12" y1="19" x2="12" y2="22" />
			</svg>
			<span class="text-h1 font-semibold">
				{speechInput.listening ? settings.t('listening') : settings.t('listen')}
			</span>
		</button>

		<p class="min-h-[1.125rem] text-center text-caption text-slate-500">{speechInput.interim}</p>
	{/if}

	{#if showText}
		<div class="flex w-full gap-2">
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
	{:else}
		<button
			type="button"
			onclick={() => (manualText = true)}
			class="text-label text-slate-400 underline decoration-line underline-offset-4 hover:text-slate-200"
		>
			{settings.t('typeInstead')}
		</button>
	{/if}
</div>
