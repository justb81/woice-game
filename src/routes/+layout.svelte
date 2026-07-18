<script lang="ts">
	import './layout.css';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { browser, dev, version } from '$app/environment';
	import { base } from '$app/paths';
	import { updateStatus } from '$lib/state/update.svelte.js';
	import { installPrompt } from '$lib/state/install.svelte.js';
	import { settings } from '$lib/state/settings.svelte.js';

	// An update is offered whenever a new worker is waiting (installed app or open tab); the
	// install prompt only when the app isn't installed yet. Update takes precedence.
	const showUpdate = $derived(updateStatus.available);
	const showInstall = $derived(!showUpdate && installPrompt.available && !installPrompt.installed);

	let { children } = $props();

	if (browser) {
		// A distinct value per `vite dev`/`vite build` run — paste this when reporting a
		// bug, so we can tell whether the browser is actually running the build being debugged.
		console.info(`[woice] build ${version}`);

		if (dev) {
			// Registration is disabled in dev (see vite.config.ts): a cache-first worker
			// fighting Vite's dev server is exactly how a browser can keep serving a build
			// from hours ago with zero console errors. Shed any worker left over from an
			// earlier production/preview load of this same origin.
			void navigator.serviceWorker
				?.getRegistrations()
				.then((regs) => regs.forEach((r) => void r.unregister()));
		} else if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('./service-worker.js', { type: 'module' });
		}
	}
</script>

<svelte:head><link rel="icon" href="{base}/pwa-icon.svg" /></svelte:head>

{#if showUpdate || showInstall}
	<div class="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
		<div
			class="flex w-full max-w-md items-center gap-3 rounded-panel border border-line-strong bg-surface-raised px-4 py-3 shadow-lg"
			role="status"
		>
			<span class="flex-1 text-body text-slate-100">
				{showUpdate ? settings.t('updateTitle') : settings.t('installTitle')}
			</span>
			{#if showUpdate}
				<button
					type="button"
					onclick={() => updateStatus.reload()}
					class="rounded-control bg-accent-strong px-4 py-2 text-label font-semibold text-white hover:bg-accent"
				>
					{settings.t('updateAction')}
				</button>
			{:else}
				<button
					type="button"
					onclick={() => installPrompt.dismiss()}
					class="rounded-control px-3 py-2 text-label font-medium text-slate-400 hover:text-slate-200"
				>
					{settings.t('dismiss')}
				</button>
				<button
					type="button"
					onclick={() => installPrompt.install()}
					class="rounded-control bg-accent-strong px-4 py-2 text-label font-semibold text-white hover:bg-accent"
				>
					{settings.t('installAction')}
				</button>
			{/if}
		</div>
	</div>
{/if}

{@render children()}

<Toast />
