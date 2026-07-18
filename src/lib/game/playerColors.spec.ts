import { describe, it, expect } from 'vitest';
import { PLAYER_COLORS, assignPlayerColor } from './playerColors.js';

describe('assignPlayerColor', () => {
	it('returns the first palette colour when none are used', () => {
		expect(assignPlayerColor([])).toBe(PLAYER_COLORS[0]);
	});

	it('skips colours already in use', () => {
		expect(assignPlayerColor([PLAYER_COLORS[0]])).toBe(PLAYER_COLORS[1]);
		expect(assignPlayerColor([PLAYER_COLORS[0], PLAYER_COLORS[1]])).toBe(PLAYER_COLORS[2]);
	});

	it('gives distinct colours for the first palette-worth of players', () => {
		const used: string[] = [];
		for (let i = 0; i < PLAYER_COLORS.length; i++) used.push(assignPlayerColor(used));
		expect(new Set(used).size).toBe(PLAYER_COLORS.length);
	});

	it('wraps around once the palette is exhausted rather than returning undefined', () => {
		const color = assignPlayerColor([...PLAYER_COLORS]);
		expect(PLAYER_COLORS).toContain(color);
	});
});
