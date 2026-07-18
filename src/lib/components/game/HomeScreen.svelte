<script lang="ts">
	import { base } from '$app/paths';
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
	import LanguageToggle from './LanguageToggle.svelte';
</script>

<main
	class="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-10 px-5 py-12 text-center"
>
	<div class="flex flex-col items-center gap-4">
		<img src="{base}/pwa-icon.svg" alt="" class="size-16" />
		<h1 class="text-5xl font-black tracking-tight text-slate-50">{settings.t('appName')}</h1>
		<p class="max-w-md text-body text-slate-400">{settings.t('tagline')}</p>
	</div>

	<button
		type="button"
		onclick={() => gameSession.goToLobby()}
		class="rounded-panel bg-accent-strong px-10 py-4 text-h1 font-semibold text-white transition hover:bg-accent"
	>
		{settings.t('play')}
	</button>

	<LanguageToggle />
</main>
