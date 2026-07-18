<script lang="ts">
	// Woice — a voice-first word-chain party game. The whole game is one client-only
	// page: `gameSession.phase` drives which screen shows. See docs/design.md for the
	// product concept and CLAUDE.md for the architecture. The PWA shell (manifest,
	// offline service worker, update banner, toasts) is wired up in the layout.
	import { gameSession } from '$lib/state/game.svelte.js';
	import HomeScreen from '$lib/components/game/HomeScreen.svelte';
	import LobbyScreen from '$lib/components/game/LobbyScreen.svelte';
	import GameScreen from '$lib/components/game/GameScreen.svelte';
	import SummaryScreen from '$lib/components/game/SummaryScreen.svelte';
</script>

{#if gameSession.phase === 'home'}
	<HomeScreen />
{:else if gameSession.phase === 'lobby'}
	<LobbyScreen />
{:else if gameSession.phase === 'ingame'}
	<GameScreen />
{:else if gameSession.phase === 'summary'}
	<SummaryScreen />
{/if}
