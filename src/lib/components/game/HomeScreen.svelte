<script lang="ts">
	import { base } from '$app/paths';
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
	import LanguageToggle from './LanguageToggle.svelte';

	// Baked in at build time by Vite's `define` (see vite.config.ts).
	const version = __APP_VERSION__;
</script>

<main
	class="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-10 px-5 py-12 text-center"
>
	<div class="absolute top-5 right-5">
		<LanguageToggle />
	</div>

	<div class="flex flex-col items-center gap-4">
		<img src="{base}/pwa-icon.svg" alt="" class="size-16" />
		<h1 class="text-5xl font-black tracking-tight text-slate-50">{settings.t('appName')}</h1>
		<p class="max-w-md text-body text-slate-400">{settings.t('tagline')}</p>
	</div>

	<div class="flex flex-col items-center gap-3">
		<button
			type="button"
			onclick={() => gameSession.goToLobby()}
			class="rounded-panel bg-accent-strong px-10 py-4 text-h1 font-semibold text-white transition hover:bg-accent"
		>
			{settings.t('play')}
		</button>

		<button
			type="button"
			onclick={() => gameSession.goToStats()}
			class="rounded-panel border border-line px-6 py-2.5 text-body font-medium text-slate-200 transition hover:bg-surface-raised"
		>
			{settings.t('stats')}
		</button>
	</div>

	<footer
		class="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 px-5 py-4 text-caption text-slate-500"
	>
		<span class="tabular-nums">v{version}</span>
		<span aria-hidden="true">·</span>
		<a
			href="https://github.com/justb81/woice-game"
			target="_blank"
			rel="noopener noreferrer"
			class="inline-flex items-center gap-1.5 transition hover:text-slate-300"
		>
			<svg
				viewBox="0 0 16 16"
				class="size-4"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
				/>
			</svg>
			GitHub
		</a>
	</footer>
</main>
