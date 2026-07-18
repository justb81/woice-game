<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
	import { validationMessageKey } from '$lib/i18n/messages.js';

	const result = $derived(gameSession.lastResult);
</script>

{#if result}
	<div
		class="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4"
		role="status"
		aria-live="polite"
	>
		<div
			class="rounded-panel px-5 py-2.5 text-h2 font-semibold shadow-lg
				{result.valid ? 'bg-success-strong text-white' : 'bg-danger-strong text-white'}"
		>
			{#if result.valid}
				✓ {settings.t('valid')}: <span class="capitalize">{result.normalizedWord}</span>
			{:else if result.reason}
				✕ {settings.t(validationMessageKey[result.reason])}
			{/if}
		</div>
	</div>
{/if}
