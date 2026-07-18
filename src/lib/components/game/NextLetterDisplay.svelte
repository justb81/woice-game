<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
</script>

<!-- The next start letter is the dominant visual element (see design principles). -->
<div class="flex flex-col items-center gap-1">
	<span class="text-caption tracking-widest text-slate-500 uppercase"
		>{settings.t('nextLetter')}</span
	>
	<span
		class="flex size-28 items-center justify-center rounded-panel bg-accent-strong text-7xl font-black text-white uppercase shadow-lg sm:size-32"
	>
		{gameSession.requiredStart}
	</span>
</div>
