<script lang="ts">
	// Woice — a voice-first word-chain party game. The whole game is one client-only
	// page: `gameSession.phase` drives which screen shows. See docs/design.md for the
	// product concept and CLAUDE.md for the architecture. The PWA shell (manifest,
	// offline service worker, update banner, toasts) is wired up in the layout.
	import { gameSession } from '#lib/state/game.svelte.js';
	import HomeScreen from '#lib/components/game/HomeScreen.svelte';
	import LobbyScreen from '#lib/components/game/LobbyScreen.svelte';
	import GameScreen from '#lib/components/game/GameScreen.svelte';
	import SummaryScreen from '#lib/components/game/SummaryScreen.svelte';
	import StatsScreen from '#lib/components/game/StatsScreen.svelte';
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';

	// Mirror phases in browser history so the system back button steps one screen back
	// instead of leaving the app. Home is the stack base; every other phase pushes an entry.
	$effect(() => {
		const phase = gameSession.phase;
		if (phase !== 'home' && page.state.phase !== phase) pushState('', { phase });
	});

	function onpopstate() {
		const phase = gameSession.phase;
		if (phase === 'ingame')
			pushState('', { phase }); // a live round is only left via "End round"
		else if (phase === 'summary') gameSession.reset();
		else if (phase !== 'home') gameSession.backHome();
	}
</script>

<svelte:window {onpopstate} />

{#if gameSession.phase === 'home'}
	<HomeScreen />
{:else if gameSession.phase === 'lobby'}
	<LobbyScreen />
{:else if gameSession.phase === 'ingame'}
	<GameScreen />
{:else if gameSession.phase === 'summary'}
	<SummaryScreen />
{:else if gameSession.phase === 'stats'}
	<StatsScreen />
{/if}
