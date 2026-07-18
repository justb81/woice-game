/**
 * Example pure helper — delete once you have real code. It exists mainly so the
 * template ships with a green test to copy from: pure, framework-free logic lives
 * in plain `.ts` files (Node-testable by vitest's `server` project), while anything
 * touching the DOM or browser APIs stays in `.svelte.ts` / components.
 */

/** Build a friendly greeting, trimming and falling back to a generic name. */
export function greet(name: string): string {
	const trimmed = name.trim();
	return `Hello, ${trimmed || 'world'}!`;
}
