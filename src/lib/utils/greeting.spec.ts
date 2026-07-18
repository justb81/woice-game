import { describe, it, expect } from 'vitest';
import { greet } from './greeting.js';

describe('greet', () => {
	it('greets a given name', () => {
		expect(greet('Ada')).toBe('Hello, Ada!');
	});

	it('trims surrounding whitespace', () => {
		expect(greet('  Ada  ')).toBe('Hello, Ada!');
	});

	it('falls back to "world" for an empty name', () => {
		expect(greet('   ')).toBe('Hello, world!');
	});
});
