/**
 * Per-player accent colours. Auto-assigned when a player joins (see `assignPlayerColor`)
 * and editable afterwards in the lobby. Pure and framework-free so it's Node-testable
 * and safe to import from both the state layer and the prerender pass.
 */

/**
 * Distinct, high-contrast accent colours for players, in assignment order. Chosen to stay
 * legible on the dark surface and to read as clearly different from each other.
 */
export const PLAYER_COLORS = [
	'#38bdf8', // sky
	'#f472b6', // pink
	'#34d399', // emerald
	'#fbbf24', // amber
	'#a78bfa', // violet
	'#fb7185', // rose
	'#22d3ee', // cyan
	'#a3e635', // lime
	'#f97316', // orange
	'#60a5fa' // blue
];

/**
 * Pick the next player colour given the colours already in use. Prefers the first palette
 * entry that isn't taken so early players are maximally distinct; once the palette is
 * exhausted it wraps around by count (guaranteeing a colour is always returned).
 */
export function assignPlayerColor(usedColors: readonly string[]): string {
	const free = PLAYER_COLORS.find((c) => !usedColors.includes(c));
	return free ?? PLAYER_COLORS[usedColors.length % PLAYER_COLORS.length];
}
