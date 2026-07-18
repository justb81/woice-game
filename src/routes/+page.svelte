<script lang="ts">
	import { base } from '$app/paths';
	import { toast } from '$lib/state/toast.svelte.js';
	import { windowChrome } from '$lib/state/windowChrome.svelte.js';

	// Starter home page. Delete everything below and build your app — the shell
	// (PWA manifest, offline service worker, update banner, toasts) is already wired up.
</script>

<header
	class="app-header flex items-center gap-3 border-b border-line bg-surface/80 px-5 py-3 backdrop-blur"
	data-wco={windowChrome.visible}
>
	<img src="{base}/pwa-icon.svg" alt="" class="app-header-no-drag size-7" />
	<h1 class="app-header-no-drag text-h1 font-semibold text-slate-100">PWA Template</h1>
</header>

<main class="mx-auto flex max-w-2xl flex-col gap-8 px-5 py-12">
	<section class="flex flex-col gap-3">
		<p class="text-display font-semibold text-slate-50">
			A SvelteKit + Svelte 5 + Tailwind 4 PWA starter.
		</p>
		<p class="text-body text-slate-400">
			Client-only, installable, offline-capable. Static-adapter build, forced runes mode, and a
			service worker with an opt-in update banner — all preconfigured. Start editing
			<code class="rounded-control bg-surface-raised px-1.5 py-0.5 text-caption text-accent-soft"
				>src/routes/+page.svelte</code
			>.
		</p>
	</section>

	<section class="grid gap-3 sm:grid-cols-3">
		<div class="rounded-panel border border-line bg-surface p-4">
			<p class="text-h2 font-semibold text-slate-100">Installable</p>
			<p class="mt-1 text-caption text-slate-400">Web manifest + maskable icons.</p>
		</div>
		<div class="rounded-panel border border-line bg-surface p-4">
			<p class="text-h2 font-semibold text-slate-100">Offline</p>
			<p class="mt-1 text-caption text-slate-400">Cache-first service worker.</p>
		</div>
		<div class="rounded-panel border border-line bg-surface p-4">
			<p class="text-h2 font-semibold text-slate-100">Tested</p>
			<p class="mt-1 text-caption text-slate-400">Vitest + ESLint + Prettier + CI.</p>
		</div>
	</section>

	<section class="flex flex-wrap gap-3">
		<button
			type="button"
			onclick={() => toast.success('It works! Toasts are wired up.')}
			class="rounded-control bg-accent-strong px-4 py-2 text-label font-medium text-white hover:bg-accent"
		>
			Show a toast
		</button>
		<a
			href="https://svelte.dev/docs/kit"
			class="rounded-control border border-line px-4 py-2 text-label font-medium text-slate-200 hover:bg-surface-raised"
		>
			SvelteKit docs
		</a>
	</section>
</main>
