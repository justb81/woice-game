<script lang="ts">
	import { settings } from '$lib/state/settings.svelte.js';
	import { gameSession } from '$lib/state/game.svelte.js';
</script>

<!-- End letters repeated enough that a new word ending in one would now cost points. -->
{#if gameSession.negativeEndLetters.length > 0}
	<div class="flex flex-col items-center gap-1.5">
		<span class="text-caption tracking-widest text-slate-500 uppercase"
			>{settings.t('penaltyLetters')}</span
		>
		<ul class="flex flex-wrap justify-center gap-1.5">
			{#each gameSession.negativeEndLetters as { letter, projected } (letter)}
				<li
					class="flex items-center gap-1 rounded-control border border-danger/40 bg-surface px-2 py-1"
				>
					<span class="text-label font-bold text-danger uppercase">{letter}</span>
					<span class="text-caption font-semibold text-danger tabular-nums">{projected}</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}
