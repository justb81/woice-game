<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import type { Language } from '$lib/game/types.js';

	const options: { value: Language; label: string }[] = [
		{ value: 'de', label: 'DE' },
		{ value: 'en', label: 'EN' }
	];
</script>

<div
	class="inline-flex rounded-control border border-line"
	role="group"
	aria-label={settings.t('language')}
>
	{#each options as option (option.value)}
		<button
			type="button"
			onclick={() => settings.setLanguage(option.value)}
			aria-pressed={settings.language === option.value}
			class="px-3 py-1 text-label font-medium first:rounded-l-control last:rounded-r-control
				{settings.language === option.value
				? 'bg-accent-strong text-white'
				: 'text-slate-300 hover:bg-surface-raised'}"
		>
			{option.label}
		</button>
	{/each}
</div>
